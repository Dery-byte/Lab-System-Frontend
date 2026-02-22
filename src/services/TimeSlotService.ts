// import api from './api';
// import { TimeSlot,CreateTimeSlotRequest, UpdateTimeSlotRequest, TimeSlotsByDate } from '../types';
// export const timeSlotService = {

//   // ---------------------------------------------------------------------------
//   // READ
//   // ---------------------------------------------------------------------------

//   /**
//    * All time slots for a session ordered by date → slot number.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots
//    */
//   getBySession: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<TimeSlot[]>(
//       `/sessions/${sessionId}/time-slots`
//     );
//     return data;
//   },

//   /**
//    * Time slots grouped by date — avoids the client-side reduce in the TSX.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots/grouped
//    */
//   getGroupedByDate: async (sessionId: number): Promise<TimeSlotsByDate> => {
//     const { data } = await api.get<TimeSlotsByDate>(
//       `/sessions/${sessionId}/time-slots/grouped`
//     );
//     return data;
//   },

//   /**
//    * Only active, non-full slots — for student registration dropdowns.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots/available
//    */
//   getAvailable: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<TimeSlot[]>(
//       `/sessions/${sessionId}/time-slots/available`
//     );
//     return data;
//   },

//   /**
//    * Slots on today or later.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots/upcoming
//    */
//   getUpcoming: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<TimeSlot[]>(
//       `/sessions/${sessionId}/time-slots/upcoming`
//     );
//     return data;
//   },

//   /**
//    * Slots for a session on a specific date.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots/by-date?date=2025-04-01
//    */
//   getByDate: async (sessionId: number, date: string): Promise<TimeSlot[]> => {
//     const { data } = await api.get<TimeSlot[]>(
//       `/sessions/${sessionId}/time-slots/by-date`,
//       { params: { date } }
//     );
//     return data;
//   },

//   /**
//    * Total registrations across all slots for a session.
//    * Maps to: GET /api/sessions/{sessionId}/time-slots/registration-count
//    */
//   getTotalRegistrations: async (sessionId: number): Promise<number> => {
//     const { data } = await api.get<{ totalRegistrations: number }>(
//       `/sessions/${sessionId}/time-slots/registration-count`
//     );
//     return data.totalRegistrations;
//   },

//   /**
//    * Single time slot by id.
//    * Maps to: GET /api/time-slots/{slotId}
//    */
//   getById: async (slotId: number): Promise<TimeSlot> => {
//     const { data } = await api.get<TimeSlot>(`/time-slots/${slotId}`);
//     return data;
//   },

//   // ---------------------------------------------------------------------------
//   // CREATE  — used by handleAddTimeSlot / handleSubmit (editingGroup === null)
//   // ---------------------------------------------------------------------------

//   /**
//    * Creates a single time slot.
//    * Maps to: POST /api/sessions/{sessionId}/time-slots
//    */
//   create: async (
//     sessionId: number,
//     request: CreateTimeSlotRequest
//   ): Promise<TimeSlot> => {
//     const { data } = await api.post<TimeSlot>(
//       `/sessions/${sessionId}/time-slots`,
//       request
//     );
//     return data;
//   },

//   /**
//    * Creates multiple time slots in one round-trip.
//    * Maps to: POST /api/sessions/{sessionId}/time-slots/bulk
//    */
//   createBulk: async (
//     sessionId: number,
//     requests: CreateTimeSlotRequest[]
//   ): Promise<TimeSlot[]> => {
//     const { data } = await api.post<TimeSlot[]>(
//       `/sessions/${sessionId}/time-slots/bulk`,
//       requests
//     );
//     return data;
//   },

//   // ---------------------------------------------------------------------------
//   // UPDATE  — used by handleSubmit (editingGroup !== null)
//   // ---------------------------------------------------------------------------

//   /**
//    * Partial or full update of a time slot.
//    * Maps to: PUT /api/time-slots/{slotId}
//    */
//   update: async (
//     slotId: number,
//     request: UpdateTimeSlotRequest
//   ): Promise<TimeSlot> => {
//     const { data } = await api.put<TimeSlot>(
//       `/time-slots/${slotId}`,
//       request
//     );
//     return data;
//   },

//   /**
//    * Quickly toggles a slot's active flag without a full update payload.
//    * Maps to: PATCH /api/time-slots/{slotId}/toggle-active
//    */
//   toggleActive: async (slotId: number): Promise<TimeSlot> => {
//     const { data } = await api.patch<TimeSlot>(
//       `/time-slots/${slotId}/toggle-active`
//     );
//     return data;
//   },

//   // ---------------------------------------------------------------------------
//   // DELETE  — used by handleDeleteTimeSlot
//   // ---------------------------------------------------------------------------

//   /**
//    * Hard-deletes a slot. The backend rejects this if students are registered
//    * (matching the disabled={group.currentSize > 0} guard in the UI).
//    * Maps to: DELETE /api/time-slots/{slotId}
//    */
//   delete: async (slotId: number): Promise<void> => {
//     await api.delete(`/time-slots/${slotId}`);
//   },
// };




// import api from './api';
// import { TimeSlot, CreateTimeSlotRequest, UpdateTimeSlotRequest, TimeSlotsByDate } from '../types';

// // Backend wraps all responses as: { success, message, data: T }
// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export const timeSlotService = {

//   // ---------------------------------------------------------------------------
//   // READ
//   // ---------------------------------------------------------------------------

//   /** GET /api/sessions/{sessionId}/time-slots */
//   getBySession: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<ApiResponse<TimeSlot[]>>(
//       `/sessions/${sessionId}/time-slots`
//     );
//     return data.data;
//   },

//   /** GET /api/sessions/{sessionId}/time-slots/grouped */
//   getGroupedByDate: async (sessionId: number): Promise<TimeSlotsByDate> => {
//     const { data } = await api.get<ApiResponse<TimeSlotsByDate>>(
//       `/sessions/${sessionId}/time-slots/grouped`
//     );
//     return data.data;
//   },

//   /** GET /api/sessions/{sessionId}/time-slots/available */
//   getAvailable: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<ApiResponse<TimeSlot[]>>(
//       `/sessions/${sessionId}/time-slots/available`
//     );
//     return data.data;
//   },

//   /** GET /api/sessions/{sessionId}/time-slots/upcoming */
//   getUpcoming: async (sessionId: number): Promise<TimeSlot[]> => {
//     const { data } = await api.get<ApiResponse<TimeSlot[]>>(
//       `/sessions/${sessionId}/time-slots/upcoming`
//     );
//     return data.data;
//   },

//   /** GET /api/sessions/{sessionId}/time-slots/by-date?date=2025-04-01 */
//   getByDate: async (sessionId: number, date: string): Promise<TimeSlot[]> => {
//     const { data } = await api.get<ApiResponse<TimeSlot[]>>(
//       `/sessions/${sessionId}/time-slots/by-date`,
//       { params: { date } }
//     );
//     return data.data;
//   },

//   /** GET /api/sessions/{sessionId}/time-slots/registration-count */
//   getTotalRegistrations: async (sessionId: number): Promise<number> => {
//     const { data } = await api.get<ApiResponse<{ totalRegistrations: number }>>(
//       `/sessions/${sessionId}/time-slots/registration-count`
//     );
//     return data.data.totalRegistrations;
//   },

//   /** GET /api/time-slots/{slotId} */
//   getById: async (slotId: number): Promise<TimeSlot> => {
//     const { data } = await api.get<ApiResponse<TimeSlot>>(`/time-slots/${slotId}`);
//     return data.data;
//   },

//   // ---------------------------------------------------------------------------
//   // CREATE
//   // ---------------------------------------------------------------------------

//   /** POST /api/sessions/{sessionId}/time-slots */
//   create: async (sessionId: number, request: CreateTimeSlotRequest): Promise<TimeSlot> => {
//     const { data } = await api.post<ApiResponse<TimeSlot>>(
//       `/sessions/${sessionId}/time-slots`,
//       request
//     );
//     return data.data;
//   },

//   /** POST /api/sessions/{sessionId}/time-slots/bulk */
//   createBulk: async (sessionId: number, requests: CreateTimeSlotRequest[]): Promise<TimeSlot[]> => {
//     const { data } = await api.post<ApiResponse<TimeSlot[]>>(
//       `/sessions/${sessionId}/time-slots/bulk`,
//       requests
//     );
//     return data.data;
//   },

//   // ---------------------------------------------------------------------------
//   // UPDATE
//   // ---------------------------------------------------------------------------

//   /** PUT /api/time-slots/{slotId} */
//   update: async (slotId: number, request: UpdateTimeSlotRequest): Promise<TimeSlot> => {
//     const { data } = await api.put<ApiResponse<TimeSlot>>(
//       `/time-slots/${slotId}`,
//       request
//     );
//     return data.data;
//   },

