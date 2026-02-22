// // import { useEffect, useState } from 'react';
// // import {
// //   Download, FileText, Calendar, BookOpen,
// //   FileSpreadsheet, Building2, Layers, ChevronRight,
// //   CheckCircle2, AlertCircle
// // } from 'lucide-react';
// // import { toast } from 'react-hot-toast';
// // import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
// // import { reportService, ReportFormat } from '../../services/reportService';
// // import { labSessionService } from '../../services/labSessionService';
// // import { courseService } from '../../services/courseService';
// // import { LabSession, Course } from '../../types';

// // // ─── Types ────────────────────────────────────────────────────────────────────

// // type DownloadKey = 'session' | 'course' | 'all' | 'dateRange' | 'department' | null;

// // interface FormatOption {
// //   value: ReportFormat;
// //   label: string;
// //   ext: string;
// //   color: string;
// // }

// // // ─── Constants ───────────────────────────────────────────────────────────────

// // const ALL_FORMATS: FormatOption[] = [
// //   { value: 'txt',   label: 'Text',  ext: '.txt',  color: 'bg-slate-100 text-slate-700 border-slate-200' },
// //   { value: 'csv',   label: 'CSV',   ext: '.csv',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
// //   { value: 'excel', label: 'Excel', ext: '.xlsx', color: 'bg-green-50 text-green-700 border-green-200' },
// //   { value: 'pdf',   label: 'PDF',   ext: '.pdf',  color: 'bg-red-50 text-red-700 border-red-200' },
// // ];

// // const TABULAR_FORMATS: FormatOption[] = ALL_FORMATS.filter(f => f.value !== 'txt');
// // const SESSION_FORMATS: FormatOption[] = ALL_FORMATS;

// // // ─── Sub-components ───────────────────────────────────────────────────────────

// // const FormatPicker = ({
// //   formats,
// //   value,
// //   onChange,
// // }: {
// //   formats: FormatOption[];
// //   value: ReportFormat;
// //   onChange: (v: ReportFormat) => void;
// // }) => (
// //   <div>
// //     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</p>
// //     <div className="flex flex-wrap gap-2">
// //       {formats.map(f => (
// //         <button
// //           key={f.value}
// //           onClick={() => onChange(f.value)}
// //           className={`
// //             px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
// //             ${value === f.value
// //               ? `${f.color} ring-2 ring-offset-1 ring-current shadow-sm`
// //               : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
// //             }
// //           `}
// //         >
// //           {f.label}
// //           <span className="ml-1 opacity-60">{f.ext}</span>
// //         </button>
// //       ))}
// //     </div>
// //   </div>
// // );

// // const SectionLabel = ({ children }: { children: React.ReactNode }) => (
// //   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{children}</p>
// // );

// // const DownloadButton = ({
// //   onClick,
// //   loading,
// //   disabled,
// //   label = 'Download Report',
// // }: {
// //   onClick: () => void;
// //   loading: boolean;
// //   disabled?: boolean;
// //   label?: string;
// // }) => (
// //   <button
// //     onClick={onClick}
// //     disabled={disabled || loading}
// //     className={`
// //       w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
// //       transition-all duration-200 shadow-sm
// //       ${disabled || loading
// //         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
// //         : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] hover:shadow-md'
// //       }
// //     `}
// //   >
// //     {loading ? (
// //       <>
// //         <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
// //           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
// //           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
// //         </svg>
// //         Generating…
// //       </>
// //     ) : (
// //       <>
// //         <Download className="w-4 h-4" />
// //         {label}
// //       </>
// //     )}
// //   </button>
// // );

// // const ReportCard = ({
// //   icon,
// //   iconColor,
// //   title,
// //   description,
// //   badge,
// //   children,
// // }: {
// //   icon: React.ReactNode;
// //   iconColor: string;
// //   title: string;
// //   description: string;
// //   badge?: string;
// //   children: React.ReactNode;
// // }) => (
// //   <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
// //     <div className="px-5 pt-5 pb-4 border-b border-gray-100">
// //       <div className="flex items-start justify-between gap-3">
// //         <div className="flex items-center gap-3">
// //           <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
// //             {icon}
// //           </div>
// //           <div>
// //             <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
// //             <p className="text-xs text-gray-500 mt-0.5">{description}</p>
// //           </div>
// //         </div>
// //         {badge && (
// //           <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
// //             {badge}
// //           </span>
// //         )}
// //       </div>
// //     </div>
// //     <div className="px-5 py-4 space-y-4">
// //       {children}
// //     </div>
// //   </div>
// // );

// // // ─── Main Page ────────────────────────────────────────────────────────────────

