import api from './api';
import { User, ApiResponse } from '../types';

export const adminService = {
  getLabManagers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/admin/lab-managers');
    return response.data.data;
  },

  deactivateLabManager: async (id: number): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/admin/lab-managers/${id}/deactivate`);
},

activateLabManager: async (id: number): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/admin/lab-managers/${id}/activate`);
},
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/dashboard/stats');
    return response.data.data;
  },


};
