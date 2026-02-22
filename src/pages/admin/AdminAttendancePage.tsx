// import { useEffect, useState } from 'react';
// import { UserCheck, Calendar, Save, Search } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader,Alert,Badge, Button, Loading, Select, EmptyState, Input } from '../../components/ui';
// import { labSessionService, registrationService, attendanceService } from '../../services';
// import { Registration, LabSession, Attendance, MarkAttendanceRequest } from '../../types';
// // import { Badge } from '../../components/ui/Badge';


// const AdminAttendancePage = () => {
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);
//   const [selectedSession, setSelectedSession] = useState<number | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [attendanceMap, setAttendanceMap] = useState<Record<number, { present: boolean; notes: string }>>({});

//   useEffect(() => {
//     labSessionService.getAll().then(data => {
//       setSessions(data.filter(s => s.status === 'OPEN'));
//     }).catch(() => toast.error('Failed to load sessions'))
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (selectedSession) {
//       setLoading(true);
//       Promise.all([
//         registrationService.getBySession(selectedSession),
//         selectedDate ? attendanceService.getBySessionAndDate(selectedSession, selectedDate) : Promise.resolve([]),
//       ]).then(([regs, attendance]) => {
//         const confirmed = regs.filter(r => r.status === 'CONFIRMED');
//         setRegistrations(confirmed);
//         setExistingAttendance(attendance);
        
//         // Initialize attendance map
//         const map: Record<number, { present: boolean; notes: string }> = {};
//         confirmed.forEach(reg => {
//           const existing = attendance.find(a => a.registrationId === reg.id);
//           map[reg.id] = { present: existing?.present ?? false, notes: existing?.notes ?? '' };
//         });
//         setAttendanceMap(map);
//       }).catch(() => toast.error('Failed to load data'))
//         .finally(() => setLoading(false));
//     }
//   }, [selectedSession, selectedDate]);

//   const toggleAttendance = (regId: number) => {
//     setAttendanceMap(prev => ({
//       ...prev,
//       [regId]: { ...prev[regId], present: !prev[regId]?.present }
//     }));
//   };

//   const updateNotes = (regId: number, notes: string) => {
//     setAttendanceMap(prev => ({
//       ...prev,
//       [regId]: { ...prev[regId], notes }
//     }));
//   };

//   const handleSave = async () => {
//     if (!selectedSession || !selectedDate) return;
    
//     setSaving(true);
//     try {
//       const request: MarkAttendanceRequest = {
//         labSessionId: selectedSession,
//         sessionDate: selectedDate,
//         attendances: Object.entries(attendanceMap).map(([regId, data]) => ({
//           registrationId: parseInt(regId),
//           present: data.present,
//           notes: data.notes || undefined,
//         })),
//       };
      
//       await attendanceService.markAttendance(request);
//       toast.success('Attendance saved successfully!');
      
//       // Refresh existing attendance
//       const attendance = await attendanceService.getBySessionAndDate(selectedSession, selectedDate);
//       setExistingAttendance(attendance);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save attendance');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const markAllPresent = () => {
//     const newMap: Record<number, { present: boolean; notes: string }> = {};
//     registrations.forEach(reg => {
//       newMap[reg.id] = { present: true, notes: attendanceMap[reg.id]?.notes ?? '' };
//     });
//     setAttendanceMap(newMap);
//   };

//   const markAllAbsent = () => {
//     const newMap: Record<number, { present: boolean; notes: string }> = {};
//     registrations.forEach(reg => {
//       newMap[reg.id] = { present: false, notes: attendanceMap[reg.id]?.notes ?? '' };
//     });
//     setAttendanceMap(newMap);
//   };

//   const presentCount = Object.values(attendanceMap).filter(a => a.present).length;
//   const totalCount = registrations.length;

//   if (loading && !selectedSession) return <Loading text="Loading..." />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
//         <p className="text-gray-600 mt-1">Mark attendance for lab sessions</p>
//       </div>

//       {/* Session and Date Selection */}
//       <Card>
//         <CardContent className="py-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <Select label="Select Lab Session" value={selectedSession?.toString() || ''}
//                 onChange={e => setSelectedSession(e.target.value ? parseInt(e.target.value) : null)}
//                 options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode})` }))}
//                 placeholder="Choose a session..." />
//             </div>
//             <div className="w-48">
//               <Input label="Date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {!selectedSession ? (
//         <Card><CardContent>
//           <EmptyState icon={UserCheck} title="Select a session" description="Choose a lab session to mark attendance" />
//         </CardContent></Card>
//       ) : loading ? (
//         <Loading text="Loading registrations..." />
//       ) : registrations.length === 0 ? (
//         <Card><CardContent>
//           <EmptyState icon={UserCheck} title="No confirmed registrations" description="There are no confirmed students for this session" />
//         </CardContent></Card>
//       ) : (
//         <>
//           {/* Summary and Actions */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div className="flex items-center gap-4">
//               <Badge variant="success" size="md">{presentCount} Present</Badge>
//               <Badge variant="danger" size="md">{totalCount - presentCount} Absent</Badge>
//               <span className="text-gray-500">of {totalCount} students</span>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="secondary" size="sm" onClick={markAllPresent}>Mark All Present</Button>
//               <Button variant="secondary" size="sm" onClick={markAllAbsent}>Mark All Absent</Button>
//               <Button onClick={handleSave} isLoading={saving}>
//                 <Save className="w-4 h-4 mr-2" />Save Attendance
//               </Button>
//             </div>
//           </div>

//           {existingAttendance.length > 0 && (
//             <Alert variant="info">
//               Attendance has already been recorded for this date. You can update it below.
//             </Alert>
//           )}

//           {/* Attendance List */}
//           <Card>
//             <CardContent className="p-0">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Present</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {registrations.map(reg => {
//                     const attendance = attendanceMap[reg.id] || { present: false, notes: '' };
//                     return (
//                       <tr key={reg.id} className={attendance.present ? 'bg-green-50' : 'bg-red-50'}>
//                         <td className="px-4 py-3">
//                           <button onClick={() => toggleAttendance(reg.id)}
//                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
//                               attendance.present ? 'bg-green-500 text-white' : 'bg-red-200 text-red-600'
//                             }`}>
//                             {attendance.present ? '✓' : '✗'}
//                           </button>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="font-medium text-gray-900">{reg.studentName}</p>
//                           <p className="text-sm text-gray-500">{reg.studentIdNumber}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <Badge variant="info">Slot {reg.slotNumber}</Badge>
//                         </td>
//                         <td className="px-4 py-3">
//                           <input type="text" value={attendance.notes} onChange={e => updateNotes(reg.id, e.target.value)}
//                             placeholder="Add notes..."
//                             className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500" />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default AdminAttendancePage;


import { useEffect, useState } from 'react';
import {
  UserCheck, Calendar, Save, ChevronDown,
  Check, X, Users, ClipboardList, Info,
  CheckCircle2, XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { labSessionService, registrationService, attendanceService } from '../../services';
import { Registration, LabSession, Attendance, MarkAttendanceRequest } from '../../types';

// ─── Deterministic avatar palette ────────────────────────────────────────────

const AVATAR_PALETTES = [
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#dcfce7', color: '#15803d' },
  { bg: '#fef3c7', color: '#b45309' },
  { bg: '#f3e8ff', color: '#7e22ce' },
  { bg: '#fee2e2', color: '#b91c1c' },
  { bg: '#e0f2fe', color: '#0369a1' },
  { bg: '#fce7f3', color: '#be185d' },
  { bg: '#ccfbf1', color: '#0f766e' },
];

const avatarPalette = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTES[Math.abs(h) % AVATAR_PALETTES.length];
};

const initials = (name: string) =>
  name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ─── Styled atoms ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13.5,
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#18181b', outline: 'none',
  fontFamily: "'Cabinet Grotesk', sans-serif",
  boxSizing: 'border-box' as const, transition: 'all .15s',
};

