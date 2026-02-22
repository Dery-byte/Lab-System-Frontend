// import { useEffect, useState } from 'react';
// import { ClipboardList, Search } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Loading, Select } from '../../components/ui/index';
// import { labSessionService, registrationService } from '../../services';
// import { Registration, LabSession } from '../../types';

// const AdminRegistrationsPage = () => {
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [registrations, setRegistrations] = useState<Registration[]>([]);
//   const [selectedSession, setSelectedSession] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     labSessionService.getAll().then(setSessions).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (selectedSession) {
//       setLoading(true);
//       registrationService.getBySession(selectedSession)
//         .then(setRegistrations)
//         .catch(() => toast.error('Failed to load registrations'))
//         .finally(() => setLoading(false));
//     }
//   }, [selectedSession]);

//   const getStatusBadge = (status: string, pos?: number) => {
//     if (status === 'CONFIRMED') return <Badge variant="success">Confirmed</Badge>;
//     if (status === 'WAITLISTED') return <Badge variant="warning">Waitlisted #{pos}</Badge>;
//     return <Badge>{status}</Badge>;
//   };

//   if (loading && !selectedSession) return <Loading />;

//   return (
//     <div className="space-y-6">
//       <div><h1 className="text-2xl font-bold text-gray-900">Registrations</h1></div>
//       <Card><CardContent className="py-4">
//         <Select label="Select Lab Session" value={selectedSession?.toString() || ''} onChange={e => setSelectedSession(e.target.value ? parseInt(e.target.value) : null)}
//           options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode})` }))} placeholder="Choose a session..." />
//       </CardContent></Card>

//       {!selectedSession ? (
//         <Card><CardContent className="py-12 text-center"><ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-medium">Select a session</h3></CardContent></Card>
//       ) : loading ? <Loading /> : registrations.length === 0 ? (
//         <Card><CardContent className="py-12 text-center"><h3 className="text-lg font-medium">No registrations</h3></CardContent></Card>
//       ) : (
//         <Card>
//           <CardHeader><h2 className="font-semibold">{registrations.length} Registrations</h2></CardHeader>
//           <CardContent className="p-0">
//             <table className="w-full">
//               <thead className="bg-gray-50"><tr>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
//               </tr></thead>
//               <tbody className="divide-y">
//                 {registrations.map(reg => (
//                   <tr key={reg.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3"><p className="font-medium">{reg.studentName}</p><p className="text-sm text-gray-500">{reg.studentIdNumber}</p></td>
//                     <td className="px-4 py-3 text-sm">{reg.programName || 'N/A'}</td>
//                     <td className="px-4 py-3">{getStatusBadge(reg.status, reg.waitlistPosition)}</td>
//                     <td className="px-4 py-3 text-sm text-gray-500">{new Date(reg.registeredAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default AdminRegistrationsPage;



