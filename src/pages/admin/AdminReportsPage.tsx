// import { useEffect, useState } from 'react';
// import {
//   Download, FileText, Calendar, BookOpen,
//   FileSpreadsheet, Building2, Layers, ChevronRight,
//   CheckCircle2, AlertCircle
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
// import { reportService, ReportFormat } from '../../services/reportService';
// import { labSessionService } from '../../services/labSessionService';
// import { courseService } from '../../services/courseService';
// import { LabSession, Course } from '../../types';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type DownloadKey = 'session' | 'course' | 'all' | 'dateRange' | 'department' | null;

// interface FormatOption {
//   value: ReportFormat;
//   label: string;
//   ext: string;
//   color: string;
// }

// // ─── Constants ───────────────────────────────────────────────────────────────

// const ALL_FORMATS: FormatOption[] = [
//   { value: 'txt',   label: 'Text',  ext: '.txt',  color: 'bg-slate-100 text-slate-700 border-slate-200' },
//   { value: 'csv',   label: 'CSV',   ext: '.csv',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
//   { value: 'excel', label: 'Excel', ext: '.xlsx', color: 'bg-green-50 text-green-700 border-green-200' },
//   { value: 'pdf',   label: 'PDF',   ext: '.pdf',  color: 'bg-red-50 text-red-700 border-red-200' },
// ];

