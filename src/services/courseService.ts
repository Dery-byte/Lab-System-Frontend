import api from './api';
import { Course, ApiResponse } from '../types';

export const courseService = {
  getAll: async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses');
    return response.data.data;
  },

  getActive: async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses/active');
    return response.data.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  },

  create: async (data: any): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>('/courses', data);
    return response.data.data;
  },

  update: async (id: number, data: any): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, data);
    return response.data.data;
  },

  toggleStatus: async (id: number): Promise<void> => {
    await api.patch(`/courses/${id}/toggle-status`);
  },
};