import { useEffect, useState } from 'react';
import { ClipboardList, Search, ChevronDown, Users, CheckCircle2, Clock4 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { labSessionService, registrationService } from '../../services';
import { Registration, LabSession } from '../../types';

// ─── Palette (mirrors the system from Courses / Programs) ────────────────────

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

// ─── Status pill ─────────────────────────────────────────────────────────────

const StatusPill = ({ status, position }: { status: string; position?: number }) => {
  const confirmed = status === 'CONFIRMED';
  const waitlisted = status === 'WAITLISTED';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      background: confirmed ? '#f0fdf4' : waitlisted ? '#fffbeb' : '#f8fafc',
      border: `1px solid ${confirmed ? '#bbf7d0' : waitlisted ? '#fde68a' : '#e2e8f0'}`,
      fontSize: 11, fontWeight: 600,
      color: confirmed ? '#15803d' : waitlisted ? '#b45309' : '#94a3b8',
      fontFamily: "'Cabinet Grotesk', sans-serif",
      letterSpacing: '0.03em', whiteSpace: 'nowrap' as const,
    }}>
      <span style={{
        width: 5.5, height: 5.5, borderRadius: '50%', flexShrink: 0,
        background: confirmed ? '#22c55e' : waitlisted ? '#f59e0b' : '#cbd5e1',
      }} />
      {confirmed ? 'Confirmed' : waitlisted ? `Waitlisted #${position}` : status}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const p = getPalette(name);
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 9,
      background: p.bg, border: `1.5px solid ${p.accent}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: p.accent, fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '-0.01em' }}>
        {initials}
      </span>
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) => (
  <div style={{
    background: '#fff', border: '1px solid #e8e5df', borderRadius: 12,
    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flex: 1,
  }}>
    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: '#18181b', margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11.5, color: '#94a3b8', margin: '3px 0 0', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>{label}</p>
    </div>
  </div>
);

// ─── Form input styles ────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13.5,
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  background: '#f8fafc', color: '#0f172a', outline: 'none',
  fontFamily: "'Cabinet Grotesk', sans-serif",
  boxSizing: 'border-box' as const, transition: 'all .15s',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminRegistrationsPage = () => {
  const [sessions, setSessions]               = useState<LabSession[]>([]);
  const [registrations, setRegistrations]     = useState<Registration[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [regLoading, setRegLoading]           = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [statusFilter, setStatusFilter]       = useState<'all' | 'CONFIRMED' | 'WAITLISTED'>('all');

  useEffect(() => {
    labSessionService.getAll()
      .then(setSessions)
      .catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    setRegLoading(true);
    registrationService.getBySession(selectedSession)
      .then(setRegistrations)
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setRegLoading(false));
  }, [selectedSession]);

  const selectedSessionObj = sessions.find(s => s.id === selectedSession);
  const palette = selectedSessionObj ? getPalette(selectedSessionObj.courseCode || selectedSessionObj.name) : null;

  const confirmed  = registrations.filter(r => r.status === 'CONFIRMED').length;
  const waitlisted = registrations.filter(r => r.status === 'WAITLISTED').length;

  const filtered = registrations.filter(r => {
    const q = searchTerm.toLowerCase();
    const m = r.studentName.toLowerCase().includes(q) || r.studentIdNumber?.toLowerCase().includes(q) || r.programName?.toLowerCase().includes(q);
    const s = statusFilter === 'all' ? true : r.status === statusFilter;
    return m && s;
  });

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'arp-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading sessions…</span>
      <style>{`@keyframes arp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes arp-spin   { to { transform: rotate(360deg); } }
        @keyframes arp-rise   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes arp-fadein { from { opacity: 0; } to { opacity: 1; } }

        .arp-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; }
        .arp-wrap { max-width: 1100px; margin: 0 auto; animation: arp-rise .35s ease both; }

        /* Session selector card */
        .arp-selector {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 14px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Table */
        .arp-table-wrap {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 14px;
          overflow: hidden;
          animation: arp-fadein .2s ease;
        }

        .arp-table { width: 100%; border-collapse: collapse; }

        .arp-thead th {
          padding: 10px 16px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'Cabinet Grotesk', sans-serif;
          background: #fafaf9;
          border-bottom: 1px solid #f1f0ec;
        }

        .arp-tr {
          border-bottom: 1px solid #f5f4f0;
          transition: background .1s;
        }
        .arp-tr:last-child { border-bottom: none; }
        .arp-tr:hover { background: #fafaf9; }

        .arp-td { padding: 12px 16px; vertical-align: middle; }

        /* Filter chips */
        .arp-chip {
          padding: 5px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .arp-chip:hover:not(.arp-chip-on) { border-color: #a5b4fc; color: #4f46e5; }
        .arp-chip-on { background: #18181b; color: #fff; border-color: #18181b; }

        /* Empty state */
        .arp-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px; padding: 80px 40px;
          border: 1.5px dashed #e2e8f0; border-radius: 16px; text-align: center;
        }

        @media (max-width: 640px) {
          .arp-page { padding: 24px 16px; }
        }
      `}</style>

      <div className="arp-page">
        <div className="arp-wrap">

          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Admin · Registrations
            </p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Registrations
            </h1>
            <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
              View student registrations by lab session
            </p>
          </div>

          {/* ── Session Selector ─────────────────────────────────────────────── */}
          <div className="arp-selector" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: palette ? palette.bg : '#f1f5f9', border: `1.5px solid ${palette ? palette.accent + '30' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={16} color={palette ? palette.accent : '#94a3b8'} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Lab Session</p>
                {selectedSessionObj && (
                  <p style={{ fontSize: 12, fontWeight: 600, color: palette?.accent, margin: '1px 0 0', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {selectedSessionObj.courseCode}
                  </p>
                )}
              </div>
            </div>

            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <select
                value={selectedSession?.toString() || ''}
                onChange={e => { setSearchTerm(''); setStatusFilter('all'); setSelectedSession(e.target.value ? parseInt(e.target.value) : null); }}
                style={{ ...inp, paddingRight: 36, cursor: 'pointer', appearance: 'none' }}
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

          {/* ── No session selected ──────────────────────────────────────────── */}
          {!selectedSession ? (
            <div className="arp-empty">
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No session selected</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>Choose a lab session above to view its registrations</p>
            </div>

          ) : regLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '80px 0' }}>
              <div style={{ width: 24, height: 24, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'arp-spin .75s linear infinite' }} />
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading registrations…</span>
            </div>

          ) : (
            <>
              {/* ── Stats row ─────────────────────────────────────────────────── */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <StatCard icon={<Users size={17} />}        value={registrations.length} label="Total registered"  color="#6366f1" />
                <StatCard icon={<CheckCircle2 size={17} />} value={confirmed}            label="Confirmed"         color="#16a34a" />
                <StatCard icon={<Clock4 size={17} />}       value={waitlisted}           label="On waitlist"       color="#d97706" />
              </div>

              {/* ── Search + filter ───────────────────────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
                  <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    type="text" placeholder="Search student, ID, program…"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ ...inp, paddingLeft: 32, borderRadius: 9, fontSize: 13 }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['all', 'CONFIRMED', 'WAITLISTED'] as const).map(f => (
                    <button key={f} className={`arp-chip ${statusFilter === f ? 'arp-chip-on' : ''}`} onClick={() => setStatusFilter(f)}>
                      {f === 'all' ? 'All' : f === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
                    </button>
                  ))}
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>
                  {filtered.length} of {registrations.length}
                </span>
              </div>

              {/* ── Table or empty ────────────────────────────────────────────── */}
              {filtered.length === 0 ? (
                <div className="arp-empty" style={{ border: '1.5px dashed #e2e8f0', borderRadius: 14 }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#18181b', margin: 0 }}>No results</p>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Try a different search or filter</p>
                </div>
              ) : (
                <div className="arp-table-wrap">
                  {/* Session title bar */}
                  {selectedSessionObj && palette && (
                    <div style={{ padding: '13px 18px', borderBottom: '1px solid #f1f0ec', display: 'flex', alignItems: 'center', gap: 10, background: palette.soft }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: palette.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b' }}>
                        {selectedSessionObj.name}
                      </span>
                      <span style={{ fontSize: 11.5, color: palette.accent, fontWeight: 600, fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.04em' }}>
                        {selectedSessionObj.courseCode}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                        {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  <table className="arp-table">
                    <thead className="arp-thead">
                      <tr>
                        <th style={{ width: 44 }}></th>
                        <th>Student</th>
                        <th>ID Number</th>
                        <th>Program</th>
                        <th>Status</th>
                        <th>Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((reg, i) => (
                        <tr key={reg.id} className="arp-tr" style={{ animationDelay: `${i * 0.03}s` }}>
                          <td className="arp-td" style={{ paddingRight: 0 }}>
                            <Avatar name={reg.studentName} />
                          </td>
                          <td className="arp-td">
                            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b' }}>
                              {reg.studentName}
                            </span>
                          </td>
                          <td className="arp-td">
                            <span style={{ fontSize: 12.5, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500, background: '#f1f5f9', padding: '2px 8px', borderRadius: 5 }}>
                              {reg.studentIdNumber || '—'}
                            </span>
                          </td>
                          <td className="arp-td">
                            <span style={{ fontSize: 12.5, color: '#475569', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                              {reg.programName || <span style={{ color: '#cbd5e1' }}>N/A</span>}
                            </span>
                          </td>
                          <td className="arp-td">
                            <StatusPill status={reg.status} position={reg.waitlistPosition} />
                          </td>
                          <td className="arp-td">
                            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                              {new Date(reg.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegistrationsPage;