// // const AdminReportsPage = () => {
// //   const [sessions, setSessions]       = useState<LabSession[]>([]);
// //   const [courses, setCourses]         = useState<Course[]>([]);
// //   const [departments, setDepartments] = useState<string[]>([]);
// //   const [loading, setLoading]         = useState(true);
// //   const [downloading, setDownloading] = useState<DownloadKey>(null);

// //   const [selectedSessionId,  setSelectedSessionId]  = useState('');
// //   const [selectedCourseId,   setSelectedCourseId]   = useState('');
// //   const [selectedDepartment, setSelectedDepartment] = useState('');
// //   const [sessionFormat,   setSessionFormat]   = useState<ReportFormat>('pdf');
// //   const [allFormat,       setAllFormat]       = useState<ReportFormat>('excel');
// //   const [dateRangeFormat, setDateRangeFormat] = useState<ReportFormat>('excel');
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate,   setEndDate]   = useState('');

// //   useEffect(() => { fetchData(); }, []);

// //   const fetchData = async () => {
// //     try {
// //       const [sessionsData, coursesData] = await Promise.all([
// //         labSessionService.getAll(),
// //         courseService.getAll(),
// //       ]);
// //       setSessions(sessionsData);
// //       setCourses(coursesData);
// //       const depts = [...new Set(coursesData.map((c: Course) => c.department).filter(Boolean))] as string[];
// //       setDepartments(depts);
// //     } catch {
// //       toast.error('Failed to load data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const dl = async (key: DownloadKey, fn: () => Promise<void>) => {
// //     setDownloading(key);
// //     try {
// //       await fn();
// //       toast.success('Report downloaded');
// //     } catch {
// //       toast.error('Download failed — please try again');
// //     } finally {
// //       setDownloading(null);
// //     }
// //   };

// //   const handleSession = () => {
// //     if (!selectedSessionId) return toast.error('Please select a session');
// //     // Use the dedicated /pdf endpoint when PDF is selected, otherwise the format param route
// //     dl('session', () =>
// //       sessionFormat === 'pdf'
// //         ? reportService.downloadSessionReportPdf(parseInt(selectedSessionId))
// //         : reportService.downloadSessionReport(parseInt(selectedSessionId), sessionFormat)
// //     );
// //   };

// //   const handleCourse = () => {
// //     if (!selectedCourseId) return toast.error('Please select a course');
// //     dl('course', () => reportService.downloadCourseReport(parseInt(selectedCourseId)));
// //   };

// //   const handleAll = () =>
// //     dl('all', () => reportService.downloadAllRegistrationsReport(allFormat));

// //   const handleDateRange = () => {
// //     if (!startDate || !endDate) return toast.error('Select both start and end dates');
// //     if (new Date(endDate) < new Date(startDate)) return toast.error('End date must be after start date');
// //     dl('dateRange', () => reportService.downloadDateRangeReport(startDate, endDate, dateRangeFormat));
// //   };

// //   const handleDepartment = () => {
// //     if (!selectedDepartment) return toast.error('Please select a department');
// //     dl('department', () => reportService.downloadDepartmentReport(selectedDepartment));
// //   };

// //   if (loading) return <Loading text="Loading reports…" />;

// //   const sessionSelectOptions = [
// //     { value: '', label: 'Choose a session…' },
// //     ...sessions.map(s => ({
// //       value: s.id.toString(),
// //       label: `${s.name} — ${s.course?.courseCode ?? ''} (${s.course?.department ?? ''})`,
// //     })),
// //   ];

// //   const courseSelectOptions = [
// //     { value: '', label: 'Choose a course…' },
// //     ...courses.map(c => ({
// //       value: c.id.toString(),
// //       label: `${c.courseCode} — ${c.courseName}`,
// //     })),
// //   ];

// //   const deptSelectOptions = [
// //     { value: '', label: 'Choose a department…' },
// //     ...departments.map(d => ({ value: d, label: d })),
// //   ];

// //   return (
// //     <div className="max-w-6xl mx-auto space-y-8 pb-12">

// //       {/* ── Page Header ── */}
// //       <div className="flex items-end justify-between">
// //         <div>
// //           <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Data Export</p>
// //           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
// //           <p className="text-sm text-gray-500 mt-1">
// //             Generate and download registration reports in multiple formats
// //           </p>
// //         </div>
// //         <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
// //           <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
// //           {sessions.length} sessions &nbsp;·&nbsp; {courses.length} courses
// //         </div>
// //       </div>

