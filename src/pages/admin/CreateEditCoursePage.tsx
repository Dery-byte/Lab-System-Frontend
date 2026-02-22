// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
// import { courseService } from '../../services/courseService';
// import { CreateCourseRequest, Level, LEVEL_OPTIONS } from '../../types';

// const CreateEditCoursePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);

//   const [loading, setLoading] = useState(isEdit);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<CreateCourseRequest>({
//     courseCode: '',
//     courseName: '',
//     description: '',
//     department: '',
//     level: 'LEVEL_100',
//     semester: '',
//     creditHours: 3,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (isEdit && id) {
//       fetchCourse(parseInt(id));
//     }
//   }, [id, isEdit]);

//   const fetchCourse = async (courseId: number) => {
//     try {
//       const course = await courseService.getById(courseId);
//       setFormData({
//         courseCode: course.courseCode,
//         courseName: course.courseName,
//         description: course.description || '',
//         department: course.department,
//         level: course.level,
//         semester: course.semester,
//         creditHours: course.creditHours,
//       });
//     } catch (error) {
//       toast.error('Failed to load course');
//       navigate('/admin/courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'number' ? parseInt(value) || 0 : value,
//     });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const validate = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.courseCode) newErrors.courseCode = 'Course code is required';
//     if (!formData.courseName) newErrors.courseName = 'Course name is required';
//     if (!formData.department) newErrors.department = 'Department is required';
//     if (!formData.level) newErrors.level = 'Level is required';
//     if (!formData.semester) newErrors.semester = 'Semester is required';
//     if (formData.creditHours < 1 || formData.creditHours > 6) {
//       newErrors.creditHours = 'Credit hours must be between 1 and 6';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setSaving(true);
//     try {
//       if (isEdit && id) {
//         await courseService.update(parseInt(id), formData);
//         toast.success('Course updated successfully');
//       } else {
//         await courseService.create(formData);
//         toast.success('Course created successfully');
//       }
//       navigate('/admin/courses');
//     } catch (error: any) {
//       const message = error.response?.data?.message || 'Failed to save course';
//       toast.error(message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <Loading text="Loading course..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => navigate('/admin/courses')}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {isEdit ? 'Edit Course' : 'Create Course'}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {isEdit ? 'Update course details' : 'Add a new course to the system'}
//           </p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <Card>
//           <CardHeader>
//             <h2 className="text-lg font-semibold">Course Details</h2>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Input
//                 label="Course Code"
//                 name="courseCode"
//                 placeholder="e.g., PHY101"
//                 value={formData.courseCode}
//                 onChange={handleChange}
//                 error={errors.courseCode}
//               />

//               <Input
//                 label="Course Name"
//                 name="courseName"
//                 placeholder="e.g., Introduction to Physics"
//                 value={formData.courseName}
//                 onChange={handleChange}
//                 error={errors.courseName}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 rows={3}
//                 placeholder="Course description..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Input
//                 label="Department"
//                 name="department"
//                 placeholder="e.g., Physics"
//                 value={formData.department}
//                 onChange={handleChange}
//                 error={errors.department}
//               />

//               <Select
//                 label="Level"
//                 name="level"
//                 options={LEVEL_OPTIONS}
//                 value={formData.level}
//                 onChange={handleChange}
//                 error={errors.level}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Input
//                 label="Semester"
//                 name="semester"
//                 placeholder="e.g., Spring 2025"
//                 value={formData.semester}
//                 onChange={handleChange}
//                 error={errors.semester}
//               />

//               <Input
//                 label="Credit Hours"
//                 name="creditHours"
//                 type="number"
//                 min={1}
//                 max={6}
//                 value={formData.creditHours}
//                 onChange={handleChange}
//                 error={errors.creditHours}
//               />
//             </div>

//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={() => navigate('/admin/courses')}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" isLoading={saving}>
//                 {isEdit ? 'Update Course' : 'Create Course'}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </div>
//   );
// };

// export default CreateEditCoursePage;




// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   ArrowLeft, BookOpen, Hash, Building2, GraduationCap,
//   Calendar, Star, FileText, AlertCircle, CheckCircle2
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { courseService } from '../../services/courseService';
// import { CreateCourseRequest, LEVEL_OPTIONS } from '../../types';
// import { Semester } from '../../types/enums';

// // ─── Types ────────────────────────────────────────────────────────────────────

// type FieldErrors = Record<string, string>;

