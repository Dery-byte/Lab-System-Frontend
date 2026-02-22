// // import { useEffect, useState } from 'react';
// // import { Calendar, Play, Pause, Eye } from 'lucide-react';
// // import { toast } from 'react-hot-toast';
// // import { Card, CardContent, Badge, Button, Loading } from '../../components/ui/index';
// // import { labSessionService } from '../../services';
// // import { LabSession, SessionStatus } from '../../types';

// // const AdminSessionsPage = () => {
// //   const [sessions, setSessions] = useState<LabSession[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     labSessionService.getAll()
// //       .then(setSessions)
// //       .catch(() => toast.error('Failed to load sessions'))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const handleStatusChange = async (session: LabSession, status: SessionStatus) => {
// //     try {
// //       await labSessionService.updateStatus(session.id, status);
// //       toast.success(`Session ${status.toLowerCase()}`);
// //       setSessions(await labSessionService.getAll());
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || 'Failed to update');
// //     }
// //   };

// //   const getStatusBadge = (status: SessionStatus) => {
// //     const variants: Record<string, 'success' | 'default' | 'danger'> = { OPEN: 'success', DRAFT: 'default', CLOSED: 'danger' };
// //     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
// //   };

// //   if (loading) return <Loading text="Loading sessions..." />;

// //   return (
// //     <div className="space-y-6">
// //       <div><h1 className="text-2xl font-bold text-gray-900">Lab Sessions</h1><p className="text-gray-600 mt-1">Manage lab sessions</p></div>
// //       {sessions.length === 0 ? (
// //         <Card><CardContent className="py-12 text-center"><Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-medium">No sessions</h3></CardContent></Card>
// //       ) : (
// //         <div className="grid gap-4">
// //           {sessions.map(session => (
// //             <Card key={session.id}>
// //               <CardContent className="py-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <div className="flex items-center gap-2"><h3 className="font-semibold">{session.name}</h3>{getStatusBadge(session.status)}</div>
// //                     <p className="text-sm text-gray-500">{session.courseCode} • {session.durationWeeks} weeks • {session.currentRegistrations}/{session.totalCapacity} registered</p>
// //                   </div>
// //                   <div className="flex gap-2">
// //                     {session.status === 'DRAFT' && <Button variant="success" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}><Play className="w-4 h-4" /></Button>}
// //                     {session.status === 'OPEN' && <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'CLOSED')}><Pause className="w-4 h-4" /></Button>}
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminSessionsPage;

// import { useEffect, useState } from 'react';
// import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, Play, Pause, Tag } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, Badge, Button, Loading, Modal, Input, Select } from '../../components/ui/index';
// import { labSessionService } from '../../services';
// import { courseService } from '../../services/courseService';
// import { LabSession, Course, SessionStatus, DEPARTMENT_OPTIONS, DAY_OF_WEEK_OPTIONS } from '../../types';

// const AdminSessionsPage = () => {
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showProgramsModal, setShowProgramsModal] = useState(false);
//   const [editingSession, setEditingSession] = useState<LabSession | null>(null);
//   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '', description: '', labRoom: '', startDate: '', endDate: '',
//     startTime: '', endTime: '', maxGroupSize: 4, maxGroups: 3, courseId: 0,
//     sessionDays: [] as string[], allowedPrograms: [] as string[], openToAllPrograms: false,
//   });

//   useEffect(() => { fetchData(); }, []);

//   const fetchData = async () => {
//     try {
//       const [sessionsData, coursesData] = await Promise.all([
//         labSessionService.getAll(),
//         courseService.getActive(),
//       ]);
//       setSessions(sessionsData);
//       setCourses(coursesData);
//     } catch { toast.error('Failed to load data'); }
//     finally { setLoading(false); }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '', description: '', labRoom: '', startDate: '', endDate: '',
//       startTime: '', endTime: '', maxGroupSize: 4, maxGroups: 3, courseId: 0,
//       sessionDays: [], allowedPrograms: [], openToAllPrograms: false,
//     });
//     setEditingSession(null);
//   };

//   const handleOpenModal = (session?: LabSession) => {
//     if (session) {
//       setEditingSession(session);
//       setFormData({
//         name: session.name,
//         description: session.description || '',
//         labRoom: session.labRoom,
//         startDate: session.startDate,
//         endDate: session.endDate,
//         startTime: session.startTime,
//         endTime: session.endTime,
//         maxGroupSize: session.maxGroupSize,
//         maxGroups: session.maxGroups,
//         courseId: session.course?.id || 0,
//         sessionDays: session.sessionDaysList || [],
//         allowedPrograms: session.allowedProgramsList || [],
//         openToAllPrograms: session.openToAllPrograms || false,
//       });
//     } else { resetForm(); }
//     setShowModal(true);
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setSaving(true);
//   //   try {
//   //     if (editingSession) {
//   //       await labSessionService.update(editingSession.id, formData);
//   //       toast.success('Session updated');
//   //     } else {
//   //       await labSessionService.create(formData);
//   //       toast.success('Session created');
//   //     }
//   //     setShowModal(false);
//   //     resetForm();
//   //     fetchData();
//   //   } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to save session'); }
//   //   finally { setSaving(false); }
//   // };


//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setSaving(true);

//   const payload = {
//     ...formData,
//     maxStudentsPerSlot: formData.maxGroupSize,
//     slotsPerDay: formData.maxGroups,
//   };

//   try {
//     if (editingSession) {
//       await labSessionService.update(editingSession.id, payload);
//       toast.success('Session updated');
//     } else {
//       await labSessionService.create(payload);
//       toast.success('Session created');
//     }
//     setShowModal(false);
//     resetForm();
//     fetchData();
//   } catch (error: any) {
//     toast.error(error.response?.data?.message || 'Failed to save session');
//   } finally {
//     setSaving(false);
//   }
// };
//   const handleStatusChange = async (session: LabSession, status: SessionStatus) => {
//     try {
//       await labSessionService.updateStatus(session.id, status);
//       toast.success(`Status changed to ${status}`);
//       fetchData();
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update status'); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this session?')) return;
//     try { await labSessionService.delete(id); toast.success('Session deleted'); fetchData(); }
//     catch (error: any) { toast.error(error.response?.data?.message || 'Failed to delete session'); }
//   };

//   const handleOpenProgramsModal = (session: LabSession) => {
//     setSelectedSession(session);
//     setFormData(prev => ({
//       ...prev,
//       allowedPrograms: session.allowedProgramsList || [],
//       openToAllPrograms: session.openToAllPrograms || false,
//     }));
//     setShowProgramsModal(true);
//   };

//   const handleUpdatePrograms = async () => {
//     if (!selectedSession) return;
//     setSaving(true);
//     try {
//       await labSessionService.updatePrograms(selectedSession.id, formData.allowedPrograms, formData.openToAllPrograms);
//       toast.success('Program access updated');
//       setShowProgramsModal(false);
//       fetchData();
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update programs'); }
//     finally { setSaving(false); }
//   };







  
//   const toggleSessionDay = (day: string) =>
//     setFormData(prev => ({
//       ...prev,
//       sessionDays: prev.sessionDays.includes(day)
//         ? prev.sessionDays.filter(d => d !== day)
//         : [...prev.sessionDays, day],
//     }));