// //       {/* ── Top row: Session (featured, full-width) ── */}
// //       <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
// //         <div className="flex flex-col md:flex-row md:items-center gap-6">
// //           <div className="flex-1">
// //             <div className="flex items-center gap-2 mb-1">
// //               <FileText className="w-4 h-4 text-blue-400" />
// //               <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured</span>
// //             </div>
// //             <h2 className="text-lg font-bold mb-1">Session Report</h2>
// //             <p className="text-sm text-gray-400">
// //               Full roster per group — student biodata, status, waitlist, and summary footer.
// //               The PDF variant uses a professional table layout with colour-coded status badges.
// //             </p>
// //           </div>

// //           <div className="flex-1 space-y-4">
// //             <div>
// //               <SectionLabel>Session</SectionLabel>
// //               <select
// //                 value={selectedSessionId}
// //                 onChange={e => setSelectedSessionId(e.target.value)}
// //                 className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
// //               >
// //                 {sessionSelectOptions.map(o => (
// //                   <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Format</p>
// //               <div className="flex flex-wrap gap-2">
// //                 {SESSION_FORMATS.map(f => (
// //                   <button
// //                     key={f.value}
// //                     onClick={() => setSessionFormat(f.value)}
// //                     className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
// //                       ${sessionFormat === f.value
// //                         ? 'bg-white text-gray-900 border-white shadow'
// //                         : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
// //                       }`}
// //                   >
// //                     {f.label}
// //                     <span className="ml-1 opacity-60">{f.ext}</span>
// //                     {f.value === 'pdf' && (
// //                       <span className="ml-1.5 text-[9px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">PRO</span>
// //                     )}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleSession}
// //               disabled={!selectedSessionId || downloading === 'session'}
// //               className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
// //                 ${!selectedSessionId || downloading === 'session'
// //                   ? 'bg-white/10 text-gray-500 cursor-not-allowed'
// //                   : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
// //                 }`}
// //             >
// //               {downloading === 'session' ? (
// //                 <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
// //               ) : (
// //                 <><Download className="w-4 h-4" />Download Session Report</>
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ── Grid: 3 cards ── */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

// //         {/* Department */}
// //         <ReportCard
// //           icon={<Building2 className="w-4 h-4 text-indigo-600" />}
// //           iconColor="bg-indigo-50"
// //           title="Department Report"
// //           description="All courses & sessions within a department"
// //         >
// //           <div>
// //             <SectionLabel>Department</SectionLabel>
// //             <select
// //               value={selectedDepartment}
// //               onChange={e => setSelectedDepartment(e.target.value)}
// //               className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
// //             >
// //               {deptSelectOptions.map(o => (
// //                 <option key={o.value} value={o.value}>{o.label}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
// //             Outputs as <strong>Excel</strong> or <strong>PDF</strong> (default: Excel)
// //           </div>
// //           <DownloadButton
// //             onClick={handleDepartment}
// //             loading={downloading === 'department'}
// //             disabled={!selectedDepartment}
// //             label="Download Department Report"
// //           />
// //         </ReportCard>

// //         {/* Course */}
// //         <ReportCard
// //           icon={<BookOpen className="w-4 h-4 text-green-600" />}
// //           iconColor="bg-green-50"
// //           title="Course Report"
// //           description="All lab sessions within a course"
// //         >
// //           <div>
// //             <SectionLabel>Course</SectionLabel>
// //             <select
// //               value={selectedCourseId}
// //               onChange={e => setSelectedCourseId(e.target.value)}
// //               className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
// //             >
// //               {courseSelectOptions.map(o => (
// //                 <option key={o.value} value={o.value}>{o.label}</option>
// //               ))}
// //             </select>
// //           </div>
// //           <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
// //             Outputs as <strong>Text</strong> or <strong>PDF</strong> (default: Text)
// //           </div>
// //           <DownloadButton
// //             onClick={handleCourse}
// //             loading={downloading === 'course'}
// //             disabled={!selectedCourseId}
// //             label="Download Course Report"
// //           />
// //         </ReportCard>

// //         {/* Date Range */}
// //         <ReportCard
// //           icon={<Calendar className="w-4 h-4 text-blue-600" />}
// //           iconColor="bg-blue-50"
// //           title="Date Range Report"
// //           description="All registrations within a date window"
// //         >
// //           <div className="grid grid-cols-2 gap-2">
// //             <div>
// //               <SectionLabel>From</SectionLabel>
// //               <input
// //                 type="date"
// //                 value={startDate}
// //                 onChange={e => setStartDate(e.target.value)}
// //                 className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
// //               />
// //             </div>
// //             <div>
// //               <SectionLabel>To</SectionLabel>
// //               <input
// //                 type="date"
// //                 value={endDate}
// //                 onChange={e => setEndDate(e.target.value)}
// //                 className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
// //               />
// //             </div>
// //           </div>
// //           <FormatPicker
// //             formats={TABULAR_FORMATS}
// //             value={dateRangeFormat}
// //             onChange={setDateRangeFormat}
// //           />
// //           <DownloadButton
// //             onClick={handleDateRange}
// //             loading={downloading === 'dateRange'}
// //             disabled={!startDate || !endDate}
// //             label="Download Date Range Report"
// //           />
// //         </ReportCard>
// //       </div>