// // ─── Credit hour selector ──────────────────────────────────────────────────

// const CREDIT_OPTIONS = [1, 2, 3, 4, 5, 6];

// const CreditSelector = ({
//   value,
//   onChange,
//   error,
// }: { value: number; onChange: (v: number) => void; error?: string }) => (
//   <div>
//     <label style={labelStyle}>Credit Hours</label>
//     <div style={{ display: 'flex', gap: 8 }}>
//       {CREDIT_OPTIONS.map(n => (
//         <button
//           key={n}
//           type="button"
//           onClick={() => onChange(n)}
//           style={{
//             flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 14,
//             fontWeight: 700, cursor: 'pointer',
//             fontFamily: "'Syne', sans-serif",
//             border: `1.5px solid ${value === n ? '#818cf8' : '#e2e8f0'}`,
//             background: value === n ? '#eef2ff' : '#f8fafc',
//             color: value === n ? '#4f46e5' : '#94a3b8',
//             transition: 'all .15s',
//             boxShadow: value === n ? '0 0 0 3px #eef2ff' : 'none',
//           }}
//         >
//           {n}
//         </button>
//       ))}
//     </div>
//     {error && <p style={errorStyle}><AlertCircle size={11} />{error}</p>}
//   </div>
// );

// // ─── Shared style atoms ───────────────────────────────────────────────────────

// const labelStyle: React.CSSProperties = {
//   display: 'block', fontSize: 10, fontWeight: 800,
//   letterSpacing: '0.18em', textTransform: 'uppercase',
//   color: '#94a3b8', marginBottom: 6,
//   fontFamily: "'DM Mono', monospace",
// };

// const errorStyle: React.CSSProperties = {
//   display: 'flex', alignItems: 'center', gap: 4,
//   fontSize: 11, color: '#dc2626', marginTop: 5, fontWeight: 600,
// };

// const baseInput: React.CSSProperties = {
//   width: '100%', padding: '11px 13px', fontSize: 13,
//   border: '1.5px solid #e2e8f0', borderRadius: 10,
//   background: '#f8fafc', color: '#0f172a', outline: 'none',
//   fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box',
//   transition: 'border-color .15s, background .15s, box-shadow .15s',
// };

// // ─── Field wrapper ────────────────────────────────────────────────────────────

// const Field = ({
//   label, icon, error, children,
// }: { label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode }) => (
//   <div>
//     <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
//       {icon && <span style={{ color: '#c7d2fe' }}>{icon}</span>}
//       {label}
//     </label>
//     {children}
//     {error && <p style={errorStyle}><AlertCircle size={11} />{error}</p>}
//   </div>
// );

// // ─── Text input ───────────────────────────────────────────────────────────────

// const TInput = ({
//   name, value, onChange, placeholder, type = 'text',
//   error, min, max,
// }: {
//   name: string; value: string | number; onChange: React.ChangeEventHandler<HTMLInputElement>;
//   placeholder?: string; type?: string; error?: string; min?: number; max?: number;
// }) => (
//   <input
//     name={name} type={type} value={value} placeholder={placeholder}
//     min={min} max={max} onChange={onChange}
//     style={{ ...baseInput, borderColor: error ? '#fca5a5' : '#e2e8f0' }}
//     onFocus={e => {
//       e.target.style.borderColor = error ? '#f87171' : '#818cf8';
//       e.target.style.background = 'white';
//       e.target.style.boxShadow = `0 0 0 3px ${error ? '#fee2e2' : '#eef2ff'}`;
//     }}
//     onBlur={e => {
//       e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0';
//       e.target.style.background = '#f8fafc';
//       e.target.style.boxShadow = 'none';
//     }}
//   />
// );

// // ─── Select ───────────────────────────────────────────────────────────────────

// const TSelect = ({
//   name, value, onChange, options, error,
// }: {
//   name: string; value: string;
//   onChange: React.ChangeEventHandler<HTMLSelectElement>;
//   options: { value: string; label: string }[];
//   error?: string;
// }) => (
//   <div style={{ position: 'relative' }}>
//     <select
//       name={name} value={value} onChange={onChange}
//       style={{
//         ...baseInput,
//         appearance: 'none', paddingRight: 36,
//         borderColor: error ? '#fca5a5' : '#e2e8f0',
//         cursor: 'pointer',
//       }}
//       onFocus={e => {
//         e.target.style.borderColor = error ? '#f87171' : '#818cf8';
//         e.target.style.background = 'white';
//         e.target.style.boxShadow = `0 0 0 3px ${error ? '#fee2e2' : '#eef2ff'}`;
//       }}
//       onBlur={e => {
//         e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0';
//         e.target.style.background = '#f8fafc';
//         e.target.style.boxShadow = 'none';
//       }}
//     >
//       {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//     </select>
//     <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
//       <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//       </svg>
//     </div>
//   </div>
// );

