import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne(
        { key: "id", equals: request.params.id });

      if (post === null) {
        throw fastify.httpErrors.notFound();
      } else {
        return post;
      }
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const deletedPost = await fastify.db.posts.delete(request.params.id);
        return deletedPost;
      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err.message);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body, params } = request;

      if (!(body instanceof Object) || !("title" in body || "content" in body || "userId" in body)) {
        reply.badRequest();
      }

      try {
        return fastify.db.posts.change(params.id, body);
      } catch (err: any) {
        throw fastify.httpErrors.notFound(err.message);
      }
    }
  );
};

export default plugin;
