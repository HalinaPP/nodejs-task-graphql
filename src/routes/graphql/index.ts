import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from "graphql";
import { allByIdType, allType, graphqlBodySchema, } from "./schema";
import { getAll, getAllById } from './services';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = request.body.query!;
      const { variables } = request.body;
      console.log('var=', request.body.variables!.id);

      const queryType = new GraphQLObjectType({
        name: 'queryType',
        fields: () => ({
          all: {
            type: allType,
            resolve: async () =>
              await getAll(fastify)
          },
          allById: {
            type: allByIdType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
            },
            resolve: async (_source, { id }) =>
              await getAllById(fastify, id)
          },
          /*  users: {},
            user: {},
            usersWithUserSubscribedTo: {},
            userWithSubscribedToUser: {},
            usersSubscriptions: {},*/
        }),
      });


      const schema = new GraphQLSchema({ query: queryType });

      return await graphql({ schema, source, variableValues: variables });
    }
  );
};

export default plugin;