// // ─── Section card ─────────────────────────────────────────────────────────────

// const Section = ({
//   title, accent = '#818cf8', children,
// }: { title: string; accent?: string; children: React.ReactNode }) => (
//   <div style={{
//     background: 'white', border: '1.5px solid #e8e6e1', borderRadius: 16,
//     overflow: 'hidden',
//   }}>
//     <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
//     <div style={{ padding: '20px 22px 0' }}>
//       <p style={{
//         fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14,
//         color: '#0f172a', margin: 0, letterSpacing: '-0.01em',
//       }}>
//         {title}
//       </p>
//     </div>
//     <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
//       {children}
//     </div>
//   </div>
// );

// // ─── Course code preview badge ────────────────────────────────────────────────

// const CODE_PALETTES = [
//   { bg: '#dbeafe', accent: '#2563eb' },
//   { bg: '#fef3c7', accent: '#d97706' },
//   { bg: '#dcfce7', accent: '#16a34a' },
//   { bg: '#f3e8ff', accent: '#9333ea' },
//   { bg: '#fee2e2', accent: '#dc2626' },
//   { bg: '#e0f2fe', accent: '#0284c7' },
//   { bg: '#fce7f3', accent: '#db2777' },
//   { bg: '#ccfbf1', accent: '#0d9488' },
// ];

// const getCodePalette = (code: string) => {
//   let h = 0;
//   for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
//   return CODE_PALETTES[Math.abs(h) % CODE_PALETTES.length];
// };

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const CreateEditCoursePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);

//   const [loading, setLoading]   = useState(isEdit);
//   const [saving, setSaving]     = useState(false);
//   const [errors, setErrors]     = useState<FieldErrors>({});
//   const [formData, setFormData] = useState<CreateCourseRequest>({
//     courseCode: '', courseName: '', description: '',
//     department: '', level: 'LEVEL_100', semester: Semester.FIRST_SEMESTER, creditHours: 3,
//   });

//   useEffect(() => {
//     if (isEdit && id) fetchCourse(parseInt(id));
//   }, [id, isEdit]);

//   const fetchCourse = async (courseId: number) => {
//     try {
//       const course = await courseService.getById(courseId);
//       setFormData({
//         courseCode: course.courseCode, courseName: course.courseName,
//         description: course.description || '', department: course.department,
//         level: course.level, semester: Semester.FIRST_SEMESTER, creditHours: course.creditHours,
//       });
//     } catch {
//       toast.error('Failed to load course');
//       navigate('/admin/courses');
//     } finally { setLoading(false); }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData({ ...formData, [name]: type === 'number' ? parseInt(value) || 0 : value });
//     if (errors[name]) setErrors({ ...errors, [name]: '' });
//   };

//   const validate = () => {
//     const e: FieldErrors = {};
//     if (!formData.courseCode)  e.courseCode  = 'Course code is required';
//     if (!formData.courseName)  e.courseName  = 'Course name is required';
//     if (!formData.department)  e.department  = 'Department is required';
//     if (!formData.level)       e.level       = 'Level is required';
//     if (!formData.semester)    e.semester    = 'Semester is required';
//     if (formData.creditHours < 1 || formData.creditHours > 6)
//       e.creditHours = 'Must be between 1 and 6';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) { toast.error('Please fix the errors below'); return; }
//     setSaving(true);
//     try {
//       if (isEdit && id) {
//         await courseService.update(parseInt(id), formData);
//         toast.success('Course updated');
//       } else {
//         await courseService.create(formData);
//         toast.success('Course created');
//       }
//       navigate('/admin/courses');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save course');
//     } finally { setSaving(false); }
//   };

//   const palette = getCodePalette(formData.courseCode || 'X');
//   const hasPreview = formData.courseCode || formData.courseName;
//   const fieldCount = [formData.courseCode, formData.courseName, formData.department, formData.level, formData.semester].filter(Boolean).length;
//   const progress = Math.round((fieldCount / 5) * 100);

