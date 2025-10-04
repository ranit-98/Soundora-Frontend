import { Message, User } from '@/types/types';
import { axiosInstance } from '../axios';
import { ENDPOINTS } from '../endpoints';

export const fetchUsers = async () => {
  const response = await axiosInstance.get(ENDPOINTS.users);
  return response.data as User[];
};

export const fetchMessages = async (userId: string) => {
  const response = await axiosInstance.get(ENDPOINTS.userMessages(userId));
  return response.data as Message[];
};

export const fetchUserDetails = async (userId: string) => {
  const response = await axiosInstance.get(ENDPOINTS.userById(userId));
  return response.data as User;
}

export const updateUserDetails = async (userId: string, data: Partial<User>) => {
  const response = await axiosInstance.put(ENDPOINTS.userById(userId), data);
  return response.data as User;
}