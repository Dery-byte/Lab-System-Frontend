import api from './api';
import { LabSession, CreateLabSessionRequest, ApiResponse, SessionStatus } from '../types';

export const labSessionService = {
  getAll: async (): Promise<LabSession[]> => {
    const response = await api.get<ApiResponse<LabSession[]>>('/lab-sessions');
    return response.data.data;
  },




  getById: async (id: number): Promise<LabSession> => {
    const response = await api.get<ApiResponse<LabSession>>(`/lab-sessions/${id}`);
    return response.data.data;
  },



  
  getAvailableForMe: async (): Promise<LabSession[]> => {
    const response = await api.get<ApiResponse<LabSession[]>>('/lab-sessions/available-for-me');
    return response.data.data;
  },
  updateStatus: async (id: number, status: SessionStatus): Promise<LabSession> => {
    const response = await api.patch<ApiResponse<LabSession>>(`/lab-sessions/${id}/status?status=${status}`);
    return response.data.data;
  },



  create: async (data: CreateLabSessionRequest): Promise<LabSession> => {
    const response = await api.post<ApiResponse<LabSession>>('/lab-sessions', data);
    return response.data.data;
  },

  update: async (id: number, data: CreateLabSessionRequest): Promise<LabSession> => {
    const response = await api.put<ApiResponse<LabSession>>(`/lab-sessions/${id}`, data);
    return response.data.data;
  },



  updatePrograms: async (id: number, allowedPrograms: string[], openToAllPrograms: boolean): Promise<LabSession> => {
    const response = await api.patch<ApiResponse<LabSession>>(`/lab-sessions/${id}/programs`, {
      allowedPrograms,
      openToAllPrograms,
    });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/lab-sessions/${id}`);
  },


};