//   if (loading) return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14, fontFamily: "'Nunito', sans-serif" }}>
//       <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>Loading course…</span>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

//         .cec-root {
//           font-family: 'Nunito', sans-serif;
//           background: #f7f6f3;
//           min-height: 100vh;
//           padding: 40px 36px;
//         }
//         .cec-inner {
//           max-width: 860px;
//           margin: 0 auto;
//           animation: fadeIn .3s ease;
//         }

//         .back-btn {
//           display: flex; align-items: center; justify-content: center;
//           width: 38px; height: 38px; border-radius: 10px;
//           border: 1.5px solid #e2e8f0; background: white; cursor: pointer;
//           color: #64748b; transition: all .15s; flex-shrink: 0;
//         }
//         .back-btn:hover { border-color: #818cf8; color: #4f46e5; background: #eef2ff; }

//         .submit-btn {
//           display: flex; align-items: center; gap: 8px;
//           padding: 11px 22px; border-radius: 11px; font-size: 14px;
//           font-weight: 700; cursor: pointer; border: none;
//           background: #0f172a; color: white;
//           font-family: 'Nunito', sans-serif;
//           transition: background .15s, transform .1s;
//           box-shadow: 0 2px 10px rgba(15,23,42,.2);
//         }
//         .submit-btn:hover { background: #1e293b; }
//         .submit-btn:active { transform: scale(.97); }
//         .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

//         .cancel-btn {
//           padding: 11px 18px; border-radius: 11px; font-size: 14px;
//           font-weight: 600; cursor: pointer; border: 1.5px solid #e2e8f0;
//           background: transparent; color: #64748b;
//           font-family: 'Nunito', sans-serif; transition: all .15s;
//         }
//         .cancel-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }

//         .credit-btn { }
//         .credit-btn:hover { border-color: #818cf8 !important; color: #4f46e5 !important; background: #eef2ff !important; }

//         .progress-bar-fill {
//           height: 100%; border-radius: 999px;
//           background: linear-gradient(90deg, #818cf8, #6366f1);
//           transition: width .4s cubic-bezier(.34,1.56,.64,1);
//         }

//         textarea.cec-ta {
//           width: 100%; padding: 11px 13px; font-size: 13px;
//           border: 1.5px solid #e2e8f0; border-radius: 10px;
//           background: #f8fafc; color: #0f172a; outline: none;
//           font-family: 'Nunito', sans-serif; box-sizing: border-box;
//           resize: vertical; min-height: 80px;
//           transition: border-color .15s, background .15s, box-shadow .15s;
//         }
//         textarea.cec-ta:focus {
//           border-color: #818cf8; background: white;
//           box-shadow: 0 0 0 3px #eef2ff;
//         }

//         .grid-2 {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 18px;
//         }

//         @media (max-width: 600px) {
//           .cec-root { padding: 24px 16px; }
//           .grid-2 { grid-template-columns: 1fr; }
//         }
//       `}</style>

//       <div className="cec-root">
//         <div className="cec-inner">

//           {/* ── Header ──────────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 28 }}>
//             <button className="back-btn" onClick={() => navigate('/admin/courses')}>
//               <ArrowLeft size={17} />
//             </button>
//             <div style={{ flex: 1 }}>
//               <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px' }}>
//                 Admin · Courses
//               </p>
//               <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 30, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
//                 {isEdit ? 'Edit Course' : 'New Course'}
//               </h1>
//               <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 5, fontWeight: 400 }}>
//                 {isEdit ? 'Update the details for this course' : 'Fill in the fields below to add a course'}
//               </p>
//             </div>

//             {/* Completion bar */}
//             <div style={{ flexShrink: 0, paddingTop: 4 }}>
//               <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#94a3b8', textAlign: 'right', margin: '0 0 4px', letterSpacing: '0.1em' }}>
//                 {progress}% COMPLETE
//               </p>
//               <div style={{ width: 100, height: 5, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
//                 <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