// //       {/* ── Full-width: All Registrations ── */}
// //       <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
// //         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
// //               <FileSpreadsheet className="w-4 h-4 text-purple-600" />
// //             </div>
// //             <div>
// //               <h3 className="font-semibold text-gray-900 text-sm">Complete Export</h3>
// //               <p className="text-xs text-gray-500 mt-0.5">
// //                 Every registration across all sessions and departments in one file
// //               </p>
// //             </div>
// //           </div>
// //           <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">
// //             All Data
// //           </span>
// //         </div>
// //         <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-end gap-5">
// //           <div className="flex-1">
// //             <FormatPicker
// //               formats={TABULAR_FORMATS}
// //               value={allFormat}
// //               onChange={setAllFormat}
// //             />
// //           </div>
// //           <button
// //             onClick={handleAll}
// //             disabled={downloading === 'all'}
// //             className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
// //               ${downloading === 'all'
// //                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
// //                 : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-[0.98] hover:shadow-md'
// //               }`}
// //           >
// //             {downloading === 'all' ? (
// //               <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Generating…</>
// //             ) : (
// //               <><Download className="w-4 h-4" />Download All Registrations</>
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Legend ── */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //         {/* Format legend */}
// //         <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
// //           <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Format Guide</h4>
// //           <div className="space-y-2">
// //             {[
// //               { ext: 'TXT',  color: 'bg-slate-100 text-slate-700',   desc: 'Formatted text — easy to read and print' },
// //               { ext: 'CSV',  color: 'bg-emerald-50 text-emerald-700', desc: 'Opens in Excel, Sheets, or any spreadsheet app' },
// //               { ext: 'XLSX', color: 'bg-green-50 text-green-700',     desc: 'Native Excel with colour-coded slot status' },
// //               { ext: 'PDF',  color: 'bg-red-50 text-red-700',         desc: 'Professional table layout — ideal for printing' },
// //             ].map(f => (
// //               <div key={f.ext} className="flex items-center gap-3 text-sm">
// //                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.color} w-10 text-center shrink-0`}>{f.ext}</span>
// //                 <span className="text-gray-600">{f.desc}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Excel colour legend */}
// //         <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
// //           <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Excel Colour Codes</h4>
// //           <div className="space-y-2">
// //             {[
// //               { dot: 'bg-green-400',  label: 'Empty',     desc: 'No students registered (0 / capacity)' },
// //               { dot: 'bg-yellow-400', label: 'Available', desc: 'Partially filled — still has open spots' },
// //               { dot: 'bg-red-400',    label: 'Full',      desc: 'At maximum capacity — no more spots' },
// //             ].map(c => (
// //               <div key={c.label} className="flex items-center gap-3 text-sm">
// //                 <span className={`w-3 h-3 rounded-full shrink-0 ${c.dot}`} />
// //                 <span className="font-medium text-gray-700 w-16 shrink-0">{c.label}</span>
// //                 <span className="text-gray-500">{c.desc}</span>
// //               </div>
// //             ))}
// //           </div>
// //           <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
// //             PDF session reports use a professional iText layout with navy/blue colour scheme and per-group rosters.
// //           </div>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default AdminReportsPage;

















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
//   const [sessionFormat,    setSessionFormat]    = useState<ReportFormat>('pdf');
//   const [courseFormat,     setCourseFormat]     = useState<ReportFormat>('pdf');
//   const [departmentFormat, setDepartmentFormat] = useState<ReportFormat>('excel');
//   const [allFormat,        setAllFormat]        = useState<ReportFormat>('excel');
//   const [dateRangeFormat,  setDateRangeFormat]  = useState<ReportFormat>('excel');
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
//     dl('course', () => reportService.downloadCourseReport(parseInt(selectedCourseId), courseFormat));
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
//     dl('department', () => reportService.downloadDepartmentReport(selectedDepartment, departmentFormat));
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
//           <FormatPicker
//             formats={ALL_FORMATS}
//             value={departmentFormat}
//             onChange={setDepartmentFormat}
//           />
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
//           <FormatPicker
//             formats={ALL_FORMATS}
//             value={courseFormat}
//             onChange={setCourseFormat}
//           />
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
  FileSpreadsheet, Building2, CheckCircle2,
  ChevronDown, ArrowRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
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
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ALL_FORMATS: FormatOption[] = [
  { value: 'txt',   label: 'Text',  ext: 'TXT'  },
  { value: 'csv',   label: 'CSV',   ext: 'CSV'  },
  { value: 'excel', label: 'Excel', ext: 'XLSX' },
  { value: 'pdf',   label: 'PDF',   ext: 'PDF'  },
];
const TABULAR_FORMATS = ALL_FORMATS.filter(f => f.value !== 'txt');
const SESSION_FORMATS = ALL_FORMATS;