//   const toggleProgram = (program: string) =>
//     setFormData(prev => ({
//       ...prev,
//       allowedPrograms: prev.allowedPrograms.includes(program)
//         ? prev.allowedPrograms.filter(p => p !== program)
//         : [...prev.allowedPrograms, program],
//     }));

//   const getStatusBadge = (status: SessionStatus) => {
//     const variants: Record<string, 'success' | 'default' | 'danger'> = {
//       OPEN: 'success', DRAFT: 'default', CLOSED: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const formatDateRange = (start: string, end: string) => {
//     const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     return `${s} - ${e}`;
//   };

//   if (loading) return <Loading text="Loading sessions..." />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Lab Sessions</h1>
//           <p className="text-gray-600 mt-1">Create and manage recurring lab sessions</p>
//         </div>
//         <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" />New Session</Button>
//       </div>

//       {sessions.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No sessions yet</h3>
//             <Button className="mt-4" onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" />Create Session</Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {sessions.map((session) => (
//             <Card key={session.id}>
//               <CardContent className="py-4">
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <h3 className="font-semibold text-gray-900">{session.name}</h3>
//                       {getStatusBadge(session.status)}
//                       {session.durationWeeks && session.durationWeeks > 1 && (
//                         <Badge variant="default">{session.durationWeeks} weeks</Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">{session.course?.courseCode} - {session.course?.courseName}</p>
//                     <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
//                       <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{formatDateRange(session.startDate, session.endDate)}</span>
//                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{session.startTime} - {session.endTime}</span>
//                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{session.labRoom}</span>
//                       <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{session.currentRegistrationCount}/{session.totalCapacity}</span>
//                     </div>
//                     {session.sessionDaysList && session.sessionDaysList.length > 0 && (
//                       <div className="mt-2">
//                         <span className="text-xs text-gray-500">Days: </span>
//                         {session.sessionDaysList.map(day => (
//                           <Badge key={day} variant="default" className="mr-1">{day.substring(0, 3)}</Badge>
//                         ))}
//                       </div>
//                     )}
//                     <div className="mt-2">
//                       <span className="text-xs text-gray-500">Programs: </span>
//                       {session.openToAllPrograms
//                         ? <Badge variant="success">All Programs</Badge>
//                         : session.allowedProgramsList?.length
//                           ? session.allowedProgramsList.map(prog => (
//                               <Badge key={prog} variant="default" className="mr-1">{prog}</Badge>
//                             ))
//                           : <Badge variant="warning">Not Set</Badge>}
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button variant="ghost" size="sm" onClick={() => handleOpenProgramsModal(session)}>
//                       <Tag className="w-4 h-4 mr-1" />Programs
//                     </Button>
//                     {session.status === 'DRAFT' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
//                         <Play className="w-4 h-4 mr-1" />Open
//                       </Button>
//                     )}
//                     {session.status === 'OPEN' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'CLOSED')}>
//                         <Pause className="w-4 h-4 mr-1" />Close
//                       </Button>
//                     )}
//                     {session.status === 'CLOSED' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
//                         <Play className="w-4 h-4 mr-1" />Reopen
//                       </Button>
//                     )}
//                     <Button variant="ghost" size="sm" onClick={() => handleOpenModal(session)}>
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     {session.status !== 'OPEN' && (
//                       <Button variant="danger" size="sm" onClick={() => handleDelete(session.id)}>
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Create / Edit Session Modal */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingSession ? 'Edit Session' : 'Create New Session'} size="lg">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input label="Session Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Physics Lab - Mechanics" required />
//           <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
//             <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
//             <Input label="End Time" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
//           </div>
//           <Input label="Lab Room" value={formData.labRoom} onChange={(e) => setFormData({ ...formData, labRoom: e.target.value })} required />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Max per Group" type="number" min="1" value={formData.maxGroupSize} onChange={(e) => setFormData({ ...formData, maxGroupSize: parseInt(e.target.value) })} required />
//             <Input label="Groups per Day" type="number" min="1" value={formData.maxGroups} onChange={(e) => setFormData({ ...formData, maxGroups: parseInt(e.target.value) })} required />
//           </div>
//           <Select
//             label="Course"
//             options={[{ value: '', label: 'Select Course' }, ...courses.map(c => ({ value: c.id.toString(), label: `${c.courseCode} - ${c.courseName}` }))]}
//             value={formData.courseId.toString()}
//             onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
//             required
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Session Days</label>
//             <div className="flex flex-wrap gap-2">
//               {DAY_OF_WEEK_OPTIONS.map(day => (
//                 <Button key={day.value} type="button" variant={formData.sessionDays.includes(day.value) ? 'primary' : 'secondary'} size="sm" onClick={() => toggleSessionDay(day.value)}>
//                   {day.label}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Programs</label>
//             <div className="flex items-center gap-2 mb-2">
//               <input type="checkbox" id="openToAll" checked={formData.openToAllPrograms} onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })} />
//               <label htmlFor="openToAll" className="text-sm">Open to all programs</label>
//             </div>
//             {!formData.openToAllPrograms && (
//               <div className="flex flex-wrap gap-2">
//                 {DEPARTMENT_OPTIONS.map(prog => (
//                   <Button key={prog} type="button" variant={formData.allowedPrograms.includes(prog) ? 'primary' : 'secondary'} size="sm" onClick={() => toggleProgram(prog)}>
//                     {prog}
//                   </Button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
//             <Button type="submit" isLoading={saving}>{editingSession ? 'Update' : 'Create'}</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Manage Program Access Modal */}
//       <Modal isOpen={showProgramsModal} onClose={() => setShowProgramsModal(false)} title="Manage Program Access" size="md">
//         <div className="space-y-4">
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <h4 className="font-medium">{selectedSession?.name}</h4>
//             <p className="text-sm text-gray-500">{selectedSession?.course?.courseCode}</p>
//           </div>
//           <div className="flex items-center gap-2 mb-2">
//             <input type="checkbox" id="openToAllModal" checked={formData.openToAllPrograms} onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })} />
//             <label htmlFor="openToAllModal" className="text-sm font-medium">Open to all programs</label>
//           </div>
//           {!formData.openToAllPrograms && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Select Programs</label>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {DEPARTMENT_OPTIONS.map(prog => (
//                   <label key={prog} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
//                     <input type="checkbox" checked={formData.allowedPrograms.includes(prog)} onChange={() => toggleProgram(prog)} className="mr-3" />
//                     {prog}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" onClick={() => setShowProgramsModal(false)}>Cancel</Button>
//             <Button onClick={handleUpdatePrograms} isLoading={saving}>Save Changes</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AdminSessionsPage;













































































// import { useEffect, useState } from 'react';
// import {
//   Calendar, Clock, Users, MapPin, Plus, Edit, Trash2,
//   Play, Pause, Tag, ChevronDown, ChevronUp, Zap, ToggleLeft, ToggleRight,
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, Button, Loading, Badge, Modal, Input, Select } from '../../components/ui/index';
// import { labSessionService } from '../../services';
// import { courseService } from '../../services/courseService';
// import { timeSlotService } from '../../services/TimeSlotService';
// import {
//   LabSession, Course, SessionStatus, TimeSlot,
//   DEPARTMENT_OPTIONS, DAY_OF_WEEK_OPTIONS,
// } from '../../types';

// // import { Badge } from '../../components/ui/Badge';

// const emptySlotForm = {
//   sessionDate: '', startTime: '', endTime: '', slotNumber: 1, maxStudents: 5,
// };

// const AdminSessionsPage = () => {
//   // ── Session state ──────────────────────────────────────────────────────────
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showProgramsModal, setShowProgramsModal] = useState(false);
//   const [editingSession, setEditingSession] = useState<LabSession | null>(null);
//   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '', description: '', labRoom: '', startDate: '', endDate: '',
//     startTime: '', endTime: '', maxGroupSize: 4, maxGroups: 3, courseId: 0,
//     sessionDays: [] as string[], allowedPrograms: [] as string[], openToAllPrograms: false,
//   });

//   // ── Time slot state ────────────────────────────────────────────────────────
//   const [expandedSession, setExpandedSession] = useState<number | null>(null);
//   const [slotsBySession, setSlotsBySession] = useState<Record<number, TimeSlot[]>>({});
//   const [loadingSlots, setLoadingSlots] = useState<number | null>(null);

//   const [showSlotModal, setShowSlotModal] = useState(false);
//   const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
//   const [slotSessionId, setSlotSessionId] = useState<number | null>(null);
//   const [slotForm, setSlotForm] = useState(emptySlotForm);
//   const [savingSlot, setSavingSlot] = useState(false);

//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [bulkSessionId, setBulkSessionId] = useState<number | null>(null);
//   const [bulkForm, setBulkForm] = useState({ startTime: '', endTime: '', maxStudents: 5, numberOfSlots: 3 });
//   const [savingBulk, setSavingBulk] = useState(false);

//   // ── Init ───────────────────────────────────────────────────────────────────
//   useEffect(() => { fetchData(); }, []);

//   const fetchData = async () => {
//     try {
//       const [sessionsData, coursesData] = await Promise.all([
//         labSessionService.getAll(),
//         courseService.getActive(),
//       ]);
//       setSessions(sessionsData);
//       setCourses(coursesData);
//     } catch { toast.error('Failed to load data'); }
//     finally { setLoading(false); }
//   };

//   // ── Session CRUD ───────────────────────────────────────────────────────────
//   const resetForm = () => {
//     setFormData({
//       name: '', description: '', labRoom: '', startDate: '', endDate: '',
//       startTime: '', endTime: '', maxGroupSize: 4, maxGroups: 3, courseId: 0,
//       sessionDays: [], allowedPrograms: [], openToAllPrograms: false,
//     });
//     setEditingSession(null);
//   };

//   const handleOpenModal = (session?: LabSession) => {
//     if (session) {
//       setEditingSession(session);
//       setFormData({
//         name: session.name, description: session.description || '',
//         labRoom: session.labRoom, startDate: session.startDate, endDate: session.endDate,
//         startTime: session.startTime, endTime: session.endTime,
//         maxGroupSize: session.maxGroupSize, maxGroups: session.maxGroups,
//         courseId: session.course?.id || 0,
//         sessionDays: session.sessionDaysList || [],
//         allowedPrograms: session.allowedProgramsList || [],
//         openToAllPrograms: session.openToAllPrograms || false,
//       });
//     } else { resetForm(); }
//     setShowModal(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); setSaving(true);
//     try {
//       if (editingSession) {
//         await labSessionService.update(editingSession.id, formData); toast.success('Session updated');
//       } else {
//         await labSessionService.create(formData); toast.success('Session created');
//       }
//       setShowModal(false); resetForm(); fetchData();
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to save session'); }
//     finally { setSaving(false); }
//   };

//   const handleStatusChange = async (session: LabSession, status: SessionStatus) => {
//     try {
//       await labSessionService.updateStatus(session.id, status);
//       toast.success(`Status changed to ${status}`); fetchData();
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update status'); }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this session?')) return;
//     try { await labSessionService.delete(id); toast.success('Session deleted'); fetchData(); }
//     catch (error: any) { toast.error(error.response?.data?.message || 'Failed to delete session'); }
//   };

//   const handleOpenProgramsModal = (session: LabSession) => {
//     setSelectedSession(session);
//     setFormData(prev => ({
//       ...prev,
//       allowedPrograms: session.allowedProgramsList || [],
//       openToAllPrograms: session.openToAllPrograms || false,
//     }));
//     setShowProgramsModal(true);
//   };

//   const handleUpdatePrograms = async () => {
//     if (!selectedSession) return; setSaving(true);
//     try {
//       await labSessionService.updatePrograms(selectedSession.id, formData.allowedPrograms, formData.openToAllPrograms);
//       toast.success('Program access updated'); setShowProgramsModal(false); fetchData();
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update programs'); }
//     finally { setSaving(false); }
//   };

//   const toggleSessionDay = (day: string) =>
//     setFormData(prev => ({
//       ...prev,
//       sessionDays: prev.sessionDays.includes(day)
//         ? prev.sessionDays.filter(d => d !== day) : [...prev.sessionDays, day],
//     }));

//   const toggleProgram = (program: string) =>
//     setFormData(prev => ({
//       ...prev,
//       allowedPrograms: prev.allowedPrograms.includes(program)
//         ? prev.allowedPrograms.filter(p => p !== program) : [...prev.allowedPrograms, program],
//     }));

//   // ── Slot panel ─────────────────────────────────────────────────────────────
//   const handleToggleSlots = async (sessionId: number) => {
//     if (expandedSession === sessionId) { setExpandedSession(null); return; }
//     setExpandedSession(sessionId);
//     if (slotsBySession[sessionId]) return;
//     setLoadingSlots(sessionId);
//     try {
//       const slots = await timeSlotService.getBySession(sessionId);
//       setSlotsBySession(prev => ({ ...prev, [sessionId]: slots }));
//     } catch { toast.error('Failed to load time slots'); }
//     finally { setLoadingSlots(null); }
//   };

//   const refreshSlots = async (sessionId: number) => {
//     try {
//       const slots = await timeSlotService.getBySession(sessionId);
//       setSlotsBySession(prev => ({ ...prev, [sessionId]: slots }));
//     } catch { toast.error('Failed to refresh slots'); }
//   };

//   // ── Single slot ────────────────────────────────────────────────────────────
//   const handleOpenSlotModal = (sessionId: number, slot?: TimeSlot) => {
//     setSlotSessionId(sessionId);
//     if (slot) {
//       setEditingSlot(slot);
//       setSlotForm({
//         sessionDate: slot.sessionDate, startTime: slot.startTime,
//         endTime: slot.endTime, slotNumber: slot.slotNumber, maxStudents: slot.maxStudents,
//       });
//     } else {
//       setEditingSlot(null); setSlotForm(emptySlotForm);
//     }
//     setShowSlotModal(true);
//   };

//   const handleSaveSlot = async (e: React.FormEvent) => {
//     e.preventDefault(); if (!slotSessionId) return; setSavingSlot(true);
//     try {
//       if (editingSlot) {
//         await timeSlotService.update(editingSlot.id, slotForm); toast.success('Slot updated');
//       } else {
//         await timeSlotService.create(slotSessionId, slotForm); toast.success('Slot added');
//       }
//       setShowSlotModal(false); await refreshSlots(slotSessionId);
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to save slot'); }
//     finally { setSavingSlot(false); }
//   };

//   const handleDeleteSlot = async (sessionId: number, slotId: number) => {
//     if (!confirm('Delete this time slot?')) return;
//     try { await timeSlotService.delete(slotId); toast.success('Slot deleted'); await refreshSlots(sessionId); }
//     catch (error: any) { toast.error(error.response?.data?.message || 'Failed to delete slot'); }
//   };

//   const handleToggleActive = async (sessionId: number, slotId: number) => {
//     try { await timeSlotService.toggleActive(slotId); await refreshSlots(sessionId); }
//     catch (error: any) { toast.error(error.response?.data?.message || 'Failed to toggle slot'); }
//   };

//   // ── Bulk generate ──────────────────────────────────────────────────────────
//   const handleOpenBulkModal = (sessionId: number) => {
//     setBulkSessionId(sessionId);
//     setBulkForm({ startTime: '', endTime: '', maxStudents: 5, numberOfSlots: 3 });
//     setShowBulkModal(true);
//   };

//   const handleBulkGenerate = async (e: React.FormEvent) => {
//     e.preventDefault(); if (!bulkSessionId) return;
//     const session = sessions.find(s => s.id === bulkSessionId);
//     if (!session) return;
//     setSavingBulk(true);
//     try {
//       const start = new Date(session.startDate);
//       const end = new Date(session.endDate);
//       const days = session.sessionDaysList || [];
//       const dayNames = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
//       const requests: any[] = [];

//       for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//         const dayName = dayNames[d.getDay()];
//         if (days.includes(dayName)) {
//           for (let s = 1; s <= bulkForm.numberOfSlots; s++) {
//             requests.push({
//               sessionDate: d.toISOString().split('T')[0],
//               startTime: bulkForm.startTime,
//               endTime: bulkForm.endTime,
//               slotNumber: s,
//               maxStudents: bulkForm.maxStudents,
//             });
//           }
//         }
//       }

//       if (requests.length === 0) {
//         toast.error('No matching session days found in the date range'); return;
//       }

//       await timeSlotService.createBulk(bulkSessionId, requests);
//       toast.success(`${requests.length} slots generated`);
//       setShowBulkModal(false); await refreshSlots(bulkSessionId);
//     } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to generate slots'); }
//     finally { setSavingBulk(false); }
//   };

//   // ── Helpers ────────────────────────────────────────────────────────────────
//   const getStatusBadge = (status: SessionStatus) => {
//     const variants: Record<string, 'success' | 'default' | 'danger'> = {
//       OPEN: 'success', DRAFT: 'default', CLOSED: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const formatDateRange = (start: string, end: string) => {
//     const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     return `${s} - ${e}`;
//   };

//   const groupSlotsByDate = (slots: TimeSlot[]) => {
//     const map = new Map<string, TimeSlot[]>();
//     slots.forEach(slot => {
//       if (!map.has(slot.sessionDate)) map.set(slot.sessionDate, []);
//       map.get(slot.sessionDate)!.push(slot);
//     });
//     return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
//   };

//   if (loading) return <Loading text="Loading sessions..." />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Lab Sessions</h1>
//           <p className="text-gray-600 mt-1">Create and manage recurring lab sessions</p>
//         </div>
//         <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" />New Session</Button>
//       </div>

//       {sessions.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No sessions yet</h3>
//             <Button className="mt-4" onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" />Create Session</Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4 ">
//           {sessions.map((session) => (
//             <Card key={session.id}>
//               {/* ── Session row ───────────────────────────────────────────── */}
//               <CardContent className="py-4">
//                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <h3 className="font-semibold text-gray-900">{session.name}</h3>
//                       {getStatusBadge(session.status)}
//                       {session.durationWeeks && session.durationWeeks > 1 && (
//                         <Badge variant="default">{session.durationWeeks} week(s)</Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">{session.course?.courseCode} - {session.course?.courseName}</p>
//                     <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
//                       <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{formatDateRange(session.startDate, session.endDate)}</span>
//                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{session.startTime} - {session.endTime}</span>
//                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{session.labRoom}</span>
//                       <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{session.currentRegistrationCount}/{session.totalCapacity}</span>
//                     </div>
//                     {session.sessionDaysList && session.sessionDaysList.length > 0 && (
//                       <div className="mt-2">
//                         <span className="text-xs text-gray-500">Days: </span>
//                         {session.sessionDaysList.map(day => (
//                           <Badge key={day} variant="default" className="mr-1">{day.substring(0, 3)}</Badge>
//                         ))}
//                       </div>
//                     )}
//                     <div className="mt-2">
//                       <span className="text-xs text-gray-500">Programs: </span>
//                       {session.openToAllPrograms
//                         ? <Badge variant="success">All Programs</Badge>
//                         : session.allowedProgramsList?.length
//                           ? session.allowedProgramsList.map(prog => (
//                               <Badge key={prog} variant="default" className="mr-1">{prog}</Badge>
//                             ))
//                           : <Badge variant="warning">Not Set</Badge>}
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button
//                       variant="ghost" size="sm"
//                       onClick={() => handleToggleSlots(session.id)}
//                       className="text-blue-600"
//                     >
//                       <Clock className="w-4 h-4 mr-1" />
//                       Time Slots
//                       {expandedSession === session.id
//                         ? <ChevronUp className="w-4 h-4 ml-1" />
//                         : <ChevronDown className="w-4 h-4 ml-1" />}
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => handleOpenProgramsModal(session)}>
//                       <Tag className="w-4 h-4 mr-1" />Programs
//                     </Button>
//                     {session.status === 'DRAFT' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
//                         <Play className="w-4 h-4 mr-1" />Open
//                       </Button>
//                     )}
//                     {session.status === 'OPEN' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'CLOSED')}>
//                         <Pause className="w-4 h-4 mr-1" />Close
//                       </Button>
//                     )}
//                     {session.status === 'CLOSED' && (
//                       <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
//                         <Play className="w-4 h-4 mr-1" />Reopen
//                       </Button>
//                     )}
//                     <Button variant="ghost" size="sm" onClick={() => handleOpenModal(session)}>
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     {session.status !== 'OPEN' && (
//                       <Button variant="danger" size="sm" onClick={() => handleDelete(session.id)}>
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>

//               {/* ── Collapsible time slots panel ──────────────────────────── */}
//               {expandedSession === session.id && (
//                 <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl px-6 py-4">
//                   {/* Panel header */}
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="text-sm font-semibold text-gray-700 flex items-center">
//                       <Clock className="w-4 h-4 mr-2 text-blue-500" />
//                       Time Slots
//                       {slotsBySession[session.id] && (
//                         <span className="ml-2 text-xs font-normal text-gray-400">
//                           ({slotsBySession[session.id].length} total)
//                         </span>
//                       )}
//                     </h4>
//                     <div className="flex gap-2">
//                       <Button variant="secondary" size="sm" onClick={() => handleOpenBulkModal(session.id)}>
//                         <Zap className="w-4 h-4 mr-1" />Bulk Generate
//                       </Button>
//                       <Button size="sm" onClick={() => handleOpenSlotModal(session.id)}>
//                         <Plus className="w-4 h-4 mr-1" />Add Slot
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Slot list */}
//                   {loadingSlots === session.id ? (
//                     <Loading text="Loading slots..." />
//                   ) : !slotsBySession[session.id] || slotsBySession[session.id].length === 0 ? (
//                     <div className="text-center py-8 text-gray-400">
//                       <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
//                       <p className="text-sm">No time slots yet — add one manually or use Bulk Generate.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {groupSlotsByDate(slotsBySession[session.id]).map(([date, slots]) => (
//                         <div key={date}>
//                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
//                             {new Date(date).toLocaleDateString('en-US', {
//                               weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
//                             })}
//                           </p>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//                             {slots.sort((a, b) => a.slotNumber - b.slotNumber).map(slot => (
//                               <div
//                                 key={slot.id}
//                                 className={`flex items-center justify-between p-3 rounded-lg border ${
//                                   slot.active
//                                     ? 'bg-white border-gray-500'
//                                     : 'bg-red-900 border-gray-300 opacity-60 '
//                                 }`}
//                               >
//                                 <div className="min-w-0">
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-xs font-bold text-blue-600">Slot #{slot.slotNumber}</span>
//                                     {!slot.active && <Badge variant="default">Inactive</Badge>}
//                                     {slot.currentCount >= slot.maxStudents && <Badge variant="danger">Full</Badge>}
//                                   </div>
//                                   <p className="text-sm font-medium text-gray-800 mt-0.5">
//                                     {slot.startTime} – {slot.endTime}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {slot.currentCount}/{slot.maxStudents} students
//                                   </p>
//                                 </div>
//                                 <div className="flex items-center gap-1 ml-2 flex-shrink-0">
//                                   <button
//                                     onClick={() => handleToggleActive(session.id, slot.id)}
//                                     title={slot.active ? 'Deactivate' : 'Activate'}
//                                     className="p-1 rounded hover:bg-gray-100"
//                                   >
//                                     {slot.active
//                                       ? <ToggleRight className="w-5 h-5 text-green-500" />
//                                       : <ToggleLeft className="w-5 h-5 text-gray-400" />}
//                                   </button>
//                                   <button
//                                     onClick={() => handleOpenSlotModal(session.id, slot)}
//                                     title="Edit slot"
//                                     className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
//                                   >
//                                     <Edit className="w-4 h-4" />
//                                   </button>
//                                   <button
//                                     onClick={() => handleDeleteSlot(session.id, slot.id)}
//                                     disabled={slot.currentCount > 0}
//                                     title={slot.currentCount > 0 ? 'Cannot delete — has registrations' : 'Delete slot'}
//                                     className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ── Create / Edit Session Modal ─────────────────────────────────────── */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingSession ? 'Edit Session' : 'Create New Session'} size="lg">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input label="Session Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Physics Lab - Mechanics" required />
//           <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
//             <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
//             <Input label="End Time" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
//           </div>
//           <Input label="Lab Room" value={formData.labRoom} onChange={(e) => setFormData({ ...formData, labRoom: e.target.value })} required />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Max per Group" type="number" min="1" value={formData.maxGroupSize} onChange={(e) => setFormData({ ...formData, maxGroupSize: parseInt(e.target.value) })} required />
//             <Input label="Groups per Day" type="number" min="1" value={formData.maxGroups} onChange={(e) => setFormData({ ...formData, maxGroups: parseInt(e.target.value) })} required />
//           </div>
//           <Select
//             label="Course"
//             options={[{ value: '', label: 'Select Course' }, ...courses.map(c => ({ value: c.id.toString(), label: `${c.courseCode} - ${c.courseName}` }))]}
//             value={formData.courseId.toString()}
//             onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
//             required
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Session Days</label>
//             <div className="flex flex-wrap gap-2">
//               {DAY_OF_WEEK_OPTIONS.map(day => (
//                 <Button key={day.value} type="button" variant={formData.sessionDays.includes(day.value) ? 'primary' : 'secondary'} size="sm" onClick={() => toggleSessionDay(day.value)}>
//                   {day.label}
//                 </Button>
//               ))}
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Programs</label>
//             <div className="flex items-center gap-2 mb-2">
//               <input type="checkbox" id="openToAll" checked={formData.openToAllPrograms} onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })} />
//               <label htmlFor="openToAll" className="text-sm">Open to all programs</label>
//             </div>
//             {!formData.openToAllPrograms && (
//               <div className="flex flex-wrap gap-2">
//                 {DEPARTMENT_OPTIONS.map(prog => (
//                   <Button key={prog} type="button" variant={formData.allowedPrograms.includes(prog) ? 'primary' : 'secondary'} size="sm" onClick={() => toggleProgram(prog)}>
//                     {prog}
//                   </Button>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
//             <Button type="submit" isLoading={saving}>{editingSession ? 'Update' : 'Create'}</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* ── Programs Modal ──────────────────────────────────────────────────── */}
//       <Modal isOpen={showProgramsModal} onClose={() => setShowProgramsModal(false)} title="Manage Program Access" size="md">
//         <div className="space-y-4">
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <h4 className="font-medium">{selectedSession?.name}</h4>
//             <p className="text-sm text-gray-500">{selectedSession?.course?.courseCode}</p>
//           </div>
//           <div className="flex items-center gap-2 mb-2">
//             <input type="checkbox" id="openToAllModal" checked={formData.openToAllPrograms} onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })} />
//             <label htmlFor="openToAllModal" className="text-sm font-medium">Open to all programs</label>
//           </div>
//           {!formData.openToAllPrograms && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Select Programs</label>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {DEPARTMENT_OPTIONS.map(prog => (
//                   <label key={prog} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
//                     <input type="checkbox" checked={formData.allowedPrograms.includes(prog)} onChange={() => toggleProgram(prog)} className="mr-3" />
//                     {prog}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" onClick={() => setShowProgramsModal(false)}>Cancel</Button>
//             <Button onClick={handleUpdatePrograms} isLoading={saving}>Save Changes</Button>
//           </div>
//         </div>
//       </Modal>

//       {/* ── Add / Edit Single Slot Modal ────────────────────────────────────── */}
//       <Modal isOpen={showSlotModal} onClose={() => setShowSlotModal(false)} title={editingSlot ? 'Edit Time Slot' : 'Add Time Slot'} size="sm">
//         <form onSubmit={handleSaveSlot} className="space-y-4">
//           <Input label="Session Date" type="date" value={slotForm.sessionDate} onChange={(e) => setSlotForm({ ...slotForm, sessionDate: e.target.value })} required />
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Start Time" type="time" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />
//             <Input label="End Time" type="time" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Slot Number" type="number" min="1" value={slotForm.slotNumber} onChange={(e) => setSlotForm({ ...slotForm, slotNumber: parseInt(e.target.value) })} required />
//             <Input label="Max Students" type="number" min="1" value={slotForm.maxStudents} onChange={(e) => setSlotForm({ ...slotForm, maxStudents: parseInt(e.target.value) })} required />
//           </div>
//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" type="button" onClick={() => setShowSlotModal(false)}>Cancel</Button>
//             <Button type="submit" isLoading={savingSlot}>{editingSlot ? 'Update Slot' : 'Add Slot'}</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* ── Bulk Generate Modal ─────────────────────────────────────────────── */}
//       <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Generate Time Slots" size="sm">
//         {bulkSessionId && (() => {
//           const session = sessions.find(s => s.id === bulkSessionId);
//           return (
//             <form onSubmit={handleBulkGenerate} className="space-y-4">
//               <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
//                 <p className="font-medium">{session?.name}</p>
//                 <p className="mt-1 text-blue-600">
//                   Slots will be created for every{' '}
//                   <strong>{session?.sessionDaysList?.map(d => d.substring(0, 3)).join(', ')}</strong>{' '}
//                   between <strong>{session?.startDate}</strong> and <strong>{session?.endDate}</strong>.
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <Input label="Start Time" type="time" value={bulkForm.startTime} onChange={(e) => setBulkForm({ ...bulkForm, startTime: e.target.value })} required />
//                 <Input label="End Time" type="time" value={bulkForm.endTime} onChange={(e) => setBulkForm({ ...bulkForm, endTime: e.target.value })} required />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <Input label="Slots per Day" type="number" min="1" max="10" value={bulkForm.numberOfSlots} onChange={(e) => setBulkForm({ ...bulkForm, numberOfSlots: parseInt(e.target.value) })} required />
//                 <Input label="Max Students / Slot" type="number" min="1" value={bulkForm.maxStudents} onChange={(e) => setBulkForm({ ...bulkForm, maxStudents: parseInt(e.target.value) })} required />
//               </div>
//               <div className="flex justify-end space-x-3 pt-4 border-t">
//                 <Button variant="secondary" type="button" onClick={() => setShowBulkModal(false)}>Cancel</Button>
//                 <Button type="submit" isLoading={savingBulk}>
//                   <Zap className="w-4 h-4 mr-1" />Generate Slots
//                 </Button>
//               </div>
//             </form>
//           );
//         })()}
//       </Modal>
//     </div>
//   );
// };

// export default AdminSessionsPage;





































import { useEffect, useState } from 'react';
import {
  Calendar, Clock, Users, MapPin, Plus, Edit, Trash2,
  Play, Pause, Tag, ChevronDown, ChevronUp, Zap, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Card, CardContent, Button, Loading, Badge, Modal, Input, Select,
} from '../../components/ui/index';
import { labSessionService } from '../../services';
import { courseService } from '../../services/courseService';
import { timeSlotService } from '../../services/TimeSlotService';
import {
  LabSession, Course, SessionStatus, TimeSlot,
  DEPARTMENT_OPTIONS, DAY_OF_WEEK_OPTIONS,
} from '../../types';

// ── Constants ────────────────────────────────────────────────────────────────

const emptySlotForm = {
  sessionDate: '',
  startTime: '',
  endTime: '',
  slotNumber: 1,
  maxStudents: 5,
};

const emptyForm = {
  name: '',
  description: '',
  labRoom: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  maxGroupSize: 4,
  maxGroups: 3,
  slotsPerDay: 3,          // ← was missing
  maxStudentsPerSlot: 5,   // ← was missing
  courseId: 0,
  sessionDays: [] as string[],
  allowedPrograms: [] as string[],
  openToAllPrograms: false,
};

// ── Component ────────────────────────────────────────────────────────────────

const AdminSessionsPage = () => {

  // ── Session state ──────────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProgramsModal, setShowProgramsModal] = useState(false);
  const [editingSession, setEditingSession] = useState<LabSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  // ── Time slot state ────────────────────────────────────────────────────────
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [slotsBySession, setSlotsBySession] = useState<Record<number, TimeSlot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState<number | null>(null);

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotSessionId, setSlotSessionId] = useState<number | null>(null);
  const [slotForm, setSlotForm] = useState({ ...emptySlotForm });
  const [savingSlot, setSavingSlot] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSessionId, setBulkSessionId] = useState<number | null>(null);
  const [bulkForm, setBulkForm] = useState({
    startTime: '', endTime: '', maxStudents: 5, numberOfSlots: 3,
  });
  const [savingBulk, setSavingBulk] = useState(false);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, coursesData] = await Promise.all([
        labSessionService.getAll(),
        courseService.getActive(),
      ]);
      setSessions(sessionsData);
      setCourses(coursesData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ── Session CRUD ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingSession(null);
  };

  const handleOpenModal = (session?: LabSession) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        name: session.name,
        description: session.description || '',
        labRoom: session.labRoom,
        startDate: session.startDate,
        endDate: session.endDate,
        startTime: session.startTime,
        endTime: session.endTime,
        maxGroupSize: session.maxGroupSize,
        maxGroups: session.maxGroups,
        slotsPerDay: session.slotsPerDay ?? 1,           // ← was missing
        maxStudentsPerSlot: session.maxStudentsPerSlot ?? 1, // ← was missing
        courseId: session.course?.id || 0,
        sessionDays: session.sessionDaysList || [],
        allowedPrograms: session.allowedProgramsList || [],
        openToAllPrograms: session.openToAllPrograms || false,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side guard — belt-and-suspenders on top of backend validation
    if (!formData.slotsPerDay || formData.slotsPerDay < 1) {
      toast.error('Slots per day must be at least 1');
      return;
    }
    if (!formData.maxStudentsPerSlot || formData.maxStudentsPerSlot < 1) {
      toast.error('Max students per slot must be at least 1');
      return;
    }
    if (formData.sessionDays.length === 0) {
      toast.error('Please select at least one session day');
      return;
    }

    setSaving(true);
    try {
      if (editingSession) {
        await labSessionService.update(editingSession.id, formData);
        toast.success('Session updated');
      } else {
        await labSessionService.create(formData);
        toast.success('Session created');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (session: LabSession, status: SessionStatus) => {
    try {
      await labSessionService.updateStatus(session.id, status);
      toast.success(`Status changed to ${status}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await labSessionService.delete(id);
      toast.success('Session deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete session');
    }
  };

  const handleOpenProgramsModal = (session: LabSession) => {
    setSelectedSession(session);
    setFormData(prev => ({
      ...prev,
      allowedPrograms: session.allowedProgramsList || [],
      openToAllPrograms: session.openToAllPrograms || false,
    }));
    setShowProgramsModal(true);
  };

  const handleUpdatePrograms = async () => {
    if (!selectedSession) return;
    setSaving(true);
    try {
      await labSessionService.updatePrograms(
        selectedSession.id,
        formData.allowedPrograms,
        formData.openToAllPrograms,
      );
      toast.success('Program access updated');
      setShowProgramsModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update programs');
    } finally {
      setSaving(false);
    }
  };

  const toggleSessionDay = (day: string) =>
    setFormData(prev => ({
      ...prev,
      sessionDays: prev.sessionDays.includes(day)
        ? prev.sessionDays.filter(d => d !== day)
        : [...prev.sessionDays, day],
    }));

  const toggleProgram = (program: string) =>
    setFormData(prev => ({
      ...prev,
      allowedPrograms: prev.allowedPrograms.includes(program)
        ? prev.allowedPrograms.filter(p => p !== program)
        : [...prev.allowedPrograms, program],
    }));

  // ── Slot panel ─────────────────────────────────────────────────────────────
  const handleToggleSlots = async (sessionId: number) => {
    if (expandedSession === sessionId) { setExpandedSession(null); return; }
    setExpandedSession(sessionId);
    if (slotsBySession[sessionId]) return;
    setLoadingSlots(sessionId);
    try {
      const slots = await timeSlotService.getBySession(sessionId);
      setSlotsBySession(prev => ({ ...prev, [sessionId]: slots }));
    } catch {
      toast.error('Failed to load time slots');
    } finally {
      setLoadingSlots(null);
    }
  };

  const refreshSlots = async (sessionId: number) => {
    try {
      const slots = await timeSlotService.getBySession(sessionId);
      setSlotsBySession(prev => ({ ...prev, [sessionId]: slots }));
    } catch {
      toast.error('Failed to refresh slots');
    }
  };

  // ── Single slot ────────────────────────────────────────────────────────────
  const handleOpenSlotModal = (sessionId: number, slot?: TimeSlot) => {
    setSlotSessionId(sessionId);
    if (slot) {
      setEditingSlot(slot);
      setSlotForm({
        sessionDate: slot.sessionDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotNumber: slot.slotNumber,
        maxStudents: slot.maxStudents,
      });
    } else {
      setEditingSlot(null);
      setSlotForm({ ...emptySlotForm });
    }
    setShowSlotModal(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSessionId) return;
    setSavingSlot(true);
    try {
      if (editingSlot) {
        await timeSlotService.update(editingSlot.id, slotForm);
        toast.success('Slot updated');
      } else {
        await timeSlotService.create(slotSessionId, slotForm);
        toast.success('Slot added');
      }
      setShowSlotModal(false);
      await refreshSlots(slotSessionId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save slot');
    } finally {
      setSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (sessionId: number, slotId: number) => {
    if (!confirm('Delete this time slot?')) return;
    try {
      await timeSlotService.delete(slotId);
      toast.success('Slot deleted');
      await refreshSlots(sessionId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete slot');
    }
  };

  const handleToggleActive = async (sessionId: number, slotId: number) => {
    try {
      await timeSlotService.toggleActive(slotId);
      await refreshSlots(sessionId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to toggle slot');
    }
  };

  // ── Bulk generate ──────────────────────────────────────────────────────────
  const handleOpenBulkModal = (sessionId: number) => {
    setBulkSessionId(sessionId);
    setBulkForm({ startTime: '', endTime: '', maxStudents: 5, numberOfSlots: 3 });
    setShowBulkModal(true);
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkSessionId) return;
    const session = sessions.find(s => s.id === bulkSessionId);
    if (!session) return;
    setSavingBulk(true);
    try {
      const start = new Date(session.startDate + 'T00:00:00'); // ← timezone fix
      const end   = new Date(session.endDate   + 'T00:00:00'); // ← timezone fix
      const days  = session.sessionDaysList || [];
      const dayNames = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
      const requests: any[] = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayName = dayNames[d.getDay()];
        if (days.includes(dayName)) {
          for (let i = 1; i <= bulkForm.numberOfSlots; i++) {
            requests.push({
              sessionDate: d.toISOString().split('T')[0],
              startTime:   bulkForm.startTime,
              endTime:     bulkForm.endTime,
              slotNumber:  i,
              maxStudents: bulkForm.maxStudents,
            });
          }
        }
      }

      if (requests.length === 0) {
        toast.error('No matching session days found in the date range');
        return;
      }

      await timeSlotService.createBulk(bulkSessionId, requests);
      toast.success(`${requests.length} slots generated`);
      setShowBulkModal(false);
      await refreshSlots(bulkSessionId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate slots');
    } finally {
      setSavingBulk(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getStatusBadge = (status: SessionStatus) => {
    const variants: Record<string, 'success' | 'default' | 'danger' | 'warning'> = {
      OPEN: 'success',
      DRAFT: 'default',
      CLOSED: 'danger',
      CANCELLED: 'danger',
      COMPLETED: 'warning',
    };
    return <Badge variant={variants[status] ?? 'default'}>{status}</Badge>;
  };

  // ← timezone fix: append T00:00:00 so Date parses in local time
  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(end   + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} – ${e}`;
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const map = new Map<string, TimeSlot[]>();
    slots.forEach(slot => {
      if (!map.has(slot.sessionDate)) map.set(slot.sessionDate, []);
      map.get(slot.sessionDate)!.push(slot);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <Loading text="Loading sessions..." />;

  return (
    <div className="space-y-6">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Sessions</h1>
          <p className="text-gray-600 mt-1">Create and manage recurring lab sessions</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />New Session
        </Button>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No sessions yet</h3>
            <Button className="mt-4" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />Create Session
            </Button>
          </CardContent>
        </Card>
      ) : (

        /* ── Session list ─────────────────────────────────────────────────── */
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>

              {/* ── Session row ─────────────────────────────────────────── */}
              <CardContent className="py-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{session.name}</h3>
                      {getStatusBadge(session.status)}
                      {session.durationWeeks && session.durationWeeks > 1 && (
                        <Badge variant="default">{session.durationWeeks} week(s)</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {session.course?.courseCode} – {session.course?.courseName}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateRange(session.startDate, session.endDate)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.startTime} – {session.endTime}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />{session.labRoom}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {session.currentRegistrationCount}/{session.totalCapacity}
                      </span>
                    </div>
                    {session.sessionDaysList && session.sessionDaysList.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Days: </span>
                        {session.sessionDaysList.map(day => (
                          <Badge key={day} variant="default" className="mr-1">
                            {day.substring(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Programs: </span>
                      {session.openToAllPrograms
                        ? <Badge variant="success">All Programs</Badge>
                        : session.allowedProgramsList?.length
                          ? session.allowedProgramsList.map(prog => (
                              <Badge key={prog} variant="default" className="mr-1">{prog}</Badge>
                            ))
                          : <Badge variant="warning">Not Set</Badge>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleToggleSlots(session.id)}
                      className="text-blue-600"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Groups
                      {expandedSession === session.id
                        ? <ChevronUp className="w-4 h-4 ml-1" />
                        : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleOpenProgramsModal(session)}>
                      <Tag className="w-4 h-4 mr-1" />Programs
                    </Button>

                    {session.status === 'DRAFT' && (
                      <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
                        <Play className="w-4 h-4 mr-1" />Open
                      </Button>
                    )}
                    {session.status === 'OPEN' && (
                      <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'CLOSED')}>
                        <Pause className="w-4 h-4 mr-1" />Close
                      </Button>
                    )}
                    {session.status === 'CLOSED' && (
                      <Button variant="secondary" size="sm" onClick={() => handleStatusChange(session, 'OPEN')}>
                        <Play className="w-4 h-4 mr-1" />Reopen
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(session)}>
                      <Edit className="w-4 h-4" />
                    </Button>

                    {session.status !== 'OPEN' && (
                      <Button variant="danger" size="sm" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* ── Collapsible time slots panel ──────────────────────────── */}
              {expandedSession === session.id && (
                <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl px-6 py-4">

                  {/* Panel header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      Groups
                      {slotsBySession[session.id] && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          ({slotsBySession[session.id].length} total)
                        </span>
                      )}
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenBulkModal(session.id)}>
                        <Zap className="w-4 h-4 mr-1" />Bulk Generate
                      </Button>
                      <Button size="sm" onClick={() => handleOpenSlotModal(session.id)}>
                        <Plus className="w-4 h-4 mr-1" />Add Group
                      </Button>
                    </div>
                  </div>

                  {/* Slot list */}
                  {loadingSlots === session.id ? (
                    <Loading text="Loading groups..." />
                  ) : !slotsBySession[session.id] || slotsBySession[session.id].length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No groups yet — add one manually or use Bulk Generate.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupSlotsByDate(slotsBySession[session.id]).map(([date, slots]) => (
                        <div key={date}>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {/* ← timezone fix */}
                            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {slots.sort((a, b) => a.groupNumber - b.groupNumber).map(slot => (
                              <div
                                key={slot.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-opacity ${
                                  slot.active
                                    ? 'bg-white border-gray-700'
                                    : 'bg-red-300 border-red-800 opacity-70' // ← fixed dark red bg
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-blue-600">
                                      Group #{slot.slotNumber}
                                    </span>
                                    {!slot.active && (
                                      <Badge variant="default">Inactive</Badge>
                                    )}
                                    {slot.currentCount >= slot.maxStudents && (
                                      <Badge variant="danger">Full</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                                    {slot.startTime} – {slot.endTime}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {slot.currentCount}/{slot.maxStudents} students
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleToggleActive(session.id, slot.id)}
                                    title={slot.active ? 'Deactivate' : 'Activate'}
                                    className="p-1 rounded hover:bg-gray-100"
                                  >
                                    {slot.active
                                      ? <ToggleRight className="w-5 h-5 text-green-500" />
                                      : <ToggleLeft  className="w-5 h-5 text-gray-400" />}
                                  </button>
                                  <button
                                    onClick={() => handleOpenSlotModal(session.id, slot)}
                                    title="Edit slot"
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(session.id, slot.id)}
                                    disabled={slot.currentCount > 0}
                                    title={slot.currentCount > 0 ? 'Cannot delete — has registrations' : 'Delete slot'}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Create / Edit Session Modal ────────────────────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingSession ? 'Edit Session' : 'Create New Session'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Session Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Physics Lab – Mechanics"
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            <Input label="End Date" type="date" value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
            <Input label="End Time" type="time" value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
          </div>

          <Input
            label="Lab Room"
            value={formData.labRoom}
            onChange={(e) => setFormData({ ...formData, labRoom: e.target.value })}
            required
          />

          {/* ← was missing these two fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Groups per Day"
              type="number" min="1"
              value={formData.slotsPerDay}
              onChange={(e) => setFormData({ ...formData, slotsPerDay: parseInt(e.target.value) || 1 })}
              required
            />
            <Input
              label="Max Students per Group"
              type="number" min="1"
              value={formData.maxStudentsPerSlot}
              onChange={(e) => setFormData({ ...formData, maxStudentsPerSlot: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max per Group"
              type="number" min="1"
              value={formData.maxGroupSize}
              onChange={(e) => setFormData({ ...formData, maxGroupSize: parseInt(e.target.value) || 1 })}
              required
            />
            <Input
              label="Groups per Day"
              type="number" min="1"
              value={formData.maxGroups}
              onChange={(e) => setFormData({ ...formData, maxGroups: parseInt(e.target.value) || 1 })}
              required
            />
          </div> */}

          <Select
            label="Course"
            options={[
              { value: '', label: 'Select Course' },
              ...courses.map(c => ({ value: c.id.toString(), label: `${c.courseCode} – ${c.courseName}` })),
            ]}
            value={formData.courseId.toString()}
            onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Days <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DAY_OF_WEEK_OPTIONS.map(day => (
                <Button
                  key={day.value}
                  type="button"
                  variant={formData.sessionDays.includes(day.value) ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => toggleSessionDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
            {formData.sessionDays.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one day</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Programs</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="openToAll"
                checked={formData.openToAllPrograms}
                onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })}
              />
              <label htmlFor="openToAll" className="text-sm">Open to all programs</label>
            </div>
            {!formData.openToAllPrograms && (
              <div className="flex flex-wrap gap-2">
                {DEPARTMENT_OPTIONS.map(prog => (
                  <Button
                    key={prog} type="button"
                    variant={formData.allowedPrograms.includes(prog) ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => toggleProgram(prog)}
                  >
                    {prog}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saving}>
              {editingSession ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Programs Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={showProgramsModal}
        onClose={() => setShowProgramsModal(false)}
        title="Manage Program Access"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">{selectedSession?.name}</h4>
            <p className="text-sm text-gray-500">{selectedSession?.course?.courseCode}</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="openToAllModal"
              checked={formData.openToAllPrograms}
              onChange={(e) => setFormData({ ...formData, openToAllPrograms: e.target.checked })}
            />
            <label htmlFor="openToAllModal" className="text-sm font-medium">Open to all programs</label>
          </div>

          {!formData.openToAllPrograms && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Programs</label>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {DEPARTMENT_OPTIONS.map(prog => (
                  <label key={prog} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowedPrograms.includes(prog)}
                      onChange={() => toggleProgram(prog)}
                      className="mr-3"
                    />
                    {prog}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowProgramsModal(false)}>Cancel</Button>
            <Button onClick={handleUpdatePrograms} isLoading={saving}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* ── Add / Edit Single Slot Modal ───────────────────────────────────── */}
      <Modal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        title={editingSlot ? 'Edit Group' : 'Add Group'}
        size="sm"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <Input
            label="Session Date" type="date"
            value={slotForm.sessionDate}
            onChange={(e) => setSlotForm({ ...slotForm, sessionDate: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={slotForm.startTime}
              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />
            <Input label="End Time" type="time" value={slotForm.endTime}
              onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Slot Number" type="number" min="1" value={slotForm.slotNumber}
              onChange={(e) => setSlotForm({ ...slotForm, slotNumber: parseInt(e.target.value) || 1 })} required />
            <Input label="Max Students" type="number" min="1" value={slotForm.maxStudents}
              onChange={(e) => setSlotForm({ ...slotForm, maxStudents: parseInt(e.target.value) || 1 })} required />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setShowSlotModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={savingSlot}>
              {editingSlot ? 'Update Group' : 'Add Group'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Bulk Generate Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Generate Groups"
        size="sm"
      >
        {bulkSessionId && (() => {
          const session = sessions.find(s => s.id === bulkSessionId);
          return (
            <form onSubmit={handleBulkGenerate} className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-medium">{session?.name}</p>
                <p className="mt-1 text-blue-600">
                  Slots will be created for every{' '}
                  <strong>{session?.sessionDaysList?.map(d => d.substring(0, 3)).join(', ')}</strong>
                  {' '}between{' '}
                  <strong>{session?.startDate}</strong> and <strong>{session?.endDate}</strong>.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Time" type="time" value={bulkForm.startTime}
                  onChange={(e) => setBulkForm({ ...bulkForm, startTime: e.target.value })} required />
                <Input label="End Time" type="time" value={bulkForm.endTime}
                  onChange={(e) => setBulkForm({ ...bulkForm, endTime: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Slots per Day" type="number" min="1" max="10" value={bulkForm.numberOfSlots}
                  onChange={(e) => setBulkForm({ ...bulkForm, numberOfSlots: parseInt(e.target.value) || 1 })} required />
                <Input label="Max Students / Slot" type="number" min="1" value={bulkForm.maxStudents}
                  onChange={(e) => setBulkForm({ ...bulkForm, maxStudents: parseInt(e.target.value) || 1 })} required />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="secondary" type="button" onClick={() => setShowBulkModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={savingBulk}>
                  <Zap className="w-4 h-4 mr-1" />Generate Groups
                </Button>
              </div>
            </form>
          );
        })()}
      </Modal>

    </div>
  );
};

export default AdminSessionsPage;