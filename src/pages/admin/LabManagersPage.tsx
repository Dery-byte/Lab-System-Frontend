// import { useEffect, useState } from 'react';
// import { Users, Plus, Edit, Trash2, Search, UserCog, CheckCircle } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal, Select } from '../../components/ui';
// import api from '../../services/api';
// import { User, DEPARTMENT_OPTIONS } from '../../types';

// interface CreateLabManagerRequest {
//   studentId: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   department: string;
// }

// const LabManagersPage = () => {
//   const [labManagers, setLabManagers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingManager, setEditingManager] = useState<User | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [formData, setFormData] = useState<CreateLabManagerRequest>({
//     studentId: '',
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     department: '',
//   });

//   useEffect(() => {
//     fetchLabManagers();
//   }, []);

//   const fetchLabManagers = async () => {
//     try {
//       const response = await api.get('/admin/lab-managers');
//       setLabManagers(response.data.data || []);
//     } catch (error) {
//       toast.error('Failed to load lab managers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdd = () => {
//     setEditingManager(null);
//     setFormData({
//       studentId: '',
//       email: '',
//       password: '',
//       firstName: '',
//       lastName: '',
//       department: '',
//     });
//     setIsModalOpen(true);
//   };

//   const handleEdit = (manager: User) => {
//     setEditingManager(manager);
//     setFormData({
//       studentId: manager.studentId,
//       email: manager.email,
//       password: '',
//       firstName: manager.firstName,
//       lastName: manager.lastName,
//       department: manager.department ?? '',
//       // department: manager.department,
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

//     try {
//       await api.delete(`/admin/lab-managers/${id}`);
//       toast.success('Lab manager deactivated');
//       fetchLabManagers();
//     } catch (error) {
//       toast.error('Failed to deactivate lab manager');
//     }
//   };


//   const handleDeactivate = async (id: number) => {
//     if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

//     try {
//       await api.patch(`/admin/lab-managers/${id}/deactivate`);
//       toast.success('Lab manager deactivated');
//       fetchLabManagers();
//     } catch (error) {
//       toast.error('Failed to deactivate lab manager');
//     }
//   };


//   const handleActivate = async (id: number) => {
//     if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

//     try {
//       await api.patch(`/admin/lab-managers/${id}/activate`);
//       toast.success('Lab manager deactivated');
//       fetchLabManagers();
//     } catch (error) {
//       toast.error('Failed to deactivate lab manager');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.studentId || !formData.email || !formData.firstName || !formData.lastName || !formData.department) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (!editingManager && !formData.password) {
//       toast.error('Password is required for new lab managers');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       if (editingManager) {
//         await api.put(`/admin/lab-managers/${editingManager.id}`, formData);
//         toast.success('Lab manager updated successfully');
//       } else {
//         await api.post('/admin/create-lab-manager', formData);
//         toast.success('Lab manager created successfully');
//       }
//       setIsModalOpen(false);
//       fetchLabManagers();
//     } catch (error: any) {
//       const message = error.response?.data?.message || 'Failed to save lab manager';
//       toast.error(message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // const filteredManagers = labManagers.filter(manager =>
//   //   manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   manager.department.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//   const filteredManagers = labManagers.filter(manager =>
//     manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (manager.department ?? '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return <Loading text="Loading lab managers..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Lab Managers</h1>
//           <p className="text-gray-600 mt-1">Manage lab manager accounts (Super Admin only)</p>
//         </div>
//         <Button onClick={handleAdd}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Lab Manager
//         </Button>
//       </div>

//       {/* Search */}
//       <Card>
//         <CardContent className="py-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search lab managers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Lab Managers Grid */}
//       {filteredManagers.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <UserCog className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No lab managers found</h3>
//             <p className="text-gray-500 mt-1">
//               {searchTerm ? 'Try a different search term' : 'Add your first lab manager'}
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredManagers.map((manager) => (
//             <Card key={manager.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-indigo-100 rounded-lg">
//                       <UserCog className="w-5 h-5 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{manager.fullName}</h3>
//                       <p className="text-sm text-gray-500">{manager.studentId}</p>
//                     </div>
//                   </div>
//                   <Badge variant={manager.enabled ? 'success' : 'default'}>
//                     {manager.enabled ? 'Active' : 'Inactive'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-sm">
//                   {/* <pre>{JSON.stringify(manager, null, 2)}</pre> */}
//                   <p><span className="text-gray-500">Email:</span> {manager.email}</p>
//                   <p><span className="text-gray-500">Department:</span> {manager.departmentName}</p>
//                   <p><span className="text-gray-500">Role: </span>{manager.role}</p>
//                 </div>
//                 <div className="flex justify-between mt-4 pt-4 border-t">
//                   <Button size="sm" variant="secondary" onClick={() => handleEdit(manager)}>
//                     <Edit className="w-4 h-4 mr-1" />
//                     Edit
//                   </Button>
//                   {manager.enabled ? (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleDeactivate(manager.id)}
//                       className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Deactivate
//                     </Button>
//                   ) : (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleActivate(manager.id)}
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

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingManager ? 'Edit Lab Manager' : 'Add Lab Manager'}
//         size="md"
//       >
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="First Name *"
//               placeholder="John"
//               value={formData.firstName}
//               onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//             />
//             <Input
//               label="Last Name *"
//               placeholder="Doe"
//               value={formData.lastName}
//               onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//             />
//           </div>

//           <Input
//             label="Employee ID *"
//             placeholder="LABMGR001"
//             value={formData.studentId}
//             onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
//           />

//           <Input
//             label="Email *"
//             type="email"
//             placeholder="manager@university.edu"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           />

//           <Input
//             label={editingManager ? 'New Password (leave blank to keep current)' : 'Password *'}
//             type="password"
//             placeholder="••••••••"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           />

//           <Select
//             label="Department *"
//             options={[
//               { value: '', label: 'Select Department' },
//               ...DEPARTMENT_OPTIONS.map(d => ({ value: d, label: d })),
//             ]}
//             value={formData.department}
//             onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//           />

//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} isLoading={isSaving}>
//               {editingManager ? 'Update' : 'Create'} Lab Manager
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default LabManagersPage;




import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, UserCog, CheckCircle, Mail, Hash, Building, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loading, Modal, Input, Select } from '../../components/ui';
import api from '../../services/api';
import { User, DEPARTMENT_OPTIONS } from '../../types';

interface CreateLabManagerRequest {
  studentId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
}

// ─── Deterministic avatar colour from name ────────────────────────────────────

const AVATAR_PALETTES = [
  { from: '#3b82f6', to: '#6366f1' }, // blue → indigo
  { from: '#10b981', to: '#059669' }, // emerald
  { from: '#f59e0b', to: '#d97706' }, // amber
  { from: '#8b5cf6', to: '#7c3aed' }, // violet
  { from: '#ef4444', to: '#dc2626' }, // red
  { from: '#06b6d4', to: '#0891b2' }, // cyan
  { from: '#ec4899', to: '#db2777' }, // pink
  { from: '#84cc16', to: '#65a30d' }, // lime
];

const avatarPalette = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
};

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name, muted = false, size = 44 }: { name: string; muted?: boolean; size?: number }) => {
  const p = avatarPalette(name);
  return (
    <div
      className={`rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 transition-all duration-300 ${muted ? 'grayscale opacity-50' : ''}`}
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
        boxShadow: muted ? 'none' : `0 4px 14px ${p.from}40`,
      }}
    >
      {initials(name)}
    </div>
  );
};

// ─── Status pulse ─────────────────────────────────────────────────────────────

const StatusDot = ({ active }: { active: boolean }) => (
  <span className="relative flex h-2.5 w-2.5">
    {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
  </span>
);

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-2 text-[12px] text-slate-500">
    <span className="text-slate-400 flex-shrink-0">{icon}</span>
    <span className="truncate">{value}</span>
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spin = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
  </svg>
);

// ─── Form field wrapper ───────────────────────────────────────────────────────

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
    {children}
  </div>
);

const TextInput = ({
  type = 'text', value, onChange, placeholder,
}: { type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl
      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white
      placeholder:text-slate-300 transition-all duration-150"
  />
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LabManagersPage = () => {
  const [labManagers, setLabManagers]     = useState<User[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingManager, setEditingManager] = useState<User | null>(null);
  const [isSaving, setIsSaving]           = useState(false);
  const [formData, setFormData]           = useState<CreateLabManagerRequest>({
    studentId: '', email: '', password: '', firstName: '', lastName: '', department: '',
  });

  useEffect(() => { fetchLabManagers(); }, []);

  const fetchLabManagers = async () => {
    try {
      const response = await api.get('/admin/lab-managers');
      setLabManagers(response.data.data || []);
    } catch { toast.error('Failed to load lab managers'); }
    finally { setLoading(false); }
  };

  const handleAdd = () => {
    setEditingManager(null);
    setFormData({ studentId: '', email: '', password: '', firstName: '', lastName: '', department: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (manager: User) => {
    setEditingManager(manager);
    setFormData({
      studentId: manager.studentId, email: manager.email, password: '',
      firstName: manager.firstName, lastName: manager.lastName, department: manager.department ?? '',
    });
    setIsModalOpen(true);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Deactivate this lab manager?')) return;
    try {
      await api.patch(`/admin/lab-managers/${id}/deactivate`);
      toast.success('Lab manager deactivated');
      fetchLabManagers();
    } catch { toast.error('Failed to deactivate'); }
  };

  const handleActivate = async (id: number) => {
    if (!confirm('Activate this lab manager?')) return;
    try {
      await api.patch(`/admin/lab-managers/${id}/activate`);
      toast.success('Lab manager activated');
      fetchLabManagers();
    } catch { toast.error('Failed to activate'); }
  };

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.email || !formData.firstName || !formData.lastName || !formData.department) {
      toast.error('Please fill in all required fields'); return;
    }
    if (!editingManager && !formData.password) {
      toast.error('Password is required for new lab managers'); return;
    }
    setIsSaving(true);
    try {
      if (editingManager) {
        await api.put(`/admin/lab-managers/${editingManager.id}`, formData);
        toast.success('Lab manager updated');
      } else {
        await api.post('/admin/create-lab-manager', formData);
        toast.success('Lab manager created');
      }
      setIsModalOpen(false);
      fetchLabManagers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally { setIsSaving(false); }
  };

  const filtered = labManagers.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.department ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount   = labManagers.filter(m => m.enabled).length;
  const inactiveCount = labManagers.filter(m => !m.enabled).length;

  if (loading) return <Loading text="Loading lab managers..." />;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Administration</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Managers</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[12px] text-slate-500">
              <span className="font-semibold text-emerald-600">{activeCount} active</span>
              {inactiveCount > 0 && <> · <span className="text-slate-400">{inactiveCount} inactive</span></>}
            </span>
          </div>
        </div>

        {/* Search + Add in one row */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, dept…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-150
                placeholder:text-slate-300"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all duration-150 active:scale-[0.97] shadow-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Manager
          </button>
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 gap-3">
          <UserCog className="w-12 h-12 opacity-25" />
          <p className="text-base font-semibold text-slate-500">
            {searchTerm ? 'No managers match your search' : 'No lab managers yet'}
          </p>
          {!searchTerm && (
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-all">
              <Plus className="w-4 h-4" /> Add first manager
            </button>
          )}
        </div>
      ) : (

        // /* ── Manager grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((manager, idx) => (
            <div
              key={manager.id}
              className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
                ${manager.enabled ? 'border-slate-200/80' : 'border-slate-200/50 opacity-70'}`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Card top accent line — colour-matched to avatar */}
              <div className="h-[3px] w-full"
                style={{ background: `linear-gradient(90deg, ${avatarPalette(manager.fullName || 'X').from}, ${avatarPalette(manager.fullName || 'X').to})` }}
              />

              <div className="p-5">
                {/* Identity row */}
                <div className="flex items-start gap-3.5">
                  <Avatar name={manager.fullName || 'User'} muted={!manager.enabled} size={48} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                        {manager.fullName}
                      </h3>
                      <StatusDot active={!!manager.enabled} />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                      {manager.role?.replace('_', ' ') ?? 'Lab Manager'}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5">
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={manager.email} />
                  <InfoRow icon={<Hash className="w-3.5 h-3.5" />} value={manager.studentId} />
                  <InfoRow icon={<Building className="w-3.5 h-3.5" />} value={manager.departmentName ?? manager.department ?? '—'} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(manager)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-150 active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>

                  {manager.enabled ? (
                    <button
                      onClick={() => handleDeactivate(manager.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-150 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(manager.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all duration-150 active:scale-95"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Activate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL ════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingManager ? 'Edit Lab Manager' : 'New Lab Manager'}
        size="md"
      >
        <div className="space-y-4">

          {/* Avatar preview at top of modal */}
          {(formData.firstName || formData.lastName) && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <Avatar name={`${formData.firstName} ${formData.lastName}`.trim()} size={44} />
              <div>
                <p className="text-[14px] font-bold text-slate-800">
                  {`${formData.firstName} ${formData.lastName}`.trim() || 'Preview'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Lab Manager</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name *">
              <TextInput value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} placeholder="Jane" />
            </FormField>
            <FormField label="Last Name *">
              <TextInput value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} placeholder="Doe" />
            </FormField>
          </div>

          <FormField label="Employee ID *">
            <TextInput value={formData.studentId} onChange={v => setFormData({ ...formData, studentId: v })} placeholder="LABMGR001" />
          </FormField>

          <FormField label="Email *">
            <TextInput type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="manager@university.edu" />
          </FormField>

          <FormField label={editingManager ? 'New Password (leave blank to keep)' : 'Password *'}>
            <TextInput type="password" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} placeholder="••••••••" />
          </FormField>

          <FormField label="Department *">
            <div className="relative">
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full appearance-none px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white transition-all duration-150"
              >
                <option value="">Select department…</option>
                {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </FormField>

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
              {isSaving ? <><Spin /> Saving…</> : editingManager ? 'Update Manager' : 'Create Manager'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LabManagersPage;
