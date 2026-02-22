
// import { useEffect, useState } from 'react';
// import { Calendar, Clock, Users, MapPin, CalendarDays, X } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal, Alert } from '../../components/ui';
// import { labSessionService, registrationService } from '../../services';
// import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';
// import { timeSlotService } from '../../services/TimeSlotService';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface GroupMember {
//   id: number;
//   fullName: string;
//   studentId: string;
//   username: string;
//   profilePictureUrl?: string;
// }

// // ─── Avatar ───────────────────────────────────────────────────────────────────

// const MemberAvatar = ({ member }: { member: GroupMember }) => {
//   const initials = member.fullName
//     .split(' ')
//     .map(n => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase();

//   const PALETTE = [
//     'bg-blue-100 text-blue-700',
//     'bg-violet-100 text-violet-700',
//     'bg-emerald-100 text-emerald-700',
//     'bg-amber-100 text-amber-700',
//     'bg-pink-100 text-pink-700',
//     'bg-cyan-100 text-cyan-700',
//     'bg-orange-100 text-orange-700',
//     'bg-teal-100 text-teal-700',
//   ];
//   const colorClass = PALETTE[member.fullName.charCodeAt(0) % PALETTE.length];

//   return (
//     <div className="flex flex-col items-center gap-2 group">
//       <div className="relative">
//         {member.profilePictureUrl ? (
//           <img
//             src={member.profilePictureUrl}
//             alt={member.fullName}
//             className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:ring-blue-300 transition-all duration-200"
//           />
//         ) : (
//           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md ring-2 ring-white group-hover:ring-blue-300 transition-all duration-200 ${colorClass}`}>
//             {initials}
//           </div>
//         )}
//       </div>
//       <div className="text-center">
//         <p className="text-xs font-semibold text-gray-800 leading-tight max-w-[72px] truncate" title={member.fullName}>
//           {member.fullName.split(' ')[0]}
//         </p>
//         <p className="text-[10px] text-gray-400 font-mono mt-0.5">{member.studentId}</p>
//       </div>
//     </div>
//   );
// };

// // ─── Group Members Modal ──────────────────────────────────────────────────────

// const GroupMembersModal = ({
//   isOpen,
//   onClose,
//   session,
//   timeSlotId,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   session: LabSession | null;
//   timeSlotId: number | null;
// }) => {
//   const [members, setMembers] = useState<GroupMember[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isOpen || !timeSlotId) return;
//     setLoading(true);
//     registrationService
//       .getGroupMembers(timeSlotId)
//       .then(setMembers)
//       .catch(() => toast.error('Failed to load group members'))
//       .finally(() => setLoading(false));
//   }, [isOpen, timeSlotId]);

//   if (!session) return null;

//   return (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 flex items-center justify-between">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-0.5">Lab Group</p>
//             <h2 className="text-white font-bold text-base leading-tight">{session.name}</h2>
//             <p className="text-gray-400 text-xs mt-0.5">{session.courseCode} · {session.course?.courseName}</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
//           >
//             <X className="w-4 h-4 text-white" />
//           </button>
//         </div>

//         {/* Slot info strip */}
//         <div className="bg-gray-50 border-b border-gray-100 px-5 py-2.5 flex flex-wrap gap-4 text-xs text-gray-500">
//           <span className="flex items-center gap-1">
//             <Calendar className="w-3.5 h-3.5" />
//             {formatSessionDays(session.sessionDays)}
//           </span>
//           <span className="flex items-center gap-1">
//             <Clock className="w-3.5 h-3.5" />
//             {session.startTime} – {session.endTime}
//           </span>
//           <span className="flex items-center gap-1">
//             <MapPin className="w-3.5 h-3.5" />
//             {session.labRoom}
//           </span>
//         </div>

