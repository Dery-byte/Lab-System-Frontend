// import api from './api';

// export type ReportFormat = 'txt' | 'csv' | 'excel' | 'pdf';

// const FORMAT_EXTENSIONS: Record<ReportFormat, string> = {
//   txt: '.txt',
//   csv: '.csv',
//   excel: '.xlsx',
//   pdf: '.pdf',
// };

// export const reportService = {
//   downloadSessionReport: async (sessionId: number, format: ReportFormat = 'txt'): Promise<void> => {
//     const response = await api.get(`/reports/session/${sessionId}?format=${format}`, {
//       responseType: 'blob',
//     });
//     const ext = FORMAT_EXTENSIONS[format];
//     downloadFile(response.data, `session_report_${sessionId}${ext}`);
//   },

//   downloadAllRegistrationsReport: async (format: ReportFormat = 'csv'): Promise<void> => {
//     const response = await api.get(`/reports/all?format=${format}`, {
//       responseType: 'blob',
//     });
//     const ext = FORMAT_EXTENSIONS[format];
//     downloadFile(response.data, `all_registrations${ext}`);
//   },

//   downloadCourseReport: async (courseId: number, format: ReportFormat = 'txt'): Promise<void> => {
//     const response = await api.get(`/reports/course/${courseId}?format=${format}`, {
//       responseType: 'blob',
//     });
//     const ext = format === 'pdf' ? '.pdf' : '.txt';
//     downloadFile(response.data, `course_report_${courseId}${ext}`);
//   },

//   downloadDateRangeReport: async (startDate: string, endDate: string, format: ReportFormat = 'csv'): Promise<void> => {
//     const response = await api.get(`/reports/date-range?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
//       responseType: 'blob',
//     });
//     const ext = FORMAT_EXTENSIONS[format];
//     downloadFile(response.data, `registrations_${startDate}_to_${endDate}${ext}`);
//   },

//   downloadDepartmentReport: async (departmentName: string, format: ReportFormat = 'excel'): Promise<void> => {
//     const response = await api.get(`/reports/department/${encodeURIComponent(departmentName)}?format=${format}`, {
//       responseType: 'blob',
//     });
//     const ext = FORMAT_EXTENSIONS[format];
//     downloadFile(response.data, `department_report_${departmentName}${ext}`);
//   },
// };

// function downloadFile(data: Blob, filename: string) {
//   const url = window.URL.createObjectURL(new Blob([data]));
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', filename);
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   window.URL.revokeObjectURL(url);
// }


import api from './api';

export type ReportFormat = 'txt' | 'csv' | 'excel' | 'pdf';

const FORMAT_EXTENSIONS: Record<ReportFormat, string> = {
  txt: '.txt',
  csv: '.csv',
  excel: '.xlsx',
  pdf: '.pdf',
};

export const reportService = {
  downloadSessionReport: async (sessionId: number, format: ReportFormat = 'txt'): Promise<void> => {
    const response = await api.get(`/reports/session/${sessionId}?format=${format}`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `session_report_${sessionId}${FORMAT_EXTENSIONS[format]}`);
  },

  // Dedicated endpoint → GET /api/reports/session/{id}/pdf
  // Returns the professional iText table-based PDF
  downloadSessionReportPdf: async (sessionId: number): Promise<void> => {
    const response = await api.get(`/reports/session/${sessionId}/pdf`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `session_report_${sessionId}.pdf`);
  },

  downloadAllRegistrationsReport: async (format: ReportFormat = 'csv'): Promise<void> => {
    const response = await api.get(`/reports/all?format=${format}`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `all_registrations${FORMAT_EXTENSIONS[format]}`);
  },

  downloadCourseReport: async (courseId: number, format: ReportFormat = 'txt'): Promise<void> => {
    const response = await api.get(`/reports/course/${courseId}?format=${format}`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `course_report_${courseId}${format === 'pdf' ? '.pdf' : '.txt'}`);
  },

  downloadDateRangeReport: async (startDate: string, endDate: string, format: ReportFormat = 'csv'): Promise<void> => {
    const response = await api.get(`/reports/date-range?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `registrations_${startDate}_to_${endDate}${FORMAT_EXTENSIONS[format]}`);
  },

  downloadDepartmentReport: async (departmentName: string, format: ReportFormat = 'excel'): Promise<void> => {
    const response = await api.get(`/reports/department/${encodeURIComponent(departmentName)}?format=${format}`, {
      responseType: 'blob',
    });
    downloadFile(response.data, `department_report_${departmentName}${FORMAT_EXTENSIONS[format]}`);
  },
};

function downloadFile(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}