// const TABULAR_FORMATS: FormatOption[] = ALL_FORMATS.filter(f => f.value !== 'txt');
// const SESSION_FORMATS: FormatOption[] = ALL_FORMATS;

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const FormatPicker = ({
//   formats,
//   value,
//   onChange,
// }: {
//   formats: FormatOption[];
//   value: ReportFormat;
//   onChange: (v: ReportFormat) => void;
// }) => (
//   <div>
//     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</p>
//     <div className="flex flex-wrap gap-2">
//       {formats.map(f => (
//         <button
//           key={f.value}
//           onClick={() => onChange(f.value)}
//           className={`
//             px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
//             ${value === f.value
//               ? `${f.color} ring-2 ring-offset-1 ring-current shadow-sm`
//               : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
//             }
//           `}
//         >
//           {f.label}
//           <span className="ml-1 opacity-60">{f.ext}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );

// const SectionLabel = ({ children }: { children: React.ReactNode }) => (
//   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{children}</p>
// );

// const DownloadButton = ({
//   onClick,
//   loading,
//   disabled,
//   label = 'Download Report',
// }: {
//   onClick: () => void;
//   loading: boolean;
//   disabled?: boolean;
//   label?: string;
// }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled || loading}
//     className={`
//       w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
//       transition-all duration-200 shadow-sm
//       ${disabled || loading
//         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//         : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] hover:shadow-md'
//       }
//     `}
//   >
//     {loading ? (
//       <>
//         <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
//         </svg>
//         Generating…
//       </>
//     ) : (
//       <>
//         <Download className="w-4 h-4" />
//         {label}
//       </>
//     )}
//   </button>
// );

// const ReportCard = ({
//   icon,
//   iconColor,
//   title,
//   description,
//   badge,
//   children,
// }: {
//   icon: React.ReactNode;
//   iconColor: string;
//   title: string;
//   description: string;
//   badge?: string;
//   children: React.ReactNode;
// }) => (
//   <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
//     <div className="px-5 pt-5 pb-4 border-b border-gray-100">
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
//             {icon}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
//             <p className="text-xs text-gray-500 mt-0.5">{description}</p>
//           </div>
//         </div>
//         {badge && (
//           <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
//             {badge}
//           </span>
//         )}
//       </div>
//     </div>
//     <div className="px-5 py-4 space-y-4">
//       {children}
//     </div>
//   </div>
// );

// // ─── Main Page ────────────────────────────────────────────────────────────────

// const AdminReportsPage = () => {
//   const [sessions, setSessions]       = useState<LabSession[]>([]);
//   const [courses, setCourses]         = useState<Course[]>([]);
//   const [departments, setDepartments] = useState<string[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [downloading, setDownloading] = useState<DownloadKey>(null);

//   const [selectedSessionId,  setSelectedSessionId]  = useState('');
//   const [selectedCourseId,   setSelectedCourseId]   = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [sessionFormat,   setSessionFormat]   = useState<ReportFormat>('pdf');
//   const [allFormat,       setAllFormat]       = useState<ReportFormat>('excel');
//   const [dateRangeFormat, setDateRangeFormat] = useState<ReportFormat>('excel');
//   const [startDate, setStartDate] = useState('');
//   const [endDate,   setEndDate]   = useState('');

//   useEffect(() => { fetchData(); }, []);

//   const fetchData = async () => {
//     try {
//       const [sessionsData, coursesData] = await Promise.all([
//         labSessionService.getAll(),
//         courseService.getAll(),
//       ]);
//       setSessions(sessionsData);
//       setCourses(coursesData);
//       const depts = [...new Set(coursesData.map((c: Course) => c.department).filter(Boolean))] as string[];
//       setDepartments(depts);
//     } catch {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const dl = async (key: DownloadKey, fn: () => Promise<void>) => {
//     setDownloading(key);
//     try {
//       await fn();
//       toast.success('Report downloaded');
//     } catch {
//       toast.error('Download failed — please try again');
//     } finally {
//       setDownloading(null);
//     }
//   };

//   const handleSession = () => {
//     if (!selectedSessionId) return toast.error('Please select a session');
//     // Use the dedicated /pdf endpoint when PDF is selected, otherwise the format param route
//     dl('session', () =>
//       sessionFormat === 'pdf'
//         ? reportService.downloadSessionReportPdf(parseInt(selectedSessionId))
//         : reportService.downloadSessionReport(parseInt(selectedSessionId), sessionFormat)
//     );
//   };

//   const handleCourse = () => {
//     if (!selectedCourseId) return toast.error('Please select a course');
//     dl('course', () => reportService.downloadCourseReport(parseInt(selectedCourseId)));
//   };

//   const handleAll = () =>
//     dl('all', () => reportService.downloadAllRegistrationsReport(allFormat));

//   const handleDateRange = () => {
//     if (!startDate || !endDate) return toast.error('Select both start and end dates');
//     if (new Date(endDate) < new Date(startDate)) return toast.error('End date must be after start date');
//     dl('dateRange', () => reportService.downloadDateRangeReport(startDate, endDate, dateRangeFormat));
//   };

//   const handleDepartment = () => {
//     if (!selectedDepartment) return toast.error('Please select a department');
//     dl('department', () => reportService.downloadDepartmentReport(selectedDepartment));
//   };

//   if (loading) return <Loading text="Loading reports…" />;

//   const sessionSelectOptions = [
//     { value: '', label: 'Choose a session…' },
//     ...sessions.map(s => ({
//       value: s.id.toString(),
//       label: `${s.name} — ${s.course?.courseCode ?? ''} (${s.course?.department ?? ''})`,
//     })),
//   ];

//   const courseSelectOptions = [
//     { value: '', label: 'Choose a course…' },
//     ...courses.map(c => ({
//       value: c.id.toString(),
//       label: `${c.courseCode} — ${c.courseName}`,
//     })),
//   ];

//   const deptSelectOptions = [
//     { value: '', label: 'Choose a department…' },
//     ...departments.map(d => ({ value: d, label: d })),
//   ];

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 pb-12">

//       {/* ── Page Header ── */}
//       <div className="flex items-end justify-between">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Data Export</p>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Generate and download registration reports in multiple formats
//           </p>
//         </div>
//         <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
//           <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
//           {sessions.length} sessions &nbsp;·&nbsp; {courses.length} courses
//         </div>
//       </div>

//       {/* ── Top row: Session (featured, full-width) ── */}
//       <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
//         <div className="flex flex-col md:flex-row md:items-center gap-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               <FileText className="w-4 h-4 text-blue-400" />
//               <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured</span>
//             </div>
//             <h2 className="text-lg font-bold mb-1">Session Report</h2>
//             <p className="text-sm text-gray-400">
//               Full roster per group — student biodata, status, waitlist, and summary footer.
//               The PDF variant uses a professional table layout with colour-coded status badges.
//             </p>
//           </div>

//           <div className="flex-1 space-y-4">
//             <div>
//               <SectionLabel>Session</SectionLabel>
//               <select
//                 value={selectedSessionId}
//                 onChange={e => setSelectedSessionId(e.target.value)}
//                 className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
//               >
//                 {sessionSelectOptions.map(o => (
//                   <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Format</p>
//               <div className="flex flex-wrap gap-2">
//                 {SESSION_FORMATS.map(f => (
//                   <button
//                     key={f.value}
//                     onClick={() => setSessionFormat(f.value)}
//                     className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
//                       ${sessionFormat === f.value
//                         ? 'bg-white text-gray-900 border-white shadow'
//                         : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
//                       }`}
//                   >
//                     {f.label}
//                     <span className="ml-1 opacity-60">{f.ext}</span>
//                     {f.value === 'pdf' && (
//                       <span className="ml-1.5 text-[9px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">PRO</span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={handleSession}
//               disabled={!selectedSessionId || downloading === 'session'}
//               className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
//                 ${!selectedSessionId || downloading === 'session'
//                   ? 'bg-white/10 text-gray-500 cursor-not-allowed'
//                   : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
//                 }`}
//             >
//               {downloading === 'session' ? (
//                 <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
//               ) : (
//                 <><Download className="w-4 h-4" />Download Session Report</>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Grid: 3 cards ── */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//         {/* Department */}
//         <ReportCard
//           icon={<Building2 className="w-4 h-4 text-indigo-600" />}
//           iconColor="bg-indigo-50"
//           title="Department Report"
//           description="All courses & sessions within a department"
//         >
//           <div>
//             <SectionLabel>Department</SectionLabel>
//             <select
//               value={selectedDepartment}
//               onChange={e => setSelectedDepartment(e.target.value)}
//               className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
//             >
//               {deptSelectOptions.map(o => (
//                 <option key={o.value} value={o.value}>{o.label}</option>
//               ))}
//             </select>
//           </div>
//           <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
//             Outputs as <strong>Excel</strong> or <strong>PDF</strong> (default: Excel)
//           </div>
//           <DownloadButton
//             onClick={handleDepartment}
//             loading={downloading === 'department'}
//             disabled={!selectedDepartment}
//             label="Download Department Report"
//           />
//         </ReportCard>

//         {/* Course */}
//         <ReportCard
//           icon={<BookOpen className="w-4 h-4 text-green-600" />}
//           iconColor="bg-green-50"
//           title="Course Report"
//           description="All lab sessions within a course"
//         >
//           <div>
//             <SectionLabel>Course</SectionLabel>
//             <select
//               value={selectedCourseId}
//               onChange={e => setSelectedCourseId(e.target.value)}
//               className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
//             >
//               {courseSelectOptions.map(o => (
//                 <option key={o.value} value={o.value}>{o.label}</option>
//               ))}
//             </select>
//           </div>
//           <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
//             Outputs as <strong>Text</strong> or <strong>PDF</strong> (default: Text)
//           </div>
//           <DownloadButton
//             onClick={handleCourse}
//             loading={downloading === 'course'}
//             disabled={!selectedCourseId}
//             label="Download Course Report"
//           />
//         </ReportCard>

//         {/* Date Range */}
//         <ReportCard
//           icon={<Calendar className="w-4 h-4 text-blue-600" />}
//           iconColor="bg-blue-50"
//           title="Date Range Report"
//           description="All registrations within a date window"
//         >
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <SectionLabel>From</SectionLabel>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={e => setStartDate(e.target.value)}
//                 className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//             <div>
//               <SectionLabel>To</SectionLabel>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={e => setEndDate(e.target.value)}
//                 className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
//               />
//             </div>
//           </div>
//           <FormatPicker
//             formats={TABULAR_FORMATS}
//             value={dateRangeFormat}
//             onChange={setDateRangeFormat}
//           />
//           <DownloadButton
//             onClick={handleDateRange}
//             loading={downloading === 'dateRange'}
//             disabled={!startDate || !endDate}
//             label="Download Date Range Report"
//           />
//         </ReportCard>
//       </div>

//       {/* ── Full-width: All Registrations ── */}
//       <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
//         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
//               <FileSpreadsheet className="w-4 h-4 text-purple-600" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 text-sm">Complete Export</h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 Every registration across all sessions and departments in one file
//               </p>
//             </div>
//           </div>
//           <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">
//             All Data
//           </span>
//         </div>
//         <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-end gap-5">
//           <div className="flex-1">
//             <FormatPicker
//               formats={TABULAR_FORMATS}
//               value={allFormat}
//               onChange={setAllFormat}
//             />
//           </div>
//           <button
//             onClick={handleAll}
//             disabled={downloading === 'all'}
//             className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
//               ${downloading === 'all'
//                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-[0.98] hover:shadow-md'
//               }`}
//           >
//             {downloading === 'all' ? (
//               <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
//             ) : (
//               <><Download className="w-4 h-4" />Download All Registrations</>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ── Legend ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Format legend */}
//         <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Format Guide</h4>
//           <div className="space-y-2">
//             {[
//               { ext: 'TXT',  color: 'bg-slate-100 text-slate-700',   desc: 'Formatted text — easy to read and print' },
//               { ext: 'CSV',  color: 'bg-emerald-50 text-emerald-700', desc: 'Opens in Excel, Sheets, or any spreadsheet app' },
//               { ext: 'XLSX', color: 'bg-green-50 text-green-700',     desc: 'Native Excel with colour-coded slot status' },
//               { ext: 'PDF',  color: 'bg-red-50 text-red-700',         desc: 'Professional table layout — ideal for printing' },
//             ].map(f => (
//               <div key={f.ext} className="flex items-center gap-3 text-sm">
//                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.color} w-10 text-center shrink-0`}>{f.ext}</span>
//                 <span className="text-gray-600">{f.desc}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Excel colour legend */}
//         <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
//           <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Excel Colour Codes</h4>
//           <div className="space-y-2">
//             {[
//               { dot: 'bg-green-400',  label: 'Empty',     desc: 'No students registered (0 / capacity)' },
//               { dot: 'bg-yellow-400', label: 'Available', desc: 'Partially filled — still has open spots' },
//               { dot: 'bg-red-400',    label: 'Full',      desc: 'At maximum capacity — no more spots' },
//             ].map(c => (
//               <div key={c.label} className="flex items-center gap-3 text-sm">
//                 <span className={`w-3 h-3 rounded-full shrink-0 ${c.dot}`} />
//                 <span className="font-medium text-gray-700 w-16 shrink-0">{c.label}</span>
//                 <span className="text-gray-500">{c.desc}</span>
//               </div>
//             ))}
//           </div>
//           <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
//             PDF session reports use a professional iText layout with navy/blue colour scheme and per-group rosters.
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminReportsPage;

















import { useEffect, useState } from 'react';
import {
  Download, FileText, Calendar, BookOpen,
  FileSpreadsheet, Building2, Layers, ChevronRight,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
import { reportService, ReportFormat } from '../../services/reportService';
import { labSessionService } from '../../services/labSessionService';
import { courseService } from '../../services/courseService';
import { LabSession, Course } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadKey = 'session' | 'course' | 'all' | 'dateRange' | 'department' | null;

interface FormatOption {
  value: ReportFormat;
  label: string;
  ext: string;
  color: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_FORMATS: FormatOption[] = [
  { value: 'txt',   label: 'Text',  ext: '.txt',  color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'csv',   label: 'CSV',   ext: '.csv',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'excel', label: 'Excel', ext: '.xlsx', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'pdf',   label: 'PDF',   ext: '.pdf',  color: 'bg-red-50 text-red-700 border-red-200' },
];

const TABULAR_FORMATS: FormatOption[] = ALL_FORMATS.filter(f => f.value !== 'txt');
const SESSION_FORMATS: FormatOption[] = ALL_FORMATS;

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormatPicker = ({
  formats,
  value,
  onChange,
}: {
  formats: FormatOption[];
  value: ReportFormat;
  onChange: (v: ReportFormat) => void;
}) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</p>
    <div className="flex flex-wrap gap-2">
      {formats.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`
            px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
            ${value === f.value
              ? `${f.color} ring-2 ring-offset-1 ring-current shadow-sm`
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }
          `}
        >
          {f.label}
          <span className="ml-1 opacity-60">{f.ext}</span>
        </button>
      ))}
    </div>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{children}</p>
);