const FLabel = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: '#64748b', marginBottom: 5, fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.03em' }}>
    {children}
  </label>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const AdminAttendancePage = () => {
  const [sessions, setSessions]               = useState<LabSession[]>([]);
  const [registrations, setRegistrations]     = useState<Registration[]>([]);
  const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedDate, setSelectedDate]       = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading]                 = useState(true);
  const [loadingList, setLoadingList]         = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [search, setSearch]                   = useState('');
  const [attendanceMap, setAttendanceMap]     = useState<Record<number, { present: boolean; notes: string }>>({});

  useEffect(() => {
    labSessionService.getAll()
      .then(data => setSessions(data.filter(s => s.status === 'OPEN')))
      .catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    setLoadingList(true);
    Promise.all([
      registrationService.getBySession(selectedSession),
      selectedDate ? attendanceService.getBySessionAndDate(selectedSession, selectedDate) : Promise.resolve([]),
    ]).then(([regs, attendance]) => {
      const confirmed = regs.filter(r => r.status === 'CONFIRMED');
      setRegistrations(confirmed);
      setExistingAttendance(attendance);
      const map: Record<number, { present: boolean; notes: string }> = {};
      confirmed.forEach(reg => {
        const ex = attendance.find(a => a.registrationId === reg.id);
        map[reg.id] = { present: ex?.present ?? false, notes: ex?.notes ?? '' };
      });
      setAttendanceMap(map);
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoadingList(false));
  }, [selectedSession, selectedDate]);

  const toggle = (id: number) =>
    setAttendanceMap(p => ({ ...p, [id]: { ...p[id], present: !p[id]?.present } }));

  const updateNotes = (id: number, notes: string) =>
    setAttendanceMap(p => ({ ...p, [id]: { ...p[id], notes } }));

  const markAll = (present: boolean) => {
    const m: Record<number, { present: boolean; notes: string }> = {};
    registrations.forEach(r => { m[r.id] = { present, notes: attendanceMap[r.id]?.notes ?? '' }; });
    setAttendanceMap(m);
  };

  const handleSave = async () => {
    if (!selectedSession || !selectedDate) return;
    setSaving(true);
    try {
      await attendanceService.markAttendance({
        labSessionId: selectedSession,
        sessionDate: selectedDate,
        attendances: Object.entries(attendanceMap).map(([id, d]) => ({
          registrationId: parseInt(id),
          present: d.present,
          notes: d.notes || undefined,
        })),
      } as MarkAttendanceRequest);
      toast.success('Attendance saved!');
      const att = await attendanceService.getBySessionAndDate(selectedSession, selectedDate);
      setExistingAttendance(att);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save attendance');
    } finally { setSaving(false); }
  };

  const presentCount = Object.values(attendanceMap).filter(a => a.present).length;
  const total        = registrations.length;
  const pct          = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  const selectedSessionObj = sessions.find(s => s.id === selectedSession);

  const visibleRegs = registrations.filter(r => {
    const q = search.toLowerCase();
    return !q || r.studentName?.toLowerCase().includes(q) || r.studentIdNumber?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'att-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading sessions…</span>
      <style>{`@keyframes att-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes att-spin   { to { transform: rotate(360deg); } }
        @keyframes att-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes att-rise   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .att-page  { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; }
        .att-wrap  { max-width: 1100px; margin: 0 auto; animation: att-rise .3s ease both; }

        /* ── Config card ── */
        .att-config {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          padding: 20px 22px; display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;
        }

        /* ── Summary bar ── */
        .att-summary {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          padding: 18px 22px; display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }

        /* ── Progress bar ── */
        .att-prog-track {
          width: 120px; height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden;
        }
        .att-prog-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          transition: width .4s cubic-bezier(.34,1,.64,1);
        }

        /* ── Table ── */
        .att-table-wrap {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px; overflow: hidden;
        }
        .att-table { width: 100%; border-collapse: collapse; }
        .att-thead th {
          background: #fafaf9; padding: 10px 16px;
          font-size: 10.5px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: #94a3b8; text-align: left;
          border-bottom: 1px solid #f1f5f9;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .att-row { border-bottom: 1px solid #f8f7f4; transition: background .12s; }
        .att-row:last-child { border-bottom: none; }
        .att-row-present { background: #f0fdf4; }
        .att-row-absent  { background: #fff; }
        .att-row:hover   { background: #fafaf9; }
        .att-row-present:hover { background: #dcfce7; }

        .att-row td { padding: 12px 16px; vertical-align: middle; }

        /* Toggle button */
        .att-toggle {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; transition: all .15s; flex-shrink: 0;
        }
        .att-toggle:active { transform: scale(.9); }
        .att-toggle-on  { background: #22c55e; color: #fff; box-shadow: 0 2px 8px #22c55e40; }
        .att-toggle-off { background: #f1f5f9; color: #94a3b8; }
        .att-toggle-on:hover  { background: #16a34a; }
        .att-toggle-off:hover { background: #e2e8f0; color: #475569; }

        /* Notes input */
        .att-notes {
          width: 100%; padding: 7px 10px; font-size: 12.5px;
          border: 1.5px solid transparent; border-radius: 7px;
          background: transparent; color: #334155; outline: none;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
          box-sizing: border-box;
        }
        .att-notes:focus {
          border-color: #6366f1; background: #fff;
          box-shadow: 0 0 0 3px #eef2ff;
        }
        .att-notes::placeholder { color: #cbd5e1; }

        /* Action buttons */
        .att-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 15px; border-radius: 8px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: 1px solid; transition: all .12s;
          font-family: 'Cabinet Grotesk', sans-serif; white-space: nowrap;
        }
        .att-btn:active { transform: scale(.97); }
        .att-btn-ghost { color: #475569; border-color: #e2e8f0; background: #fff; }
        .att-btn-ghost:hover { border-color: #a5b4fc; color: #4f46e5; background: #eef2ff; }
        .att-btn-present { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
        .att-btn-present:hover { background: #dcfce7; }
        .att-btn-absent  { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
        .att-btn-absent:hover  { background: #fee2e2; }
        .att-btn-save {
          color: #fff; border-color: #18181b; background: #18181b;
          box-shadow: 0 1px 6px rgba(0,0,0,.15);
        }
        .att-btn-save:hover { background: #27272a; }
        .att-btn-save:disabled { opacity: .45; cursor: not-allowed; }

        /* Slot badge */
        .slot-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 22px; padding: 0 8px;
          background: #f1f5f9; border-radius: 5px;
          font-size: 11px; font-weight: 700; color: #475569;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Alert info */
        .att-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px; border-radius: 10px;
          background: #eff6ff; border: 1px solid #bfdbfe;
          font-size: 13px; color: #1e40af;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        /* Empty state */
        .att-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 64px 40px; gap: 10px; text-align: center;
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
        }

        /* search */
        .att-search {
          position: relative; flex: 1; max-width: 280px;
        }
        .att-search input {
          width: 100%; padding: 8px 12px 8px 34px;
          border: 1px solid #e2e8f0; border-radius: 8px;
          background: #f8fafc; font-size: 13px; color: #334155;
          outline: none; font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .12s; box-sizing: border-box;
        }
        .att-search input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px #eef2ff; }
        .att-search svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; }

        @media (max-width: 640px) {
          .att-page { padding: 24px 16px; }
        }
      `}</style>

      <div className="att-page">
        <div className="att-wrap">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Admin · Sessions
            </p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 36, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Attendance
            </h1>
            <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 5, fontWeight: 500 }}>
              Mark and manage student attendance for lab sessions
            </p>
          </div>

          {/* ── Session + Date config ───────────────────────────────────────── */}
          <div className="att-config" style={{ marginBottom: 16 }}>
            <div style={{ flex: 2, minWidth: 220 }}>
              <FLabel>Lab Session</FLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedSession ?? ''}
                  onChange={e => setSelectedSession(e.target.value ? parseInt(e.target.value) : null)}
                  style={{ ...inp, appearance: 'none', paddingRight: 34, cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="">Choose a session…</option>
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.courseCode})</option>
                  ))}
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ width: 170 }}>
              <FLabel>Date</FLabel>
              <input
                type="date" value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={inp}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {selectedSessionObj && (
              <div style={{ padding: '9px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 2, alignSelf: 'flex-end' }}>
                <span style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Session</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{selectedSessionObj.name}</span>
              </div>
            )}
          </div>

          {/* ── No session selected ─────────────────────────────────────────── */}
          {!selectedSession ? (
            <div className="att-empty">
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <ClipboardList size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: '#18181b', margin: 0 }}>Select a session</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>Choose a lab session above to start marking attendance</p>
            </div>

          ) : loadingList ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '64px 0' }}>
              <div style={{ width: 26, height: 26, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'att-spin .75s linear infinite' }} />
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading registrations…</span>
            </div>

          ) : registrations.length === 0 ? (
            <div className="att-empty">
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Users size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: '#18181b', margin: 0 }}>No confirmed students</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>There are no confirmed registrations for this session</p>
            </div>

          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* ── Already recorded alert ──────────────────────────────────── */}
              {existingAttendance.length > 0 && (
                <div className="att-alert">
                  <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>Attendance has already been recorded for this date. Any changes below will overwrite it.</span>
                </div>
              )}

              {/* ── Summary + actions ───────────────────────────────────────── */}
              <div className="att-summary">
                {/* Left: stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  {/* Present */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={18} color="#16a34a" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: '#18181b', margin: 0, lineHeight: 1 }}>{presentCount}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Present</p>
                    </div>
                  </div>

                  {/* Absent */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <XCircle size={18} color="#dc2626" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: '#18181b', margin: 0, lineHeight: 1 }}>{total - presentCount}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 600 }}>Absent</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Attendance rate</span>
                      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 13, color: pct >= 70 ? '#16a34a' : '#dc2626' }}>{pct}%</span>
                    </div>
                    <div className="att-prog-track">
                      <div className="att-prog-fill" style={{ width: `${pct}%`, background: pct >= 70 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f87171,#dc2626)' }} />
                    </div>
                    <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{total} total students</span>
                  </div>
                </div>

                {/* Right: action buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button className="att-btn att-btn-present" onClick={() => markAll(true)}>
                    <Check size={13} strokeWidth={2.5} /> All Present
                  </button>
                  <button className="att-btn att-btn-absent" onClick={() => markAll(false)}>
                    <X size={13} strokeWidth={2.5} /> All Absent
                  </button>
                  <button className="att-btn att-btn-save" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <><div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'att-spin .7s linear infinite' }} /> Saving…</>
                      : <><Save size={13} /> Save Attendance</>
                    }
                  </button>
                </div>
              </div>

              {/* ── Table ───────────────────────────────────────────────────── */}
              <div className="att-table-wrap">
                {/* Table toolbar */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: '#18181b', margin: 0 }}>
                    Student List
                    <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500, fontSize: 13, color: '#94a3b8', marginLeft: 8 }}>
                      {visibleRegs.length} of {total}
                    </span>
                  </p>
                  <div className="att-search">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                      type="text" placeholder="Search students…"
                      value={search} onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <table className="att-table">
                  <thead className="att-thead">
                    <tr>
                      <th style={{ width: 60 }}>Status</th>
                      <th>Student</th>
                      <th style={{ width: 80 }}>Slot</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRegs.map(reg => {
                      const att  = attendanceMap[reg.id] || { present: false, notes: '' };
                      const pal  = avatarPalette(reg.studentName || 'S');
                      const init = initials(reg.studentName || 'ST');
                      return (
                        <tr key={reg.id} className={`att-row ${att.present ? 'att-row-present' : 'att-row-absent'}`}>
                          {/* Toggle */}
                          <td>
                            <button
                              className={`att-toggle ${att.present ? 'att-toggle-on' : 'att-toggle-off'}`}
                              onClick={() => toggle(reg.id)}
                            >
                              {att.present ? <Check size={15} strokeWidth={2.5} /> : <X size={14} strokeWidth={2.5} />}
                            </button>
                          </td>

                          {/* Student */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                              {/* Avatar */}
                              <div style={{
                                width: 34, height: 34, borderRadius: 8,
                                background: pal.bg, color: pal.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: "'Cabinet Grotesk', sans-serif",
                                fontSize: 11, fontWeight: 800, flexShrink: 0,
                              }}>
                                {init}
                              </div>
                              <div>
                                <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b', margin: 0, lineHeight: 1.2 }}>
                                  {reg.studentName}
                                </p>
                                <p style={{ fontSize: 11.5, color: '#94a3b8', margin: 0, marginTop: 1, fontWeight: 500 }}>
                                  {reg.studentIdNumber}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Slot */}
                          <td>
                            <span className="slot-badge">Slot {reg.slotNumber}</span>
                          </td>

                          {/* Notes */}
                          <td>
                            <input
                              type="text"
                              className="att-notes"
                              value={att.notes}
                              onChange={e => updateNotes(reg.id, e.target.value)}
                              placeholder="Add a note…"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Bottom save bar — sticky feel */}
                {registrations.length > 5 && (
                  <div style={{ padding: '14px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', background: '#fafaf9' }}>
                    <button className="att-btn att-btn-save" onClick={handleSave} disabled={saving}>
                      {saving
                        ? <><div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'att-spin .7s linear infinite' }} /> Saving…</>
                        : <><Save size={13} /> Save Attendance</>
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAttendancePage;