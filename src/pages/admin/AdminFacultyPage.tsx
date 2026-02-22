// import { useEffect, useState } from 'react';
// import { GraduationCap, Plus, Edit, Trash2, Search, CheckCircle, User } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal } from '../../components/ui';
// import { facultyService } from '../../services/facultyService';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Faculty {
//   id: number;
//   code: string;
//   name: string;
//   description?: string;
//   dean?: string;
//   active: boolean;
//   createdAt?: string;
// }

// interface FacultyFormData {
//   code: string;
//   name: string;
//   description: string;
//   dean: string;
//   active?: boolean;
// }

// const emptyForm: FacultyFormData = {
//   code: '',
//   name: '',
//   description: '',
//   dean: '',
// };

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const AdminFacultyPage = () => {
//   const [faculties, setFaculties]           = useState<Faculty[]>([]);
//   const [loading, setLoading]               = useState(true);
//   const [searchTerm, setSearchTerm]         = useState('');
//   const [isModalOpen, setIsModalOpen]       = useState(false);
//   const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
//   const [isSaving, setIsSaving]             = useState(false);
//   const [formData, setFormData]             = useState<FacultyFormData>(emptyForm);

//   useEffect(() => { fetchFaculties(); }, []);

//   const fetchFaculties = async () => {
//     try {
//       const data = await facultyService.getAll();
//       setFaculties(data);
//     } catch {
//       toast.error('Failed to load faculties');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Handlers ────────────────────────────────────────────────────────────────

//   const handleAdd = () => {
//     setEditingFaculty(null);
//     setFormData(emptyForm);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (faculty: Faculty) => {
//     setEditingFaculty(faculty);
//     setFormData({
//       code:        faculty.code,
//       name:        faculty.name,
//       description: faculty.description || '',
//       dean:        faculty.dean || '',
//     });
//     setIsModalOpen(true);
//   };

//   const handleActivate = async (id: number) => {
//     if (!confirm('Activate this faculty?')) return;
//     try {
//       await facultyService.activate(id);
//       toast.success('Faculty activated');
//       fetchFaculties();
//     } catch {
//       toast.error('Failed to activate faculty');
//     }
//   };

//   const handleDeactivate = async (id: number) => {
//     if (!confirm('Deactivate this faculty?')) return;
//     try {
//       await facultyService.deactivate(id);
//       toast.success('Faculty deactivated');
//       fetchFaculties();
//     } catch {
//       toast.error('Failed to deactivate faculty');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.code.trim() || !formData.name.trim()) {
//       toast.error('Code and name are required');
//       return;
//     }
//     setIsSaving(true);
//     try {
//       if (editingFaculty) {
//         await facultyService.update(editingFaculty.id, formData);
//         toast.success('Faculty updated');
//       } else {
//         await facultyService.create(formData);
//         toast.success('Faculty created');
//       }
//       setIsModalOpen(false);
//       fetchFaculties();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save faculty');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ── Filter ───────────────────────────────────────────────────────────────────

//   const filtered = faculties.filter(f =>
//     f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (f.dean ?? '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <Loading text="Loading faculties..." />;

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Faculties</h1>
//           <p className="text-gray-600 mt-1">Manage university faculties (Super Admin only)</p>
//         </div>
//         <Button onClick={handleAdd}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Faculty
//         </Button>
//       </div>

//       {/* Search */}
//       <Card>
//         <CardContent className="py-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by name, code or dean..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Grid */}
//       {filtered.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No faculties found</h3>
//             <p className="text-gray-500 mt-1">
//               {searchTerm ? 'Try a different search term' : 'Add your first faculty'}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filtered.map(faculty => (
//             <Card key={faculty.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-indigo-50 rounded-lg">
//                       <GraduationCap className="w-5 h-5 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{faculty.name}</h3>
//                       <p className="text-sm text-gray-500 font-mono">{faculty.code}</p>
//                     </div>
//                   </div>
//                   <Badge variant={faculty.active ? 'success' : 'default'}>
//                     {faculty.active ? 'Active' : 'Inactive'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-sm">
//                   {faculty.dean && (
//                     <p className="flex items-center gap-1.5">
//                       <User className="w-3.5 h-3.5 text-gray-400" />
//                       <span className="text-gray-500">Dean:</span>
//                       <span className="text-gray-800">{faculty.dean}</span>
//                     </p>
//                   )}
//                   {faculty.description && (
//                     <p className="text-gray-600 text-xs leading-relaxed">{faculty.description}</p>
//                   )}
//                   {faculty.createdAt && (
//                     <p className="text-xs text-gray-400">
//                       Added {new Date(faculty.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex justify-between mt-4 pt-4 border-t">
//                   <Button size="sm" variant="secondary" onClick={() => handleEdit(faculty)}>
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   {faculty.active ? (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleDeactivate(faculty.id)}
//                       className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Deactivate
//                     </Button>
//                   ) : (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleActivate(faculty.id)}
//                       className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
//                     >
//                       <CheckCircle className="w-4 h-4 mr-1" />
//                       Activate
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Add / Edit Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}
//         size="md"
//       >
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="Faculty Code *"
//               placeholder="e.g., SCI, ENG"
//               value={formData.code}
//               onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
//               maxLength={20}
//             />
//             <Input
//               label="Faculty Name *"
//               placeholder="e.g., Faculty of Science"
//               value={formData.name}
//               onChange={e => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>

//           <Input
//             label="Dean"
//             placeholder="e.g., Prof. Jane Doe"
//             value={formData.dean}
//             onChange={e => setFormData({ ...formData, dean: e.target.value })}
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               rows={3}
//               placeholder="Brief description of the faculty..."
//               value={formData.description}
//               onChange={e => setFormData({ ...formData, description: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t">
//             <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} isLoading={isSaving}>
//               {editingFaculty ? 'Update' : 'Create'} Faculty
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AdminFacultyPage;


// import { useEffect, useState } from 'react';
// import {
//   GraduationCap, Plus, Edit, Trash2, Search,
//   CheckCircle, User, X, BookOpen, LayoutGrid, List
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { facultyService } from '../../services/facultyService';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Faculty {
//   id: number;
//   code: string;
//   name: string;
//   description?: string;
//   dean?: string;
//   active: boolean;
//   createdAt?: string;
// }

// interface FacultyFormData {
//   code: string;
//   name: string;
//   description: string;
//   dean: string;
// }

// const emptyForm: FacultyFormData = { code: '', name: '', description: '', dean: '' };

// // ─── Palette per faculty code ─────────────────────────────────────────────────

// const PALETTES = [
//   { bg: '#fef3c7', accent: '#d97706', glow: '#fcd34d40' },
//   { bg: '#dbeafe', accent: '#2563eb', glow: '#93c5fd40' },
//   { bg: '#dcfce7', accent: '#16a34a', glow: '#86efac40' },
//   { bg: '#f3e8ff', accent: '#9333ea', glow: '#d8b4fe40' },
//   { bg: '#fee2e2', accent: '#dc2626', glow: '#fca5a540' },
//   { bg: '#e0f2fe', accent: '#0284c7', glow: '#7dd3fc40' },
//   { bg: '#fce7f3', accent: '#db2777', glow: '#f9a8d440' },
//   { bg: '#ccfbf1', accent: '#0d9488', glow: '#5eead440' },
// ];

// const getPalette = (code: string) => {
//   let h = 0;
//   for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
//   return PALETTES[Math.abs(h) % PALETTES.length];
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const FacultyBadge = ({ code, size = 46 }: { code: string; size?: number }) => {
//   const p = getPalette(code);
//   return (
//     <div style={{
//       width: size, height: size, background: p.bg,
//       border: `1.5px solid ${p.accent}33`,
//       borderRadius: 12, display: 'flex', alignItems: 'center',
//       justifyContent: 'center', flexShrink: 0,
//       boxShadow: `0 2px 8px ${p.glow}`,
//     }}>
//       <span style={{
//         fontFamily: 'Syne, sans-serif', fontWeight: 800,
//         fontSize: size * 0.27, color: p.accent, letterSpacing: '-0.01em',
//       }}>
//         {code.slice(0, 3).toUpperCase() || '?'}
//       </span>
//     </div>
//   );
// };

// const StatusPill = ({ active }: { active: boolean }) => (
//   <span style={{
//     display: 'inline-flex', alignItems: 'center', gap: 5,
//     padding: '3px 10px', borderRadius: 999,
//     background: active ? '#f0fdf4' : '#f8fafc',
//     border: `1.5px solid ${active ? '#bbf7d0' : '#e2e8f0'}`,
//     fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
//     color: active ? '#15803d' : '#94a3b8',
//     fontFamily: "'DM Mono', monospace",
//     textTransform: 'uppercase' as const,
//   }}>
//     <span style={{
//       width: 6, height: 6, borderRadius: '50%',
//       background: active ? '#22c55e' : '#cbd5e1',
//       flexShrink: 0,
//       ...(active ? { boxShadow: '0 0 0 2px #bbf7d0' } : {}),
//     }} />
//     {active ? 'Active' : 'Inactive'}
//   </span>
// );

// const MetaRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
//     <span style={{ color: '#94a3b8', display: 'flex', flexShrink: 0 }}>{icon}</span>
//     <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{text}</span>
//   </div>
// );

// // ─── Input helpers ────────────────────────────────────────────────────────────

// const baseInput: React.CSSProperties = {
//   width: '100%', padding: '10px 13px', fontSize: 13,
//   border: '1.5px solid #e2e8f0', borderRadius: 10,
//   background: '#f8fafc', color: '#0f172a', outline: 'none',
//   fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' as const,
//   transition: 'border-color 0.15s, background 0.15s',
// };

// const FocusInput = ({
//   value, onChange, placeholder, type = 'text', maxLength,
// }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number; }) => (
//   <input
//     type={type}
//     value={value}
//     placeholder={placeholder}
//     maxLength={maxLength}
//     onChange={e => onChange(e.target.value)}
//     style={baseInput}
//     onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = '#fff'; }}
//     onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
//   />
// );

// const Label = ({ children }: { children: React.ReactNode }) => (
//   <label style={{
//     display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
//     textTransform: 'uppercase' as const, color: '#94a3b8', marginBottom: 5,
//     fontFamily: "'DM Mono', monospace",
//   }}>
//     {children}
//   </label>
// );

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const AdminFacultyPage = () => {
//   const [faculties, setFaculties]           = useState<Faculty[]>([]);
//   const [loading, setLoading]               = useState(true);
//   const [searchTerm, setSearchTerm]         = useState('');
//   const [isModalOpen, setIsModalOpen]       = useState(false);
//   const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
//   const [isSaving, setIsSaving]             = useState(false);
//   const [formData, setFormData]             = useState<FacultyFormData>(emptyForm);
//   const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid');
//   const [filter, setFilter]                 = useState<'all' | 'active' | 'inactive'>('all');

//   useEffect(() => { fetchFaculties(); }, []);

//   const fetchFaculties = async () => {
//     try { setFaculties(await facultyService.getAll()); }
//     catch { toast.error('Failed to load faculties'); }
//     finally { setLoading(false); }
//   };

//   const handleAdd = () => {
//     setEditingFaculty(null);
//     setFormData(emptyForm);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (faculty: Faculty) => {
//     setEditingFaculty(faculty);
//     setFormData({ code: faculty.code, name: faculty.name, description: faculty.description || '', dean: faculty.dean || '' });
//     setIsModalOpen(true);
//   };

//   const handleActivate = async (id: number) => {
//     if (!confirm('Activate this faculty?')) return;
//     try { await facultyService.activate(id); toast.success('Activated'); fetchFaculties(); }
//     catch { toast.error('Failed to activate'); }
//   };

//   const handleDeactivate = async (id: number) => {
//     if (!confirm('Deactivate this faculty?')) return;
//     try { await facultyService.deactivate(id); toast.success('Deactivated'); fetchFaculties(); }
//     catch { toast.error('Failed to deactivate'); }
//   };

//   const handleSubmit = async () => {
//     if (!formData.code.trim() || !formData.name.trim()) { toast.error('Code and name are required'); return; }
//     setIsSaving(true);
//     try {
//       if (editingFaculty) {
//         await facultyService.update(editingFaculty.id, formData);
//         toast.success('Faculty updated');
//       } else {
//         await facultyService.create(formData);
//         toast.success('Faculty created');
//       }
//       setIsModalOpen(false);
//       fetchFaculties();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save');
//     } finally { setIsSaving(false); }
//   };

//   const activeCount   = faculties.filter(f => f.active).length;
//   const inactiveCount = faculties.filter(f => !f.active).length;

//   const filtered = faculties.filter(f => {
//     const q = searchTerm.toLowerCase();
//     const matchQ = f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || (f.dean ?? '').toLowerCase().includes(q);
//     const matchF = filter === 'all' ? true : filter === 'active' ? f.active : !f.active;
//     return matchQ && matchF;
//   });

//   const previewPalette = getPalette(formData.code || 'X');

//   // ── Loading ──────────────────────────────────────────────────────────────────
//   if (loading) return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14, fontFamily: "'Nunito', sans-serif" }}>
//       <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>Loading faculties…</span>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   return (
//     <>
//       {/* ── Global styles ─────────────────────────────────────────────────────── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

//         .fac-root { font-family: 'Nunito', sans-serif; background: #f7f6f3; min-height: 100vh; padding: 40px 36px; }
//         .fac-inner { max-width: 1280px; margin: 0 auto; }

//         /* card */
//         .fac-card {
//           background: white; border: 1.5px solid #e8e6e1; border-radius: 16px;
//           overflow: hidden; display: flex; flex-direction: column;
//           transition: box-shadow .2s, transform .2s, border-color .2s;
//         }
//         .fac-card:hover { box-shadow: 0 10px 32px rgba(15,23,42,.09); transform: translateY(-2px); border-color: #c7d2fe; }
//         .fac-card-off { opacity: .55; filter: saturate(.35); }

//         /* list row */
//         .fac-row {
//           background: white; border: 1.5px solid #e8e6e1; border-radius: 12px;
//           padding: 13px 20px; display: flex; align-items: center; gap: 14px;
//           transition: box-shadow .15s, border-color .15s;
//         }
//         .fac-row:hover { box-shadow: 0 4px 16px rgba(15,23,42,.07); border-color: #c7d2fe; }
//         .fac-row-off { opacity: .5; filter: saturate(.3); }

//         /* action buttons */
//         .abtn {
//           display: flex; align-items: center; gap: 5px;
//           padding: 7px 13px; border-radius: 9px; font-size: 12px;
//           font-weight: 700; cursor: pointer; border: 1.5px solid;
//           transition: all .15s; font-family: 'Nunito', sans-serif;
//           letter-spacing: .02em; background: transparent;
//         }
//         .abtn:active { transform: scale(.95); }
//         .abtn-edit { color: #475569; border-color: #e2e8f0; background: #f8fafc; }
//         .abtn-edit:hover { border-color: #818cf8; color: #4f46e5; background: #eef2ff; }
//         .abtn-deact { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
//         .abtn-deact:hover { background: #fee2e2; border-color: #f87171; }
//         .abtn-act { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
//         .abtn-act:hover { background: #dcfce7; border-color: #86efac; }
//         .abtn-icon { padding: 7px; }

//         /* filter chips */
//         .fchip {
//           padding: 6px 14px; border-radius: 999px; font-size: 10px;
//           font-weight: 700; border: 1.5px solid #e2e8f0; cursor: pointer;
//           transition: all .15s; font-family: 'DM Mono', monospace;
//           letter-spacing: .08em; text-transform: uppercase; background: white; color: #64748b;
//         }
//         .fchip:hover:not(.fchip-on) { border-color: #818cf8; color: #4f46e5; }
//         .fchip-on { background: #0f172a; color: white; border-color: #0f172a; }

//         /* view toggle */
//         .vtgl {
//           padding: 8px; border-radius: 9px; border: 1.5px solid #e2e8f0;
//           background: white; cursor: pointer; display: flex;
//           align-items: center; color: #94a3b8; transition: all .15s;
//         }
//         .vtgl-on { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }
//         .vtgl:hover:not(.vtgl-on) { border-color: #c7d2fe; color: #6366f1; }

//         /* add btn */
//         .add-btn {
//           display: flex; align-items: center; gap: 7px;
//           padding: 10px 18px; border-radius: 12px; border: none;
//           background: #0f172a; color: white; font-size: 13px; font-weight: 700;
//           font-family: 'Nunito', sans-serif; cursor: pointer; white-space: nowrap;
//           transition: background .15s, transform .1s; flex-shrink: 0;
//           box-shadow: 0 2px 10px rgba(15,23,42,.18);
//         }
//         .add-btn:hover { background: #1e293b; }
//         .add-btn:active { transform: scale(.97); }

//         /* modal */
//         .fac-overlay {
//           position: fixed; inset: 0; z-index: 200;
//           background: rgba(15,23,42,.45); backdrop-filter: blur(8px);
//           display: flex; align-items: center; justify-content: center; padding: 24px;
//           animation: fadeIn .18s ease;
//         }
//         .fac-modal {
//           background: white; border-radius: 20px; width: 100%; max-width: 490px;
//           box-shadow: 0 28px 80px rgba(15,23,42,.18);
//           animation: slideUp .25s cubic-bezier(.34,1.56,.64,1);
//           overflow: hidden;
//         }

//         /* modal btns */
//         .mbtn-cancel {
//           padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
//           cursor: pointer; border: 1.5px solid #e2e8f0; background: transparent;
//           color: #64748b; font-family: 'Nunito', sans-serif; transition: all .15s;
//         }
//         .mbtn-cancel:hover { background: #f1f5f9; }
//         .mbtn-submit {
//           display: flex; align-items: center; gap: 7px;
//           padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700;
//           cursor: pointer; border: none; background: #0f172a; color: white;
//           font-family: 'Nunito', sans-serif; transition: background .15s, transform .1s;
//         }
//         .mbtn-submit:hover { background: #1e293b; }
//         .mbtn-submit:active { transform: scale(.97); }
//         .mbtn-submit:disabled { opacity: .5; cursor: not-allowed; }

//         textarea.fac-ta {
//           width: 100%; padding: 10px 13px; font-size: 13px;
//           border: 1.5px solid #e2e8f0; border-radius: 10px;
//           background: #f8fafc; color: #0f172a; outline: none;
//           font-family: 'Nunito', sans-serif; box-sizing: border-box;
//           resize: vertical; min-height: 68px; transition: border-color .15s, background .15s;
//         }
//         textarea.fac-ta:focus { border-color: #818cf8; background: white; }

//         .fac-close-btn {
//           width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid #e2e8f0;
//           background: #f8fafc; display: flex; align-items: center; justify-content: center;
//           cursor: pointer; color: #94a3b8; transition: all .15s; flex-shrink: 0;
//         }
//         .fac-close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
//       `}</style>

//       <div className="fac-root">
//         <div className="fac-inner">

//           {/* ── Header ───────────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
//             <div>
//               <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px' }}>
//                 Super Admin · Academic
//               </p>
//               <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 34, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
//                 Faculties
//               </h1>
//               <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 400 }}>
//                 <span style={{ color: '#16a34a', fontWeight: 700 }}>{activeCount} active</span>
//                 {inactiveCount > 0 && <> · <span>{inactiveCount} inactive</span></>}
//                 {' '}· {faculties.length} total
//               </p>
//             </div>
//             <button className="add-btn" onClick={handleAdd}>
//               <Plus size={15} /> Add Faculty
//             </button>
//           </div>

//           {/* ── Toolbar ──────────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
//             <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
//               <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
//               <input
//                 type="text"
//                 placeholder="Search name, code, dean…"
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 style={{ ...baseInput, paddingLeft: 34, borderRadius: 12, fontSize: 13 }}
//                 onFocus={e => { e.target.style.borderColor = '#818cf8'; e.target.style.background = 'white'; }}
//                 onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
//               />
//             </div>

//             {/* Filter chips */}
//             <div style={{ display: 'flex', gap: 6 }}>
//               {(['all', 'active', 'inactive'] as const).map(f => (
//                 <button key={f} className={`fchip ${filter === f ? 'fchip-on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
//               ))}
//             </div>

//             {/* View toggle */}
//             <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
//               <button className={`vtgl ${viewMode === 'grid' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={15} /></button>
//               <button className={`vtgl ${viewMode === 'list' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('list')}><List size={15} /></button>
//             </div>
//           </div>

//           {/* ── Empty ────────────────────────────────────────────────────────── */}
//           {filtered.length === 0 ? (
//             <div style={{
//               display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//               gap: 12, padding: '80px 40px', border: '2px dashed #e2e8f0', borderRadius: 20, textAlign: 'center',
//             }}>
//               <div style={{ width: 56, height: 56, background: '#f1f5f9', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <GraduationCap size={26} color="#cbd5e1" />
//               </div>
//               <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>No faculties found</p>
//               <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{searchTerm ? 'Try a different search or clear filters' : 'Add your first faculty to get started'}</p>
//               {!searchTerm && <button className="add-btn" style={{ marginTop: 4 }} onClick={handleAdd}><Plus size={14} /> Add Faculty</button>}
//             </div>

//           ) : viewMode === 'grid' ? (
//             /* ── Grid ─────────────────────────────────────────────────────── */
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
//               {filtered.map((faculty, idx) => {
//                 const p = getPalette(faculty.code);
//                 return (
//                   <div key={faculty.id} className={`fac-card ${!faculty.active ? 'fac-card-off' : ''}`} style={{ animationDelay: `${idx * 35}ms` }}>
//                     {/* Accent bar */}
//                     <div style={{ height: 4, background: `linear-gradient(90deg, ${p.accent}, ${p.accent}88)` }} />

//                     <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
//                       {/* Top */}
//                       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
//                           <FacultyBadge code={faculty.code} size={46} />
//                           <div style={{ minWidth: 0 }}>
//                             <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: p.accent, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 2px', fontWeight: 500 }}>
//                               {faculty.code}
//                             </p>
//                             <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: 0, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                               {faculty.name}
//                             </h3>
//                           </div>
//                         </div>
//                         <StatusPill active={faculty.active} />
//                       </div>

//                       {/* Meta */}
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//                         {faculty.dean && <MetaRow icon={<User size={12} />} text={`Dean: ${faculty.dean}`} />}
//                         {faculty.description && (
//                           <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
//                             {faculty.description}
//                           </p>
//                         )}
//                         {faculty.createdAt && (
//                           <MetaRow icon={<BookOpen size={12} />} text={`Est. ${new Date(faculty.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`} />
//                         )}
//                       </div>

//                       {/* Actions */}
//                       <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
//                         <button className="abtn abtn-edit" onClick={() => handleEdit(faculty)}><Edit size={12} /> Edit</button>
//                         {faculty.active
//                           ? <button className="abtn abtn-deact" onClick={() => handleDeactivate(faculty.id)}><Trash2 size={12} /> Deactivate</button>
//                           : <button className="abtn abtn-act" onClick={() => handleActivate(faculty.id)}><CheckCircle size={12} /> Activate</button>
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//           ) : (
//             /* ── List ──────────────────────────────────────────────────────── */
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {filtered.map(faculty => {
//                 const p = getPalette(faculty.code);
//                 return (
//                   <div key={faculty.id} className={`fac-row ${!faculty.active ? 'fac-row-off' : ''}`}>
//                     <div style={{ width: 4, height: 36, borderRadius: 999, background: p.accent, flexShrink: 0 }} />
//                     <FacultyBadge code={faculty.code} size={38} />
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//                         <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{faculty.name}</span>
//                         <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: p.accent, fontWeight: 500 }}>{faculty.code}</span>
//                       </div>
//                       {faculty.dean && <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 1 }}>Dean: {faculty.dean}</p>}
//                     </div>
//                     <StatusPill active={faculty.active} />
//                     <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
//                       <button className="abtn abtn-edit abtn-icon" onClick={() => handleEdit(faculty)}><Edit size={13} /></button>
//                       {faculty.active
//                         ? <button className="abtn abtn-deact abtn-icon" onClick={() => handleDeactivate(faculty.id)}><Trash2 size={13} /></button>
//                         : <button className="abtn abtn-act abtn-icon" onClick={() => handleActivate(faculty.id)}><CheckCircle size={13} /></button>
//                       }
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* ── Modal ──────────────────────────────────────────────────────────── */}
//         {isModalOpen && (
//           <div className="fac-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
//             <div className="fac-modal">

//               {/* Header */}
//               <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
//                 <div>
//                   <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px' }}>
//                     {editingFaculty ? `Editing · ${editingFaculty.code}` : 'New Faculty'}
//                   </p>
//                   <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
//                     {editingFaculty ? editingFaculty.name : 'Add Faculty'}
//                   </h2>
//                 </div>
//                 <button className="fac-close-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
//               </div>

//               {/* Live preview */}
//               {(formData.code || formData.name) && (
//                 <div style={{ margin: '14px 22px 0', padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1.5px solid #e8e6e1', display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <FacultyBadge code={formData.code || '?'} size={38} />
//                   <div>
//                     <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>{formData.name || 'Faculty Name'}</p>
//                     <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: previewPalette.accent, margin: 0, marginTop: 2 }}>{formData.code || 'CODE'}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Form */}
//               <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//                   <div><Label>Code *</Label><FocusInput value={formData.code} onChange={v => setFormData({ ...formData, code: v.toUpperCase() })} placeholder="SCI" maxLength={10} /></div>
//                   <div><Label>Name *</Label><FocusInput value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Faculty of Science" /></div>
//                 </div>

//                 <div><Label>Dean</Label><FocusInput value={formData.dean} onChange={v => setFormData({ ...formData, dean: v })} placeholder="Prof. Jane Doe" /></div>

//                 <div>
//                   <Label>Description</Label>
//                   <textarea
//                     className="fac-ta"
//                     rows={3}
//                     placeholder="Brief overview of this faculty…"
//                     value={formData.description}
//                     onChange={e => setFormData({ ...formData, description: e.target.value })}
//                   />
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 10, borderTop: '1.5px solid #f1f5f9' }}>
//                   <button className="mbtn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
//                   <button className="mbtn-submit" onClick={handleSubmit} disabled={isSaving}>
//                     {isSaving
//                       ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Saving…</>
//                       : <>{editingFaculty ? 'Update' : 'Create'} Faculty</>
//                     }
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdminFacultyPage;




import { useEffect, useState } from 'react';
import {
  GraduationCap, Plus, Edit, Trash2, Search,
  CheckCircle, User, X, BookOpen, LayoutGrid, List,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Faculty {
  id: number;
  code: string;
  name: string;
  description?: string;
  dean?: string;
  active: boolean;
  createdAt?: string;
}

interface FacultyFormData {
  code: string;
  name: string;
  description: string;
  dean: string;
}

const EMPTY: FacultyFormData = { code: '', name: '', description: '', dean: '' };

// ─── Deterministic palette ────────────────────────────────────────────────────

const PALETTES = [
  { bg: '#fef3c7', accent: '#d97706', soft: '#fffbeb', bar: '#f59e0b' },
  { bg: '#dbeafe', accent: '#2563eb', soft: '#eff6ff', bar: '#3b82f6' },
  { bg: '#dcfce7', accent: '#16a34a', soft: '#f0fdf4', bar: '#22c55e' },
  { bg: '#f3e8ff', accent: '#9333ea', soft: '#faf5ff', bar: '#a855f7' },
  { bg: '#fee2e2', accent: '#dc2626', soft: '#fef2f2', bar: '#ef4444' },
  { bg: '#e0f2fe', accent: '#0284c7', soft: '#f0f9ff', bar: '#38bdf8' },
  { bg: '#fce7f3', accent: '#db2777', soft: '#fdf2f8', bar: '#ec4899' },
  { bg: '#ccfbf1', accent: '#0d9488', soft: '#f0fdfa', bar: '#14b8a6' },
];

const palette = (code: string) => {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return PALETTES[Math.abs(h) % PALETTES.length];
};

// ─── Reusable atoms ───────────────────────────────────────────────────────────

const INP: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13.5,
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#18181b', outline: 'none',
  fontFamily: "'Cabinet Grotesk', sans-serif",
  boxSizing: 'border-box' as const, transition: 'all .15s',
};

const fIn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; };
const fOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ code, size = 46 }: { code: string; size?: number }) => {
  const p = palette(code);
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.24),
      background: p.bg, border: `1.5px solid ${p.accent}28`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 800, fontSize: Math.round(size * 0.27),
        color: p.accent, letterSpacing: '-0.02em', lineHeight: 1,
      }}>
        {(code || '·').slice(0, 4).toUpperCase()}
      </span>
    </div>
  );
};

