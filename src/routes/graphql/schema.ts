import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const graphqlBodySchema = {
  type: 'object',
  properties: {
    mutation: { type: 'string' },
    query: { type: 'string' },
    variables: {
      type: 'object',
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
    {
      type: 'object',
      required: ['mutation'],
      properties: {
        mutation: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  ],
} as const;


export const UserInputDTO = new GraphQLInputObjectType({
  name: 'UserInputDTO',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) }
  })
});

export const ProfileInputDTO = new GraphQLInputObjectType({
  name: 'ProfileInputDTO',
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
  })
});

export const PostInputDTO = new GraphQLInputObjectType({
  name: 'PostInputDTO',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })
});

export const userType = new GraphQLObjectType({
  name: 'User',
  description: 'user data',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the user.',
    },
    firstName: {
      type: GraphQLString,
      description: 'The name of the user.',
    },
    lastName: {
      type: GraphQLString,
      description: 'The lastname of the user.',
    },
    email: {
      type: GraphQLString,
      description: 'The email of the user.',
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLID),
      description:
        'The list with users to whom user subscribed, or an empty list if they have none.',
    },
  })
});

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'profile data',
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
  })
});

export const postType = new GraphQLObjectType({
  name: 'postType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  })
});

export const memberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  })
});


export const allType = new GraphQLObjectType({
  name: 'All',
  description: 'data of all users, profiles, posts, memmber-types',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      description: 'The list of all users.',
    },
    profiles: {
      type: new GraphQLList(profileType),
      description: 'The list of all profiles.',
    },
    posts: {
      type: new GraphQLList(postType),
      description: 'The list of all posts.',
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      description: 'The list of all member-types.',
    },
  })
});

export const allByIdType = new GraphQLObjectType({
  name: 'AllById',
  description: 'data of user, profiles, posts, memmber-types getting by id value',
  fields: () => ({
    user: {
      type: userType,
      description: 'The user getting by id.',
    },
    profile: {
      type: profileType,
      description: 'The profile getting by id.',
    },
    post: {
      type: postType,
      description: 'The post getting by id.',
    },
    memberType: {
      type: new GraphQLList(memberType),
      description: 'The member-type getting by id.',
    },
  })
});

/*


type Mutation {
  createUser(userData: UserDTO): User
  createProfile: Profile
  createPost: Post
}

*/