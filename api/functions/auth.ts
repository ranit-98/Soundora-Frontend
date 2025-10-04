import { axiosInstance } from '../axios';
import { ENDPOINTS } from '../endpoints';

export const checkAdminStatus = async () => {
  const response = await axiosInstance.get(ENDPOINTS.adminCheck);
  return response.data as { admin: boolean };
};

export const authCallback = async (token: string) => {
  const response = await axiosInstance.post(ENDPOINTS.authCallback, { token });
  return response.data as { success: boolean; token: string };
};