// Format accent colors
const FMT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  txt:   { bg: '#f8fafc',  text: '#475569', border: '#e2e8f0' },
  csv:   { bg: '#f0fdf4',  text: '#15803d', border: '#bbf7d0' },
  excel: { bg: '#dcfce7',  text: '#166534', border: '#86efac' },
  pdf:   { bg: '#fef2f2',  text: '#dc2626', border: '#fecaca' },
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13.5,
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#18181b', outline: 'none',
  fontFamily: "'Cabinet Grotesk', sans-serif",
  boxSizing: 'border-box' as const, transition: 'all .15s',
};

const focusIn  = (e: React.FocusEvent<HTMLElement>) => {
  (e.target as HTMLElement).style.borderColor = '#6366f1';
  (e.target as HTMLElement).style.background  = '#fff';
  (e.target as HTMLElement).style.boxShadow   = '0 0 0 3px #eef2ff';
};
const focusOut = (e: React.FocusEvent<HTMLElement>) => {
  (e.target as HTMLElement).style.borderColor = '#e2e8f0';
  (e.target as HTMLElement).style.background  = '#f8fafc';
  (e.target as HTMLElement).style.boxShadow   = 'none';
};

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b', margin: '0 0 5px', fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.02em' }}>
    {children}
  </p>
);

const NativeSelect = ({
  value, onChange, children, darkMode = false
}: { value: string; onChange: (v: string) => void; children: React.ReactNode; darkMode?: boolean }) => (
  <div style={{ position: 'relative' }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={darkMode ? {
        ...inp, background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.2)',
        color: '#fff', paddingRight: 34, appearance: 'none', cursor: 'pointer',
      } : { ...inp, appearance: 'none', paddingRight: 34, cursor: 'pointer' }}
      onFocus={darkMode ? undefined : focusIn as any}
      onBlur={darkMode  ? undefined : focusOut as any}
    >
      {children}
    </select>
    <ChevronDown
      size={13}
      style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: darkMode ? 'rgba(255,255,255,.5)' : '#94a3b8' }}
    />
  </div>
);

// ─── Format Picker ────────────────────────────────────────────────────────────

