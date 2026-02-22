

// import { useEffect, useState } from 'react';
// import { Building, Plus, Edit, Trash2, Search, CheckCircle } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal } from '../../components/ui';
// import { departmentService } from '../../services/departmentService';
// import { facultyService } from '../../services/facultyService';
// import { Department, CreateDepartmentRequest } from '../../types';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface FacultyOption {
//   id: number;
//   code: string;
//   name: string;
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const DepartmentsPage = () => {
//   const [departments, setDepartments]       = useState<Department[]>([]);
//   const [faculties, setFaculties]           = useState<FacultyOption[]>([]);
//   const [loading, setLoading]               = useState(true);
//   const [searchTerm, setSearchTerm]         = useState('');
//   const [isModalOpen, setIsModalOpen]       = useState(false);
//   const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
//   const [isSaving, setIsSaving]             = useState(false);
//   const [formData, setFormData]             = useState<CreateDepartmentRequest>({
//     code: '',
//     name: '',
//     description: '',
//     facultyId: 0,
//     headOfDepartment: '',
//   });

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const [deptData, facultyData] = await Promise.all([
//         departmentService.getAll(),
//         facultyService.getAllActive(),
//       ]);
//       setDepartments(deptData);
//       setFaculties(facultyData);
//     } catch {
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       setDepartments(await departmentService.getAll());
//     } catch {
//       toast.error('Failed to load departments');
//     }
//   };

//   // ── Handlers ────────────────────────────────────────────────────────────────

//   const handleAdd = () => {
//     setEditingDepartment(null);
//     setFormData({
//       code: '',
//       name: '',
//       description: '',
//       facultyId: faculties[0]?.id ?? 0,
//       headOfDepartment: '',
//     });
//     setIsModalOpen(true);
//   };

//   const handleEdit = (dept: Department) => {
//     setEditingDepartment(dept);
//     setFormData({
//       code: dept.code,
//       name: dept.name,
//       description:     dept.description || '',
//       facultyId:       dept.facultyId || 0,
//       headOfDepartment: dept.headOfDepartment || '',
//     });
//     setIsModalOpen(true);
//   };

//   const activateDepartment = async (id: number) => {
//     if (!confirm('Activate this department?')) return;
//     try {
//       await departmentService.activateDepartment(id);
//       toast.success('Department activated');
//       fetchDepartments();
//     } catch {
//       toast.error('Failed to activate department');
//     }
//   };

//   const deactivateDepartment = async (id: number) => {
//     if (!confirm('Deactivate this department?')) return;
//     try {
//       await departmentService.deactivateDepartment(id);
//       toast.success('Department deactivated');
//       fetchDepartments();
//     } catch {
//       toast.error('Failed to deactivate department');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.code || !formData.name || !formData.facultyId) {
//       toast.error('Code, name and faculty are required');
//       return;
//     }
//     setIsSaving(true);
//     try {
//       if (editingDepartment) {
//         await departmentService.update(editingDepartment.id, formData);
//         toast.success('Department updated successfully');
//       } else {
//         await departmentService.create(formData);
//         toast.success('Department created successfully');
//       }
//       setIsModalOpen(false);
//       fetchDepartments();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save department');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ── Filter ───────────────────────────────────────────────────────────────────

//   const filteredDepartments = departments.filter(dept =>
//     dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (dept.faculty ?? '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Helper: resolve faculty name from id for display
//   const getFacultyName = (dept: Department) =>
//     dept.faculty || faculties.find(f => f.id === dept.facultyId)?.name || '—';

//   if (loading) return <Loading text="Loading departments..." />;

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
//           <p className="text-gray-600 mt-1">Manage academic departments (Super Admin only)</p>
//         </div>
//         <Button onClick={handleAdd}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Department
//         </Button>
//       </div>

//       {/* Search */}
//       <Card>
//         <CardContent className="py-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search departments..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Grid */}
//       {filteredDepartments.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No departments found</h3>
//             <p className="text-gray-500 mt-1">
//               {searchTerm ? 'Try a different search term' : 'Add your first department'}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredDepartments.map(dept => (
//             <Card key={dept.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-primary-100 rounded-lg">
//                       <Building className="w-5 h-5 text-primary-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{dept.name}</h3>
//                       <p className="text-sm text-gray-500">{dept.code}</p>
//                     </div>
//                   </div>
//                   <Badge variant={dept.active ? 'success' : 'default'}>
//                     {dept.active ? 'Active' : 'Inactive'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-gray-500">Faculty:</span> {getFacultyName(dept)}</p>
//                   {dept.headOfDepartment && (
//                     <p><span className="text-gray-500">HOD:</span> {dept.headOfDepartment}</p>
//                   )}
//                   {dept.description && (
//                     <p className="text-gray-600">{dept.description}</p>
//                   )}
//                   {dept.courseCount !== undefined && (
//                     <p><span className="text-gray-500">Courses:</span> {dept.courseCount}</p>
//                   )}
//                 </div>

//                 <div className="flex justify-between mt-4 pt-4 border-t">
//                   <Button size="sm" variant="secondary" onClick={() => handleEdit(dept)}>
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   {dept.active ? (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => deactivateDepartment(dept.id)}
//                       className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Deactivate
//                     </Button>
//                   ) : (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => activateDepartment(dept.id)}
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
//         title={editingDepartment ? 'Edit Department' : 'Add Department'}
//         size="md"
//       >
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="Department Code *"
//               placeholder="e.g., CS, PHY"
//               value={formData.code}
//               onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
//               maxLength={10}
//             />
//             <Input
//               label="Department Name *"
//               placeholder="e.g., Computer Science"
//               value={formData.name}
//               onChange={e => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>

//           {/* ── Faculty dropdown ── */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Faculty <span className="text-red-500">*</span>
//             </label>
//             {faculties.length === 0 ? (
//               <div className="px-3 py-2 border border-amber-200 bg-amber-50 rounded-lg text-sm text-amber-700">
//                 No active faculties found. Please add a faculty first.
//               </div>
//             ) : (
//               <select
//                 value={formData.facultyId}
//                 onChange={e => setFormData({ ...formData, facultyId: Number(e.target.value) })}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
//               >
//                 <option value={0} disabled>Select a faculty…</option>
//                 {faculties.map(f => (
//                   <option key={f.id} value={f.id}>
//                     {f.name} ({f.code})
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <Input
//             label="Head of Department"
//             placeholder="e.g., Dr. John Smith"
//             value={formData.headOfDepartment}
//             onChange={e => setFormData({ ...formData, headOfDepartment: e.target.value })}
//           />

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea
//               rows={3}
//               placeholder="Brief description of the department..."
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
//               {editingDepartment ? 'Update' : 'Create'} Department
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default DepartmentsPage;







import { useEffect, useState } from 'react';
import {
  Building, Plus, Edit, Trash2, Search, CheckCircle,
  GraduationCap, User, BookOpen, ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loading, Modal } from '../../components/ui';
import { departmentService } from '../../services/departmentService';
import { facultyService } from '../../services/facultyService';
import { Department, CreateDepartmentRequest } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FacultyOption { id: number; code: string; name: string; }

// ─── Faculty colour system ────────────────────────────────────────────────────

const PALETTES = [
  { from: '#3b82f6', to: '#6366f1', light: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  { from: '#10b981', to: '#059669', light: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  { from: '#f59e0b', to: '#d97706', light: '#fffbeb', text: '#92400e', border: '#fde68a' },
  { from: '#8b5cf6', to: '#7c3aed', light: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  { from: '#ef4444', to: '#dc2626', light: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  { from: '#06b6d4', to: '#0891b2', light: '#ecfeff', text: '#155e75', border: '#a5f3fc' },
  { from: '#ec4899', to: '#db2777', light: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  { from: '#84cc16', to: '#65a30d', light: '#f7fee7', text: '#3f6212', border: '#d9f99d' },
];

const palette = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTES[Math.abs(h) % PALETTES.length];
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const CodeBadge = ({ code, facultyName }: { code: string; facultyName: string }) => {
  const p = palette(facultyName || 'default');
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[11px] tracking-wide text-white flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, boxShadow: `0 4px 12px ${p.from}45` }}
    >
      {code.slice(0, 3)}
    </div>
  );
};

const StatusDot = ({ active }: { active: boolean }) => (
  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
    {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
  </span>
);

const MetaRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-2 text-[12px] text-slate-500">
    <span className="text-slate-400 flex-shrink-0">{icon}</span>
    <span className="truncate">{value}</span>
  </div>
);

const Spin = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
  </svg>
);

const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const TextInput = ({
  value, onChange, placeholder, maxLength, className = '',
}: { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; className?: string }) => (
  <input
    type="text"
    value={value}
    maxLength={maxLength}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl
      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white
      placeholder:text-slate-300 transition-all duration-150 ${className}`}
  />
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const DepartmentsPage = () => {
  const [departments, setDepartments]             = useState<Department[]>([]);
  const [faculties, setFaculties]                 = useState<FacultyOption[]>([]);
  const [loading, setLoading]                     = useState(true);
  const [searchTerm, setSearchTerm]               = useState('');
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isSaving, setIsSaving]                   = useState(false);
  const [formData, setFormData]                   = useState<CreateDepartmentRequest>({
    code: '', name: '', description: '', facultyId: 0, headOfDepartment: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [deptData, facultyData] = await Promise.all([
        departmentService.getAll(), facultyService.getAllActive(),
      ]);
      setDepartments(deptData); setFaculties(facultyData);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try { setDepartments(await departmentService.getAll()); }
    catch { toast.error('Failed to load departments'); }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({ code: '', name: '', description: '', facultyId: faculties[0]?.id ?? 0, headOfDepartment: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({ code: dept.code, name: dept.name, description: dept.description || '', facultyId: dept.facultyId || 0, headOfDepartment: dept.headOfDepartment || '' });
    setIsModalOpen(true);
  };

  const activateDepartment = async (id: number) => {
    if (!confirm('Activate this department?')) return;
    try { await departmentService.activateDepartment(id); toast.success('Activated'); fetchDepartments(); }
    catch { toast.error('Failed to activate'); }
  };

  const deactivateDepartment = async (id: number) => {
    if (!confirm('Deactivate this department?')) return;
    try { await departmentService.deactivateDepartment(id); toast.success('Deactivated'); fetchDepartments(); }
    catch { toast.error('Failed to deactivate'); }
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.facultyId) {
      toast.error('Code, name and faculty are required'); return;
    }
    setIsSaving(true);
    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, formData);
        toast.success('Department updated');
      } else {
        await departmentService.create(formData);
        toast.success('Department created');
      }
      setIsModalOpen(false); fetchDepartments();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to save'); }
    finally { setIsSaving(false); }
  };

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.faculty ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFacultyName = (dept: Department) =>
    dept.faculty || faculties.find(f => f.id === dept.facultyId)?.name || '—';

  const activeCount   = departments.filter(d => d.active).length;
  const inactiveCount = departments.filter(d => !d.active).length;

  if (loading) return <Loading text="Loading departments..." />;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Academic Structure</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-[12px] text-slate-500 mt-1">
            <span className="font-semibold text-emerald-600">{activeCount} active</span>
            {inactiveCount > 0 && <> · <span className="text-slate-400">{inactiveCount} inactive</span></>}
            {faculties.length > 0 && <> · {faculties.length} facult{faculties.length === 1 ? 'y' : 'ies'}</>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, code, faculty…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all active:scale-[0.97] shadow-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {/* ── Faculty legend chips ────────────────────────────────────────────── */}
      {faculties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {faculties.map(f => {
            const p = palette(f.name);
            return (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                style={{ background: p.light, color: p.text, borderColor: p.border }}
              >
                <GraduationCap className="w-3 h-3" /> {f.name}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Empty ──────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl gap-3">
          <Building className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-500">
            {searchTerm ? 'No departments match your search' : 'No departments yet'}
          </p>
          {!searchTerm && (
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all">
              <Plus className="w-4 h-4" /> Add first department
            </button>
          )}
        </div>
      ) : (

        /* ── Grid ──────────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dept, idx) => {
            const facultyName = getFacultyName(dept);
            const p = palette(facultyName);
            return (
              <div
                key={dept.id}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
                  ${dept.active ? 'border-slate-200/80' : 'border-slate-200/50 opacity-65'}`}
                style={{ animationDelay: `${idx * 35}ms` }}
              >
                {/* Faculty-coloured top stripe */}
                <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${p.from}, ${p.to})` }} />

                <div className="p-5">
                  {/* Identity */}
                  <div className="flex items-start gap-3.5">
                    <CodeBadge code={dept.code} facultyName={facultyName} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight truncate">{dept.name}</h3>
                        <StatusDot active={!!dept.active} />
                      </div>
                      <p className="text-[11px] font-mono font-bold text-slate-400 tracking-wider mt-0.5">{dept.code}</p>
                    </div>
                  </div>

                  {/* Faculty chip */}
                  <div className="mt-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold border"
                      style={{ background: p.light, color: p.text, borderColor: p.border }}
                    >
                      <GraduationCap className="w-3 h-3" /> {facultyName}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-3 space-y-1.5">
                    {dept.headOfDepartment && (
                      <MetaRow icon={<User className="w-3.5 h-3.5" />} value={dept.headOfDepartment} />
                    )}
                    {dept.courseCount !== undefined && (
                      <MetaRow icon={<BookOpen className="w-3.5 h-3.5" />} value={`${dept.courseCount} course${dept.courseCount !== 1 ? 's' : ''}`} />
                    )}
                    {dept.description && (
                      <p className="text-[12px] text-slate-400 leading-relaxed mt-1 line-clamp-2">{dept.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>

                    {dept.active ? (
                      <button
                        onClick={() => deactivateDepartment(dept.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activateDepartment(dept.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ MODAL ═══════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? 'Edit Department' : 'New Department'}
        size="md"
      >
        <div className="space-y-4">

          {/* Live preview */}
          {(formData.code || formData.name) && (() => {
            const prevFaculty = faculties.find(f => f.id === formData.facultyId);
            const p = palette(prevFaculty?.name || 'default');
            return (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[11px] text-white tracking-wide flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                >
                  {(formData.code || '???').slice(0, 3)}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800">{formData.name || 'Department Name'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{prevFaculty?.name || 'Select faculty below'}</p>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel required>Code</FormLabel>
              <TextInput
                value={formData.code}
                onChange={v => setFormData({ ...formData, code: v.toUpperCase() })}
                placeholder="CS"
                maxLength={10}
                className="font-mono font-bold tracking-widest"
              />
            </div>
            <div>
              <FormLabel required>Department Name</FormLabel>
              <TextInput
                value={formData.name}
                onChange={v => setFormData({ ...formData, name: v })}
                placeholder="Computer Science"
              />
            </div>
          </div>

          {/* Faculty select */}
          <div>
            <FormLabel required>Faculty</FormLabel>
            {faculties.length === 0 ? (
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                No active faculties found — please add a faculty first.
              </div>
            ) : (
              <div className="relative">
                <select
                  value={formData.facultyId}
                  onChange={e => setFormData({ ...formData, facultyId: Number(e.target.value) })}
                  className="w-full appearance-none px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white transition-all"
                >
                  <option value={0} disabled>Select a faculty…</option>
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>

          <div>
            <FormLabel>Head of Department</FormLabel>
            <TextInput
              value={formData.headOfDepartment}
              onChange={v => setFormData({ ...formData, headOfDepartment: v })}
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <FormLabel>Description</FormLabel>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the department…"
              className="w-full px-4 py-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white
                placeholder:text-slate-300 leading-relaxed transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-all active:scale-[0.97]"
            >
              {isSaving ? <><Spin /> Saving…</> : editingDepartment ? 'Update Department' : 'Create Department'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;