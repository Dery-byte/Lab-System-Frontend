import api from './api';
import { WeeklyNote, UpdateWeeklyNoteRequest, ApiResponse } from '../types';

export const weeklyNoteService = {
  // Get all weekly notes for admin/lab manager (includes unpublished)
  getAllForSession: async (sessionId: number): Promise<WeeklyNote[]> => {
    const response = await api.get<ApiResponse<WeeklyNote[]>>(`/weekly-notes/session/${sessionId}/all`);
    return response.data.data;
  },
  // Get published weekly notes for students
  getPublishedForSession: async (sessionId: number): Promise<WeeklyNote[]> => {
    const response = await api.get<ApiResponse<WeeklyNote[]>>(`/weekly-notes/session/${sessionId}`);
    return response.data.data;
  },
  // Update or create a weekly note
  update: async (data: UpdateWeeklyNoteRequest): Promise<WeeklyNote> => {
    const response = await api.post<ApiResponse<WeeklyNote>>('/weekly-notes', data);
    return response.data.data;
  },
  // Publish a weekly note
  publish: async (sessionId: number, weekNumber: number): Promise<WeeklyNote> => {
    const response = await api.patch<ApiResponse<WeeklyNote>>(`/weekly-notes/session/${sessionId}/week/${weekNumber}/publish`);
    return response.data.data;
  },
  // Unpublish a weekly note
  unpublish: async (sessionId: number, weekNumber: number): Promise<WeeklyNote> => {
    const response = await api.patch<ApiResponse<WeeklyNote>>(`/weekly-notes/session/${sessionId}/week/${weekNumber}/unpublish`);
    return response.data.data;
  },
};
