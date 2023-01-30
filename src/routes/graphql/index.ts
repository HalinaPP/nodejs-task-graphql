import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  graphql,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import {
  allByIdType,
  allType,
  ChangeMemberTypeInputDTO,
  ChangePostInputDTO,
  ChangeProfileInputDTO,
  graphqlBodySchema,
  memberType,
  PostInputDTO,
  postType,
  ProfileInputDTO,
  profileType,
  SubscribeInputDTO,
  UserInputDTO,
  usersWithAllDataType,
  usersWithUserSubscribedToProfileType,
  userType,
  userTypeWithAllData,
  userWithSubscribedToUserPostsType,
  userWithUserSubscribedTo2levelType,
} from "./schema";
import {
  createPost,
  createProfile,
  createUser,
  getAll,
  getAllById,
  getAllUserWithAllData,
  getUserByIdWithAllData,
  getUsersSubscriptions,
  getUserWithSubscribedToUserPosts,
  subscribeTo,
  unsubscribeFrom,
  updateMemberType,
  updatePost,
  updateProfile,
  updateUser,
  usersWithUserSubscribedToProfiles,
} from "./services";

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
      console.log("var=", request.body);

      const queryType = new GraphQLObjectType({
        name: "queryType",
        fields: () => ({
          all: {
            type: allType,
            resolve: async () => await getAll(fastify),
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
            resolve: async (_source, args) => await getAllById(fastify, args),
          },
          getUser: {
            type: userTypeWithAllData,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
            },
            resolve: async (_source, { id }) =>
              await getUserByIdWithAllData(fastify, id),
          },
          getUsers: {
            type: usersWithAllDataType,
            resolve: async () => await getAllUserWithAllData(fastify),
          },
          getUsersWithUserSubscribedToProfiles: {
            type: usersWithUserSubscribedToProfileType,
            resolve: async () =>
              usersWithUserSubscribedToProfiles(fastify),
          },
          getUserSubscribedPosts: {
            type: userWithSubscribedToUserPostsType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLID),
              },
            },
            resolve: async (_source, { id }) =>
              getUserWithSubscribedToUserPosts(fastify, id),
          },
          getUsersSubscriptions: {
            type: userWithUserSubscribedTo2levelType,
            resolve: async () =>
              getUsersSubscriptions(fastify, 2),
          },
        }),
      });

      const mutationType = new GraphQLObjectType({
        name: "mutationType",
        fields: () => ({
          createUser: {
            type: userType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(UserInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createUser(fastify, data),
          },
          createProfile: {
            type: profileType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(ProfileInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createProfile(fastify, data),
          },
          createPost: {
            type: postType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(PostInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await createPost(fastify, data),
          },
          updateUser: {
            type: userType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(UserInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updateUser(fastify, data),
          },
          updateProfile: {
            type: profileType,
            args: {
              data: {
                name: "data",
                type: ChangeProfileInputDTO,
              },
            },
            resolve: async (_source, { data }) =>
              await updateProfile(fastify, data),
          },
          updatePost: {
            type: postType,
            args: {
              data: {
                name: "data",
                type: ChangePostInputDTO,
              },
            },
            resolve: async (_source, { data }) =>
              await updatePost(fastify, data),
          },
          updateMemberType: {
            type: memberType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(ChangeMemberTypeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await updateMemberType(fastify, data),
          },
          subscribeTo: {
            type: userType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(SubscribeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await subscribeTo(fastify, data),
          },
          unsubscribeFrom: {
            type: userType,
            args: {
              data: {
                name: "data",
                type: new GraphQLNonNull(SubscribeInputDTO),
              },
            },
            resolve: async (_source, { data }) =>
              await unsubscribeFrom(fastify, data),
          },
        }),
      });

      const schema = new GraphQLSchema({
        query: queryType,
        mutation: mutationType,
      });

      return await graphql({ schema, source, variableValues: variables });
    }
  );
};

export default plugin;
