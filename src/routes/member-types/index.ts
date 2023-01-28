import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypes = await fastify.db.memberTypes.findOne(
        { key: "id", equals: request.params.id });

      if (memberTypes === null) {
        reply.notFound();
        throw new Error();
      } else {
        return memberTypes;
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { body, params } = request;

      if (!(body instanceof Object) || !("discount" in body || "monthPostsLimit" in body)) {
        reply.badRequest();
      }

      try {
        return fastify.db.memberTypes.change(params.id, body) || reply.notFound();
      } catch (err: any) {
        reply.notFound();
        throw new Error(err.message);
      }
    }
  );
};

export default plugin;