//             {/* ── Preview card ─────────────────────────────────────────────── */}
//             {hasPreview && (
//               <div style={{
//                 padding: '14px 18px', background: palette.bg,
//                 border: `1.5px solid ${palette.accent}33`, borderRadius: 14,
//                 display: 'flex', alignItems: 'center', gap: 14,
//                 transition: 'all .3s',
//               }}>
//                 <div style={{
//                   width: 46, height: 46, borderRadius: 11, background: 'white',
//                   border: `1.5px solid ${palette.accent}44`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   boxShadow: `0 2px 8px ${palette.accent}30`,
//                   flexShrink: 0,
//                 }}>
//                   <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12, color: palette.accent, letterSpacing: '-0.01em' }}>
//                     {(formData.courseCode || '?').slice(0, 6)}
//                   </span>
//                 </div>
//                 <div>
//                   <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
//                     {formData.courseName || 'Course Name'}
//                   </p>
//                   <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
//                     {formData.department && (
//                       <span style={{ fontSize: 11, color: palette.accent, fontWeight: 600 }}>{formData.department}</span>
//                     )}
//                     {formData.level && (
//                       <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{formData.level.replace('_', ' ')}</span>
//                     )}
//                     {formData.creditHours && (
//                       <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono', monospace" }}>{formData.creditHours} credits</span>
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
//                   <CheckCircle2 size={18} color={`${palette.accent}88`} />
//                 </div>
//               </div>
//             )}

//             {/* ── Identity section ─────────────────────────────────────────── */}
//             <Section title="Identity" accent="#818cf8">
//               <div className="grid-2">
//                 <Field label="Course Code" icon={<Hash size={10} />} error={errors.courseCode}>
//                   <TInput
//                     name="courseCode"
//                     value={formData.courseCode}
//                     onChange={e => {
//                       handleChange(e);
//                       // force uppercase
//                       const ev = { ...e, target: { ...e.target, name: 'courseCode', value: e.target.value.toUpperCase(), type: 'text' } };
//                       handleChange(ev as any);
//                     }}
//                     placeholder="e.g., PHY101"
//                     error={errors.courseCode}
//                   />
//                 </Field>
//                 <Field label="Course Name" icon={<BookOpen size={10} />} error={errors.courseName}>
//                   <TInput name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Introduction to Physics" error={errors.courseName} />
//                 </Field>
//               </div>

//               <Field label="Description" icon={<FileText size={10} />}>
//                 <textarea
//                   className="cec-ta"
//                   name="description"
//                   rows={3}
//                   placeholder="What will students learn in this course?"
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </Field>
//             </Section>

//             {/* ── Academic section ─────────────────────────────────────────── */}
//             <Section title="Academic Details" accent="#34d399">
//               <div className="grid-2">
//                 <Field label="Department" icon={<Building2 size={10} />} error={errors.department}>
//                   <TInput name="department" value={formData.department} onChange={handleChange} placeholder="e.g., Physics" error={errors.department} />
//                 </Field>
//                 <Field label="Level" icon={<GraduationCap size={10} />} error={errors.level}>
//                   <TSelect
//                     name="level"
//                     value={formData.level}
//                     onChange={handleChange}
//                     options={LEVEL_OPTIONS}
//                     error={errors.level}
//                   />
//                 </Field>
//               </div>

//               <div className="grid-2">
//                 <Field label="Semester" icon={<Calendar size={10} />} error={errors.semester}>
//                   <TInput name="semester" value={formData.semester} onChange={handleChange} placeholder="e.g., Spring 2025" error={errors.semester} />
//                 </Field>
//                 <div>
//                   <CreditSelector
//                     value={formData.creditHours}
//                     onChange={v => {
//                       setFormData({ ...formData, creditHours: v });
//                       if (errors.creditHours) setErrors({ ...errors, creditHours: '' });
//                     }}
//                     error={errors.creditHours}
//                   />
//                 </div>
//               </div>
//             </Section>

//             {/* ── Actions ──────────────────────────────────────────────────── */}
//             <div style={{
//               display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//               background: 'white', border: '1.5px solid #e8e6e1', borderRadius: 14,
//               padding: '16px 20px',
//             }}>
//               <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
//                 {Object.keys(errors).length > 0
//                   ? <span style={{ color: '#dc2626', fontStyle: 'normal', fontWeight: 600 }}>
//                       {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need attention
//                     </span>
//                   : 'All required fields marked with *'
//                 }
//               </p>
//               <div style={{ display: 'flex', gap: 10 }}>
//                 <button type="button" className="cancel-btn" onClick={() => navigate('/admin/courses')}>
//                   Cancel
//                 </button>
//                 <button type="submit" className="submit-btn" disabled={saving}>
//                   {saving
//                     ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Saving…</>
//                     : <>{isEdit ? 'Update' : 'Create'} Course</>
//                   }
//                 </button>
//               </div>
//             </div>

//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateEditCoursePage;