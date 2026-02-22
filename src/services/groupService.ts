import api from './api';
import { LabGroup, CreateLabGroupRequest, ApiResponse } from '../types';

export const groupService = {
  getBySession: async (sessionId: number): Promise<LabGroup[]> => {
    const response = await api.get<ApiResponse<LabGroup[]>>(`/groups/session/${sessionId}`);
    return response.data.data;
  },

  getBySessionWithMembers: async (sessionId: number): Promise<LabGroup[]> => {
    const response = await api.get<ApiResponse<LabGroup[]>>(`/groups/session/${sessionId}/with-members`);
    return response.data.data;
  },

  getById: async (id: number): Promise<LabGroup> => {
    const response = await api.get<ApiResponse<LabGroup>>(`/groups/${id}`);
    return response.data.data;
  },

  create: async (sessionId: number, data: CreateLabGroupRequest): Promise<LabGroup> => {
    const response = await api.post<ApiResponse<LabGroup>>(`/groups/session/${sessionId}`, data);
    return response.data.data;
  },

  update: async (id: number, data: CreateLabGroupRequest): Promise<LabGroup> => {
    const response = await api.put<ApiResponse<LabGroup>>(`/groups/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/groups/${id}`);
  },
};
