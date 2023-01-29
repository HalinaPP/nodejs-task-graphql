import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { buildSchema, graphql } from "graphql";
import { graphqlBodySchema } from "./schema";
import { generate_createUserDTO } from "../../../test/utils/fake";

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


      const schema = buildSchema(`
      type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
        subscribedToUserIds: [String]
      }

      type Profile {
        id: String
        avatar: String
        sex: String
        birthday: Int
        country: String
        street: String
        city: String
        memberTypeId: String
        userId: String
      }

      type Post {
        id: String
        title: String
        content: String
        userId: String
      }

      type MemberType {
        id: String
        discount: Int
        monthPostsLimit: Int
      }

      type All {
        users: [User]
        profiles: [Profile]
        posts: [Post]
        memberTypes: [MemberType]
      }

      type AllById {
        user: User
        profile: Profile
        post: Post
        memberType: MemberType
      }

      type Query {
        all: All
        allById(id:ID!) : AllById!
        users: [User]
        user: User
        usersWithUserSubscribedTo: [User]
        userWithSubscribedToUser: User
        usersSubscriptions: [User]
      }

      `);

      const rootValue = {
        all: async () => {
          const us = generate_createUserDTO();
          await fastify.db.users.create(us);

          const users = await fastify.db.users.findMany();
          const profiles = await fastify.db.profiles.findMany();
          const posts = await fastify.db.posts.findMany();
          const memberTypes = await fastify.db.memberTypes.findMany();
          return { users, profiles, posts, memberTypes }
        },

        allById: async ({ id }: { id: string }) => {
          const user = await fastify.db.users.findOne({ key: "id", equals: id });
          const profile = await fastify.db.profiles.findOne({ key: "id", equals: id });
          const post = await fastify.db.posts.findOne({ key: "id", equals: id });
          const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: id });
          return { user, profile, post, memberType }
        },
        users: async () => {
          const us = generate_createUserDTO();
          await fastify.db.users.create(us);
          return await fastify.db.users.findMany();
        },
        profiles: async () => {
          return await fastify.db.profiles.findMany();
        },
        posts: async () => {
          return await fastify.db.posts.findMany();
        },
        memberTypes: async () => {
          return await fastify.db.memberTypes.findMany();
        }
      };

      return await graphql({ schema, source, rootValue, variableValues: variables });
    }
  );
};

export default plugin;
