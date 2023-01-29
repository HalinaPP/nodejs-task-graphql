import { generate_createUserDTO } from '../../../test/utils/fake';

export const getUsers = async (fastify: any) => {
  const generatedUser = generate_createUserDTO();
  await fastify.db.users.create(generatedUser);
  return await fastify.db.users.findMany();
}

export const getProfiles = async (fastify: any) => {
  return await fastify.db.profiles.findMany();
}

export const getPosts = async (fastify: any) => {
  return await fastify.db.posts.findMany();
}

export const getMemberTypes = async (fastify: any) => {
  return await fastify.db.memberTypes.findMany();
}

export const getAll = async (fastify: any) => {
  const users = await getUsers(fastify);
  const profiles = await getProfiles(fastify);
  const posts = await getPosts(fastify);
  const memberTypes = await getMemberTypes(fastify);

  return { users, profiles, posts, memberTypes };
}

const getUserById = async (fastify: any, id: string) => {
  return await fastify.db.users.findOne({ key: "id", equals: id });
}

const getProfileById = async (fastify: any, id: string) => {
  return await fastify.db.profiles.findOne({ key: "id", equals: id });
}

const getPostById = async (fastify: any, id: string) => {
  return await fastify.db.posts.findOne({ key: "id", equals: id });
}

const getMemberTypeById = async (fastify: any, id: string) => {
  return await fastify.db.memberTypes.findOne({ key: "id", equals: id });
}


export const getAllById = async (fastify: any, id: string) => {
  const user = await getUserById(fastify, id);
  const profile = getProfileById(fastify, id);
  const post = getPostById(fastify, id);
  const memberType = getMemberTypeById(fastify, id);

  return { user, profile, post, memberType }
}
