import api from './api';
import { Attendance, MarkAttendanceRequest, ApiResponse } from '../types';

export const attendanceService = {
  // POST /api/attendance/mark
  markAttendance: async (data: MarkAttendanceRequest): Promise<Attendance[]> => {
    const response = await api.post<ApiResponse<Attendance[]>>('/attendance/mark', data);
    return response.data.data;
  },

  // GET /api/attendance/registration/{registrationId}
  getByRegistration: async (registrationId: number): Promise<Attendance[]> => {
    const response = await api.get<ApiResponse<Attendance[]>>(`/attendance/registration/${registrationId}`);
    return response.data.data;
  },

  // GET /api/attendance/session/{sessionId}/date/{date}
  getBySessionAndDate: async (sessionId: number, date: string): Promise<Attendance[]> => {
    const response = await api.get<ApiResponse<Attendance[]>>(`/attendance/session/${sessionId}/date/${date}`);
    return response.data.data;
  },

  // GET /api/attendance/session/{sessionId}
  getAllBySession: async (sessionId: number): Promise<Attendance[]> => {
    const response = await api.get<ApiResponse<Attendance[]>>(`/attendance/session/${sessionId}`);
    return response.data.data;
  },
};
