import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, Program } from '../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },
};

export const publicService = {
  getPrograms: async (): Promise<Program[]> => {
    const response = await api.get<ApiResponse<Program[]>>('/public/programs');
    return response.data.data;
  },
};
