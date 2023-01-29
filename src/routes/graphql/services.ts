import { generate_createUserDTO } from '../../../test/utils/fake';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

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

export const createUser = async (fastify: any, data: UserEntity) => {
  return fastify.db.users.create(data);
}

export const createProfile = async (fastify: any, data: ProfileEntity) => {
  return fastify.db.profiles.create(data);
}

export const createPost = async (fastify: any, data: PostEntity) => {
  return fastify.db.posts.create(data);
}

export const updateUser = async (fastify: any, data: UserEntity) => {
  const { id, ...newData } = data;
  return fastify.db.users.change(id, newData);
}

export const updateProfile = async (fastify: any, data: ProfileEntity) => {
  const { id, ...newData } = data;
  return fastify.db.profiles.change(id, newData);
}

export const updatePost = async (fastify: any, data: PostEntity) => {
  const { id, ...newData } = data;
  return fastify.db.posts.change(id, newData);
}

export const updateMemberType = async (fastify: any, data: MemberTypeEntity) => {
  const { id, ...newData } = data;
  console.log('data=', data);
  return fastify.db.memberTypes.change(id, newData);
}