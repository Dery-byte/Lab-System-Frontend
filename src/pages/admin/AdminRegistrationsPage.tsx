import { useEffect, useState } from 'react';
import { ClipboardList, Search, ChevronDown, Users, CheckCircle2, Clock4, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { labSessionService, registrationService } from '../../services';
import { Registration, LabSession } from '../../types';

// ─── Palette ──────────────────────────────────────────────────────────────────

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

const getPalette = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTES[Math.abs(h) % PALETTES.length];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format LocalTime (HH:mm:ss) → "9:00 AM" */
const fmtTime = (t?: string) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** Format Set<string> of days → "Mon · Wed · Fri" */
const fmtDays = (days?: string[]) => {
  if (!days || days.length === 0) return '';
  const ORDER = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  const SHORT: Record<string, string> = {
    MONDAY:'Mon', TUESDAY:'Tue', WEDNESDAY:'Wed',
    THURSDAY:'Thu', FRIDAY:'Fri', SATURDAY:'Sat', SUNDAY:'Sun',
  };
  return [...days].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
    .map(d => SHORT[d] ?? d).join(' · ');
};

/** Build readable schedule string from DTO fields */
const buildSchedule = (reg: Registration): string => {
  const days  = fmtDays(reg.sessionDays as unknown as string[]);
  const start = fmtTime(reg.sessionStartTime as unknown as string);
  const end   = fmtTime(reg.sessionEndTime   as unknown as string);
  const parts = [days, start && end ? `${start} – ${end}` : start || end].filter(Boolean);
  return parts.join('  ');
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupEntry {
  slotNumber:          number;
  timeSlotDisplayName: string;
  labRoom?:            string;
  schedule:            string;
  regs:                Registration[];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatusPill = ({ status, position }: { status: string; position?: number }) => {
  const confirmed  = status === 'CONFIRMED';
  const waitlisted = status === 'WAITLISTED';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap' as const,
      background: confirmed ? '#f0fdf4' : waitlisted ? '#fffbeb' : '#f8fafc',
      border: `1px solid ${confirmed ? '#bbf7d0' : waitlisted ? '#fde68a' : '#e2e8f0'}`,
      fontSize: 11, fontWeight: 600,
      color: confirmed ? '#15803d' : waitlisted ? '#b45309' : '#94a3b8',
      fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.03em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: confirmed ? '#22c55e' : waitlisted ? '#f59e0b' : '#cbd5e1' }} />
      {confirmed ? 'Confirmed' : waitlisted ? `Waitlist #${position}` : status}
    </span>
  );
};

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const p = getPalette(name);
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, background: p.bg, border: `1.5px solid ${p.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: p.accent, fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '-0.01em' }}>{initials}</span>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) => (
  <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 12, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 120 }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21, color: '#18181b', margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>{label}</p>
    </div>
  </div>
);

// ─── Group Block ──────────────────────────────────────────────────────────────

const GroupBlock = ({
  entry, searchTerm, statusFilter, animDelay,
}: {
  entry: GroupEntry;
  searchTerm: string;
  statusFilter: 'all' | 'CONFIRMED' | 'WAITLISTED';
  animDelay: string;
}) => {
  const [collapsed, setCollapsed] = useState(true);

  // Palette keyed to the slot number so each slot has a distinct color
  const gp = getPalette(`Group-${entry.slotNumber}`);

  const filtered = entry.regs.filter(r => {
    const q    = searchTerm.toLowerCase();
    const hit  = r.studentName.toLowerCase().includes(q)
      || r.studentIdNumber?.toLowerCase().includes(q)
      || r.programName?.toLowerCase().includes(q);
    const stat = statusFilter === 'all' ? true : r.status === statusFilter;
    return hit && stat;
  });

  // Hide block entirely when a filter/search produces no matches
  if (filtered.length === 0 && (searchTerm || statusFilter !== 'all')) return null;

  const confirmed  = entry.regs.filter(r => r.status === 'CONFIRMED').length;
  const waitlisted = entry.regs.filter(r => r.status === 'WAITLISTED').length;

  const COL = '40px 1fr 130px 150px 120px 108px';

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 16, overflow: 'hidden', animation: `arp-rise .4s ease ${animDelay} both` }}>

      {/* ── Slot header ──────────────────────────────────────────────────── */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '15px 20px', cursor: 'pointer', userSelect: 'none' as const,
          background: collapsed ? '#fafaf9' : gp.soft,
          borderBottom: collapsed ? 'none' : `1px solid ${gp.accent}18`,
          transition: 'background .15s',
        }}
      >
        {/* Slot number badge */}
        <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: gp.bg, border: `1.5px solid ${gp.accent}28`, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 9, fontWeight: 700, color: gp.accent, letterSpacing: '0.06em', textTransform: 'uppercase' as const, lineHeight: 1 }}>GROUP</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, color: gp.accent, lineHeight: 1 }}>{entry.slotNumber}</span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Display name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const, marginBottom: entry.schedule || entry.labRoom ? 5 : 0 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, color: '#18181b' }}>
              {entry.timeSlotDisplayName}
            </span>
          </div>

          {/* Schedule + room meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
            {entry.schedule && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>
                <Clock size={11} color="#94a3b8" strokeWidth={2} />
                {entry.schedule}
              </span>
            )}
            {entry.labRoom && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500 }}>
                <MapPin size={11} color="#94a3b8" strokeWidth={2} />
                {entry.labRoom}
              </span>
            )}
          </div>
        </div>

        {/* Confirmed + waitlist counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 11, fontWeight: 700, color: '#15803d', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />{confirmed} confirmed
          </span>
          {waitlisted > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, background: '#fffbeb', border: '1px solid #fde68a', fontSize: 11, fontWeight: 700, color: '#b45309', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />+{waitlisted} waitlist
            </span>
          )}
        </div>

        {/* Chevron */}
        <div style={{ color: '#94a3b8', flexShrink: 0, transition: 'transform .2s', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
          <ChevronDown size={15} />
        </div>
      </div>

      {/* ── Student rows ─────────────────────────────────────────────────── */}
      {!collapsed && (
        <>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: COL, padding: '8px 20px', background: '#fafaf9', borderBottom: '1px solid #f1f0ec' }}>
            {['', 'Student', 'ID Number', 'Programme', 'Status', 'Registered'].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: '#b0bac6', letterSpacing: '0.09em', textTransform: 'uppercase' as const, fontFamily: "'Cabinet Grotesk', sans-serif" }}>{h}</span>
            ))}
          </div>

          {filtered.map((reg, i) => (
            <div
              key={reg.id}
              style={{
                display: 'grid', gridTemplateColumns: COL,
                padding: '11px 20px', alignItems: 'center',
                borderBottom: i < filtered.length - 1 ? '1px solid #f5f4f0' : 'none',
                transition: 'background .1s',
                animation: `arp-fadein .2s ease ${i * 0.025}s both`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar name={reg.studentName} />

              {/* Student name */}
              <div style={{ minWidth: 0, paddingRight: 8 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {reg.studentName}
                </div>
                {reg.studentEmail && (
                  <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, marginTop: 1 }}>
                    {reg.studentEmail}
                  </div>
                )}
              </div>

              {/* Student ID */}
              <span style={{ fontSize: 12, color: '#64748b', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 500, background: '#f1f5f9', padding: '2px 8px', borderRadius: 5, display: 'inline-block', width: 'fit-content' }}>
                {reg.studentIdNumber || '—'}
              </span>

              {/* Programme */}
              <span style={{ fontSize: 12.5, color: '#475569', fontFamily: "'Cabinet Grotesk', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, paddingRight: 8 }}>
                {reg.programName ?? <span style={{ color: '#cbd5e1' }}>N/A</span>}
              </span>

              {/* Status */}
              <StatusPill status={reg.status as string} position={reg.waitlistPosition} />

              {/* Date registered */}
              <span style={{ fontSize: 11.5, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {new Date(reg.registeredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13, fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              No students match this filter in this group
            </div>
          )}
        </>
      )}
    </div>
  );
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

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', fontSize: 13.5,
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    background: '#f8fafc', color: '#0f172a', outline: 'none',
    fontFamily: "'Cabinet Grotesk', sans-serif",
    boxSizing: 'border-box' as const, transition: 'all .15s',
  };

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

  // ── Group by slotNumber (from RegistrationDTO) ────────────────────────────
  const groupMap = new Map<number, GroupEntry>();
  for (const reg of registrations) {
    // slotNumber is the primary grouping key; fallback to 0 if unassigned
    const key = reg.slotNumber ?? 0;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        slotNumber:          reg.slotNumber   ?? 0,
        timeSlotDisplayName: reg.timeSlotDisplayName ?? `Slot ${reg.slotNumber ?? 0}`,
        labRoom:             reg.labRoom,
        schedule:            buildSchedule(reg),
        regs:                [],
      });
    }
    groupMap.get(key)!.regs.push(reg);
  }
  const groupEntries = Array.from(groupMap.values()).sort((a, b) => a.slotNumber - b.slotNumber);

  const selectedSessionObj  = sessions.find(s => s.id === selectedSession);
  const palette             = selectedSessionObj ? getPalette(selectedSessionObj.courseCode || selectedSessionObj.name) : null;
  const totalConfirmed      = registrations.filter(r => r.status === 'CONFIRMED').length;
  const totalWaitlisted     = registrations.filter(r => r.status === 'WAITLISTED').length;

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
        @keyframes arp-rise   { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes arp-fadein { from { opacity: 0; } to { opacity: 1; } }

        .arp-page { font-family: 'Cabinet Grotesk', sans-serif; background: #f5f4f0; min-height: 100vh; padding: 44px 40px; }
        .arp-wrap { max-width: 1140px; margin: 0 auto; animation: arp-rise .35s ease both; }

        .arp-selector {
          background: #fff; border: 1px solid #e8e5df; border-radius: 14px;
          padding: 18px 22px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }

        .arp-chip {
          padding: 5px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif; transition: all .12s;
        }
        .arp-chip:hover:not(.arp-chip-on) { border-color: #a5b4fc; color: #4f46e5; }
        .arp-chip-on { background: #18181b; color: #fff; border-color: #18181b; }

        .arp-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 80px 40px; border: 1.5px dashed #e2e8f0; border-radius: 16px; text-align: center;
        }

        @media (max-width: 860px) { .arp-page { padding: 24px 16px; } }
      `}</style>

      <div className="arp-page">
        <div className="arp-wrap">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Admin · Registrations
            </p>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Registrations
            </h1>
            <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
              Students organized by time group
            </p>
          </div>

          {/* ── Session Selector ───────────────────────────────────────────── */}
          <div className="arp-selector" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: palette ? palette.bg : '#f1f5f9', border: `1.5px solid ${palette ? palette.accent + '30' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardList size={16} color={palette ? palette.accent : '#94a3b8'} />
              </div>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', margin: 0, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Lab Session</p>
                {selectedSessionObj && palette && (
                  <p style={{ fontSize: 12, fontWeight: 700, color: palette.accent, margin: '1px 0 0', fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '0.04em' }}>
                    {selectedSessionObj.courseCode}
                  </p>
                )}
              </div>
            </div>

            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <select
                value={selectedSession?.toString() || ''}
                onChange={e => {
                  setSearchTerm(''); setStatusFilter('all'); setRegistrations([]);
                  setSelectedSession(e.target.value ? parseInt(e.target.value) : null);
                }}
                style={{ ...inp, paddingRight: 36, cursor: 'pointer', appearance: 'none' } as React.CSSProperties}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px #eef2ff'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="">Choose a session…</option>
                {sessions.map(s => <option key={s.id} value={s.id}>{s.name} ({s.courseCode})</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
            </div>

            {selectedSession && !regLoading && registrations.length > 0 && (
              <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 600, flexShrink: 0 }}>
                {groupEntries.length} Group{groupEntries.length !== 1 ? 's' : ''} · {registrations.length} students
              </span>
            )}
          </div>

          {/* ── States ─────────────────────────────────────────────────────── */}
          {!selectedSession ? (
            <div className="arp-empty">
              <div style={{ width: 52, height: 52, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No session selected</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>Choose a lab session above to view students by time group</p>
            </div>

          ) : regLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0' }}>
              <div style={{ width: 24, height: 24, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'arp-spin .75s linear infinite' }} />
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading registrations…</span>
            </div>

          ) : registrations.length === 0 ? (
            <div className="arp-empty">
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#18181b', margin: 0 }}>No registrations yet</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No students have registered for this session</p>
            </div>

          ) : (
            <>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <StatCard icon={<Users size={16} />}         value={registrations.length} label="Total students"  color="#6366f1" />
                <StatCard icon={<CheckCircle2 size={16} />}  value={totalConfirmed}        label="Confirmed"       color="#16a34a" />
                <StatCard icon={<Clock4 size={16} />}        value={totalWaitlisted}       label="Waitlisted"      color="#d97706" />
                <StatCard icon={<ClipboardList size={16} />} value={groupEntries.length}   label="Groups"      color="#0284c7" />
              </div>

              {/* Search + filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
                  <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    type="text" placeholder="Search across all groups…"
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
              </div>

              {/* Slot blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {groupEntries.map((entry, idx) => (
                  <GroupBlock
                    key={entry.slotNumber}
                    entry={entry}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    animDelay={`${idx * 0.07}s`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRegistrationsPage;


