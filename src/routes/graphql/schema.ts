import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const graphqlBodySchema = {
  type: "object",
  properties: {
    mutation: { type: "string" },
    query: { type: "string" },
    variables: {
      type: "object",
    },
  },
  oneOf: [
    {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      required: ["mutation"],
      properties: {
        mutation: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
  ],
} as const;

export const UserInputDTO = new GraphQLInputObjectType({
  name: "UserInputDTO",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  }),
});

export const ProfileInputDTO = new GraphQLInputObjectType({
  name: "ProfileInputDTO",
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString), defaultValue: "female" },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const ChangeProfileInputDTO = new GraphQLInputObjectType({
  name: "ChangeProfileInputDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString, defaultValue: "female" },
    birthday: { type: GraphQLString },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
    userId: { type: GraphQLID },
  }),
});

export const PostInputDTO = new GraphQLInputObjectType({
  name: "PostInputDTO",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const ChangePostInputDTO = new GraphQLInputObjectType({
  name: "ChangePostInputDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

export const ChangeMemberTypeInputDTO = new GraphQLInputObjectType({
  name: "ChangeMemberTypeInputDTO",
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const SubscribeInputDTO = new GraphQLInputObjectType({
  name: "SubscribeInputDTO",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const userType = new GraphQLObjectType({
  name: "User",
  description: "user data",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the user.",
    },
    firstName: {
      type: GraphQLString,
      description: "The name of the user.",
    },
    lastName: {
      type: GraphQLString,
      description: "The lastname of the user.",
    },
    email: {
      type: GraphQLString,
      description: "The email of the user.",
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLID),
      description:
        "The list with users to whom user subscribed, or an empty list if they have none.",
    },
  }),
});

export const profileType = new GraphQLObjectType({
  name: "Profile",
  description: "profile data",
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const postType = new GraphQLObjectType({
  name: "postType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export const memberType = new GraphQLObjectType({
  name: "memberType",
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const userTypeWithAllData = new GraphQLObjectType({
  name: "userTypeWithAllData",
  description: "user data with all data",
  fields: () => ({
    user: { type: new GraphQLNonNull(userType) },
    profile: { type: profileType },
    posts: { type: new GraphQLList(postType) },
    memberType: { type: memberType },
  }),
});

export const usersWithAllDataType = new GraphQLObjectType({
  name: "usersWithAllDataType",
  description: "users with all data",
  fields: () => ({
    users: { type: new GraphQLList(userTypeWithAllData) },
  }),
});

export const userWithSubscribedToUserPostsType = new GraphQLObjectType({
  name: "userWithSubscribedToUserPostsType",
  description: "user by id with his subscribedToUser, posts.",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    posts: { type: new GraphQLList(postType) },
    subscribedToUser: { type: new GraphQLList(userType) },
  }),
});

export const userWithUserSubscribedToProfileType = new GraphQLObjectType({
  name: "userWithUserSubscribedToProfileType",
  description: "user with his userSubscribedTo ids, profile.",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    profile: { type: profileType },
    userSubscribedTo: { type: new GraphQLList(userType) },
  }),
});

export const usersWithUserSubscribedToProfileType = new GraphQLObjectType({
  name: "usersWithUserSubscribedToProfileType",
  description: "users with his userSubscribedTo ids, profile.",
  fields: () => ({
    users: {
      type: new GraphQLList(userWithUserSubscribedToProfileType),
    },
  }),
});


export const userWithUserSubscribedTo2levelType = new GraphQLObjectType({
  name: "userWithUserSubscribedTo2levelType",
  description: "user with his userSubscribedTo,userSubscribedTo.",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    userSubscribedTo: { type: new GraphQLList(userWithUserSubscribedToType) },
    subscribedToUser: { type: new GraphQLList(userWithUserSubscribedToType) },
  }),
});

export const userWithUserSubscribedToType = new GraphQLObjectType({
  name: "userWithUserSubscribedToType",
  description: "user with his userSubscribedTo,userSubscribedTo.",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    userSubscribedTo: { type: new GraphQLList(userType) },
    subscribedToUser: { type: new GraphQLList(userType) },
  }),
});
/*
export const usersWithUserSubscribedToType = new GraphQLObjectType({
  name: "usersWithUserSubscribedToType",
  description: "users with their userSubscribedTo , userSubscribedTo",
  fields: () => ({
    users: {
      type: new GraphQLList(userWithUserSubscribedToType),
    },
  }),
});
*/
export const allType = new GraphQLObjectType({
  name: "All",
  description: "data of all users, profiles, posts, memmber-types",
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      description: "The list of all users.",
    },
    profiles: {
      type: new GraphQLList(profileType),
      description: "The list of all profiles.",
    },
    posts: {
      type: new GraphQLList(postType),
      description: "The list of all posts.",
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      description: "The list of all member-types.",
    },
  }),
});

export const allByIdType = new GraphQLObjectType({
  name: "AllById",
  description:
    "data of user, profiles, posts, memmber-types getting by id value",
  fields: () => ({
    user: {
      type: userType,
      description: "The user getting by id.",
    },
    profile: {
      type: profileType,
      description: "The profile getting by id.",
    },
    post: {
      type: postType,
      description: "The post getting by id.",
    },
    memberType: {
      type: new GraphQLList(memberType),
      description: "The member-type getting by id.",
    },
  }),
});