//         {/* Members */}
//         <div className="px-5 py-5 min-h-[160px]">
//           {loading ? (
//             <div className="flex items-center justify-center h-32">
//               <svg className="animate-spin w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
//               </svg>
//             </div>
//           ) : members.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-32 text-gray-400">
//               <Users className="w-8 h-8 mb-2 opacity-40" />
//               <p className="text-sm">No other members in this group yet</p>
//             </div>
//           ) : (
//             <>
//               <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
//                 {members.length} member{members.length !== 1 ? 's' : ''}
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 {members.map(member => (
//                   <MemberAvatar key={member.id} member={member} />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Helpers (module-level so GroupMembersModal can also use them) ─────────────

// function formatDateRange(start: string, end: string) {
//   const s = new Date(start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   const e = new Date(end   + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   return `${s} – ${e}`;
// }

// function formatSessionDays(days: string | string[] | undefined) {
//   const arr = Array.isArray(days) ? days : days ? days.split(',') : [];
//   return arr
//     .map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3))
//     .join(', ');
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// const AvailableSessionsPage = () => {
//   const [sessions, setSessions]             = useState<LabSession[]>([]);
//   const [loading, setLoading]               = useState(true);
//   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
//   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
//   const [loadingSlots, setLoadingSlots]     = useState(false);
//   const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
//   const [registering, setRegistering]       = useState(false);

//   // Track which sessions the student has already registered for
//   // Maps sessionId → timeSlotId (so we can pass it to the group members modal)
//   const [myRegistrations, setMyRegistrations] = useState<Map<number, number>>(new Map());

//   // Group members modal state
//   const [groupSession, setGroupSession]   = useState<LabSession | null>(null);
//   const [groupTimeSlotId, setGroupTimeSlotId] = useState<number | null>(null);
//   const [showGroupModal, setShowGroupModal] = useState(false);

//   useEffect(() => { fetchSessions(); }, []);

//   const fetchSessions = async () => {
//     try {
//       const [sessionsData, myRegs] = await Promise.all([
//         labSessionService.getAvailableForMe(),
//         registrationService.getMyRegistrations(),
//       ]);
//       setSessions(sessionsData);

//       // Build a map of sessionId → timeSlotId for confirmed registrations
//       const regMap = new Map<number, number>();
//       myRegs
//         .filter((r: any) => r.status === 'CONFIRMED' || r.status === 'PENDING')
//         .forEach((r: any) => {
//           if (r.labSessionId && r.timeSlotId) {
//             regMap.set(r.labSessionId, r.timeSlotId);
//           }
//         });
//       setMyRegistrations(regMap);
//     } catch {
//       toast.error('Failed to load sessions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectSession = async (session: LabSession) => {
//     setSelectedSession(session);
//     setSelectedSlotNumber(null);
//     setAvailableSlots([]);
//     setLoadingSlots(true);
//     try {
//       setAvailableSlots(await timeSlotService.getAvailable(session.id));
//     } catch {
//       toast.error('Failed to load available slots');
//     } finally {
//       setLoadingSlots(false);
//     }
//   };

//   const handleViewGroup = (session: LabSession) => {
//     const timeSlotId = myRegistrations.get(session.id) ?? null;
//     setGroupSession(session);
//     setGroupTimeSlotId(timeSlotId);
//     setShowGroupModal(true);
//   };

//   const handleRegister = async () => {
//     if (!selectedSession) return;
//     setRegistering(true);
//     try {
//       const timeSlot = selectedSlotNumber !== null
//         ? availableSlots.find(ts => ts.slotNumber === selectedSlotNumber)
//         : undefined;

//       const result = await registrationService.create({
//         labSessionId: selectedSession.id,
//         timeSlotId: timeSlot?.id,
//       });

//       if (result.status === 'WAITLISTED') {
//         toast.success(`Added to waitlist! Position: #${result.waitlistPosition}`);
//       } else {
//         toast.success(`Registration confirmed! You've been assigned to Slot ${result.slotNumber}.`);
//       }
//       setSelectedSession(null);
//       fetchSessions(); // re-fetch so button switches to "View Group Members"
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//     } finally {
//       setRegistering(false);
//     }
//   };

//   const getSlotSummary = (slots: TimeSlot[]) => {
//     const slotMap = new Map<number, { total: number; filled: number; startTime: string; endTime: string }>();
//     slots.forEach(slot => {
//       if (!slotMap.has(slot.slotNumber)) {
//         slotMap.set(slot.slotNumber, {
//           total: slot.maxStudents,
//           filled: slot.currentCount,
//           startTime: slot.startTime,
//           endTime: slot.endTime,
//         });
//       }
//     });
//     return Array.from(slotMap.entries())
//       .map(([slotNumber, d]) => ({
//         slotNumber, ...d,
//         available: d.total - d.filled,
//         isFull: d.filled >= d.total,
//       }))
//       .sort((a, b) => a.slotNumber - b.slotNumber);
//   };

//   if (loading) return <Loading text="Loading available sessions..." />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Available Lab Sessions</h1>
//         <p className="text-gray-600 mt-1">Browse and register for lab sessions available to your program</p>
//       </div>

//       {sessions.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No sessions available</h3>
//             <p className="text-sm text-gray-500 mt-1">There are no lab sessions currently open for your program.</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sessions.map((session) => {
//             const isRegistered = myRegistrations.has(session.id);
//             return (
//               <Card key={session.id} className={`hover:shadow-md transition-shadow ${isRegistered ? 'ring-2 ring-green-400 ring-offset-1' : ''}`}>
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 truncate">{session.name}</h3>
//                       <p className="text-sm text-gray-500">{session.courseCode} - {session.course?.courseName}</p>
//                     </div>
//                     {isRegistered ? (
//                       <Badge variant="success" className="ml-2 flex-shrink-0">Registered</Badge>
//                     ) : (
//                       <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'} className="ml-2 flex-shrink-0">
//                         {session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 text-sm text-gray-600">
//                     <div className="flex items-center">
//                       <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
//                       <span>{formatDateRange(session.startDate, session.endDate)}</span>
//                       <Badge variant="info" className="ml-2">{session.durationWeeks}w</Badge>
//                     </div>
//                     <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatSessionDays(session.sessionDays)}</span></div>
//                     <div className="flex items-center"><Clock className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.startTime} - {session.endTime}</span></div>
//                     <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.labRoom}</span></div>
//                     <div className="flex items-center"><Users className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.currentRegistrationCount}/{session.totalCapacity} registered</span></div>
//                   </div>

//                   {/* ── The alternating button ── */}
//                   {isRegistered ? (
//                     <button
//                       onClick={() => handleViewGroup(session)}
//                       className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 border-2 border-green-300 text-sm font-semibold hover:bg-green-100 hover:border-green-400 transition-all duration-150 active:scale-[0.98]"
//                     >
//                       <Users className="w-4 h-4" />
//                       View Group Members
//                     </button>
//                   ) : (
//                     <Button className="w-full mt-4" onClick={() => handleSelectSession(session)}>
//                       {session.availableSlots > 0 ? 'Register Now' : 'Join Waitlist'}
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* Registration Modal */}
//       <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Lab Session" size="lg">
//         {selectedSession && (
//           <div className="space-y-4">
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <h4 className="font-semibold text-gray-900">{selectedSession.name}</h4>
//               <p className="text-sm text-gray-600">{selectedSession.courseCode} - {selectedSession.course?.courseName}</p>
//               <div className="mt-2 text-sm text-gray-500 space-y-1">
//                 <p><strong>Duration:</strong> {formatDateRange(selectedSession.startDate, selectedSession.endDate)} ({selectedSession.durationWeeks} weeks)</p>
//                 <p><strong>Days:</strong> {formatSessionDays(selectedSession.sessionDays)}</p>
//                 <p><strong>Location:</strong> {selectedSession.labRoom}</p>
//               </div>
//             </div>

//             <Alert variant="info" title="One Registration for Entire Duration">
//               You'll be assigned to <strong>one time slot and group</strong> that you attend every session day for the full {selectedSession.durationWeeks} weeks.
//             </Alert>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Preferred Group</label>
//               {loadingSlots ? (
//                 <Loading text="Loading slots..." />
//               ) : availableSlots.length === 0 ? (
//                 <div className="text-center py-6 text-gray-500">
//                   <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                   <p className="text-sm">No time slots have been configured for this session yet.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {getSlotSummary(availableSlots).map((slot) => (
//                     <label
//                       key={slot.slotNumber}
//                       className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                         selectedSlotNumber === slot.slotNumber
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <div className="flex items-center">
//                         <input
//                           type="radio"
//                           name="timeSlot"
//                           value={slot.slotNumber}
//                           checked={selectedSlotNumber === slot.slotNumber}
//                           onChange={() => setSelectedSlotNumber(slot.slotNumber)}
//                           className="mr-4 w-4 h-4 text-blue-600"
//                         />
//                         <div>
//                           <div className="font-medium text-gray-900">
//                             Group {slot.slotNumber}: {slot.startTime} - {slot.endTime}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {slot.isFull ? 'Full — you will be added to the waitlist' : `${slot.available} of ${slot.total} spots available`}
//                           </div>
//                         </div>
//                       </div>
//                       <Badge variant={slot.isFull ? 'warning' : 'success'}>
//                         {slot.isFull ? 'Waitlist' : `${slot.available} left`}
//                       </Badge>
//                     </label>
//                   ))}

//                   <label
//                     className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                       selectedSlotNumber === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         name="timeSlot"
//                         checked={selectedSlotNumber === null}
//                         onChange={() => setSelectedSlotNumber(null)}
//                         className="mr-4 w-4 h-4 text-blue-600"
//                       />
//                       <div>
//                         <div className="font-medium text-gray-900">Auto-assign (Recommended)</div>
//                         <div className="text-sm text-gray-500">System assigns you to the first available slot</div>
//                       </div>
//                     </div>
//                     <Badge variant="info">Auto</Badge>
//                   </label>
//                 </div>
//               )}
//             </div>

//             {selectedSlotNumber !== null &&
//               getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull && (
//               <Alert variant="warning" title="This slot is full">
//                 You will be added to the waitlist and notified when a spot opens.
//               </Alert>
//             )}

//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
//               <Button onClick={handleRegister} isLoading={registering}>
//                 {selectedSlotNumber !== null &&
//                   getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull
//                   ? 'Join Waitlist'
//                   : 'Confirm Registration'}
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Group Members Modal */}
//       <GroupMembersModal
//         isOpen={showGroupModal}
//         onClose={() => { setShowGroupModal(false); setGroupSession(null); setGroupTimeSlotId(null); }}
//         session={groupSession}
//         timeSlotId={groupTimeSlotId}
//       />
//     </div>
//   );
// };

// export default AvailableSessionsPage;





import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, MapPin, CalendarDays, X, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Badge, Button, Loading, Modal, Alert } from '../../components/ui';
import { labSessionService, registrationService } from '../../services';
import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';
import { timeSlotService } from '../../services/TimeSlotService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupMember {
  id: number;
  fullName: string;
  studentId: string;
  username: string;
  profilePictureUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string) {
  const s = new Date(start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const e = new Date(end   + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${s} – ${e}`;
}

function formatSessionDays(days: string | string[] | undefined) {
  const arr = Array.isArray(days) ? days : days ? days.split(',') : [];
  return arr
    .map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3))
    .join(', ');
}

// ─── Member Avatar ────────────────────────────────────────────────────────────

const PALETTE = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-200' },
  { bg: 'bg-sky-100',    text: 'text-sky-700',    ring: 'ring-sky-200'    },
  { bg: 'bg-emerald-100',text: 'text-emerald-700',ring: 'ring-emerald-200'},
  { bg: 'bg-amber-100',  text: 'text-amber-700',  ring: 'ring-amber-200'  },
  { bg: 'bg-rose-100',   text: 'text-rose-700',   ring: 'ring-rose-200'   },
  { bg: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-200' },
  { bg: 'bg-teal-100',   text: 'text-teal-700',   ring: 'ring-teal-200'   },
  { bg: 'bg-fuchsia-100',text: 'text-fuchsia-700',ring: 'ring-fuchsia-200'},
];

const MemberAvatar = ({ member, index }: { member: GroupMember; index: number }) => {
  const initials = member.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const palette  = PALETTE[member.fullName.charCodeAt(0) % PALETTE.length];

  return (
    <div
      className="flex flex-col items-center gap-2.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {member.profilePictureUrl ? (
        <img
          src={member.profilePictureUrl}
          alt={member.fullName}
          className={`w-14 h-14 rounded-2xl object-cover ring-2 ring-offset-2 ${palette.ring} shadow-sm hover:scale-105 transition-transform duration-200`}
        />
      ) : (
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold ring-2 ring-offset-2 shadow-sm hover:scale-105 transition-transform duration-200 ${palette.bg} ${palette.text} ${palette.ring}`}>
          {initials}
        </div>
      )}
      <div className="text-center leading-tight">
        <p className="text-xs font-semibold text-slate-700 max-w-[60px] truncate" title={member.fullName}>
          {member.fullName.split(' ')[0]}
        </p>
        <p className="text-[10px] text-slate-400 font-mono">{member.studentId}</p>
      </div>
    </div>
  );
};

