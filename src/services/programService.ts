// src/services/programService.ts
import api from './api';

export const programService = {
  getAll: async () => {
    const res = await api.get('/programs');
    return res.data;
  },

  getAllActive: async () => {
    const res = await api.get('/programs/active');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/programs/${id}`);
    return res.data;
  },

  getByDepartment: async (departmentId: number) => {
    const res = await api.get(`/programs/department/${departmentId}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post('/programs', data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.put(`/programs/${id}`, data);
    return res.data;
  },

  activate: async (id: number) => {
    const res = await api.patch(`/programs/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: number) => {
    const res = await api.patch(`/programs/${id}/deactivate`);
    return res.data;
  },

toggleStatus: async (id: number): Promise<void> => {
  await api.patch(`/programs/${id}/toggle-status`);
},

  delete: async (id: number) => {
    await api.delete(`/programs/${id}`);
  },
};