//   /** PATCH /api/time-slots/{slotId}/toggle-active */
//   toggleActive: async (slotId: number): Promise<TimeSlot> => {
//     const { data } = await api.patch<ApiResponse<TimeSlot>>(
//       `/time-slots/${slotId}/toggle-active`
//     );
//     return data.data;
//   },

//   // ---------------------------------------------------------------------------
//   // DELETE
//   // ---------------------------------------------------------------------------

//   /** DELETE /api/time-slots/{slotId} */
//   delete: async (slotId: number): Promise<void> => {
//     await api.delete(`/time-slots/${slotId}`);
//   },
// };



import api from './api';
import { TimeSlot, CreateTimeSlotRequest, UpdateTimeSlotRequest, TimeSlotsByDate } from '../types';

// Backend wraps all responses as: { success, message, data: T }
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const timeSlotService = {

  // ---------------------------------------------------------------------------
  // READ
  // ---------------------------------------------------------------------------

  /** GET /api/sessions/{sessionId}/time-slots */
  getBySession: async (sessionId: number): Promise<TimeSlot[]> => {
    const { data } = await api.get<ApiResponse<TimeSlot[]>>(
      `/sessions/${sessionId}/time-slots`
    );
    return data.data;
  },

  /** GET /api/sessions/{sessionId}/time-slots/grouped */
  getGroupedByDate: async (sessionId: number): Promise<TimeSlotsByDate> => {
    const { data } = await api.get<ApiResponse<TimeSlotsByDate>>(
      `/sessions/${sessionId}/time-slots/grouped`
    );
    return data.data;
  },

  /** GET /api/sessions/{sessionId}/time-slots/available */
  getAvailable: async (sessionId: number): Promise<TimeSlot[]> => {
    const { data } = await api.get<ApiResponse<TimeSlot[]>>(
      `/sessions/${sessionId}/time-slots/available`
    );
    return data.data;
  },

  /** GET /api/sessions/{sessionId}/time-slots/upcoming */
  getUpcoming: async (sessionId: number): Promise<TimeSlot[]> => {
    const { data } = await api.get<ApiResponse<TimeSlot[]>>(
      `/sessions/${sessionId}/time-slots/upcoming`
    );
    return data.data;
  },

  /** GET /api/sessions/{sessionId}/time-slots/by-date?date=2025-04-01 */
  getByDate: async (sessionId: number, date: string): Promise<TimeSlot[]> => {
    const { data } = await api.get<ApiResponse<TimeSlot[]>>(
      `/sessions/${sessionId}/time-slots/by-date`,
      { params: { date } }
    );
    return data.data;
  },

  /** GET /api/sessions/{sessionId}/time-slots/registration-count */
  getTotalRegistrations: async (sessionId: number): Promise<number> => {
    const { data } = await api.get<ApiResponse<{ totalRegistrations: number }>>(
      `/sessions/${sessionId}/time-slots/registration-count`
    );
    return data.data.totalRegistrations;
  },

  /** GET /api/time-slots/{slotId} */
  getById: async (slotId: number): Promise<TimeSlot> => {
    const { data } = await api.get<ApiResponse<TimeSlot>>(`/time-slots/${slotId}`);
    return data.data;
  },

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /** POST /api/sessions/{sessionId}/time-slots */
  create: async (sessionId: number, request: CreateTimeSlotRequest): Promise<TimeSlot> => {
    const { data } = await api.post<ApiResponse<TimeSlot>>(
      `/sessions/${sessionId}/time-slots`,
      request
    );
    return data.data;
  },

  /** POST /api/sessions/{sessionId}/time-slots/bulk */
  createBulk: async (sessionId: number, requests: CreateTimeSlotRequest[]): Promise<TimeSlot[]> => {
    const { data } = await api.post<ApiResponse<TimeSlot[]>>(
      `/sessions/${sessionId}/time-slots/bulk`,
      requests
    );
    return data.data;
  },

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /** PUT /api/time-slots/{slotId} */
  update: async (slotId: number, request: UpdateTimeSlotRequest): Promise<TimeSlot> => {
    const { data } = await api.put<ApiResponse<TimeSlot>>(
      `/time-slots/${slotId}`,
      request
    );
    return data.data;
  },

  /** PATCH /api/time-slots/{slotId}/toggle-active */
  toggleActive: async (slotId: number): Promise<TimeSlot> => {
    const { data } = await api.patch<ApiResponse<TimeSlot>>(
      `/time-slots/${slotId}/toggle-active`
    );
    return data.data;
  },

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /** DELETE /api/time-slots/{slotId} */
  delete: async (slotId: number): Promise<void> => {
    await api.delete(`/time-slots/${slotId}`);
  },
};