// ─── Group Members Modal ──────────────────────────────────────────────────────

const GroupMembersModal = ({
  isOpen, onClose, session, timeSlotId,
}: {
  isOpen: boolean; onClose: () => void;
  session: LabSession | null; timeSlotId: number | null;
}) => {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !timeSlotId) return;
    setLoading(true);
    setMembers([]);
    registrationService
      .getGroupMembers(timeSlotId)
      .then(setMembers)
      .catch(() => toast.error('Failed to load group members'))
      .finally(() => setLoading(false));
  }, [isOpen, timeSlotId]);

  if (!session) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">

          {/* Pull handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div className="relative px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="pr-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  <Users className="w-3 h-3" /> Lab Group
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{session.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{session.courseCode} · {session.course?.courseName}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Meta strip */}
          <div className="px-6 py-3 flex flex-wrap gap-4 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" />{formatSessionDays(session.sessionDays)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" />{session.startTime} – {session.endTime}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" />{session.labRoom}</span>
          </div>

          {/* Members area */}
          <div className="px-6 py-6 min-h-[180px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-36 gap-3">
                <svg className="animate-spin w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                <p className="text-sm text-slate-400">Loading members…</p>
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-36 text-slate-400 gap-2">
                <Users className="w-10 h-10 opacity-25" />
                <p className="text-sm font-medium">No other members yet</p>
                <p className="text-xs opacity-70">Be the first to invite classmates!</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-5">
                  {members.map((m, i) => <MemberAvatar key={m.id} member={m} index={i} />)}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Session Card ─────────────────────────────────────────────────────────────

const SessionCard = ({
  session,
  isRegistered,
  index,
  onRegister,
  onViewGroup,
}: {
  session: LabSession;
  isRegistered: boolean;
  index: number;
  onRegister: (s: LabSession) => void;
  onViewGroup: (s: LabSession) => void;
}) => {
  const hasSpots = session.availableSlots > 0;
  const fillPct  = session.totalCapacity > 0
    ? Math.round((session.currentRegistrationCount / session.totalCapacity) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isRegistered ? 'bg-emerald-400' : hasSpots ? 'bg-indigo-400' : 'bg-amber-400'}`} />

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{session.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{session.courseCode} · {session.course?.courseName}</p>
          </div>
          {isRegistered ? (
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Enrolled
            </span>
          ) : hasSpots ? (
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Open
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
              Waitlist
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 col-span-2">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {formatDateRange(session.startDate, session.endDate)}
            <span className="ml-auto text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{session.durationWeeks}w</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {formatSessionDays(session.sessionDays)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {session.startTime?.substring(0,5)} – {session.endTime?.substring(0,5)}
          </span>
          <span className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {session.labRoom}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-medium">
            <span className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> Capacity</span>
            <span className={`font-semibold ${fillPct >= 100 ? 'text-amber-500' : fillPct >= 80 ? 'text-orange-500' : 'text-slate-600'}`}>
              {session.currentRegistrationCount}/{session.totalCapacity}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${fillPct >= 100 ? 'bg-amber-400' : fillPct >= 80 ? 'bg-orange-400' : 'bg-indigo-400'}`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
        </div>

        {/* CTA button */}
        <div className="mt-auto pt-1">
          {isRegistered ? (
            <button
              onClick={() => onViewGroup(session)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150 active:scale-[0.98] group/btn"
            >
              <Users className="w-4 h-4" />
              View Group Members
              <ChevronRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-150" />
            </button>
          ) : (
            <button
              onClick={() => onRegister(session)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] group/btn
                ${hasSpots
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                }`}
            >
              {hasSpots ? 'Register Now' : 'Join Waitlist'}
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:translate-x-0.5 transition-transform duration-150" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const AvailableSessionsPage = () => {
  const [sessions, setSessions]               = useState<LabSession[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
  const [availableSlots, setAvailableSlots]   = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots]       = useState(false);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
  const [registering, setRegistering]         = useState(false);
  const [myRegistrations, setMyRegistrations] = useState<Map<number, number>>(new Map());
  const [groupSession, setGroupSession]       = useState<LabSession | null>(null);
  const [groupTimeSlotId, setGroupTimeSlotId] = useState<number | null>(null);
  const [showGroupModal, setShowGroupModal]   = useState(false);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const [sessionsData, myRegs] = await Promise.all([
        labSessionService.getAvailableForMe(),
        registrationService.getMyRegistrations(),
      ]);
      setSessions(sessionsData);
      const regMap = new Map<number, number>();
      myRegs
        .filter((r: any) => r.status === 'CONFIRMED' || r.status === 'PENDING')
        .forEach((r: any) => { if (r.labSessionId && r.timeSlotId) regMap.set(r.labSessionId, r.timeSlotId); });
      setMyRegistrations(regMap);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (session: LabSession) => {
    setSelectedSession(session);
    setSelectedSlotNumber(null);
    setAvailableSlots([]);
    setLoadingSlots(true);
    try {
      setAvailableSlots(await timeSlotService.getAvailable(session.id));
    } catch {
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleViewGroup = (session: LabSession) => {
    setGroupSession(session);
    setGroupTimeSlotId(myRegistrations.get(session.id) ?? null);
    setShowGroupModal(true);
  };

  const handleRegister = async () => {
    if (!selectedSession) return;
    setRegistering(true);
    try {
      const timeSlot = selectedSlotNumber !== null
        ? availableSlots.find(ts => ts.slotNumber === selectedSlotNumber) : undefined;
      const result = await registrationService.create({ labSessionId: selectedSession.id, timeSlotId: timeSlot?.id });
      if (result.status === 'WAITLISTED') {
        toast.success(`Added to waitlist — position #${result.waitlistPosition}`);
      } else {
        toast.success(`Confirmed! You're in Group ${result.slotNumber}.`);
      }
      setSelectedSession(null);
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const getSlotSummary = (slots: TimeSlot[]) => {
    const m = new Map<number, { total: number; filled: number; startTime: string; endTime: string }>();
    slots.forEach(s => {
      if (!m.has(s.slotNumber)) m.set(s.slotNumber, { total: s.maxStudents, filled: s.currentCount, startTime: s.startTime, endTime: s.endTime });
    });
    return Array.from(m.entries())
      .map(([slotNumber, d]) => ({ slotNumber, ...d, available: d.total - d.filled, isFull: d.filled >= d.total }))
      .sort((a, b) => a.slotNumber - b.slotNumber);
  };

  if (loading) return <Loading text="Loading available sessions…" />;

  const registered   = sessions.filter(s => myRegistrations.has(s.id));
  const unregistered = sessions.filter(s => !myRegistrations.has(s.id));

  return (
    <div className="space-y-8 pb-12">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Student Portal</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Sessions</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and register for sessions available to your programme</p>
        </div>
        {sessions.length > 0 && (
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              {unregistered.length} open
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {registered.length} enrolled
            </span>
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 opacity-40" />
          </div>
          <p className="text-base font-semibold text-slate-600">No sessions available</p>
          <p className="text-sm">There are no lab sessions currently open for your programme.</p>
        </div>
      ) : (
        <>
          {/* Enrolled sessions */}
          {registered.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Enrolled</h2>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400">{registered.length} session{registered.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {registered.map((s, i) => (
                  <SessionCard key={s.id} session={s} isRegistered index={i} onRegister={handleSelectSession} onViewGroup={handleViewGroup} />
                ))}
              </div>
            </div>
          )}

          {/* Available sessions */}
          {unregistered.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Available</h2>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400">{unregistered.length} session{unregistered.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unregistered.map((s, i) => (
                  <SessionCard key={s.id} session={s} isRegistered={false} index={i} onRegister={handleSelectSession} onViewGroup={handleViewGroup} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Registration Modal ── */}
      <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Lab Session" size="lg">
        {selectedSession && (
          <div className="space-y-5">

            {/* Session summary card */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h4 className="font-bold text-slate-900">{selectedSession.name}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{selectedSession.courseCode} · {selectedSession.course?.courseName}</p>
              <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-slate-400" />{formatDateRange(selectedSession.startDate, selectedSession.endDate)}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{formatSessionDays(selectedSession.sessionDays)}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{selectedSession.startTime} – {selectedSession.endTime}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{selectedSession.labRoom}</span>
              </div>
            </div>

            <Alert variant="info" title="One slot for the full duration">
              You'll be assigned to <strong>one group</strong> that you attend every week for all {selectedSession.durationWeeks} weeks.
            </Alert>

            {/* Group picker */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Choose your preferred group</p>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                  </svg>
                  Loading groups…
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No groups configured yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getSlotSummary(availableSlots).map(slot => (
                    <label
                      key={slot.slotNumber}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                        selectedSlotNumber === slot.slotNumber
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot.slotNumber}
                          checked={selectedSlotNumber === slot.slotNumber}
                          onChange={() => setSelectedSlotNumber(slot.slotNumber)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Group {slot.slotNumber} <span className="font-normal text-slate-500">· {slot.startTime} – {slot.endTime}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {slot.isFull ? 'Full — you\'ll join the waitlist' : `${slot.available} of ${slot.total} spots open`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        slot.isFull
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {slot.isFull ? 'Waitlist' : `${slot.available} left`}
                      </span>
                    </label>
                  ))}

                  {/* Auto-assign */}
                  <label className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                    selectedSlotNumber === null ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="timeSlot" checked={selectedSlotNumber === null} onChange={() => setSelectedSlotNumber(null)} className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Auto-assign <span className="text-xs text-indigo-500 font-medium">Recommended</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">System places you in the first available group</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-200">Auto</span>
                  </label>
                </div>
              )}
            </div>

            {selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull && (
              <Alert variant="warning" title="This group is full">
                You'll be added to the waitlist and notified when a spot opens.
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                {registering ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Registering…</>
                ) : selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull
                  ? 'Join Waitlist'
                  : 'Confirm Registration'
                }
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Group Members Modal ── */}
      <GroupMembersModal
        isOpen={showGroupModal}
        onClose={() => { setShowGroupModal(false); setGroupSession(null); setGroupTimeSlotId(null); }}
        session={groupSession}
        timeSlotId={groupTimeSlotId}
      />
    </div>
  );
};

export default AvailableSessionsPage;