import { FastifyInstance } from 'fastify';
import { generate_createUserDTO } from "../../../test/utils/fake";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";

export const unsibscibedUser = async (
  fastify: any,
  userIdToSubscribed: string,
  subscribedUser: UserEntity
): Promise<void> => {
  const subscribedToUserIds = subscribedUser.subscribedToUserIds.filter(
    (id) => id !== userIdToSubscribed
  );
  await fastify.db.users.change(subscribedUser.id, {
    ...subscribedUser,
    subscribedToUserIds,
  });
};

export const getUsers = async (fastify: FastifyInstance): Promise<UserEntity[]> => {
  const generatedUser = generate_createUserDTO();
  await fastify.db.users.create(generatedUser);
  return await fastify.db.users.findMany();
};

export const getProfiles = async (fastify: FastifyInstance) => {
  return await fastify.db.profiles.findMany();
};

export const getPosts = async (fastify: FastifyInstance) => {
  return await fastify.db.posts.findMany();
};

export const getMemberTypes = async (fastify: FastifyInstance) => {
  return await fastify.db.memberTypes.findMany();
};

export const getAll = async (fastify: FastifyInstance) => {
  const users = await getUsers(fastify);
  const profiles = await getProfiles(fastify);
  const posts = await getPosts(fastify);
  const memberTypes = await getMemberTypes(fastify);

  return { users, profiles, posts, memberTypes };
};

const getUserById = async (fastify: FastifyInstance, id: string): Promise<UserEntity> => {
  const user = await fastify.db.users.findOne({ key: "id", equals: id });
  if (user === null) {
    throw fastify.httpErrors.notFound('User is  not found');
  }

  return user;
};

const getProfileById = async (fastify: FastifyInstance, id: string): Promise<ProfileEntity> => {
  const profile = await fastify.db.profiles.findOne({ key: "id", equals: id });
  if (profile === null) {
    throw fastify.httpErrors.notFound('Profile is  not found');
  }

  return profile;
};

const getPostById = async (fastify: FastifyInstance, id: string): Promise<PostEntity> => {
  const post = await fastify.db.posts.findOne({ key: "id", equals: id });
  if (post === null) {
    throw fastify.httpErrors.notFound('Post is not found');
  }

  return post;
};

const getMemberTypeById = async (fastify: FastifyInstance, id: string): Promise<MemberTypeEntity> => {
  const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: id });
  if (memberType === null) {
    throw fastify.httpErrors.notFound('MemberType is not found');
  }

  return memberType;
};

export const getAllById = async (fastify: FastifyInstance, { userId, profileId, postId, memberTypeId }: { [key: string]: string }) => {
  const user = await getUserById(fastify, userId);
  const profile = getProfileById(fastify, profileId);
  const post = getPostById(fastify, postId);
  const memberType = getMemberTypeById(fastify, memberTypeId);

  return { user, profile, post, memberType };
};

export const createUser = async (fastify: FastifyInstance, data: UserEntity) => {
  return fastify.db.users.create(data);
};

export const createProfile = async (fastify: FastifyInstance, data: ProfileEntity) => {
  return fastify.db.profiles.create(data);
};

export const createPost = async (fastify: FastifyInstance, data: PostEntity) => {
  return fastify.db.posts.create(data);
};

export const updateUser = async (fastify: FastifyInstance, data: UserEntity) => {
  const { id, ...newData } = data;
  return fastify.db.users.change(id, newData);
};

export const updateProfile = async (fastify: FastifyInstance, data: ProfileEntity) => {
  const { id, ...newData } = data;
  return fastify.db.profiles.change(id, newData);
};

export const updatePost = async (fastify: FastifyInstance, data: PostEntity) => {
  const { id, ...newData } = data;
  return fastify.db.posts.change(id, newData);
};

export const updateMemberType = async (
  fastify: FastifyInstance,
  data: MemberTypeEntity
) => {
  const { id, ...newData } = data;
  return fastify.db.memberTypes.change(id, newData);
};

export const subscribeTo = async (
  fastify: FastifyInstance,
  data: { id: string; userId: string }
) => {
  const { id, userId } = data;

  const user = await fastify.db.users.findOne({
    key: "id",
    equals: userId,
  });

  const subscribedToUserIds = user ? [...user?.subscribedToUserIds] : [];

  if (!subscribedToUserIds.includes(id)) {
    subscribedToUserIds.push(id);
  }

  return fastify.db.users.change(userId, { subscribedToUserIds });
};

export const unsubscribeFrom = async (
  fastify: FastifyInstance,
  data: { id: string; userId: string }
) => {
  const { id, userId } = data;

  const user = await fastify.db.users.findOne({
    key: "id",
    equals: userId,
  });

  if (user === null) {
    throw new Error("bad request. User with id does not exist");
  }

  if (id) {
    const subscribedUser = await fastify.db.users.findOne({
      key: "id",
      equals: id,
    });

    if (subscribedUser === null) {
      throw new Error("bad request");
    }

    if (!subscribedUser.subscribedToUserIds.includes(userId)) {
      throw new Error("bad request. Users is not subscribed");
    } else {
      await unsibscibedUser(fastify, userId, subscribedUser);
    }
  }
};

export const getProfilesByUserId = async (fastify: FastifyInstance, id: string) => {
  return await fastify.db.profiles.findMany({ key: "userId", equals: id });
};

export const getPostsByUserId = async (fastify: FastifyInstance, id: string) => {
  return await fastify.db.posts.findMany({ key: "userId", equals: id });
};

export const getUserMemberTypeIds = (profiles: ProfileEntity[]) => {
  return profiles.map((profile) => profile.memberTypeId);
};

export const getUserMemberTypes = async (fastify: FastifyInstance, ids: string[]) => {
  return await fastify.db.memberTypes.findMany({ key: "id", equalsAnyOf: ids });
};

export const getUserByIdWithAllData = async (fastify: FastifyInstance, id: string) => {
  const user = await getUserById(fastify, id);
  const profiles = await getProfilesByUserId(fastify, id);
  const posts = await getPostsByUserId(fastify, id);

  const memberTypeIds = getUserMemberTypeIds(profiles);
  const memberTypes = await getUserMemberTypes(fastify, memberTypeIds);

  return { user, profiles, posts, memberTypes };
};

export const getAllUserWithAllData = async (fastify: FastifyInstance) => {
  const users = await getUsers(fastify);
  const usersWithAllData = users.map(async (user) => await getUserByIdWithAllData(fastify, user.id));
  return { users: usersWithAllData }
};
