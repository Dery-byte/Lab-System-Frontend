import api from './api';
import { Department, CreateDepartmentRequest } from '../types';
import { User, ApiResponse } from '../types';


export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get('/departments');
    return response.data.data;
  },

  getActive: async (): Promise<Department[]> => {
    const response = await api.get('/departments/active');
    return response.data.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get(`/departments/${id}`);
    return response.data.data;
  },

  getByCode: async (code: string): Promise<Department> => {
    const response = await api.get(`/departments/code/${code}`);
    return response.data.data;
  },

  create: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await api.post('/departments', data);
    return response.data.data;
  },

  update: async (id: number, data: CreateDepartmentRequest): Promise<Department> => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },



    deactivateDepartment: async (id: number): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/departments/${id}/deactivate`);
},

    activateDepartment: async (id: number): Promise<void> => {
  await api.patch<ApiResponse<void>>(`/departments/${id}/activate`);
},


};
