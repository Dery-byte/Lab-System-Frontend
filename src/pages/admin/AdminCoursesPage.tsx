import { useEffect, useState } from 'react';
import {
  Plus, BookOpen, Edit, Search, LayoutGrid, List,
  Users, FlaskConical, Clock, X,
  ToggleLeft, ToggleRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { courseService } from '../../services/courseService';
import { departmentService } from '../../services/departmentService';
import { Course, CreateCourseRequest, Department } from '../../types';
import { Level, Semester } from '../../types/enums';

// ─── Palette keyed to course code ────────────────────────────────────────────

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

// ─── Components ───────────────────────────────────────────────────────────────

const CourseBadge = ({ code, size = 44 }: { code: string; size?: number }) => {
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
    letterSpacing: '0.03em',
    flexShrink: 0,
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

const CreditPills = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
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
        {n}
      </button>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminCoursesPage = () => {
  const [courses, setCourses]             = useState<Course[]>([]);
  const [departments, setDepartments]     = useState<Department[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [filter, setFilter]               = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving]           = useState(false);
  const [formData, setFormData]           = useState<CreateCourseRequest>({
    courseCode: '', courseName: '', department: '', departmentId: 0,
    semester: Semester.FIRST_SEMESTER, creditHours: 3, level: Level.LEVEL_100,
  });

  useEffect(() => { fetchCourses(); fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try { setDepartments(await departmentService.getAll()); }
    catch { toast.error('Failed to load departments'); }
  };

  const fetchCourses = async () => {
    try { setCourses(await courseService.getAll()); }
    catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingCourse(null);
    setFormData({ courseCode: '', courseName: '', department: '', departmentId: 0, semester: Semester.FIRST_SEMESTER, creditHours: 3, level: Level.LEVEL_100 });
    setIsModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditingCourse(c);
    setFormData({ courseCode: c.courseCode, courseName: c.courseName, department: c.department, departmentId: c.departmentId ?? 0, semester: (c.semester as Semester) ?? Semester.FIRST_SEMESTER, creditHours: c.creditHours, level: (c.level as Level) ?? Level.LEVEL_100 });
    setIsModalOpen(true);
  };

  const toggleStatus = async (id: number) => {
    try { await courseService.toggleStatus(id); toast.success('Status updated'); fetchCourses(); }
    catch { toast.error('Failed to update'); }
  };

  const handleSubmit = async () => {
    if (!formData.courseCode || !formData.courseName || !formData.departmentId) {
      toast.error('Please fill in all required fields'); return;
    }
    setIsSaving(true);
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.id, formData);
        toast.success('Course updated');
      } else {
        await courseService.create(formData);
        toast.success('Course created');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setIsSaving(false); }
  };

  const activeCount   = courses.filter(c => c.active).length;
  const inactiveCount = courses.filter(c => !c.active).length;

  const filtered = courses.filter(c => {
    const q = searchTerm.toLowerCase();
    const m = c.courseName.toLowerCase().includes(q) || c.courseCode.toLowerCase().includes(q) || c.department.toLowerCase().includes(q);
    const s = filter === 'all' ? true : filter === 'active' ? c.active : !c.active;
    return m && s;
  });

  const pp = getPalette(formData.courseCode || 'X');

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'acp-spin .75s linear infinite' }} />
      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>Loading courses…</span>
      <style>{`@keyframes acp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300&family=Cabinet+Grotesk:wght@400;500;600;700;800&display=swap');

        @keyframes acp-spin   { to { transform: rotate(360deg); } }
        @keyframes acp-fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acp-rise   { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes acp-spring { from { opacity: 0; transform: translateY(18px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .acp-page  {
          font-family: 'Cabinet Grotesk', sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 44px 40px;
        }
        .acp-wrap  { max-width: 1280px; margin: 0 auto; animation: acp-rise .35s ease both; }

        /* Cards */
        .acp-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
          cursor: default;
        }
        .acp-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,.08);
          transform: translateY(-2px);
          border-color: #c7d2fe;
        }
        .acp-card-dim { opacity: .5; filter: saturate(.25); }

        /* List rows */
        .acp-row {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 10px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: box-shadow .15s, border-color .15s;
        }
        .acp-row:hover { box-shadow: 0 3px 12px rgba(0,0,0,.06); border-color: #c7d2fe; }
        .acp-row-dim { opacity: .45; filter: saturate(.2); }

        /* Action buttons */
        .ab {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px; font-size: 12.5px;
          font-weight: 600; cursor: pointer; border: 1px solid;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .12s; background: transparent;
        }
        .ab:active { transform: scale(.95); }
        .ab-edit   { color: #475569; border-color: #e2e8f0; background: #f8fafc; }
        .ab-edit:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
        .ab-on  { color: #15803d; border-color: #bbf7d0; background: #f0fdf4; }
        .ab-on:hover  { background: #dcfce7; }
        .ab-off { color: #64748b; border-color: #e2e8f0; background: #f8fafc; }
        .ab-off:hover { border-color: #6366f1; color: #4f46e5; background: #eef2ff; }
        .ab-icon { padding: 6px 8px; }

        /* Toolbar */
        .add-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px; border: none;
          background: #18181b; color: #fff; font-size: 13.5px; font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif; cursor: pointer;
          transition: background .15s, transform .1s;
          box-shadow: 0 1px 6px rgba(0,0,0,.15);
          flex-shrink: 0;
        }
        .add-btn:hover  { background: #27272a; }
        .add-btn:active { transform: scale(.97); }

        .fchip {
          padding: 5px 13px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
          border: 1px solid #e2e8f0; cursor: pointer; background: #fff; color: #64748b;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .12s;
        }
        .fchip:hover:not(.fc-on) { border-color: #a5b4fc; color: #4f46e5; }
        .fc-on { background: #18181b; color: #fff; border-color: #18181b; }

        .vtgl {
          width: 33px; height: 33px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #fff; cursor: pointer; display: flex;
          align-items: center; justify-content: center; color: #94a3b8;
          transition: all .12s;
        }
        .vtgl-on { background: #eef2ff; border-color: #a5b4fc; color: #4f46e5; }
        .vtgl:hover:not(.vtgl-on) { border-color: #a5b4fc; color: #6366f1; }

        /* Modal */
        .acp-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: acp-fadein .2s ease;
        }
        .acp-modal {
          background: #fff; border-radius: 18px; width: 100%; max-width: 540px;
          max-height: 92vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,.18);
          animation: acp-spring .28s cubic-bezier(.34,1.56,.64,1) both;
        }

        .close-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0;
          background: #f8fafc; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8; transition: all .12s;
          flex-shrink: 0;
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
          .acp-page { padding: 24px 16px; }
          .g2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="acp-page">
        <div className="acp-wrap">

          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 30 }}>
            <div>
              <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 5px' }}>
                Admin · Courses
              </p>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 38, color: '#18181b', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
                Courses
              </h1>
              <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{activeCount} active</span>
                {inactiveCount > 0 && <> &middot; <span>{inactiveCount} inactive</span></>}
                {' '}&middot; {courses.length} total
              </p>
            </div>
            <button className="add-btn" onClick={openAdd}>
              <Plus size={15} strokeWidth={2.5} /> Add Course
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
                <BookOpen size={24} color="#cbd5e1" />
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: '#18181b', margin: 0 }}>No courses found</p>
              <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>
                {searchTerm ? 'Try a different search term or clear filters' : 'Add your first course to get started'}
              </p>
              {!searchTerm && (
                <button className="add-btn" style={{ marginTop: 6 }} onClick={openAdd}>
                  <Plus size={14} /> Add Course
                </button>
              )}
            </div>

          ) : viewMode === 'grid' ? (
            /* ── GRID ──────────────────────────────────────────────────────── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filtered.map((course) => {
                const p = getPalette(course.courseCode);
                return (
                  <div key={course.id} className={`acp-card ${!course.active ? 'acp-card-dim' : ''}`}>
                    {/* Top accent stripe */}
                    <div style={{ height: 3.5, background: `linear-gradient(90deg, ${p.accent}, ${p.accent}60)` }} />

                    <div style={{ padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

                      {/* Identity */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                          <CourseBadge code={course.courseCode} size={44} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: p.accent, margin: '0 0 3px', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {course.courseCode}
                            </p>
                            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15.5, color: '#18181b', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {course.courseName}
                            </h3>
                          </div>
                        </div>
                        <StatusPill active={!!course.active} />
                      </div>

                      {/* Tag row */}
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <Tag>{course.levelDisplayName || course.level?.replace('LEVEL_', 'Level ')}</Tag>
                        <Tag>{course.semester?.replace(/_/g, ' ')}</Tag>
                        <Tag>{course.department}</Tag>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                        <StatItem icon={<Users size={13} />} value={course.enrolledStudentsCount ?? 0} label="students" />
                        <StatItem icon={<FlaskConical size={13} />} value={course.labSessionsCount ?? 0} label="labs" />
                        <StatItem icon={<Clock size={13} />} value={course.creditHours} label="credits" />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                        <button className="ab ab-edit" style={{ flex: 1 }} onClick={() => openEdit(course)}>
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          className={`ab ${course.active ? 'ab-on' : 'ab-off'}`}
                          style={{ flex: 1 }}
                          onClick={() => toggleStatus(course.id)}
                        >
                          {course.active
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
                gridTemplateColumns: '40px 1fr 110px 90px 60px 64px 56px 76px',
                gap: 12, padding: '0 16px 6px', alignItems: 'center',
              }}>
                {['', 'Course', 'Department', 'Level', 'Sem.', 'Students', 'Labs', ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Cabinet Grotesk', sans-serif" }}>{h}</span>
                ))}
              </div>

              {filtered.map(course => {
                const p = getPalette(course.courseCode);
                return (
                  <div key={course.id} className={`acp-row ${!course.active ? 'acp-row-dim' : ''}`}
                    style={{ display: 'grid', gridTemplateColumns: '40px 1fr 110px 90px 60px 64px 56px 76px', gap: 12, alignItems: 'center' }}>

                    <CourseBadge code={course.courseCode} size={36} />

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 14.5, color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.courseName}
                        </span>
                        <StatusPill active={!!course.active} />
                      </div>
                      <span style={{ fontSize: 11, color: p.accent, fontWeight: 600 }}>{course.courseCode}</span>
                    </div>

                    <span style={{ fontSize: 12.5, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.department}</span>
                    <Tag>{course.levelDisplayName || course.level?.replace('LEVEL_', 'Level ')}</Tag>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                      {course.semester?.includes('FIRST') ? 'Sem 1' : 'Sem 2'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Users size={12} color="#94a3b8" />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{course.enrolledStudentsCount ?? 0}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FlaskConical size={12} color="#94a3b8" />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#18181b' }}>{course.labSessionsCount ?? 0}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="ab ab-edit ab-icon" onClick={() => openEdit(course)}><Edit size={13} /></button>
                      <button className={`ab ab-icon ${course.active ? 'ab-on' : 'ab-off'}`} onClick={() => toggleStatus(course.id)}>
                        {course.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
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
          <div className="acp-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
            <div className="acp-modal">

              {/* Modal header */}
              <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 3px', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {editingCourse ? `Editing · ${editingCourse.courseCode}` : 'New Course'}
                  </p>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24, color: '#18181b', margin: 0, letterSpacing: '-0.01em' }}>
                    {editingCourse ? editingCourse.courseName : 'Add a Course'}
                  </h2>
                </div>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
              </div>

              {/* Live preview */}
              {(formData.courseCode || formData.courseName) && (
                <div style={{ margin: '14px 22px 0', padding: '12px 14px', background: pp.soft, border: `1px solid ${pp.accent}20`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CourseBadge code={formData.courseCode || '?'} size={38} />
                  <div>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#18181b', margin: 0 }}>
                      {formData.courseName || 'Course Name'}
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                      {formData.courseCode && <span style={{ fontSize: 11, fontWeight: 600, color: pp.accent }}>{formData.courseCode}</span>}
                      {formData.creditHours > 0 && <span style={{ fontSize: 11, color: '#64748b' }}>{formData.creditHours} credits</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div className="g2">
                  <div><FLabel>Course Code *</FLabel><FInput value={formData.courseCode} onChange={v => setFormData({ ...formData, courseCode: v.toUpperCase() })} placeholder="CS101" maxLength={20} /></div>
                  <div><FLabel>Course Name *</FLabel><FInput value={formData.courseName} onChange={v => setFormData({ ...formData, courseName: v })} placeholder="Intro to Programming" /></div>
                </div>

                <div>
                  <FLabel>Department *</FLabel>
                  <FSelect value={formData.departmentId} onChange={v => {
                    const dept = departments.find(d => d.id === Number(v));
                    setFormData({ ...formData, departmentId: Number(v), department: dept?.name ?? '' });
                  }}>
                    <option value={0}>Select department…</option>
                    {departments.filter(d => d.active).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </FSelect>
                </div>

                <div className="g2">
                  <div>
                    <FLabel>Level</FLabel>
                    <FSelect value={formData.level as string} onChange={v => setFormData({ ...formData, level: v as Level })}>
                      {Object.values(Level).map(l => <option key={l} value={l}>{l.replace('LEVEL_', 'Level ')}</option>)}
                    </FSelect>
                  </div>
                  <div>
                    <FLabel>Semester</FLabel>
                    <FSelect value={formData.semester as string} onChange={v => setFormData({ ...formData, semester: v as Semester })}>
                      {Object.values(Semester).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </FSelect>
                  </div>
                </div>

                <div>
                  <FLabel>Credit Hours</FLabel>
                  <CreditPills value={formData.creditHours} onChange={v => setFormData({ ...formData, creditHours: v })} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 2 }}>
                  <button className="cnl-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="sub-btn" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving
                      ? <><div style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'acp-spin .7s linear infinite' }} /> Saving…</>
                      : <>{editingCourse ? 'Update' : 'Create'} Course</>
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

export default AdminCoursesPage;