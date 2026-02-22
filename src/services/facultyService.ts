// src/services/facultyService.ts
import api from './api';

export const facultyService = {
  getAll: async () => {
    const res = await api.get('/faculties');
    return res.data;
  },

  getAllActive: async () => {
    const res = await api.get('/faculties/active');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/faculties/${id}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post('/faculties', data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.put(`/faculties/${id}`, data);
    return res.data;
  },

  activate: async (id: number) => {
    const res = await api.patch(`/faculties/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: number) => {
    const res = await api.patch(`/faculties/${id}/deactivate`);
    return res.data;
  },

  delete: async (id: number) => {
    await api.delete(`/faculties/${id}`);
  },
};