const FormatPicker = ({
  formats, value, onChange, darkMode = false,
}: { formats: FormatOption[]; value: ReportFormat; onChange: (v: ReportFormat) => void; darkMode?: boolean }) => (
  <div>
    <FieldLabel><span style={darkMode ? { color: 'rgba(255,255,255,.5)' } : {}}>Format</span></FieldLabel>
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {formats.map(f => {
        const sel = value === f.value;
        const fc  = FMT_COLORS[f.value];
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', transition: 'all .12s',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              border: `1.5px solid ${darkMode
                ? sel ? '#fff' : 'rgba(255,255,255,.2)'
                : sel ? fc.border : '#e2e8f0'}`,
              background: darkMode
                ? sel ? '#fff' : 'rgba(255,255,255,.08)'
                : sel ? fc.bg : '#f8fafc',
              color: darkMode
                ? sel ? '#18181b' : 'rgba(255,255,255,.6)'
                : sel ? fc.text : '#94a3b8',
              boxShadow: sel && !darkMode ? `0 1px 4px ${fc.border}` : 'none',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 800, opacity: sel ? 1 : 0.6 }}>{f.ext}</span>
            {f.label}
            {f.value === 'pdf' && (
              <span style={{
                fontSize: 8, background: '#3b82f6', color: '#fff',
                padding: '1px 4px', borderRadius: 3, fontWeight: 800, letterSpacing: '0.05em',
              }}>PRO</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Download Button ──────────────────────────────────────────────────────────

const DlBtn = ({
  onClick, isLoading, disabled, label, variant = 'dark',
}: { onClick: () => void; isLoading: boolean; disabled?: boolean; label: string; variant?: 'dark' | 'accent' | 'outline' }) => {
  const styles = {
    dark:    { bg: '#18181b', color: '#fff', border: '#18181b', hoverBg: '#27272a' },
    accent:  { bg: '#4f46e5', color: '#fff', border: '#4f46e5', hoverBg: '#4338ca' },
    outline: { bg: '#fff',    color: '#18181b', border: '#e2e8f0', hoverBg: '#f8fafc' },
  }[variant];
  const dis = disabled || isLoading;
  return (
    <button
      onClick={onClick}
      disabled={dis}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 7, padding: '10px 18px', borderRadius: 9, fontSize: 13.5, fontWeight: 700,
        cursor: dis ? 'not-allowed' : 'pointer', transition: 'all .15s',
        fontFamily: "'Cabinet Grotesk', sans-serif",
        border: `1.5px solid ${dis ? '#e2e8f0' : styles.border}`,
        background: dis ? '#f1f5f9' : styles.bg,
        color: dis ? '#94a3b8' : styles.color,
        boxShadow: dis ? 'none' : '0 1px 6px rgba(0,0,0,.1)',
      }}
    >
      {isLoading ? (
        <>
          <div style={{ width: 13, height: 13, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: dis ? '#94a3b8' : styles.color, borderRadius: '50%', animation: 'rp-spin .75s linear infinite' }} />
          Generating…
        </>
      ) : (
        <>
          <Download size={14} strokeWidth={2.5} />
          {label}
        </>
      )}
    </button>
  );
};

// ─── Report Card ──────────────────────────────────────────────────────────────

const RCard = ({
  accentColor, icon, title, description, children,
}: { accentColor: string; icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) => (
  <div style={{
    background: '#fff', border: '1px solid #e8e5df', borderRadius: 14,
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    transition: 'box-shadow .2s, transform .2s',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
  >
    {/* Left accent bar at top */}
    <div style={{ height: 3.5, background: accentColor }} />

    <div style={{ padding: '18px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: '#18181b', margin: 0, lineHeight: 1.2 }}>
            {title}
          </h3>
          <p style={{ fontSize: 12.5, color: '#94a3b8', margin: '3px 0 0', fontWeight: 500 }}>
            {description}
          </p>
        </div>
      </div>
    </div>

    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
      {children}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminReportsPage = () => {
  const [sessions, setSessions]       = useState<LabSession[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);
  const [downloading, setDownloading] = useState<DownloadKey>(null);

  const [selSession,  setSelSession]  = useState('');
  const [selCourse,   setSelCourse]   = useState('');
  const [selDept,     setSelDept]     = useState('');
  const [sessionFmt,  setSessionFmt]  = useState<ReportFormat>('pdf');
  const [courseFmt,   setCourseFmt]   = useState<ReportFormat>('pdf');
  const [deptFmt,     setDeptFmt]     = useState<ReportFormat>('excel');
  const [allFmt,      setAllFmt]      = useState<ReportFormat>('excel');
  const [dateRngFmt,  setDateRngFmt]  = useState<ReportFormat>('excel');
  const [startDate,   setStartDate]   = useState('');
  const [endDate,     setEndDate]     = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sd, cd] = await Promise.all([labSessionService.getAll(), courseService.getAll()]);
      setSessions(sd);
      setCourses(cd);
      setDepartments([...new Set(cd.map((c: Course) => c.department).filter(Boolean))] as string[]);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const dl = async (key: DownloadKey, fn: () => Promise<void>) => {
    setDownloading(key);
    try { await fn(); toast.success('Report downloaded'); }
    catch { toast.error('Download failed — please try again'); }
    finally { setDownloading(null); }
  };

  const handleSession    = () => { if (!selSession) { toast.error('Select a session'); return; } dl('session', () => sessionFmt === 'pdf' ? reportService.downloadSessionReportPdf(+selSession) : reportService.downloadSessionReport(+selSession, sessionFmt)); };
  const handleCourse     = () => { if (!selCourse)  { toast.error('Select a course'); return; }  dl('course',  () => reportService.downloadCourseReport(+selCourse, courseFmt)); };
  const handleDept       = () => { if (!selDept)    { toast.error('Select a department'); return; } dl('department', () => reportService.downloadDepartmentReport(selDept, deptFmt)); };
  const handleAll        = () => dl('all', () => reportService.downloadAllRegistrationsReport(allFmt));
  const handleDateRange  = () => {
    if (!startDate || !endDate) { toast.error('Select both dates'); return; }
    if (new Date(endDate) < new Date(startDate)) { toast.error('End must be after start'); return; }
    dl('dateRange', () => reportService.downloadDateRangeReport(startDate, endDate, dateRngFmt));
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'rp-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading reports…</span>
      <style>{`@keyframes rp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes rp-spin  { to { transform: rotate(360deg); } }
        @keyframes rp-rise  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .rp-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px 64px; }
        .rp-wrap { max-width: 1060px; margin: 0 auto; animation: rp-rise .3s ease both; display: flex; flex-direction: column; gap: 28px; }

        /* ── Hero (session) panel ── */
        .rp-hero {
          background: #18181b;
          border-radius: 18px;
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 40px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .rp-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .rp-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 30%;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,70,229,.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── 3-col grid ── */
        .rp-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        /* ── 2-col grid ── */
        .rp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Full-width export panel ── */
        .rp-full {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px; overflow: hidden;
        }

        /* ── Legend panel ── */
        .rp-legend {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          padding: 20px 22px; display: flex; flex-direction: column; gap: 12px;
        }

        /* ── Date input pair ── */
        .rp-date-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        @media (max-width: 768px) {
          .rp-page { padding: 24px 16px 48px; }
          .rp-hero  { grid-template-columns: 1fr; gap: 24px; }
          .rp-grid3 { grid-template-columns: 1fr; }
          .rp-grid2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rp-page">
        <div className="rp-wrap">

          {/* ── Page header ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px' }}>
                Admin · Data Export
              </p>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 36, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
                Reports
              </h1>
              <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 5, fontWeight: 500 }}>
                Generate and download registration reports in multiple formats
              </p>
            </div>

            {/* Stats chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', background: '#fff',
              border: '1px solid #e8e5df', borderRadius: 10,
            }}>
              <CheckCircle2 size={14} color="#22c55e" />
              <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                {sessions.length} sessions
              </span>
              <span style={{ color: '#e2e8f0' }}>·</span>
              <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                {courses.length} courses
              </span>
            </div>
          </div>

          {/* ── HERO: Session report ─────────────────────────────────────────── */}
          <div className="rp-hero">
            {/* Left: description */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', borderRadius: 999, background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.3)', marginBottom: 14 }}>
                <FileText size={11} color="#818cf8" />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#818cf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Featured Report</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 12px' }}>
                Session Report
              </h2>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.65, margin: 0, fontWeight: 400, maxWidth: 360 }}>
                Full roster per group — student biodata, registration status, waitlist, and a summary footer. The PDF variant uses a professional table layout with colour-coded status badges.
              </p>

              {/* Format legend dots */}
              <div style={{ display: 'flex', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Text',  color: '#94a3b8' },
                  { label: 'CSV',   color: '#4ade80' },
                  { label: 'Excel', color: '#86efac' },
                  { label: 'PDF ✦', color: '#818cf8' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: controls */}
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              <div>
                <FieldLabel><span style={{ color: 'rgba(255,255,255,.5)' }}>Lab Session</span></FieldLabel>
                <NativeSelect value={selSession} onChange={setSelSession} darkMode>
                  <option value="">Choose a session…</option>
                  {sessions.map(s => (
                    <option key={s.id} value={s.id} style={{ color: '#18181b' }}>
                      {s.name} — {s.course?.courseCode ?? ''} ({s.course?.department ?? ''})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <FormatPicker formats={SESSION_FORMATS} value={sessionFmt} onChange={setSessionFmt} darkMode />

              <button
                onClick={handleSession}
                disabled={!selSession || downloading === 'session'}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '11px 0', borderRadius: 9, fontSize: 14, fontWeight: 700,
                  cursor: (!selSession || downloading === 'session') ? 'not-allowed' : 'pointer',
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  border: 'none', transition: 'all .15s',
                  background: (!selSession || downloading === 'session') ? 'rgba(255,255,255,.1)' : '#4f46e5',
                  color: (!selSession || downloading === 'session') ? 'rgba(255,255,255,.3)' : '#fff',
                  boxShadow: (!selSession || downloading === 'session') ? 'none' : '0 4px 16px rgba(79,70,229,.4)',
                }}
              >
                {downloading === 'session' ? (
                  <><div style={{ width: 13, height: 13, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'rp-spin .75s linear infinite' }} /> Generating…</>
                ) : (
                  <><Download size={14} strokeWidth={2.5} /> Download Session Report</>
                )}
              </button>
            </div>
          </div>

          {/* ── 3-col report cards ───────────────────────────────────────────── */}
          <div className="rp-grid3">

            {/* Department */}
            <RCard accentColor="#6366f1" icon={<Building2 size={16} color="#6366f1" />} title="Department" description="All courses & sessions in a department">
              <div>
                <FieldLabel>Department</FieldLabel>
                <NativeSelect value={selDept} onChange={setSelDept}>
                  <option value="">Select department…</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </NativeSelect>
              </div>
              <FormatPicker formats={ALL_FORMATS} value={deptFmt} onChange={setDeptFmt} />
              <DlBtn onClick={handleDept} isLoading={downloading === 'department'} disabled={!selDept} label="Download" />
            </RCard>

            {/* Course */}
            <RCard accentColor="#16a34a" icon={<BookOpen size={16} color="#16a34a" />} title="Course" description="All lab sessions within a course">
              <div>
                <FieldLabel>Course</FieldLabel>
                <NativeSelect value={selCourse} onChange={setSelCourse}>
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseName}</option>)}
                </NativeSelect>
              </div>
              <FormatPicker formats={ALL_FORMATS} value={courseFmt} onChange={setCourseFmt} />
              <DlBtn onClick={handleCourse} isLoading={downloading === 'course'} disabled={!selCourse} label="Download" />
            </RCard>

            {/* Date Range */}
            <RCard accentColor="#0284c7" icon={<Calendar size={16} color="#0284c7" />} title="Date Range" description="All registrations in a date window">
              <div className="rp-date-pair">
                <div>
                  <FieldLabel>From</FieldLabel>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    style={inp} onFocus={focusIn as any} onBlur={focusOut as any} />
                </div>
                <div>
                  <FieldLabel>To</FieldLabel>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    style={inp} onFocus={focusIn as any} onBlur={focusOut as any} />
                </div>
              </div>
              <FormatPicker formats={TABULAR_FORMATS} value={dateRngFmt} onChange={setDateRngFmt} />
              <DlBtn onClick={handleDateRange} isLoading={downloading === 'dateRange'} disabled={!startDate || !endDate} label="Download" />
            </RCard>
          </div>

          {/* ── Full export panel ────────────────────────────────────────────── */}
          <div className="rp-full">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#faf5ff', border: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileSpreadsheet size={18} color="#9333ea" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: '#18181b', margin: 0 }}>Complete Export</h3>
                  <p style={{ fontSize: 12.5, color: '#94a3b8', margin: '2px 0 0', fontWeight: 500 }}>Every registration across all sessions and departments in one file</p>
                </div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: '#faf5ff', border: '1px solid #e9d5ff', fontSize: 10.5, fontWeight: 700, color: '#9333ea', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>All Data</span>
            </div>
            <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <FormatPicker formats={TABULAR_FORMATS} value={allFmt} onChange={setAllFmt} />
              </div>
              <button
                onClick={handleAll}
                disabled={downloading === 'all'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '10px 22px', borderRadius: 9, fontSize: 13.5, fontWeight: 700,
                  cursor: downloading === 'all' ? 'not-allowed' : 'pointer',
                  fontFamily: "'Cabinet Grotesk', sans-serif", transition: 'all .15s',
                  border: 'none', flexShrink: 0,
                  background: downloading === 'all' ? '#f1f5f9' : '#9333ea',
                  color: downloading === 'all' ? '#94a3b8' : '#fff',
                  boxShadow: downloading === 'all' ? 'none' : '0 2px 10px rgba(147,51,234,.3)',
                }}
              >
                {downloading === 'all' ? (
                  <><div style={{ width: 13, height: 13, border: '2.5px solid rgba(255,255,255,.3)', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'rp-spin .75s linear infinite' }} />Generating…</>
                ) : (
                  <><Download size={14} strokeWidth={2.5} />Download All Registrations</>
                )}
              </button>
            </div>
          </div>

          {/* ── Legend row ───────────────────────────────────────────────────── */}
          <div className="rp-grid2">
            {/* Format guide */}
            <div className="rp-legend">
              <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0 }}>Format Guide</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { fmt: 'TXT',  color: '#475569', bg: '#f8fafc', border: '#e2e8f0', desc: 'Plain text — easy to read and print' },
                  { fmt: 'CSV',  color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Opens in Excel, Sheets, or any spreadsheet app' },
                  { fmt: 'XLSX', color: '#166534', bg: '#dcfce7', border: '#86efac', desc: 'Native Excel with colour-coded slot status' },
                  { fmt: 'PDF',  color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Professional table layout — ideal for printing' },
                ].map(f => (
                  <div key={f.fmt} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 5, background: f.bg, border: `1px solid ${f.border}`, fontSize: 10, fontWeight: 800, color: f.color, minWidth: 36, textAlign: 'center' as const, flexShrink: 0 }}>{f.fmt}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Excel color codes */}
            <div className="rp-legend">
              <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0 }}>Excel Colour Codes</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { dot: '#22c55e', label: 'Empty',     desc: 'No students registered (0 / capacity)' },
                  { dot: '#facc15', label: 'Available', desc: 'Partially filled — still has open spots' },
                  { dot: '#f87171', label: 'Full',      desc: 'At maximum capacity — no more spots' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#334155', minWidth: 66, flexShrink: 0 }}>{c.label}</span>
                    <span style={{ fontSize: 12.5, color: '#94a3b8' }}>{c.desc}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: '#94a3b8', margin: 0, paddingTop: 10, borderTop: '1px solid #f1f5f9', lineHeight: 1.5 }}>
                PDF session reports use a professional iText layout with navy & blue scheme and per-group rosters.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminReportsPage;