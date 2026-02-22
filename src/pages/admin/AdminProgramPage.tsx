// import { useEffect, useState } from 'react';
// import {
//   Plus, Edit, Search, LayoutGrid, List,
//   ToggleLeft, ToggleRight, X, GraduationCap, Users, Clock, BookOpen,
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { departmentService } from '../../services/departmentService';
// import { programService } from '../../services/programService';
// import { Program, CreateProgramRequest, Department } from '../../types';

// // ─── Palette keyed to program code ───────────────────────────────────────────

// const PALETTES = [
//   { bg: '#dbeafe', accent: '#2563eb', soft: '#eff6ff' },
//   { bg: '#fef3c7', accent: '#d97706', soft: '#fffbeb' },
//   { bg: '#dcfce7', accent: '#16a34a', soft: '#f0fdf4' },
//   { bg: '#f3e8ff', accent: '#9333ea', soft: '#faf5ff' },
//   { bg: '#fee2e2', accent: '#dc2626', soft: '#fef2f2' },
//   { bg: '#e0f2fe', accent: '#0284c7', soft: '#f0f9ff' },
//   { bg: '#fce7f3', accent: '#db2777', soft: '#fdf2f8' },
//   { bg: '#ccfbf1', accent: '#0d9488', soft: '#f0fdfa' },
//   { bg: '#e0e7ff', accent: '#4f46e5', soft: '#eef2ff' },
//   { bg: '#fef9c3', accent: '#ca8a04', soft: '#fefce8' },
// ];

// const getPalette = (code: string) => {
//   let h = 0;
//   for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
//   return PALETTES[Math.abs(h) % PALETTES.length];
// };

// // ─── Shared sub-components ────────────────────────────────────────────────────

// const ProgramBadge = ({ code, size = 44 }: { code: string; size?: number }) => {
//   const p = getPalette(code);
//   return (
//     <div style={{
//       width: size, height: size, background: p.bg,
//       border: `1.5px solid ${p.accent}30`, borderRadius: 10,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       flexShrink: 0,
//     }}>
//       <span style={{
//         fontSize: size * 0.26, fontWeight: 700, color: p.accent,
//         letterSpacing: '-0.01em', fontFamily: "'Cabinet Grotesk', sans-serif",
//         lineHeight: 1, textAlign: 'center' as const,
//       }}>
//         {(code || '?').slice(0, 5)}
//       </span>
//     </div>
//   );
// };

// const StatusPill = ({ active }: { active: boolean }) => (
//   <span style={{
//     display: 'inline-flex', alignItems: 'center', gap: 5,
//     padding: '2px 9px', borderRadius: 999,
//     background: active ? '#f0fdf4' : '#f8fafc',
//     border: `1px solid ${active ? '#bbf7d0' : '#e2e8f0'}`,
//     fontSize: 10.5, fontWeight: 600,
//     color: active ? '#15803d' : '#94a3b8',
//     fontFamily: "'Cabinet Grotesk', sans-serif",
//     letterSpacing: '0.03em', flexShrink: 0,
//   }}>
//     <span style={{
//       width: 5.5, height: 5.5, borderRadius: '50%',
//       background: active ? '#22c55e' : '#cbd5e1', flexShrink: 0,
//     }} />
//     {active ? 'Active' : 'Inactive'}
//   </span>
// );

// const Tag = ({ children }: { children: React.ReactNode }) => (
//   <span style={{
//     padding: '3px 8px', background: '#f1f5f9',
//     borderRadius: 5, fontSize: 11, color: '#475569',
//     fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500,
//     whiteSpace: 'nowrap' as const,
//   }}>
//     {children}
//   </span>
// );

// const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//     <span style={{ color: '#94a3b8', display: 'flex' }}>{icon}</span>
//     <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{value}</span>
//     <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{label}</span>
//   </div>
// );

// // ─── Form inputs ──────────────────────────────────────────────────────────────

// const inp: React.CSSProperties = {
//   width: '100%', padding: '9px 12px', fontSize: 13.5,
//   border: '1.5px solid #e2e8f0', borderRadius: 8,
//   background: '#f8fafc', color: '#0f172a', outline: 'none',
//   fontFamily: "'Cabinet Grotesk', sans-serif",
//   boxSizing: 'border-box' as const,
//   transition: 'all .15s',
// };

// const FInput = ({ value, onChange, placeholder, type = 'text', maxLength }: {
//   value: string | number; onChange: (v: string) => void;
//   placeholder?: string; type?: string; maxLength?: number;
// }) => (
//   <input
//     type={type} value={value} placeholder={placeholder} maxLength={maxLength}
//     onChange={e => onChange(e.target.value)} style={inp}
//     onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
//     onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
//   />
// );

// const FSelect = ({ value, onChange, children }: {
//   value: string | number; onChange: (v: string) => void; children: React.ReactNode;
// }) => (
//   <div style={{ position: 'relative' }}>
//     <select value={value} onChange={e => onChange(e.target.value)}
//       style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
//       onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
//       onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
//     >
//       {children}
//     </select>
//     <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
//       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//     </svg>
//   </div>
// );

// const FLabel = ({ children }: { children: React.ReactNode }) => (
//   <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
//     {children}
//   </label>
// );

// const FTextarea = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
//   <textarea
//     value={value} placeholder={placeholder} rows={3}
//     onChange={e => onChange(e.target.value)}
//     style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.5 }}
//     onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
//     onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
//   />
// );

// const DurationPills = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
//   <div style={{ display: 'flex', gap: 6 }}>
//     {[1, 2, 3, 4, 5, 6].map(n => (
//       <button key={n} type="button" onClick={() => onChange(n)} style={{
//         flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13,
//         fontWeight: 700, cursor: 'pointer',
//         fontFamily: "'Cabinet Grotesk', sans-serif",
//         border: `1.5px solid ${value === n ? '#6366f1' : '#e2e8f0'}`,
//         background: value === n ? '#eef2ff' : '#f8fafc',
//         color: value === n ? '#4f46e5' : '#94a3b8',
//         transition: 'all .12s',
//       }}>
//         {n}yr
//       </button>
//     ))}
//   </div>
// );

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const AdminProgramPage = () => {
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editing, setEditing] = useState<Program | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   const [formData, setFormData] = useState<CreateProgramRequest>({
//     code: '', name: '', description: '', departmentId: 0, durationYears: 4, degreeType: '',
//   });

//   useEffect(() => { fetchPrograms(); fetchDepartments(); }, []);

//   const fetchPrograms = async () => {
//     try {
//       setLoading(true);
//       setPrograms(await programService.getAll());
//     } catch { toast.error('Failed to load programs'); }
//     finally { setLoading(false); }
//   };

//   const fetchDepartments = async () => {
//     try { setDepartments(await departmentService.getAll()); }
//     catch { toast.error('Failed to load departments'); }
//   };

//   const openAdd = () => {
//     setEditing(null);
//     setFormData({ code: '', name: '', description: '', departmentId: 0, durationYears: 4, degreeType: '' });
//     setIsModalOpen(true);
//   };

//   const openEdit = (p: Program) => {
//     setEditing(p);
//     setFormData({
//       code: p.code, name: p.name, description: p.description || '',
//       departmentId: departments.find(d => d.name === p.departmentName)?.id || 0,
//       durationYears: p.durationYears, degreeType: p.degreeType || '',
//     });
//     setIsModalOpen(true);
//   };

//   // const activate = async (id: number) => {
//   //   try { await programService.activate(id); toast.success('Activated'); fetchPrograms(); }
//   //   catch { toast.error('Failed to activate'); }
//   // };

//   // const deactivate = async (id: number) => {
//   //   try { await programService.deactivate(id); toast.success('Deactivated'); fetchPrograms(); }
//   //   catch { toast.error('Failed to deactivate'); }
//   // };

//   const toggleStatus = async (id: number) => {
//     try { await programService.toggleStatus(id); toast.success('Status updated'); }
//     catch { toast.error('Failed to update status'); }
//   };

//   const handleSubmit = async () => {
//     if (!formData.code || !formData.name || !formData.departmentId) {
//       toast.error('Please fill in all required fields'); return;
//     }
//     setIsSaving(true);
//     try {
//       if (editing) {
//         await programService.update(editing.id, formData);
//         toast.success('Program updated');
//       } else {
//         await programService.create(formData);
//         toast.success('Program created');
//       }
//       setIsModalOpen(false);
//       fetchPrograms();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || 'Failed to save');
//     } finally { setIsSaving(false); }
//   };

//   const activeCount = programs.filter(p => p.active).length;
//   const inactiveCount = programs.length - activeCount;

//   const filtered = programs.filter(p => {
//     const q = searchTerm.toLowerCase();
//     const m = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.departmentName?.toLowerCase().includes(q);
//     const s = filter === 'all' ? true : filter === 'active' ? p.active : !p.active;
//     return m && s;
//   });

//   const pp = getPalette(formData.code || 'X');

//   if (loading) return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
//       <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'app-spin .75s linear infinite' }} />
//       <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading programs…</span>
//       <style>{`@keyframes app-spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

//         @keyframes app-spin   { to { transform: rotate(360deg); } }
//         @keyframes app-fadein { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes app-rise   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes app-spring { from { opacity: 0; transform: translateY(18px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

//         .app-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; }
//         .app-wrap  { max-width: 1280px; margin: 0 auto; animation: app-rise .35s ease both; }

//         .app-card {
//           background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
//           overflow: hidden; display: flex; flex-direction: column;
//           transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease; cursor: default;
//         }
//         .app-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-2px); border-color: #c7d2fe; }
//         .app-card-dim { opacity: .5; filter: saturate(.25); }

//         .app-row {
//           background: #fff; border: 1px solid #e8e5df; border-radius: 10px;
//           padding: 12px 18px; display: flex; align-items: center; gap: 14px;
//           transition: box-shadow .15s, border-color .15s;
//         }
//         .app-row:hover { box-shadow: 0 3px 12px rgba(0,0,0,.06); border-color: #c7d2fe; }
//         .app-row-dim { opacity: .45; filter: saturate(.2); }

//         .ab {
//           display: inline-flex; align-items: center; gap: 5px;
//           padding: 6px 12px; border-radius: 7px; font-size: 12.5px;
//           font-weight: 600; cursor: pointer; border: 1px solid;
//           font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s; background: transparent;
//         }
//         .ab:active { transform: scale(.95); }
//         .ab-edit  { color: #475569; border-color: #e2e8f0; background: #f8fafc; }
//         .ab-edit:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
//         .ab-on  { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
//         .ab-on:hover  { background: #dcfce7; }
//         .ab-off { color: #64748b; border-color: #e2e8f0; background: #f8fafc; }
//         .ab-off:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
//         .ab-icon { padding: 6px 8px; }

//         .add-btn {
//           display: inline-flex; align-items: center; gap: 7px;
//           padding: 9px 18px; border-radius: 9px; border: none;
//           background: #18181b; color: #fff; font-size: 13.5px; font-weight: 700;
//           font-family: 'Cabinet Grotesk', sans-serif; cursor: pointer;
//           transition: background .15s, transform .1s;
//           box-shadow: 0 1px 6px rgba(0,0,0,.15); flex-shrink: 0;
//         }
//         .add-btn:hover  { background: #27272a; }
//         .add-btn:active { transform: scale(.97); }

//         .fchip {
//           padding: 5px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
//           border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
//           font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
//         }
//         .fchip:hover:not(.fc-on) { border-color: #a5b4fc; color: #4f46e5; }
//         .fc-on { background: #18181b; color: #fff; border-color: #18181b; }

//         .vtgl {
//           width: 33px; height: 33px; border-radius: 8px; border: 1px solid #e2e8f0;
//           background: #fff; cursor: pointer; display: flex;
//           align-items: center; justify-content: center; color: #94a3b8; transition: all .12s;
//         }
//         .vtgl-on { background: #eef2ff; border-color: #a5b4fc; color: #4f46e5; }
//         .vtgl:hover:not(.vtgl-on) { border-color: #a5b4fc; color: #6366f1; }

//         .app-overlay {
//           position: fixed; inset: 0; z-index: 200;
//           background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
//           display: flex; align-items: center; justify-content: center;
//           padding: 20px; animation: app-fadein .2s ease;
//         }
//         .app-modal {
//           background: #fff; border-radius: 18px; width: 100%; max-width: 560px;
//           max-height: 92vh; overflow-y: auto;
//           box-shadow: 0 32px 80px rgba(0,0,0,.18);
//           animation: app-spring .28s cubic-bezier(.34,1.56,.64,1) both;
//         }

//         .close-btn {
//           width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0;
//           background: #f8fafc; display: flex; align-items: center; justify-content: center;
//           cursor: pointer; color: #94a3b8; transition: all .12s; flex-shrink: 0;
//         }
//         .close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

//         .sub-btn {
//           display: inline-flex; align-items: center; gap: 7px;
//           padding: 9px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 700;
//           cursor: pointer; border: none; background: #18181b; color: #fff;
//           font-family: 'Cabinet Grotesk', sans-serif; transition: background .12s, transform .1s;
//         }
//         .sub-btn:hover   { background: #27272a; }
//         .sub-btn:active  { transform: scale(.97); }
//         .sub-btn:disabled { opacity: .45; cursor: not-allowed; }

//         .cnl-btn {
//           padding: 9px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
//           cursor: pointer; border: 1px solid #e2e8f0; background: transparent;
//           color: #64748b; font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
//         }
//         .cnl-btn:hover { background: #f1f5f9; }

//         .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }

//         @media (max-width: 640px) {
//           .app-page { padding: 24px 16px; }
//           .g2 { grid-template-columns: 1fr; }
//         }
//       `}</style>

//       <div className="app-page">
//         <div className="app-wrap">

//           {/* ── Header ───────────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 30 }}>
//             <div>
//               <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px' }}>
//                 Admin · Programs
//               </p>
//               <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
//                 Programs
//               </h1>
//               <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
//                 <span style={{ color: '#16a34a', fontWeight: 700 }}>{activeCount} active</span>
//                 {inactiveCount > 0 && <> &middot; <span>{inactiveCount} inactive</span></>}
//                 {' '}&middot; {programs.length} total
//               </p>
//             </div>
//             <button className="add-btn" onClick={openAdd}>
//               <Plus size={15} strokeWidth={2.5} /> Add Program
//             </button>
//           </div>

//           {/* ── Toolbar ──────────────────────────────────────────────────────── */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
//             <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
//               <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
//               <input
//                 type="text" placeholder="Search name, code, dept…"
//                 value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 style={{ ...inp, paddingLeft: 32, borderRadius: 9, fontSize: 13 }}
//                 onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
//                 onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
//               />
//             </div>

//             <div style={{ display: 'flex', gap: 6 }}>
//               {(['all', 'active', 'inactive'] as const).map(f => (
//                 <button key={f} className={`fchip ${filter === f ? 'fc-on' : ''}`} onClick={() => setFilter(f)}>
//                   {f.charAt(0).toUpperCase() + f.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
//               <button className={`vtgl ${viewMode === 'grid' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={14} /></button>
//               <button className={`vtgl ${viewMode === 'list' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('list')}><List size={14} /></button>
//             </div>
//           </div>

//           {/* ── Empty ────────────────────────────────────────────────────────── */}
//           {filtered.length === 0 ? (
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '80px 40px', border: '1.5px dashed #e2e8f0', borderRadius: 16, textAlign: 'center' }}>
//               <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <GraduationCap size={24} color="#cbd5e1" />
//               </div>
//               <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No programs found</p>
//               <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>
//                 {searchTerm ? 'Try a different search term or clear filters' : 'Add your first program to get started'}
//               </p>
//               {!searchTerm && (
//                 <button className="add-btn" style={{ marginTop: 6 }} onClick={openAdd}>
//                   <Plus size={14} /> Add Program
//                 </button>
//               )}
//             </div>

//           ) : viewMode === 'grid' ? (
//             /* ── GRID ──────────────────────────────────────────────────────── */
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
//               {filtered.map((prog) => {
//                 const p = getPalette(prog.code);
//                 return (
//                   <div key={prog.id} className={`app-card ${!prog.active ? 'app-card-dim' : ''}`}>
//                     {/* Top accent stripe */}
//                     <div style={{ height: 3.5, background: `linear-gradient(90deg, ${p.accent}, ${p.accent}60)` }} />

//                     <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

//                       {/* Identity */}
//                       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
//                           <ProgramBadge code={prog.code} size={44} />
//                           <div style={{ minWidth: 0 }}>
//                             <p style={{ fontSize: 11, fontWeight: 600, color: p.accent, margin: '0 0 3px', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                               {prog.code}
//                             </p>
//                             <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, color: '#18181b', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                               {prog.name}
//                             </h3>
//                           </div>
//                         </div>
//                         <StatusPill active={!!prog.active} />
//                       </div>

//                       {/* Tags */}
//                       <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
//                         {prog.degreeType && <Tag>{prog.degreeType}</Tag>}
//                         <Tag>{prog.durationYears} yr{prog.durationYears !== 1 ? 's' : ''}</Tag>
//                         {prog.departmentName && <Tag>{prog.departmentName}</Tag>}
//                       </div>

//                       {/* Description */}
//                       {prog.description && (
//                         <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
//                           {prog.description}
//                         </p>
//                       )}

//                       {/* Stats */}
//                       <div style={{ display: 'flex', gap: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
//                         <StatItem icon={<Users size={13} />} value={prog.studentsCount ?? 0} label="students" />
//                         <StatItem icon={<BookOpen size={13} />} value={prog.coursesCount ?? 0} label="courses" />
//                         <StatItem icon={<Clock size={13} />} value={`${prog.durationYears}yr`} label="duration" />
//                       </div>

//                       {/* Actions */}
//                       <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
//                         <button className="ab ab-edit" style={{ flex: 1 }} onClick={() => openEdit(prog)}>
//                           <Edit size={12} /> Edit
//                         </button>
//                         <button
//                           className={`ab ${prog.active ? 'ab-on' : 'ab-off'}`}
//                           style={{ flex: 1 }}
//                           onClick={() => toggleStatus(prog.id)}                        >
//                           {prog.active
//                             ? <><ToggleRight size={14} /> Active</>
//                             : <><ToggleLeft size={14} /> Inactive</>
//                           }
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//           ) : (
//             /* ── LIST ──────────────────────────────────────────────────────── */
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//               {/* Column labels */}
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: '40px 1fr 110px 80px 60px 64px 56px 80px',
//                 gap: 12, padding: '0 16px 6px', alignItems: 'center',
//               }}>
//                 {['', 'Program', 'Department', 'Degree', 'Dur.', 'Students', 'Courses', ''].map((h, i) => (
//                   <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{h}</span>
//                 ))}
//               </div>

//               {filtered.map(prog => {
//                 const p = getPalette(prog.code);
//                 return (
//                   <div key={prog.id} className={`app-row ${!prog.active ? 'app-row-dim' : ''}`}
//                     style={{ display: 'grid', gridTemplateColumns: '40px 1fr 110px 80px 60px 64px 56px 80px', gap: 12, alignItems: 'center' }}>

//                     <ProgramBadge code={prog.code} size={36} />

//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//                         <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {prog.name}
//                         </span>
//                         <StatusPill active={!!prog.active} />
//                       </div>
//                       <span style={{ fontSize: 11, color: p.accent, fontWeight: 600 }}>{prog.code}</span>
//                     </div>

//                     <span style={{ fontSize: 12.5, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.departmentName}</span>
//                     <Tag>{prog.degreeType || '—'}</Tag>
//                     <span style={{ fontSize: 12.5, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{prog.durationYears} yr</span>

//                     <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                       <Users size={12} color="#94a3b8" />
//                       <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{prog.studentsCount ?? 0}</span>
//                     </div>

//                     <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                       <BookOpen size={12} color="#94a3b8" />
//                       <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{prog.coursesCount ?? 0}</span>
//                     </div>

//                     <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
//                       <button className="ab ab-edit ab-icon" onClick={() => openEdit(prog)}><Edit size={13} /></button>
//                       <button className={`ab ab-icon ${prog.active ? 'ab-on' : 'ab-off'}`} onClick={() => toggleStatus(prog.id)}>
//                         {prog.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* ── Modal ──────────────────────────────────────────────────────────── */}
//         {isModalOpen && (
//           <div className="app-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
//             <div className="app-modal">

//               {/* Modal header */}
//               <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
//                 <div>
//                   <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
//                     {editing ? `Editing · ${editing.code}` : 'New Program'}
//                   </p>
//                   <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24, color: '#18181b', margin: 0, letterSpacing: '-0.01em' }}>
//                     {editing ? editing.name : 'Add a Program'}
//                   </h2>
//                 </div>
//                 <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
//               </div>

//               {/* Live preview */}
//               {(formData.code || formData.name) && (
//                 <div style={{ margin: '14px 22px 0', padding: '12px 14px', background: pp.soft, border: `1px solid ${pp.accent}20`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <ProgramBadge code={formData.code || '?'} size={38} />
//                   <div>
//                     <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0 }}>
//                       {formData.name || 'Program Name'}
//                     </p>
//                     <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
//                       {formData.code && <span style={{ fontSize: 11, fontWeight: 600, color: pp.accent }}>{formData.code}</span>}
//                       {formData.degreeType && <span style={{ fontSize: 11, color: '#64748b' }}>{formData.degreeType}</span>}
//                       {formData.durationYears > 0 && <span style={{ fontSize: 11, color: '#64748b' }}>{formData.durationYears} yr program</span>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Form */}
//               <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

//                 <div className="g2">
//                   <div>
//                     <FLabel>Program Code *</FLabel>
//                     <FInput value={formData.code} onChange={v => setFormData({ ...formData, code: v.toUpperCase() })} placeholder="BSC-CS" maxLength={20} />
//                   </div>
//                   <div>
//                     <FLabel>Program Name *</FLabel>
//                     <FInput value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Computer Science" />
//                   </div>
//                 </div>

//                 <div className="g2">
//                   <div>
//                     <FLabel>Degree Type</FLabel>
//                     <FInput value={formData.degreeType} onChange={v => setFormData({ ...formData, degreeType: v })} placeholder="BSc, MSc, PhD…" />
//                   </div>
//                   <div>
//                     <FLabel>Department *</FLabel>
//                     <FSelect value={formData.departmentId} onChange={v => setFormData({ ...formData, departmentId: Number(v) })}>
//                       <option value={0}>Select department…</option>
//                       {departments.filter(d => d.active).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//                     </FSelect>
//                   </div>
//                 </div>

//                 <div>
//                   <FLabel>Duration (Years)</FLabel>
//                   <DurationPills value={formData.durationYears} onChange={v => setFormData({ ...formData, durationYears: v })} />
//                 </div>

//                 <div>
//                   <FLabel>Description</FLabel>
//                   <FTextarea value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="Brief overview of the program…" />
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 2 }}>
//                   <button className="cnl-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
//                   <button className="sub-btn" onClick={handleSubmit} disabled={isSaving}>
//                     {isSaving
//                       ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'app-spin .7s linear infinite' }} /> Saving…</>
//                       : <>{editing ? 'Update' : 'Create'} Program</>
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

// export default AdminProgramPage;






// AdminProgramPage.tsx — styled to match AdminCoursesPage design system

import { useEffect, useState } from 'react';
import {
  Plus, Edit, Search, LayoutGrid, List,
  ToggleLeft, ToggleRight, X, GraduationCap, Users, Clock, BookOpen,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { departmentService } from '../../services/departmentService';
import { programService } from '../../services/programService';
import { Program, CreateProgramRequest, Department } from '../../types';

// ─── Palette keyed to program code ───────────────────────────────────────────

const PALETTES = [
  { bg: '#dbeafe', accent: '#2563eb', soft: '#eff6ff' },
  { bg: '#fef3c7', accent: '#d97706', soft: '#fffbeb' },
  { bg: '#dcfce7', accent: '#16a34a', soft: '#f0fdf4' },
  { bg: '#f3e8ff', accent: '#9333ea', soft: '#faf5ff' },
  { bg: '#fee2e2', accent: '#dc2626', soft: '#fef2f2' },
  { bg: '#e0f2fe', accent: '#0284c7', soft: '#f0f9ff' },
  { bg: '#fce7f3', accent: '#db2777', soft: '#fdf2f8' },
  { bg: '#ccfbf1', accent: '#0d9488', soft: '#f0fdfa' },
  { bg: '#e0e7ff', accent: '#4f46e5', soft: '#eef2ff' },
  { bg: '#fef9c3', accent: '#ca8a04', soft: '#fefce8' },
];

const getPalette = (code: string) => {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return PALETTES[Math.abs(h) % PALETTES.length];
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const ProgramBadge = ({ code, size = 44 }: { code: string; size?: number }) => {
  const p = getPalette(code);
  return (
    <div style={{
      width: size, height: size, background: p.bg,
      border: `1.5px solid ${p.accent}30`, borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontSize: size * 0.26, fontWeight: 700, color: p.accent,
        letterSpacing: '-0.01em', fontFamily: "'Cabinet Grotesk', sans-serif",
        lineHeight: 1, textAlign: 'center' as const,
      }}>
        {(code || '?').slice(0, 5)}
      </span>
    </div>
  );
};

const StatusPill = ({ active }: { active: boolean }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '2px 9px', borderRadius: 999,
    background: active ? '#f0fdf4' : '#f8fafc',
    border: `1px solid ${active ? '#bbf7d0' : '#e2e8f0'}`,
    fontSize: 10.5, fontWeight: 600,
    color: active ? '#15803d' : '#94a3b8',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    letterSpacing: '0.03em', flexShrink: 0,
  }}>
    <span style={{
      width: 5.5, height: 5.5, borderRadius: '50%',
      background: active ? '#22c55e' : '#cbd5e1', flexShrink: 0,
    }} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    padding: '3px 8px', background: '#f1f5f9',
    borderRadius: 5, fontSize: 11, color: '#475569',
    fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  }}>
    {children}
  </span>
);

const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ color: '#94a3b8', display: 'flex' }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{value}</span>
    <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{label}</span>
  </div>
);

// ─── Form inputs ──────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13.5,
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#0f172a', outline: 'none',
  fontFamily: "'Cabinet Grotesk', sans-serif",
  boxSizing: 'border-box' as const,
  transition: 'all .15s',
};

const FInput = ({ value, onChange, placeholder, type = 'text', maxLength }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number;
}) => (
  <input
    type={type} value={value} placeholder={placeholder} maxLength={maxLength}
    onChange={e => onChange(e.target.value)} style={inp}
    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
  />
);

const FSelect = ({ value, onChange, children }: {
  value: string | number; onChange: (v: string) => void; children: React.ReactNode;
}) => (
  <div style={{ position: 'relative' }}>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
    >
      {children}
    </select>
    <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </div>
);

const FLabel = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 5, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
    {children}
  </label>
);

const FTextarea = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <textarea
    value={value} placeholder={placeholder} rows={3}
    onChange={e => onChange(e.target.value)}
    style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.5 }}
    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
  />
);

const DurationPills = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {[1, 2, 3, 4, 5, 6].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)} style={{
        flex: 1, padding: '8px 0', borderRadius: 7, fontSize: 13,
        fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Cabinet Grotesk', sans-serif",
        border: `1.5px solid ${value === n ? '#6366f1' : '#e2e8f0'}`,
        background: value === n ? '#eef2ff' : '#f8fafc',
        color: value === n ? '#4f46e5' : '#94a3b8',
        transition: 'all .12s',
      }}>
        {n}yr
      </button>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminProgramPage = () => {
  const [programs, setPrograms]       = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');
  const [filter, setFilter]           = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing]         = useState<Program | null>(null);
  const [isSaving, setIsSaving]       = useState(false);

  const [formData, setFormData] = useState<CreateProgramRequest>({
    code: '', name: '', description: '', departmentId: 0, durationYears: 4, degreeType: '',
  });

  useEffect(() => { fetchPrograms(); fetchDepartments(); }, []);

  const fetchPrograms = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setPrograms(await programService.getAll());
    } catch { toast.error('Failed to load programs'); }
    finally { if (!silent) setLoading(false); }
  };

  const fetchDepartments = async () => {
    try { setDepartments(await departmentService.getAll()); }
    catch { toast.error('Failed to load departments'); }
  };

  const openAdd = () => {
    setEditing(null);
    setFormData({ code: '', name: '', description: '', departmentId: 0, durationYears: 4, degreeType: '' });
    setIsModalOpen(true);
  };

  const openEdit = (p: Program) => {
    setEditing(p);
    setFormData({
      code: p.code, name: p.name, description: p.description || '',
      departmentId: departments.find(d => d.name === p.departmentName)?.id || 0,
      durationYears: p.durationYears, degreeType: p.degreeType || '',
    });
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    try { await programService.toggleStatus(id); toast.success('Status updated'); fetchPrograms(true); }
    catch { toast.error('Failed to update status'); }
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.departmentId) {
      toast.error('Please fill in all required fields'); return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await programService.update(editing.id, formData);
        toast.success('Program updated');
      } else {
        await programService.create(formData);
        toast.success('Program created');
      }
      setIsModalOpen(false);
      fetchPrograms(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setIsSaving(false); }
  };

  const activeCount   = programs.filter(p => p.active).length;
  const inactiveCount = programs.length - activeCount;

  const filtered = programs.filter(p => {
    const q = searchTerm.toLowerCase();
    const m = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.departmentName?.toLowerCase().includes(q);
    const s = filter === 'all' ? true : filter === 'active' ? p.active : !p.active;
    return m && s;
  });

  const pp = getPalette(formData.code || 'X');

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'app-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading programs…</span>
      <style>{`@keyframes app-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes app-spin   { to { transform: rotate(360deg); } }
        @keyframes app-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes app-rise   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes app-spring { from { opacity: 0; transform: translateY(18px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .app-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; }
        .app-wrap  { max-width: 1280px; margin: 0 auto; animation: app-rise .35s ease both; }

        .app-card {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease; cursor: default;
        }
        .app-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-2px); border-color: #c7d2fe; }
        .app-card-dim { opacity: .5; filter: saturate(.25); }

        .app-row {
          background: #fff; border: 1px solid #e8e5df; border-radius: 10px;
          padding: 12px 18px; display: flex; align-items: center; gap: 14px;
          transition: box-shadow .15s, border-color .15s;
        }
        .app-row:hover { box-shadow: 0 3px 12px rgba(0,0,0,.06); border-color: #c7d2fe; }
        .app-row-dim { opacity: .45; filter: saturate(.2); }

        .ab {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px; font-size: 12.5px;
          font-weight: 600; cursor: pointer; border: 1px solid;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s; background: transparent;
        }
        .ab:active { transform: scale(.95); }
        .ab-edit  { color: #475569; border-color: #e2e8f0; background: #f8fafc; }
        .ab-edit:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
        .ab-on  { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
        .ab-on:hover  { background: #dcfce7; }
        .ab-off { color: #64748b; border-color: #e2e8f0; background: #f8fafc; }
        .ab-off:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
        .ab-icon { padding: 6px 8px; }

        .add-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px; border: none;
          background: #18181b; color: #fff; font-size: 13.5px; font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif; cursor: pointer;
          transition: background .15s, transform .1s;
          box-shadow: 0 1px 6px rgba(0,0,0,.15); flex-shrink: 0;
        }
        .add-btn:hover  { background: #27272a; }
        .add-btn:active { transform: scale(.97); }

        .fchip {
          padding: 5px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .fchip:hover:not(.fc-on) { border-color: #a5b4fc; color: #4f46e5; }
        .fc-on { background: #18181b; color: #fff; border-color: #18181b; }

        .vtgl {
          width: 33px; height: 33px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #94a3b8; transition: all .12s;
        }
        .vtgl-on { background: #eef2ff; border-color: #a5b4fc; color: #4f46e5; }
        .vtgl:hover:not(.vtgl-on) { border-color: #a5b4fc; color: #6366f1; }

        .app-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: app-fadein .2s ease;
        }
        .app-modal {
          background: #fff; border-radius: 18px; width: 100%; max-width: 560px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,.18);
          animation: app-spring .28s cubic-bezier(.34,1.56,.64,1) both;
        }

        .close-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0;
          background: #f8fafc; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8; transition: all .12s; flex-shrink: 0;
        }
        .close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

        .sub-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 20px; border-radius: 8px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; border: none; background: #18181b; color: #fff;
          font-family: 'Cabinet Grotesk', sans-serif; transition: background .12s, transform .1s;
        }
        .sub-btn:hover   { background: #27272a; }
        .sub-btn:active  { transform: scale(.97); }
        .sub-btn:disabled { opacity: .45; cursor: not-allowed; }

        .cnl-btn {
          padding: 9px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; border: 1px solid #e2e8f0; background: transparent;
          color: #64748b; font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .cnl-btn:hover { background: #f1f5f9; }

        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }

        @media (max-width: 640px) {
          .app-page { padding: 24px 16px; }
          .g2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app-page">
        <div className="app-wrap">

          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 30 }}>
            <div>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px' }}>
                Admin · Programs
              </p>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
                Programs
              </h1>
              <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{activeCount} active</span>
                {inactiveCount > 0 && <> &middot; <span>{inactiveCount} inactive</span></>}
                {' '}&middot; {programs.length} total
              </p>
            </div>
            <button className="add-btn" onClick={openAdd}>
              <Plus size={15} strokeWidth={2.5} /> Add Program
            </button>
          </div>

          {/* ── Toolbar ──────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
              <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="text" placeholder="Search name, code, dept…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ ...inp, paddingLeft: 32, borderRadius: 9, fontSize: 13 }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button key={f} className={`fchip ${filter === f ? 'fc-on' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
              <button className={`vtgl ${viewMode === 'grid' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={14} /></button>
              <button className={`vtgl ${viewMode === 'list' ? 'vtgl-on' : ''}`} onClick={() => setViewMode('list')}><List size={14} /></button>
            </div>
          </div>

          {/* ── Empty ────────────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '80px 40px', border: '1.5px dashed #e2e8f0', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No programs found</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>
                {searchTerm ? 'Try a different search term or clear filters' : 'Add your first program to get started'}
              </p>
              {!searchTerm && (
                <button className="add-btn" style={{ marginTop: 6 }} onClick={openAdd}>
                  <Plus size={14} /> Add Program
                </button>
              )}
            </div>

          ) : viewMode === 'grid' ? (
            /* ── GRID ──────────────────────────────────────────────────────── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filtered.map((prog) => {
                const p = getPalette(prog.code);
                return (
                  <div key={prog.id} className={`app-card ${!prog.active ? 'app-card-dim' : ''}`}>
                    {/* Top accent stripe */}
                    <div style={{ height: 3.5, background: `linear-gradient(90deg, ${p.accent}, ${p.accent}60)` }} />

                    <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

                      {/* Identity */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                          <ProgramBadge code={prog.code} size={44} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: p.accent, margin: '0 0 3px', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prog.code}
                            </p>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, color: '#18181b', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {prog.name}
                            </h3>
                          </div>
                        </div>
                        <StatusPill active={!!prog.active} />
                      </div>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {prog.degreeType && <Tag>{prog.degreeType}</Tag>}
                        <Tag>{prog.durationYears} yr{prog.durationYears !== 1 ? 's' : ''}</Tag>
                        {prog.departmentName && <Tag>{prog.departmentName}</Tag>}
                      </div>

                      {/* Description */}
                      {prog.description && (
                        <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                          {prog.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                        <StatItem icon={<Users size={13} />} value={prog.studentsCount ?? 0} label="students" />
                        <StatItem icon={<BookOpen size={13} />} value={prog.coursesCount ?? 0} label="courses" />
                        <StatItem icon={<Clock size={13} />} value={`${prog.durationYears}yr`} label="duration" />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                        <button className="ab ab-edit" style={{ flex: 1 }} onClick={() => openEdit(prog)}>
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          className={`ab ${prog.active ? 'ab-on' : 'ab-off'}`}
                          style={{ flex: 1 }}
                          onClick={() => toggleStatus(prog.id)}
                        >
                          {prog.active
                            ? <><ToggleRight size={14} /> Active</>
                            : <><ToggleLeft size={14} /> Inactive</>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : (
            /* ── LIST ──────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {/* Column labels */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 110px 80px 60px 64px 56px 80px',
                gap: 12, padding: '0 16px 6px', alignItems: 'center',
              }}>
                {['', 'Program', 'Department', 'Degree', 'Dur.', 'Students', 'Courses', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{h}</span>
                ))}
              </div>

              {filtered.map(prog => {
                const p = getPalette(prog.code);
                return (
                  <div key={prog.id} className={`app-row ${!prog.active ? 'app-row-dim' : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: '40px 1fr 110px 80px 60px 64px 56px 80px', gap: 12, alignItems: 'center' }}>

                    <ProgramBadge code={prog.code} size={36} />

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prog.name}
                        </span>
                        <StatusPill active={!!prog.active} />
                      </div>
                      <span style={{ fontSize: 11, color: p.accent, fontWeight: 600 }}>{prog.code}</span>
                    </div>

                    <span style={{ fontSize: 12.5, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.departmentName}</span>
                    <Tag>{prog.degreeType || '—'}</Tag>
                    <span style={{ fontSize: 12.5, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{prog.durationYears} yr</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Users size={12} color="#94a3b8" />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{prog.studentsCount ?? 0}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <BookOpen size={12} color="#94a3b8" />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{prog.coursesCount ?? 0}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="ab ab-edit ab-icon" onClick={() => openEdit(prog)}><Edit size={13} /></button>
                      <button className={`ab ab-icon ${prog.active ? 'ab-on' : 'ab-off'}`} onClick={() => toggleStatus(prog.id)}>
                        {prog.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal ──────────────────────────────────────────────────────────── */}
        {isModalOpen && (
          <div className="app-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
            <div className="app-modal">

              {/* Modal header */}
              <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {editing ? `Editing · ${editing.code}` : 'New Program'}
                  </p>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24, color: '#18181b', margin: 0, letterSpacing: '-0.01em' }}>
                    {editing ? editing.name : 'Add a Program'}
                  </h2>
                </div>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
              </div>

              {/* Live preview */}
              {(formData.code || formData.name) && (
                <div style={{ margin: '14px 22px 0', padding: '12px 14px', background: pp.soft, border: `1px solid ${pp.accent}20`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ProgramBadge code={formData.code || '?'} size={38} />
                  <div>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0 }}>
                      {formData.name || 'Program Name'}
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                      {formData.code && <span style={{ fontSize: 11, fontWeight: 600, color: pp.accent }}>{formData.code}</span>}
                      {formData.degreeType && <span style={{ fontSize: 11, color: '#64748b' }}>{formData.degreeType}</span>}
                      {formData.durationYears > 0 && <span style={{ fontSize: 11, color: '#64748b' }}>{formData.durationYears} yr program</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div className="g2">
                  <div>
                    <FLabel>Program Code *</FLabel>
                    <FInput value={formData.code} onChange={v => setFormData({ ...formData, code: v.toUpperCase() })} placeholder="BSC-CS" maxLength={20} />
                  </div>
                  <div>
                    <FLabel>Program Name *</FLabel>
                    <FInput value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="Computer Science" />
                  </div>
                </div>

                <div className="g2">
                  <div>
                    <FLabel>Degree Type</FLabel>
                    <FInput value={formData.degreeType} onChange={v => setFormData({ ...formData, degreeType: v })} placeholder="BSc, MSc, PhD…" />
                  </div>
                  <div>
                    <FLabel>Department *</FLabel>
                    <FSelect value={formData.departmentId} onChange={v => setFormData({ ...formData, departmentId: Number(v) })}>
                      <option value={0}>Select department…</option>
                      {departments.filter(d => d.active).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </FSelect>
                  </div>
                </div>

                <div>
                  <FLabel>Duration (Years)</FLabel>
                  <DurationPills value={formData.durationYears} onChange={v => setFormData({ ...formData, durationYears: v })} />
                </div>

                <div>
                  <FLabel>Description</FLabel>
                  <FTextarea value={formData.description} onChange={v => setFormData({ ...formData, description: v })} placeholder="Brief overview of the program…" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 2 }}>
                  <button className="cnl-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="sub-btn" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving
                      ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'app-spin .7s linear infinite' }} /> Saving…</>
                      : <>{editing ? 'Update' : 'Create'} Program</>
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

export default AdminProgramPage;