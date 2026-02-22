// ==================== ENUMS ====================
export type Role = 'SUPER_ADMIN' | 'LAB_MANAGER' | 'STUDENT';
export type Level = 'LEVEL_100' | 'LEVEL_200' | 'LEVEL_300' | 'LEVEL_400' | 'LEVEL_500';
export type SessionStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED' | 'COMPLETED';
export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED' | 'COMPLETED';
import { Semester } from './enums'; // adjust path to where your enums are defined

export const isStaff = (role: Role) => role === 'SUPER_ADMIN' || role === 'LAB_MANAGER';
export const isSuperAdmin = (role: Role) => role === 'SUPER_ADMIN';

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

// ==================== USER ====================
export interface User {
  id: number;
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  programId?: number;
  programName?: string;
  departmentName?: string;
  department?: string;
  level: Level;
  levelDisplayName?: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}





export interface CreateLabGroupRequest {
  groupName: string;          // corresponds to @NotBlank String
  sessionDate: string;        // LocalDate → ISO string (e.g., "2026-02-19")
  startTime: string;          // LocalTime → "HH:mm:ss" format
  endTime: string;            // LocalTime → "HH:mm:ss" format
  maxSize?: number;           // Integer with min/max constraints
}
// ==================== ORGANIZATION ====================
export interface Program {
  id: number;
  code: string;
  name: string;
  departmentName?: string;
  active: boolean;
}

// ==================== WEEKLY NOTE ====================
export interface WeeklyNote {
  id?: number;
  labSessionId: number;
  labSessionName?: string;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  title?: string;
  content?: string;
  learningObjectives?: string;
  materialsNeeded?: string;
  isPublished: boolean;
  createdByName?: string;
  updatedByName?: string;
  createdAt?: string;
  updatedAt?: string;
  displayName: string;
  dateRange: string;
  isCurrentWeek: boolean;
  isPastWeek: boolean;
  isFutureWeek: boolean;
}

// ==================== LAB SESSION ====================

export interface LabSession {
  id: number;
  name: string;
  description?: string;
  labRoom: string;
  // Recurring session dates
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  // Recurrence settings
  recurrenceWeeks?: number;
  sessionDays?: string;
  sessionDaysList?: string[];
  durationWeeks?: number;
  maxGroupSize: number;
  maxGroups: number;
  status: SessionStatus;
  course?: Course;
  createdBy?: User;
  totalCapacity: number;
  currentRegistrationCount: number;
  availableSlots: number;
  slotsPerDay:number;
  maxStudentsPerSlot:number;
  // Program access
  allowedPrograms?: string;
  allowedProgramsList?: string[];
  openToAllPrograms?: boolean;
  groups?: LabGroup[];
  createdAt: string;
  courseCode?: string;

}


// export interface LabSession {
//   id: number;
//   name: string;
//   description?: string;
//   labRoom: string;
//   startDate: string;
//   endDate: string;
//   startTime: string;
//   endTime: string;
//   sessionDays: string[];
//   durationWeeks: number;
//   maxStudentsPerSlot: number;
//   slotsPerDay: number;
//   totalCapacity: number;
//   currentRegistrations: number;
//   availableSlots: number;
//   status: SessionStatus;
//   courseCode?: string;
//   courseName?: string;
//   allowedPrograms: Program[];
//   openToAllPrograms: boolean;
//   instructions?: string;
//   createdAt: string;
// }


export interface LabGroup {
  id: number;
  groupName: string;
  groupNumber: number;
  maxSize: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  labSessionId: number;
  currentSize: number;
  availableSlots: number;
  isFull: boolean;
  members?: Registration[];
}


export interface TimeSlot {
  id: number;
  sessionId: number;
  sessionDate: string;       // ISO date string "2025-04-01"
  startTime: string;         // "09:00"
  endTime: string;           // "10:00"
  slotNumber: number;
  groupNumber:number;
  maxStudents: number;
  currentCount: number;
  availableSlots: number;
  isFull: boolean;
  active: boolean;
  displayName: string;       // "Week 1 - MON - Slot 2 (09:00 - 10:00)"
  weekNumber: number;
  members?: TimeSlotMember[];
}

export interface TimeSlotMember {
  id: number;
  student: {
    id: number;
    fullName: string;
    studentId: string;
    department?: string;
  };
}

export interface CreateTimeSlotRequest {
  sessionDate: string;   // "2025-04-01"
  startTime: string;     // "09:00"
  endTime: string;       // "10:00"
  maxStudents?: number;  // optional — backend falls back to session default
}

export interface UpdateTimeSlotRequest {
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
  maxStudents?: number;
  active?: boolean;
}