// ─── Status pill ──────────────────────────────────────────────────────────────

const Pill = ({ active }: { active: boolean }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', borderRadius: 999, flexShrink: 0,
    background: active ? '#f0fdf4' : '#f8fafc',
    border: `1px solid ${active ? '#bbf7d0' : '#e2e8f0'}`,
    fontSize: 10.5, fontWeight: 600,
    color: active ? '#15803d' : '#94a3b8',
    fontFamily: "'Cabinet Grotesk', sans-serif",
  }}>
    <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: active ? '#22c55e' : '#cbd5e1' }} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

// ─── Form label ───────────────────────────────────────────────────────────────

const FL = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
    {children}
  </label>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminFacultyPage = () => {
  const [faculties, setFaculties]           = useState<Faculty[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [filter, setFilter]                 = useState<'all' | 'active' | 'inactive'>('all');
  const [view, setView]                     = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen]           = useState(false);
  const [editing, setEditing]               = useState<Faculty | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [form, setForm]                     = useState<FacultyFormData>(EMPTY);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setFaculties(await facultyService.getAll()); }
    catch { toast.error('Failed to load faculties'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (f: Faculty) => { setEditing(f); setForm({ code: f.code, name: f.name, description: f.description || '', dean: f.dean || '' }); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const activate   = async (id: number) => { if (!confirm('Activate this faculty?')) return; try { await facultyService.activate(id);   toast.success('Activated');   load(); } catch { toast.error('Failed'); } };
  const deactivate = async (id: number) => { if (!confirm('Deactivate this faculty?')) return; try { await facultyService.deactivate(id); toast.success('Deactivated'); load(); } catch { toast.error('Failed'); } };

  const submit = async () => {
    if (!form.code.trim() || !form.name.trim()) { toast.error('Code and name are required'); return; }
    setSaving(true);
    try {
      editing ? await facultyService.update(editing.id, form) : await facultyService.create(form);
      toast.success(editing ? 'Faculty updated' : 'Faculty created');
      closeModal(); load();
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const active   = faculties.filter(f => f.active).length;
  const inactive = faculties.filter(f => !f.active).length;

  const shown = faculties.filter(f => {
    const q = search.toLowerCase();
    const mq = !q || f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || (f.dean || '').toLowerCase().includes(q);
    const mf = filter === 'all' || (filter === 'active' ? f.active : !f.active);
    return mq && mf;
  });

  const pp = palette(form.code || 'X');

  // Loading
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'fac-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading faculties…</span>
      <style>{`@keyframes fac-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes fac-spin   { to { transform: rotate(360deg); } }
        @keyframes fac-fade   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fac-rise   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fac-spring { from { opacity: 0; transform: translateY(20px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes fac-card   { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .fac-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; box-sizing: border-box; }
        .fac-wrap { max-width: 1280px; margin: 0 auto; animation: fac-rise .32s ease both; }

        /* ── Stats strip ── */
        .fac-stats {
          display: flex; gap: 0; background: #fff;
          border: 1px solid #e8e5df; border-radius: 12px; overflow: hidden;
        }
        .fac-stat {
          flex: 1; padding: 14px 18px;
          border-right: 1px solid #f1f5f9;
          display: flex; flex-direction: column; gap: 2;
        }
        .fac-stat:last-child { border-right: none; }

        /* ── Cards ── */
        .fac-card {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
          animation: fac-card .3s ease both;
        }
        .fac-card:hover {
          box-shadow: 0 10px 32px rgba(0,0,0,.09);
          transform: translateY(-2px);
          border-color: #c7d2fe;
        }
        .fac-card-dim { opacity: .48; filter: saturate(.2); }

        /* ── List rows ── */
        .fac-row {
          background: #fff; border: 1px solid #e8e5df; border-radius: 10px;
          padding: 13px 18px; display: grid;
          grid-template-columns: 38px 1fr 100px 76px;
          gap: 14px; align-items: center;
          transition: box-shadow .15s, border-color .15s;
          animation: fac-card .25s ease both;
        }
        .fac-row:hover { box-shadow: 0 3px 14px rgba(0,0,0,.07); border-color: #c7d2fe; }
        .fac-row-dim { opacity: .44; filter: saturate(.18); }

        /* ── Buttons ── */
        .ab {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; border: 1px solid; transition: all .12s; background: transparent;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .ab:active { transform: scale(.95); }
        .ab-edit  { color: #475569; border-color: #e2e8f0; background: #f8fafc; }
        .ab-edit:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
        .ab-off   { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
        .ab-off:hover { background: #fee2e2; border-color: #f87171; }
        .ab-on    { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
        .ab-on:hover { background: #dcfce7; border-color: #86efac; }
        .ab-icon  { padding: 6px 8px; }

        /* ── Filter chips ── */
        .fac-chip {
          padding: 5px 14px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .fac-chip:hover:not(.chip-on) { border-color: #a5b4fc; color: #4f46e5; }
        .chip-on { background: #18181b; color: #fff; border-color: #18181b; }

        /* ── View toggle ── */
        .fac-vt {
          width: 33px; height: 33px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #94a3b8; transition: all .12s;
        }
        .fac-vt.on { background: #eef2ff; border-color: #a5b4fc; color: #4f46e5; }
        .fac-vt:hover:not(.on) { border-color: #a5b4fc; color: #6366f1; }

        /* ── Add button ── */
        .fac-add {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px; border: none;
          background: #18181b; color: #fff; font-size: 13.5px; font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif; cursor: pointer; flex-shrink: 0;
          transition: background .15s, transform .1s; box-shadow: 0 1px 6px rgba(0,0,0,.15);
        }
        .fac-add:hover  { background: #27272a; }
        .fac-add:active { transform: scale(.97); }

        /* ── Modal ── */
        .fac-overlay {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,.42); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fac-fade .18s ease;
        }
        .fac-modal {
          background: #fff; border-radius: 18px; width: 100%; max-width: 490px;
          box-shadow: 0 32px 80px rgba(0,0,0,.18); overflow: hidden;
          animation: fac-spring .28s cubic-bezier(.34,1.56,.64,1) both;
        }
        .fac-close {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0;
          background: #f8fafc; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8; transition: all .12s; flex-shrink: 0;
        }
        .fac-close:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

        .fac-sub {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; border: none; background: #18181b; color: #fff;
          font-family: 'Cabinet Grotesk', sans-serif; transition: background .12s, transform .1s;
        }
        .fac-sub:hover   { background: #27272a; }
        .fac-sub:active  { transform: scale(.97); }
        .fac-sub:disabled { opacity: .4; cursor: not-allowed; }

        .fac-cnl {
          padding: 9px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; border: 1px solid #e2e8f0; background: transparent;
          color: #64748b; font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .fac-cnl:hover { background: #f1f5f9; }

        .fac-ta {
          width: 100%; padding: 9px 12px; font-size: 13.5px;
          border: 1.5px solid #e2e8f0; border-radius: 8px; background: #f8fafc;
          color: #18181b; outline: none; font-family: 'Cabinet Grotesk', sans-serif;
          box-sizing: border-box; resize: vertical; min-height: 70px; transition: all .15s;
        }
        .fac-ta:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px #eef2ff; }
        .fac-ta::placeholder { color: #cbd5e1; }

        /* ── List col header ── */
        .fac-list-hdr {
          display: grid; grid-template-columns: 38px 1fr 100px 76px;
          gap: 14px; padding: 0 16px 7px; align-items: center;
        }
        .fac-lh { font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: .09em; text-transform: uppercase; font-family: 'Cabinet Grotesk', sans-serif; }

        /* ── Grid 2 ── */
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }

        @media (max-width: 640px) {
          .fac-page { padding: 24px 16px; }
          .g2 { grid-template-columns: 1fr; }
          .fac-row { grid-template-columns: 36px 1fr auto; }
          .fac-list-hdr { display: none; }
        }
      `}</style>

      <div className="fac-page">
        <div className="fac-wrap">

          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 26 }}>
            <div>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px' }}>
                Super Admin · Academic
              </p>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.025em', lineHeight: 1, margin: 0 }}>
                Faculties
              </h1>
            </div>
            <button className="fac-add" onClick={openAdd}>
              <Plus size={15} strokeWidth={2.5} /> Add Faculty
            </button>
          </div>

          {/* ── Stats strip ──────────────────────────────────────────────────── */}
          <div className="fac-stats" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total', value: faculties.length, color: '#18181b' },
              { label: 'Active', value: active, color: '#16a34a' },
              { label: 'Inactive', value: inactive, color: '#94a3b8' },
            ].map(s => (
              <div key={s.label} className="fac-stat">
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Toolbar ──────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
              <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="text" placeholder="Search name, code, dean…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...INP, paddingLeft: 32, borderRadius: 9, fontSize: 13 }}
                onFocus={fIn as any} onBlur={fOut as any}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button key={f} className={`fac-chip ${filter === f ? 'chip-on' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Inactive'}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
              <button className={`fac-vt ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')}><LayoutGrid size={14} /></button>
              <button className={`fac-vt ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')}><List size={14} /></button>
            </div>
          </div>

          {/* ── Empty ────────────────────────────────────────────────────────── */}
          {shown.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '80px 40px', border: '1.5px dashed #e2e8f0', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No faculties found</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>{search ? 'Try a different search term' : 'Add your first faculty to get started'}</p>
              {!search && <button className="fac-add" style={{ marginTop: 6 }} onClick={openAdd}><Plus size={14} /> Add Faculty</button>}
            </div>

          ) : view === 'grid' ? (
            /* ── GRID ──────────────────────────────────────────────────────── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(292px, 1fr))', gap: 14 }}>
              {shown.map((f, i) => {
                const p = palette(f.code);
                return (
                  <div key={f.id} className={`fac-card ${!f.active ? 'fac-card-dim' : ''}`} style={{ animationDelay: `${i * 40}ms` }}>
                    {/* Colour bar */}
                    <div style={{ height: 3.5, background: `linear-gradient(90deg, ${p.bar}, ${p.bar}55)` }} />

                    <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>

                      {/* Top identity row */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                          <Badge code={f.code} size={44} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 10.5, fontWeight: 700, color: p.accent, margin: '0 0 2px', letterSpacing: '0.05em' }}>{f.code}</p>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, color: '#18181b', margin: 0, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.name}
                            </h3>
                          </div>
                        </div>
                        <Pill active={f.active} />
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                        {f.dean && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 12.5, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.dean}
                            </span>
                          </div>
                        )}
                        {f.description && (
                          <p style={{
                            fontSize: 12.5, color: '#94a3b8', margin: 0, lineHeight: 1.6,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
                          }}>
                            {f.description}
                          </p>
                        )}
                        {f.createdAt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <BookOpen size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>
                              Est. {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                        <button className="ab ab-edit" style={{ flex: 1 }} onClick={() => openEdit(f)}>
                          <Edit size={12} /> Edit
                        </button>
                        {f.active
                          ? <button className="ab ab-off" style={{ flex: 1 }} onClick={() => deactivate(f.id)}><Trash2 size={12} /> Deactivate</button>
                          : <button className="ab ab-on"  style={{ flex: 1 }} onClick={() => activate(f.id)}><CheckCircle size={12} /> Activate</button>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (
            /* ── LIST ──────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div className="fac-list-hdr">
                {['', 'Faculty', 'Status', ''].map((h, i) => <span key={i} className="fac-lh">{h}</span>)}
              </div>

              {shown.map((f, i) => {
                const p = palette(f.code);
                return (
                  <div key={f.id} className={`fac-row ${!f.active ? 'fac-row-dim' : ''}`} style={{ animationDelay: `${i * 30}ms` }}>

                    {/* Left accent + badge */}
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', width: 3, height: 28, borderRadius: 999, background: p.bar }} />
                      <Badge code={f.code} size={36} />
                    </div>

                    {/* Name / code / dean */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: p.accent }}>{f.code}</span>
                      </div>
                      {f.dean && <p style={{ fontSize: 12, color: '#94a3b8', margin: '1px 0 0', fontWeight: 500 }}>Dean: {f.dean}</p>}
                    </div>

                    {/* Status */}
                    <Pill active={f.active} />

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="ab ab-edit ab-icon" onClick={() => openEdit(f)}><Edit size={13} /></button>
                      {f.active
                        ? <button className="ab ab-off ab-icon" onClick={() => deactivate(f.id)}><Trash2 size={13} /></button>
                        : <button className="ab ab-on  ab-icon" onClick={() => activate(f.id)}><CheckCircle size={13} /></button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal ──────────────────────────────────────────────────────────── */}
        {modalOpen && (
          <div className="fac-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="fac-modal">

              {/* Modal header */}
              <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {editing ? `Editing · ${editing.code}` : 'New Faculty'}
                  </p>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: '#18181b', margin: 0, letterSpacing: '-0.01em' }}>
                    {editing ? editing.name : 'Add a Faculty'}
                  </h2>
                </div>
                <button className="fac-close" onClick={closeModal}><X size={14} /></button>
              </div>

              {/* Live preview */}
              {(form.code || form.name) && (
                <div style={{ margin: '14px 22px 0', padding: '11px 14px', background: pp.soft, border: `1px solid ${pp.accent}20`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, transition: 'background .2s' }}>
                  <Badge code={form.code || '·'} size={38} />
                  <div>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0, lineHeight: 1.25 }}>
                      {form.name || 'Faculty Name'}
                    </p>
                    {form.dean && <p style={{ fontSize: 11.5, color: '#64748b', margin: '2px 0 0' }}>{form.dean}</p>}
                    <p style={{ fontSize: 10.5, fontWeight: 700, color: pp.accent, margin: '2px 0 0', letterSpacing: '0.04em' }}>
                      {form.code || 'CODE'}
                    </p>
                  </div>
                </div>
              )}

              {/* Form fields */}
              <div style={{ padding: '14px 22px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>

                <div className="g2">
                  <div>
                    <FL>Code *</FL>
                    <input style={INP} value={form.code} placeholder="SCI" maxLength={10}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      onFocus={fIn as any} onBlur={fOut as any} />
                  </div>
                  <div>
                    <FL>Name *</FL>
                    <input style={INP} value={form.name} placeholder="Faculty of Science"
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={fIn as any} onBlur={fOut as any} />
                  </div>
                </div>

                <div>
                  <FL>Dean</FL>
                  <input style={INP} value={form.dean} placeholder="Prof. Jane Doe"
                    onChange={e => setForm({ ...form, dean: e.target.value })}
                    onFocus={fIn as any} onBlur={fOut as any} />
                </div>

                <div>
                  <FL>Description</FL>
                  <textarea className="fac-ta" rows={3}
                    placeholder="Brief overview of this faculty…"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <button className="fac-cnl" onClick={closeModal}>Cancel</button>
                  <button className="fac-sub" onClick={submit} disabled={saving}>
                    {saving
                      ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'fac-spin .7s linear infinite' }} />Saving…</>
                      : <>{editing ? 'Update' : 'Create'} Faculty</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminFacultyPage;