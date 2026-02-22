// import { useEffect, useState } from 'react';
// import { FileText, Check, X, Eye, EyeOff, Save, ChevronDown, ChevronRight, Calendar, BookOpen, Target, Package, Edit2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Loading, Select, Alert } from '../../components/ui/index';
// import { labSessionService, weeklyNoteService } from '../../services';
// import { LabSession, WeeklyNote, UpdateWeeklyNoteRequest } from '../../types';

// const AdminWeeklyNotesPage = () => {
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
//   const [weeklyNotes, setWeeklyNotes] = useState<WeeklyNote[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingNotes, setLoadingNotes] = useState(false);
//   const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
//   const [editingWeeks, setEditingWeeks] = useState<Set<number>>(new Set());
//   const [editData, setEditData] = useState<Record<number, UpdateWeeklyNoteRequest>>({});
//   const [savingWeek, setSavingWeek] = useState<number | null>(null);

//   useEffect(() => {
//     labSessionService.getAll()
//       .then(data => setSessions(data.filter(s => s.status === 'OPEN' || s.status === 'DRAFT')))
//       .catch(() => toast.error('Failed to load sessions'))
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     if (selectedSessionId) {
//       setLoadingNotes(true);
//       weeklyNoteService.getAllForSession(selectedSessionId)
//         .then(data => {
//           setWeeklyNotes(data);
//           const initialEditData: Record<number, UpdateWeeklyNoteRequest> = {};
//           data.forEach(note => {
//             initialEditData[note.weekNumber] = {
//               labSessionId: selectedSessionId,
//               weekNumber: note.weekNumber,
//               title: note.title || '',
//               content: note.content || '',
//               learningObjectives: note.learningObjectives || '',
//               materialsNeeded: note.materialsNeeded || '',
//             };
//           });
//           setEditData(initialEditData);
//           setEditingWeeks(new Set());
//         })
//         .catch(() => toast.error('Failed to load weekly notes'))
//         .finally(() => setLoadingNotes(false));
//     } else {
//       setWeeklyNotes([]);
//       setEditData({});
//     }
//   }, [selectedSessionId]);

//   const toggleExpand = (weekNum: number) => {
//     setExpandedWeeks(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(weekNum)) newSet.delete(weekNum);
//       else newSet.add(weekNum);
//       return newSet;
//     });
//   };

//   const toggleEditing = (weekNum: number) => {
//     setEditingWeeks(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(weekNum)) {
//         newSet.delete(weekNum);
//       } else {
//         newSet.add(weekNum);
//         setExpandedWeeks(prev => new Set([...prev, weekNum]));
//       }
//       return newSet;
//     });
//   };

//   const updateEditData = (weekNum: number, field: keyof UpdateWeeklyNoteRequest, value: string) => {
//     setEditData(prev => ({
//       ...prev,
//       [weekNum]: { ...prev[weekNum], [field]: value }
//     }));
//   };

//   const handleSave = async (weekNum: number, publish: boolean = false) => {
//     if (!selectedSessionId) return;
//     setSavingWeek(weekNum);
//     try {
//       const data = editData[weekNum];
//       await weeklyNoteService.update({ ...data, publish });
//       const updatedNotes = await weeklyNoteService.getAllForSession(selectedSessionId);
//       setWeeklyNotes(updatedNotes);
//       setEditingWeeks(prev => { const n = new Set(prev); n.delete(weekNum); return n; });
//       toast.success(publish ? 'Saved and published!' : 'Saved!');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to save');
//     } finally {
//       setSavingWeek(null);
//     }
//   };

//   const handlePublishToggle = async (weekNum: number, currentlyPublished: boolean) => {
//     if (!selectedSessionId) return;
//     setSavingWeek(weekNum);
//     try {
//       if (currentlyPublished) {
//         await weeklyNoteService.unpublish(selectedSessionId, weekNum);
//         toast.success('Unpublished');
//       } else {
//         await weeklyNoteService.publish(selectedSessionId, weekNum);
//         toast.success('Published! Students can now see this content.');
//       }
//       const updatedNotes = await weeklyNoteService.getAllForSession(selectedSessionId);
//       setWeeklyNotes(updatedNotes);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to update');
//     } finally {
//       setSavingWeek(null);
//     }
//   };

//   const getWeekBadge = (week: WeeklyNote) => {
//     if (week.isCurrentWeek) return <Badge variant="success">Current Week</Badge>;
//     if (week.isPastWeek) return <Badge variant="default">Past</Badge>;
//     return <Badge variant="info">Upcoming</Badge>;
//   };

//   if (loading) return <Loading text="Loading..." />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Weekly Notes Management</h1>
//         <p className="text-gray-600 mt-1">Add content for each week of your lab sessions. Check the box to enable editing.</p>
//       </div>

//       <Card>
//         <CardContent className="py-4">
//           <Select
//             label="Select Lab Session"
//             value={selectedSessionId?.toString() || ''}
//             onChange={(e) => setSelectedSessionId(e.target.value ? parseInt(e.target.value) : null)}
//             options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode}) - ${s.durationWeeks} weeks` }))}
//             placeholder="Choose a session..."
//           />
//         </CardContent>
//       </Card>

//       {!selectedSessionId ? (
//         <Card><CardContent className="py-12 text-center">
//           <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//           <h3 className="text-lg font-medium text-gray-900">Select a session</h3>
//           <p className="text-gray-500">Choose a lab session to manage its weekly notes</p>
//         </CardContent></Card>
//       ) : loadingNotes ? (
//         <Loading text="Loading weekly notes..." />
//       ) : (
//         <div className="space-y-4">
//           <Alert variant="info">
//             <strong>How it works:</strong> Check the "Edit" checkbox to enable editing for a week. 
//             Add your content and click Save. Students will only see published notes.
//           </Alert>

//           {weeklyNotes.map((week) => {
//             const isExpanded = expandedWeeks.has(week.weekNumber);
//             const isEditing = editingWeeks.has(week.weekNumber);
//             const data = editData[week.weekNumber] || {};

//             return (
//               <Card key={week.weekNumber} className={`${week.isCurrentWeek ? 'ring-2 ring-green-200 border-green-300' : ''}`}>
//                 {/* Week Header */}
//                 <div className="px-6 py-4 flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <button onClick={() => toggleExpand(week.weekNumber)} className="flex items-center gap-2">
//                       {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
//                       <span className="font-semibold text-gray-900">Week {week.weekNumber}</span>
//                     </button>
//                     <span className="text-sm text-gray-500">{week.dateRange}</span>
//                     {getWeekBadge(week)}
//                     {week.isPublished ? (
//                       <Badge variant="success"><Eye className="w-3 h-3 mr-1" />Published</Badge>
//                     ) : (
//                       <Badge variant="default"><EyeOff className="w-3 h-3 mr-1" />Draft</Badge>
//                     )}
//                   </div>
                  
//                   <div className="flex items-center gap-4">
//                     {/* Edit Checkbox */}
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={isEditing}
//                         onChange={() => toggleEditing(week.weekNumber)}
//                         className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                       />
//                       <span className="text-sm font-medium text-gray-700">
//                         <Edit2 className="w-4 h-4 inline mr-1" />Edit
//                       </span>
//                     </label>

//                     {/* Publish Toggle */}
//                     {week.id && (
//                       <Button
//                         variant={week.isPublished ? 'secondary' : 'success'}
//                         size="sm"
//                         onClick={() => handlePublishToggle(week.weekNumber, week.isPublished)}
//                         isLoading={savingWeek === week.weekNumber}
//                         disabled={!week.content && !week.title}
//                       >
//                         {week.isPublished ? <><EyeOff className="w-4 h-4 mr-1" />Unpublish</> : <><Eye className="w-4 h-4 mr-1" />Publish</>}
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Week Content - Expanded */}
//                 {isExpanded && (
//                   <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
//                     {isEditing ? (
//                       /* Editing Mode */
//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <BookOpen className="w-4 h-4 inline mr-1" />Week Title
//                           </label>
//                           <input
//                             type="text"
//                             value={data.title || ''}
//                             onChange={(e) => updateEditData(week.weekNumber, 'title', e.target.value)}
//                             placeholder="e.g., Introduction to Microscopy"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <FileText className="w-4 h-4 inline mr-1" />Content / Overview
//                           </label>
//                           <textarea
//                             value={data.content || ''}
//                             onChange={(e) => updateEditData(week.weekNumber, 'content', e.target.value)}
//                             placeholder="Brief overview of what will be covered this week..."
//                             rows={4}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <Target className="w-4 h-4 inline mr-1" />Learning Objectives
//                           </label>
//                           <textarea
//                             value={data.learningObjectives || ''}
//                             onChange={(e) => updateEditData(week.weekNumber, 'learningObjectives', e.target.value)}
//                             placeholder="What students should learn this week..."
//                             rows={3}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             <Package className="w-4 h-4 inline mr-1" />Materials Needed
//                           </label>
//                           <textarea
//                             value={data.materialsNeeded || ''}
//                             onChange={(e) => updateEditData(week.weekNumber, 'materialsNeeded', e.target.value)}
//                             placeholder="Materials or preparation students should bring..."
//                             rows={2}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//                           />
//                         </div>

