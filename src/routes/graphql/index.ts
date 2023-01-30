import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from "graphql";
import { allByIdType, allType, ChangeMemberTypeInputDTO, graphqlBodySchema, memberType, PostInputDTO, postType, ProfileInputDTO, profileType, SubscribeInputDTO, UserInputDTO, userType, userTypeWithAllData, } from "./schema";
import { createPost, createProfile, createUser, getAll, getAllById, getUserByIdWithAllData, subscribeTo, unsubscribeFrom, updateMemberType, updatePost, updateProfile, updateUser } from './services';

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
      console.log('var=', request.body);

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
              userId: {
                type: new GraphQLNonNull(GraphQLID),
              },
              profileId: {
                type: new GraphQLNonNull(GraphQLID),
              },
              postId: {
                type: new GraphQLNonNull(GraphQLID),
              },
              memberTypeId: {
                type: new GraphQLNonNull(GraphQLID),
              },
            },
            resolve: async (_source, args) =>
              await getAllById(fastify, args)
          },
          getUser: {
            type: userTypeWithAllData,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
            },
            resolve: async (_source, { id }) =>
              await getUserByIdWithAllData(fastify, id)
          },
          /*  getUsers: {
              type: [userTypeWithAllData],
              resolve: async () =>
                await getAllUserByIdWithAllData(fastify)
            },
            /*  usersWithUserSubscribedTo: {},
              userWithSubscribedToUser: {},
              usersSubscriptions: {},*/
        }),
      });


      const mutationType = new GraphQLObjectType({
        name: 'mutationType',
        fields: () => ({
          createUser: {
            type: userType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(UserInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createUser(fastify, data)
          },
          createProfile: {
            type: profileType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(ProfileInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createProfile(fastify, data)
          },
          createPost: {
            type: postType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(PostInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createPost(fastify, data)
          },
          updateUser: {
            type: userType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(UserInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updateUser(fastify, data)
          },
          updateProfile: {
            type: profileType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(ProfileInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updateProfile(fastify, data)
          },
          updatePost: {
            type: postType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(PostInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updatePost(fastify, data)
          },
          updateMemberType: {
            type: memberType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(ChangeMemberTypeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updateMemberType(fastify, data)
          },
          subscribeTo: {
            type: userType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(SubscribeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await subscribeTo(fastify, data)
          },
          unsubscribeFrom: {
            type: userType,
            args: {
              data: {
                name: 'data',
                type: new GraphQLNonNull(SubscribeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await unsubscribeFrom(fastify, data)
          }
        }),
      });

      const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

      return await graphql({ schema, source, variableValues: variables });
    }
  );
};

export default plugin;
