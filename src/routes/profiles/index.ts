import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {

  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profiles = await fastify.db.profiles.findOne(
        { key: "id", equals: request.params.id });

      if (profiles === null) {
        reply.notFound();
        throw new Error();
      } else {
        return profiles;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId, memberTypeId } = request.body;

      const user = await fastify.db.users.findOne({ key: "id", equals: userId });
      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: memberTypeId });
      const profile = await fastify.db.profiles.findOne({ key: "userId", equals: userId });

      if (user === null || memberType === null || profile?.memberTypeId === memberTypeId) {
        reply.badRequest();
        throw new Error();
      }
      return fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const deletedProfile = await fastify.db.profiles.delete(request.params.id);
        return deletedProfile;
      } catch (err: any) {
        reply.badRequest();
        throw new Error(err);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body, params } = request;

      if (!(body instanceof Object) || !("avatar" in body || "sex" in body || "birthday" in body)) {
        reply.badRequest();
      }

      try {
        const changed = await fastify.db.profiles.change(params.id, body);
        return changed;
      } catch (err: any) {
        reply.notFound();
        throw new Error(err.message);
      }
    }
  );
};

export default plugin;