//                         <div className="flex justify-end gap-3 pt-2">
//                           <Button variant="secondary" size="sm" onClick={() => toggleEditing(week.weekNumber)}>
//                             <X className="w-4 h-4 mr-1" />Cancel
//                           </Button>
//                           <Button size="sm" onClick={() => handleSave(week.weekNumber, false)} isLoading={savingWeek === week.weekNumber}>
//                             <Save className="w-4 h-4 mr-1" />Save
//                           </Button>
//                           <Button variant="success" size="sm" onClick={() => handleSave(week.weekNumber, true)} isLoading={savingWeek === week.weekNumber}>
//                             <Check className="w-4 h-4 mr-1" />Save & Publish
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       /* View Mode */
//                       <div className="space-y-4">
//                         {week.title && (
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
//                             <p className="text-gray-900">{week.title}</p>
//                           </div>
//                         )}
//                         {week.content && (
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-700 mb-1">Content</h4>
//                             <p className="text-gray-600 whitespace-pre-wrap">{week.content}</p>
//                           </div>
//                         )}
//                         {week.learningObjectives && (
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-700 mb-1">Learning Objectives</h4>
//                             <p className="text-gray-600 whitespace-pre-wrap">{week.learningObjectives}</p>
//                           </div>
//                         )}
//                         {week.materialsNeeded && (
//                           <div>
//                             <h4 className="text-sm font-medium text-gray-700 mb-1">Materials Needed</h4>
//                             <p className="text-gray-600 whitespace-pre-wrap">{week.materialsNeeded}</p>
//                           </div>
//                         )}
//                         {!week.title && !week.content && !week.learningObjectives && !week.materialsNeeded && (
//                           <p className="text-gray-400 italic">No content added yet. Check "Edit" to add content for this week.</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminWeeklyNotesPage;







import { useEffect, useState } from 'react';
import {
  FileText, Check, X, Eye, EyeOff, Save, Calendar,
  BookOpen, Target, Package, Edit2, ChevronDown, ChevronUp,
  Sparkles, Clock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loading } from '../../components/ui/index';
import { labSessionService, weeklyNoteService } from '../../services';
import { LabSession, WeeklyNote, UpdateWeeklyNoteRequest } from '../../types';

// ─── Week status config ───────────────────────────────────────────────────────

const weekStatus = (week: WeeklyNote) => {
  if (week.isCurrentWeek) return { label: 'This Week', dot: 'bg-emerald-400 ring-4 ring-emerald-100 animate-pulse', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
  if (week.isPastWeek)    return { label: 'Past',      dot: 'bg-slate-300',                                        text: 'text-slate-500',   bg: 'bg-slate-50 border-slate-200'   };
  return                         { label: 'Upcoming',  dot: 'bg-blue-300',                                         text: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200'     };
};

// ─── Textarea field ───────────────────────────────────────────────────────────

const Field = ({
  label, icon, value, onChange, placeholder, rows = 3,
}: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder: string; rows?: number;
}) => (
  <div>
    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
      <span className="text-slate-400">{icon}</span>
      {label}
    </label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl resize-none
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
        placeholder:text-slate-300 leading-relaxed transition-all duration-150"
    />
  </div>
);

// ─── View field ───────────────────────────────────────────────────────────────

const ViewField = ({ label, icon, value }: { label: string; icon: React.ReactNode; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        <span>{icon}</span>{label}
      </p>
      <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spin = () => (
  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
  </svg>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const AdminWeeklyNotesPage = () => {
  const [sessions, setSessions]               = useState<LabSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [weeklyNotes, setWeeklyNotes]         = useState<WeeklyNote[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [loadingNotes, setLoadingNotes]       = useState(false);
  const [expandedWeeks, setExpandedWeeks]     = useState<Set<number>>(new Set());
  const [editingWeeks, setEditingWeeks]       = useState<Set<number>>(new Set());
  const [editData, setEditData]               = useState<Record<number, UpdateWeeklyNoteRequest>>({});
  const [savingWeek, setSavingWeek]           = useState<number | null>(null);

  useEffect(() => {
    labSessionService.getAll()
      .then(data => setSessions(data.filter(s => s.status === 'OPEN' || s.status === 'DRAFT')))
      .catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSessionId) { setWeeklyNotes([]); setEditData({}); return; }
    setLoadingNotes(true);
    weeklyNoteService.getAllForSession(selectedSessionId)
      .then(data => {
        setWeeklyNotes(data);
        const init: Record<number, UpdateWeeklyNoteRequest> = {};
        data.forEach(n => {
          init[n.weekNumber] = {
            labSessionId: selectedSessionId, weekNumber: n.weekNumber,
            title: n.title || '', content: n.content || '',
            learningObjectives: n.learningObjectives || '', materialsNeeded: n.materialsNeeded || '',
          };
        });
        setEditData(init);
        setEditingWeeks(new Set());
      })
      .catch(() => toast.error('Failed to load weekly notes'))
      .finally(() => setLoadingNotes(false));
  }, [selectedSessionId]);

  const toggleExpand  = (n: number) => setExpandedWeeks(p => { const s = new Set(p); s.has(n) ? s.delete(n) : s.add(n); return s; });
  const toggleEditing = (n: number) => setEditingWeeks(p => {
    const s = new Set(p);
    if (s.has(n)) { s.delete(n); }
    else { s.add(n); setExpandedWeeks(prev => new Set([...prev, n])); }
    return s;
  });
  const updateField = (n: number, field: keyof UpdateWeeklyNoteRequest, value: string) =>
    setEditData(p => ({ ...p, [n]: { ...p[n], [field]: value } }));

  const handleSave = async (weekNum: number, publish = false) => {
    if (!selectedSessionId) return;
    setSavingWeek(weekNum);
    try {
      await weeklyNoteService.update({ ...editData[weekNum], publish });
      const updated = await weeklyNoteService.getAllForSession(selectedSessionId);
      setWeeklyNotes(updated);
      setEditingWeeks(p => { const s = new Set(p); s.delete(weekNum); return s; });
      toast.success(publish ? 'Saved & published!' : 'Draft saved');
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to save'); }
    finally { setSavingWeek(null); }
  };

  const handlePublishToggle = async (weekNum: number, published: boolean) => {
    if (!selectedSessionId) return;
    setSavingWeek(weekNum);
    try {
      published
        ? await weeklyNoteService.unpublish(selectedSessionId, weekNum)
        : await weeklyNoteService.publish(selectedSessionId, weekNum);
      toast.success(published ? 'Unpublished' : 'Published — students can now see this');
      setWeeklyNotes(await weeklyNoteService.getAllForSession(selectedSessionId));
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed'); }
    finally { setSavingWeek(null); }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  if (loading) return <Loading text="Loading..." />;

  return (
    <div className="space-y-7 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Content Management</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Weekly Notes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Publish content week-by-week for enrolled students</p>
        </div>
        {selectedSession && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] font-semibold text-slate-700">{selectedSession.name}</span>
            <span className="text-[11px] text-slate-400">· {(selectedSession as any).durationWeeks ?? weeklyNotes.length}w</span>
          </div>
        )}
      </div>

      {/* ── Session picker ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
          Select Session
        </label>
        <div className="relative">
          <select
            value={selectedSessionId?.toString() || ''}
            onChange={e => setSelectedSessionId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 focus:bg-white transition-all duration-150"
          >
            <option value="">Choose a lab session…</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.courseCode}) — {(s as any).durationWeeks ?? '?'} weeks
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!selectedSessionId ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 gap-3">
          <FileText className="w-12 h-12 opacity-25" />
          <p className="text-base font-semibold text-slate-500">Select a session to begin</p>
          <p className="text-sm opacity-70">Weekly content will appear here</p>
        </div>
      ) : loadingNotes ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <Spin /><span className="text-sm">Loading weekly notes…</span>
        </div>
      ) : (

        /* ── Timeline of weeks ─────────────────────────────────────────────── */
        <div className="relative">

          {/* Vertical spine line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200 pointer-events-none" />

          <div className="space-y-3">
            {weeklyNotes.map((week, idx) => {
              const ws        = weekStatus(week);
              const expanded  = expandedWeeks.has(week.weekNumber);
              const editing   = editingWeeks.has(week.weekNumber);
              const data      = editData[week.weekNumber] || {};
              const hasContent = !!(week.title || week.content || week.learningObjectives || week.materialsNeeded);
              const saving    = savingWeek === week.weekNumber;

              return (
                <div key={week.weekNumber} className="relative pl-12"
                  style={{ animationDelay: `${idx * 35}ms` }}>

                  {/* Timeline dot */}
                  <div className={`absolute left-[12px] top-[18px] w-[15px] h-[15px] rounded-full border-2 border-white ${ws.dot} z-10`} />

                  {/* Card */}
                  <div className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md
                    ${week.isCurrentWeek ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200/80'}`}>

                    {/* ── Card header ─────────────────────────────────────── */}
                    <div className="px-5 py-3.5 flex items-center justify-between gap-3">

                      {/* Left: week info */}
                      <button
                        onClick={() => toggleExpand(week.weekNumber)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[15px] font-bold text-slate-900">Week {week.weekNumber}</span>

                            {/* Status badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ws.bg} ${ws.text}`}>
                              {ws.label}
                            </span>

                            {/* Published indicator */}
                            {week.isPublished ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <Eye className="w-3 h-3" /> Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                                <EyeOff className="w-3 h-3" /> Draft
                              </span>
                            )}
                          </div>

                          {week.dateRange && (
                            <p className="flex items-center gap-1.5 text-[12px] text-slate-400 mt-0.5">
                              <Calendar className="w-3 h-3" />{week.dateRange}
                            </p>
                          )}
                        </div>

                        {/* Expand chevron */}
                        <span className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0">
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {/* Right: action buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">

                        {/* Edit toggle */}
                        <button
                          onClick={() => toggleEditing(week.weekNumber)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all duration-150 active:scale-95
                            ${editing
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          {editing ? 'Editing' : 'Edit'}
                        </button>

                        {/* Publish toggle */}
                        {week.id && (
                          <button
                            onClick={() => handlePublishToggle(week.weekNumber, week.isPublished)}
                            disabled={saving || (!hasContent)}
                            title={!hasContent ? 'Add content before publishing' : undefined}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all duration-150 active:scale-95
                              disabled:opacity-40 disabled:cursor-not-allowed
                              ${week.isPublished
                                ? 'bg-white text-slate-600 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                                : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                              }`}
                          >
                            {saving ? <Spin /> : week.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {week.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Expanded body ────────────────────────────────────── */}
                    {expanded && (
                      <div className="border-t border-slate-100">
                        {editing ? (

                          /* ── EDIT MODE ─────────────────────────────────── */
                          <div className="px-5 py-5 space-y-4"
                            style={{ background: 'linear-gradient(180deg, #fafbff 0%, #f8fafc 100%)' }}>

                            {/* Paper texture hint */}
                            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                  <BookOpen className="w-3.5 h-3.5" /> Week Title
                                </label>
                                <input
                                  type="text"
                                  value={data.title || ''}
                                  onChange={e => updateField(week.weekNumber, 'title', e.target.value)}
                                  placeholder="e.g., Introduction to Microscopy"
                                  className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                                    placeholder:text-slate-300 transition-all duration-150 font-medium"
                                />
                              </div>

                              <Field
                                label="Content / Overview"
                                icon={<FileText className="w-3.5 h-3.5" />}
                                value={data.content || ''}
                                onChange={v => updateField(week.weekNumber, 'content', v)}
                                placeholder="Overview of what will be covered this week…"
                                rows={4}
                              />

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                  label="Learning Objectives"
                                  icon={<Target className="w-3.5 h-3.5" />}
                                  value={data.learningObjectives || ''}
                                  onChange={v => updateField(week.weekNumber, 'learningObjectives', v)}
                                  placeholder="What students should learn…"
                                  rows={3}
                                />
                                <Field
                                  label="Materials Needed"
                                  icon={<Package className="w-3.5 h-3.5" />}
                                  value={data.materialsNeeded || ''}
                                  onChange={v => updateField(week.weekNumber, 'materialsNeeded', v)}
                                  placeholder="Items or prep students need to bring…"
                                  rows={3}
                                />
                              </div>
                            </div>

                            {/* Action row */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <button
                                onClick={() => toggleEditing(week.weekNumber)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSave(week.weekNumber, false)}
                                  disabled={saving}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-[0.97]"
                                >
                                  {saving ? <Spin /> : <Save className="w-3.5 h-3.5" />}
                                  Save Draft
                                </button>
                                <button
                                  onClick={() => handleSave(week.weekNumber, true)}
                                  disabled={saving}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all active:scale-[0.97] shadow-sm"
                                >
                                  {saving ? <Spin /> : <Sparkles className="w-3.5 h-3.5" />}
                                  Save & Publish
                                </button>
                              </div>
                            </div>
                          </div>

                        ) : (

                          /* ── VIEW MODE ─────────────────────────────────── */
                          <div className="px-5 py-5">
                            {hasContent ? (
                              <div className="space-y-5">
                                {week.title && (
                                  <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Title</p>
                                    <p className="text-[16px] font-semibold text-slate-900">{week.title}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <ViewField label="Content" icon={<FileText className="w-3.5 h-3.5" />} value={week.content} />
                                  <ViewField label="Learning Objectives" icon={<Target className="w-3.5 h-3.5" />} value={week.learningObjectives} />
                                </div>

                                <ViewField label="Materials Needed" icon={<Package className="w-3.5 h-3.5" />} value={week.materialsNeeded} />
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 py-6 px-2 text-slate-400">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 opacity-50" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-500">No content yet</p>
                                  <p className="text-xs mt-0.5">Click <span className="font-semibold text-blue-600">Edit</span> to add content for this week</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWeeklyNotesPage;