// Grouped response from GET /grouped
export type TimeSlotsByDate = Record<string, TimeSlot[]>;


export interface CreateLabSessionRequest {
  name: string;
  description?: string;
  labRoom: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxGroupSize: number;
  maxGroups: number;
  courseId: number;
  sessionDays?: string[];
  allowedPrograms?: string[];
  openToAllPrograms?: boolean;
}



// ==================== REGISTRATION ====================
export interface Registration {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentIdNumber: string;
  programName?: string;
  labSessionId: number;
  labSessionName: string;
  courseCode?: string;
  courseName?: string;
  labRoom?: string;
  sessionStartDate?: string;
  sessionEndDate?: string;
  sessionStartTime?: string;
  sessionEndTime?: string;
  sessionDays?: string[];
  durationWeeks?: number;
  instructions?: string;
  status: RegistrationStatus;
  waitlistPosition?: number;
  registeredAt: string;
  attendedSessions: number;
  totalSessions: number;
  attendancePercentage: number;
  slotNumber:number,
   student: {               // add this nested object
    id: number;
    fullName: string;
    studentId: string;
    department?: string;
  };
  weeklyNotes?: WeeklyNote[];
}

// ==================== AUTH ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  studentId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  programId: number;
  level: Level;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// ==================== REQUESTS ====================
export interface CreateRegistrationRequest {
  labSessionId: number;
  timeSlotId?: number;
  notes?: string;
}

export interface UpdateWeeklyNoteRequest {
  labSessionId: number;
  weekNumber: number;
  title?: string;
  content?: string;
  learningObjectives?: string;
  materialsNeeded?: string;
  publish?: boolean;
}


export const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Laboratory Technology',
];


export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description?: string;
  department: string;
  departmentId?: number;
  level: Level;
  levelDisplayName: string;
  semester: string;
  creditHours: number;
  active: boolean;
  instructor?: User;
  labSessionsCount: number;
  createdAt: string;
  allowedDepartments?: string;
  allowedDepartmentsList?: string[];
  openToAllDepartments?: boolean;
  enrolledStudentsCount: number;
}


export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Faculty {
  id: number;
  code: string;
  name: string;
  description?: string;
}

// ==================== ATTENDANCE DTOs ====================
export interface Attendance {
  id: number;
  registrationId: number;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  sessionDate: string;
  present: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  markedByName?: string;
  createdAt: string;
}





// ==================== ATTENDANCE REQUESTS ====================
export interface MarkAttendanceRequest {
  labSessionId: number;
  sessionDate: string;
  attendances: AttendanceRecord[];
}

export interface AttendanceRecord {
  registrationId: number;
  present: boolean;
  notes?: string;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description?: string;
  facultyId?: number;
  faculty: string;
  headOfDepartment?: string;
}

// export interface CreateDepartmentRequest {
//   code: string;
//   name: string;
//   description?: string;
//   facultyId: number;
//   faculty?: Faculty;
//   headOfDepartment?: string;
// }

// src/types/course.ts
// import { Level, Semester } from './enums'; // adjust path to where your enums are defined

export interface CreateCourseRequest {
  courseCode: string;
  courseName: string;
  description?: string;
  departmentId: number;
  department: string;
  level: Level;
  semester?: Semester;
  academicYear?: string;
  creditHours?: number;
  instructorId?: number;
  hasLab?: boolean;
  allowedDepartments?: string[];
  openToAllDepartments?: boolean;
}




export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  faculty: string;        // display name from backend response
  facultyId?: number;
  headOfDepartment?: string;
  active: boolean;
  courseCount?: number;
}

// export interface CreateDepartmentRequest {
//   code: string;
//   name: string;
//   description?: string;
//   facultyId: number;
//   faculty?: Faculty;
//   headOfDepartment?: string;
// }


// export interface Faculty {
//   id: number;
//   name: string;
//   code?: string;
//   description?: string;
// }

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  facultyId?: number;
  facultyName?: string;
  headOfDepartment?: string;
  active: boolean;
  programCount?: number;
  createdAt: string;
}
// ==================== CONSTANTS ====================
export const LEVEL_OPTIONS = [
  { value: 'LEVEL_100', label: '100 Level' },
  { value: 'LEVEL_200', label: '200 Level' },
  { value: 'LEVEL_300', label: '300 Level' },
  { value: 'LEVEL_400', label: '400 Level' },
  { value: 'LEVEL_500', label: '500 Level' },
];

export const DAY_OF_WEEK_OPTIONS = [
  { value: 'MONDAY', label: 'Monday', short: 'Mon' },
  { value: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { value: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { value: 'FRIDAY', label: 'Friday', short: 'Fri' },
];
