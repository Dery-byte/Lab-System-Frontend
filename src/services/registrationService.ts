import api from './api';
import { Registration, CreateRegistrationRequest, ApiResponse } from '../types';

export const registrationService = {
  create: async (data: CreateRegistrationRequest): Promise<Registration> => {
    const response = await api.post<ApiResponse<Registration>>('/registrations', data);
    return response.data.data;
  },
  getMyRegistrations: async (): Promise<Registration[]> => {
    const response = await api.get<ApiResponse<Registration[]>>('/registrations/my');
    return response.data.data;
  },
  getMyActiveRegistrations: async (): Promise<Registration[]> => {
    const response = await api.get<ApiResponse<Registration[]>>('/registrations/my/active');
    return response.data.data;
  },
  getBySession: async (sessionId: number): Promise<Registration[]> => {
    const response = await api.get<ApiResponse<Registration[]>>(`/registrations/session/${sessionId}`);
    return response.data.data;
  },
  cancel: async (id: number): Promise<Registration> => {
    const response = await api.patch<ApiResponse<Registration>>(`/registrations/${id}/cancel`);
    return response.data.data;
  },
};
