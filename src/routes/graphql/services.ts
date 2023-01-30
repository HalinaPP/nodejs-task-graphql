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

export const getUsers = async (fastify: any): Promise<UserEntity[]> => {
  const generatedUser = generate_createUserDTO();
  await fastify.db.users.create(generatedUser);
  return await fastify.db.users.findMany();
};

export const getProfiles = async (fastify: any) => {
  return await fastify.db.profiles.findMany();
};

export const getPosts = async (fastify: any) => {
  return await fastify.db.posts.findMany();
};

export const getMemberTypes = async (fastify: any) => {
  return await fastify.db.memberTypes.findMany();
};

export const getAll = async (fastify: any) => {
  const users = await getUsers(fastify);
  const profiles = await getProfiles(fastify);
  const posts = await getPosts(fastify);
  const memberTypes = await getMemberTypes(fastify);

  return { users, profiles, posts, memberTypes };
};

const getUserById = async (fastify: any, id: string) => {
  return await fastify.db.users.findOne({ key: "id", equals: id });
};

const getProfileById = async (fastify: any, id: string) => {
  return await fastify.db.profiles.findOne({ key: "id", equals: id });
};

const getPostById = async (fastify: any, id: string) => {
  return await fastify.db.posts.findOne({ key: "id", equals: id });
};

const getMemberTypeById = async (fastify: any, id: string) => {
  return await fastify.db.memberTypes.findOne({ key: "id", equals: id });
};

export const getAllById = async (fastify: any, id: string) => {
  const user = await getUserById(fastify, id);
  const profile = getProfileById(fastify, id);
  const post = getPostById(fastify, id);
  const memberType = getMemberTypeById(fastify, id);

  return { user, profile, post, memberType };
};

export const createUser = async (fastify: any, data: UserEntity) => {
  return fastify.db.users.create(data);
};

export const createProfile = async (fastify: any, data: ProfileEntity) => {
  return fastify.db.profiles.create(data);
};

export const createPost = async (fastify: any, data: PostEntity) => {
  return fastify.db.posts.create(data);
};

export const updateUser = async (fastify: any, data: UserEntity) => {
  const { id, ...newData } = data;
  return fastify.db.users.change(id, newData);
};

export const updateProfile = async (fastify: any, data: ProfileEntity) => {
  const { id, ...newData } = data;
  return fastify.db.profiles.change(id, newData);
};

export const updatePost = async (fastify: any, data: PostEntity) => {
  const { id, ...newData } = data;
  return fastify.db.posts.change(id, newData);
};

export const updateMemberType = async (
  fastify: any,
  data: MemberTypeEntity
) => {
  const { id, ...newData } = data;
  return fastify.db.memberTypes.change(id, newData);
};

export const subscribeTo = async (
  fastify: any,
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
  fastify: any,
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

export const getProfilesByUserId = async (fastify: any, id: string) => {
  return await fastify.db.profiles.findMany({ key: "userId", equals: id });
};

export const getPostsByUserId = async (fastify: any, id: string) => {
  return await fastify.db.posts.findMany({ key: "userId", equals: id });
};

export const getUserMemberTypeIds = (profiles: ProfileEntity[]) => {
  return profiles.map((profile) => profile.memberTypeId);
};

export const getUserMemberTypes = async (fastify: any, ids: string[]) => {
  return await fastify.db.memberTypes.findMany({ key: "id", equalsAnyOf: ids });
};

export const getUserByIdWithAllData = async (fastify: any, id: string) => {
  const user = await getUserById(fastify, id);
  const profiles = await getProfilesByUserId(fastify, id);
  const posts = await getPostsByUserId(fastify, id);

  const memberTypeIds = getUserMemberTypeIds(profiles);
  const memberTypes = await getUserMemberTypes(fastify, memberTypeIds);

  return { user, profiles, posts, memberTypes };
};

export const getAllUserByIdWithAllData = async (fastify: any) => {
  const users = await getUsers(fastify);
  return users.map(async (user) => await getUserByIdWithAllData(fastify, user.id));
};
