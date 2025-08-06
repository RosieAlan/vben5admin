import { baseRequestClient } from '#/api/request';

// 用户基础信息接口
export interface UserProfile {
  name: string;
  age: number;
  desc: string;
  avatar: string;
}

// API 响应接口
export interface ProfileResponse {
  data: UserProfile;
}

// 简化的 getProfile 函数，不需要泛型
export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await baseRequestClient.get<ProfileResponse>('/simple-api/profile');
  return res;
};

// 如果需要支持不同类型的 profile，可以使用这个泛型版本
export const getProfileGeneric = async <T extends UserProfile = UserProfile>(): Promise<{ data: T }> => {
  const res = await baseRequestClient.get<{ data: T }>('/simple-api/profile');
  return res;
};