const DownloadButton = ({
  onClick,
  loading,
  disabled,
  label = 'Download Report',
}: {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
      transition-all duration-200 shadow-sm
      ${disabled || loading
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] hover:shadow-md'
      }
    `}
  >
    {loading ? (
      <>
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
        </svg>
        Generating…
      </>
    ) : (
      <>
        <Download className="w-4 h-4" />
        {label}
      </>
    )}
  </button>
);

const ReportCard = ({
  icon,
  iconColor,
  title,
  description,
  badge,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="px-5 pt-5 pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        {badge && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
    <div className="px-5 py-4 space-y-4">
      {children}
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminReportsPage = () => {
  const [sessions, setSessions]       = useState<LabSession[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);
  const [downloading, setDownloading] = useState<DownloadKey>(null);

  const [selectedSessionId,  setSelectedSessionId]  = useState('');
  const [selectedCourseId,   setSelectedCourseId]   = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sessionFormat,    setSessionFormat]    = useState<ReportFormat>('pdf');
  const [courseFormat,     setCourseFormat]     = useState<ReportFormat>('pdf');
  const [departmentFormat, setDepartmentFormat] = useState<ReportFormat>('excel');
  const [allFormat,        setAllFormat]        = useState<ReportFormat>('excel');
  const [dateRangeFormat,  setDateRangeFormat]  = useState<ReportFormat>('excel');
  const [startDate, setStartDate] = useState('');
  const [endDate,   setEndDate]   = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, coursesData] = await Promise.all([
        labSessionService.getAll(),
        courseService.getAll(),
      ]);
      setSessions(sessionsData);
      setCourses(coursesData);
      const depts = [...new Set(coursesData.map((c: Course) => c.department).filter(Boolean))] as string[];
      setDepartments(depts);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const dl = async (key: DownloadKey, fn: () => Promise<void>) => {
    setDownloading(key);
    try {
      await fn();
      toast.success('Report downloaded');
    } catch {
      toast.error('Download failed — please try again');
    } finally {
      setDownloading(null);
    }
  };

  const handleSession = () => {
    if (!selectedSessionId) return toast.error('Please select a session');
    // Use the dedicated /pdf endpoint when PDF is selected, otherwise the format param route
    dl('session', () =>
      sessionFormat === 'pdf'
        ? reportService.downloadSessionReportPdf(parseInt(selectedSessionId))
        : reportService.downloadSessionReport(parseInt(selectedSessionId), sessionFormat)
    );
  };

  const handleCourse = () => {
    if (!selectedCourseId) return toast.error('Please select a course');
    dl('course', () => reportService.downloadCourseReport(parseInt(selectedCourseId), courseFormat));
  };

  const handleAll = () =>
    dl('all', () => reportService.downloadAllRegistrationsReport(allFormat));

  const handleDateRange = () => {
    if (!startDate || !endDate) return toast.error('Select both start and end dates');
    if (new Date(endDate) < new Date(startDate)) return toast.error('End date must be after start date');
    dl('dateRange', () => reportService.downloadDateRangeReport(startDate, endDate, dateRangeFormat));
  };

  const handleDepartment = () => {
    if (!selectedDepartment) return toast.error('Please select a department');
    dl('department', () => reportService.downloadDepartmentReport(selectedDepartment, departmentFormat));
  };

  if (loading) return <Loading text="Loading reports…" />;

  const sessionSelectOptions = [
    { value: '', label: 'Choose a session…' },
    ...sessions.map(s => ({
      value: s.id.toString(),
      label: `${s.name} — ${s.course?.courseCode ?? ''} (${s.course?.department ?? ''})`,
    })),
  ];

  const courseSelectOptions = [
    { value: '', label: 'Choose a course…' },
    ...courses.map(c => ({
      value: c.id.toString(),
      label: `${c.courseCode} — ${c.courseName}`,
    })),
  ];

  const deptSelectOptions = [
    { value: '', label: 'Choose a department…' },
    ...departments.map(d => ({ value: d, label: d })),
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* ── Page Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Data Export</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and download registration reports in multiple formats
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          {sessions.length} sessions &nbsp;·&nbsp; {courses.length} courses
        </div>
      </div>

      {/* ── Top row: Session (featured, full-width) ── */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured</span>
            </div>
            <h2 className="text-lg font-bold mb-1">Session Report</h2>
            <p className="text-sm text-gray-400">
              Full roster per group — student biodata, status, waitlist, and summary footer.
              The PDF variant uses a professional table layout with colour-coded status badges.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <SectionLabel>Session</SectionLabel>
              <select
                value={selectedSessionId}
                onChange={e => setSelectedSessionId(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              >
                {sessionSelectOptions.map(o => (
                  <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Format</p>
              <div className="flex flex-wrap gap-2">
                {SESSION_FORMATS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setSessionFormat(f.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
                      ${sessionFormat === f.value
                        ? 'bg-white text-gray-900 border-white shadow'
                        : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                      }`}
                  >
                    {f.label}
                    <span className="ml-1 opacity-60">{f.ext}</span>
                    {f.value === 'pdf' && (
                      <span className="ml-1.5 text-[9px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">PRO</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSession}
              disabled={!selectedSessionId || downloading === 'session'}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${!selectedSessionId || downloading === 'session'
                  ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                }`}
            >
              {downloading === 'session' ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
              ) : (
                <><Download className="w-4 h-4" />Download Session Report</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid: 3 cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Department */}
        <ReportCard
          icon={<Building2 className="w-4 h-4 text-indigo-600" />}
          iconColor="bg-indigo-50"
          title="Department Report"
          description="All courses & sessions within a department"
        >
          <div>
            <SectionLabel>Department</SectionLabel>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {deptSelectOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <FormatPicker
            formats={ALL_FORMATS}
            value={departmentFormat}
            onChange={setDepartmentFormat}
          />
          <DownloadButton
            onClick={handleDepartment}
            loading={downloading === 'department'}
            disabled={!selectedDepartment}
            label="Download Department Report"
          />
        </ReportCard>

        {/* Course */}
        <ReportCard
          icon={<BookOpen className="w-4 h-4 text-green-600" />}
          iconColor="bg-green-50"
          title="Course Report"
          description="All lab sessions within a course"
        >
          <div>
            <SectionLabel>Course</SectionLabel>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
            >
              {courseSelectOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <FormatPicker
            formats={ALL_FORMATS}
            value={courseFormat}
            onChange={setCourseFormat}
          />
          <DownloadButton
            onClick={handleCourse}
            loading={downloading === 'course'}
            disabled={!selectedCourseId}
            label="Download Course Report"
          />
        </ReportCard>

        {/* Date Range */}
        <ReportCard
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
          iconColor="bg-blue-50"
          title="Date Range Report"
          description="All registrations within a date window"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <SectionLabel>From</SectionLabel>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <SectionLabel>To</SectionLabel>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <FormatPicker
            formats={TABULAR_FORMATS}
            value={dateRangeFormat}
            onChange={setDateRangeFormat}
          />
          <DownloadButton
            onClick={handleDateRange}
            loading={downloading === 'dateRange'}
            disabled={!startDate || !endDate}
            label="Download Date Range Report"
          />
        </ReportCard>
      </div>

      {/* ── Full-width: All Registrations ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Complete Export</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Every registration across all sessions and departments in one file
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">
            All Data
          </span>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="flex-1">
            <FormatPicker
              formats={TABULAR_FORMATS}
              value={allFormat}
              onChange={setAllFormat}
            />
          </div>
          <button
            onClick={handleAll}
            disabled={downloading === 'all'}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
              ${downloading === 'all'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-[0.98] hover:shadow-md'
              }`}
          >
            {downloading === 'all' ? (
              <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
            ) : (
              <><Download className="w-4 h-4" />Download All Registrations</>
            )}
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Format legend */}
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Format Guide</h4>
          <div className="space-y-2">
            {[
              { ext: 'TXT',  color: 'bg-slate-100 text-slate-700',   desc: 'Formatted text — easy to read and print' },
              { ext: 'CSV',  color: 'bg-emerald-50 text-emerald-700', desc: 'Opens in Excel, Sheets, or any spreadsheet app' },
              { ext: 'XLSX', color: 'bg-green-50 text-green-700',     desc: 'Native Excel with colour-coded slot status' },
              { ext: 'PDF',  color: 'bg-red-50 text-red-700',         desc: 'Professional table layout — ideal for printing' },
            ].map(f => (
              <div key={f.ext} className="flex items-center gap-3 text-sm">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.color} w-10 text-center shrink-0`}>{f.ext}</span>
                <span className="text-gray-600">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Excel colour legend */}
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Excel Colour Codes</h4>
          <div className="space-y-2">
            {[
              { dot: 'bg-green-400',  label: 'Empty',     desc: 'No students registered (0 / capacity)' },
              { dot: 'bg-yellow-400', label: 'Available', desc: 'Partially filled — still has open spots' },
              { dot: 'bg-red-400',    label: 'Full',      desc: 'At maximum capacity — no more spots' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3 text-sm">
                <span className={`w-3 h-3 rounded-full shrink-0 ${c.dot}`} />
                <span className="font-medium text-gray-700 w-16 shrink-0">{c.label}</span>
                <span className="text-gray-500">{c.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
            PDF session reports use a professional iText layout with navy/blue colour scheme and per-group rosters.
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminReportsPage;