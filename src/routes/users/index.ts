import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const unsibscibedUser = async (
  fastify: any,
  userIdToSubscribed: string,
  subscribedUser: UserEntity
): Promise<void> => {
  const subscribedToUserIds = subscribedUser.subscribedToUserIds.filter(
    (id) => id !== userIdToSubscribed
  );
  await fastify.db.users.change(subscribedUser.id, {
    ...subscribedUser,
    subscribedToUserIds,
  });
};

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (user === null) {
        throw fastify.httpErrors.notFound();
      } else {
        return user;
      }
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      try {
        const deletedUser = await fastify.db.users.delete(id);

        const profile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: id,
        });

        if (profile) {
          await fastify.db.profiles.delete(profile.id);
        }

        const post = await fastify.db.posts.findOne({
          key: "userId",
          equals: id,
        });

        if (post) {
          await fastify.db.posts.delete(post.id);
        }

        const subscribedUsers = await fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: id,
        });

        subscribedUsers.forEach(async (subscribedUser) => {
          await unsibscibedUser(fastify, id, subscribedUser);
        })


        return deletedUser;
      } catch (err: any) {
        reply.badRequest();
        throw new Error(err);
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { params, body } = request;
      const userId = body.userId;
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: userId,
      });
      const subscribedToUserIds = user ? [...user?.subscribedToUserIds] : [];

      if (!subscribedToUserIds.includes(params.id)) {
        subscribedToUserIds.push(params.id);
      }

      return fastify.db.users.change(userId, { subscribedToUserIds });
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body, params } = request;
      const userId = params.id;
      const subscribedUserId = body.userId;

      const user = await fastify.db.users.findOne({
        key: "id",
        equals: userId,
      });

      if (user === null) {
        reply.badRequest();
        throw new Error("bad request");
      }

      if (subscribedUserId) {
        const subscribedUser = await fastify.db.users.findOne({
          key: "id",
          equals: subscribedUserId,
        });

        if (subscribedUser === null) {
          reply.badRequest();
          throw new Error("bad request");
        }

        if (!subscribedUser.subscribedToUserIds.includes(userId)) {
          reply.badRequest();
          throw new Error("bad request");
        } else {
          await unsibscibedUser(fastify, userId, subscribedUser);
        }
      }

      return user;
    }
  );
  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body, params } = request;

      if (
        !(body instanceof Object) ||
        !(
          "firstName" in body ||
          "lastName" in body ||
          "email" in body ||
          "subscribedToUserIds" in body
        )
      ) {
        reply.badRequest();
      }

      try {
        return fastify.db.users.change(params.id, body);
      } catch (err: any) {
        reply.badRequest();
        throw new Error(err.message);
      }
    }
  );
};

export default plugin;
