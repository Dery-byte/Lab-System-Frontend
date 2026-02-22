// // import { useEffect, useState } from 'react';
// // import { Calendar, Clock, Users, MapPin, CalendarDays } from 'lucide-react';
// // import { toast } from 'react-hot-toast';
// // import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal, Alert } from '../../components/ui/index';
// // import { labSessionService, registrationService } from '../../services';
// // import { LabSession, DAY_OF_WEEK_OPTIONS } from '../../types';

// // const AvailableSessionsPage = () => {
// //   const [sessions, setSessions] = useState<LabSession[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
// //   const [registering, setRegistering] = useState(false);

// //   useEffect(() => { fetchSessions(); }, []);

// //   const fetchSessions = async () => {
// //     try { setSessions(await labSessionService.getAvailableForMe()); }
// //     catch { toast.error('Failed to load sessions'); }
// //     finally { setLoading(false); }
// //   };

// //   const handleRegister = async () => {
// //     if (!selectedSession) return;
// //     setRegistering(true);
// //     try {
// //       const result = await registrationService.create({ labSessionId: selectedSession.id });
// //       if (result.status === 'WAITLISTED') {
// //         toast.success(`Added to waitlist! Position: #${result.waitlistPosition}`);
// //       } else {
// //         toast.success('Registration confirmed! Check "My Registrations" for weekly session details.');
// //       }
// //       setSelectedSession(null);
// //       fetchSessions();
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || 'Registration failed');
// //     } finally {
// //       setRegistering(false);
// //     }
// //   };

// //   // const formatDays = (days: string[]) => days.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d)?.short || d.substring(0, 3)).join(', ');

// // const formatDays = (days: string | string[] | undefined) => {
// //   const daysArray = Array.isArray(days) ? days : days ? days.split(',') : [];
// //   return daysArray.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3)).join(', ');
// // };
 
 
 
// //   if (loading) return <Loading text="Loading sessions..." />;

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-2xl font-bold text-gray-900">Available Lab Sessions</h1>
// //         <p className="text-gray-600 mt-1">Browse and register for lab sessions available to your program</p>
// //       </div>

// //       {sessions.length === 0 ? (
// //         <Card><CardContent className="py-12 text-center"><Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-medium text-gray-900">No sessions available</h3></CardContent></Card>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {sessions.map((session) => (
// //             <Card key={session.id}>
// //               <CardHeader>
// //                 <div className="flex justify-between items-start">
// //                   <div><h3 className="font-semibold text-gray-900">{session.name}</h3><p className="text-sm text-gray-500">{session.courseCode}</p></div>
// //                   <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'}>{session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}</Badge>
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-2 text-sm text-gray-600">
// //                   <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2" /><span>{session.durationWeeks} weeks</span></div>
// //                   <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /><span>{formatDays(session.sessionDays)}</span></div>
// //                   <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{session.startTime} - {session.endTime}</div>
// //                   <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{session.labRoom}</div>
// //                   <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{session.currentRegistrationCount}/{session.totalCapacity} registered</div>
// //                 </div>
// //                 <Button className="w-full mt-4" onClick={() => setSelectedSession(session)}>
// //                   {session.availableSlots > 0 ? 'Register' : 'Join Waitlist'}
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}

// //       <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Confirm Registration" size="md">
// //         {selectedSession && (
// //           <div className="space-y-4">
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <h4 className="font-semibold">{selectedSession.name}</h4>
// //               <p className="text-sm text-gray-500">{selectedSession.courseCode}</p>
// //               <p className="text-sm text-gray-500 mt-1">{selectedSession.durationWeeks} weeks • {formatDays(selectedSession.sessionDays)} • {selectedSession.startTime} - {selectedSession.endTime}</p>
// //             </div>
// //             <Alert variant="info" title="What happens after registration?">
// //               <ul className="list-disc list-inside text-sm space-y-1">
// //                 <li>You'll be registered for the entire {selectedSession.durationWeeks}-week session</li>
// //                 <li>View weekly session content in "My Registrations"</li>
// //                 <li>Each week's notes will be available when published by the lab manager</li>
// //               </ul>
// //             </Alert>
// //             <div className="flex justify-end space-x-3 pt-4">
// //               <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
// //               <Button onClick={handleRegister} isLoading={registering}>{selectedSession.availableSlots > 0 ? 'Confirm Registration' : 'Join Waitlist'}</Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AvailableSessionsPage;






// // import { useEffect, useState } from 'react';
// // import { Calendar, Clock, Users, MapPin, CalendarDays } from 'lucide-react';
// // import { toast } from 'react-hot-toast';
// // import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal } from '../../components/ui/index';
// // import { labSessionService, registrationService } from '../../services';
// // import { timeSlotService } from '../../services/TimeSlotService';
// // import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';

// // const AvailableSessionsPage = () => {
// //   const [sessions, setSessions] = useState<LabSession[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
// //   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
// //   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
// //   const [loadingSlots, setLoadingSlots] = useState(false);
// //   const [registering, setRegistering] = useState(false);

// //   useEffect(() => { fetchSessions(); }, []);

// //   const fetchSessions = async () => {
// //     try { setSessions(await labSessionService.getAvailableForMe()); }
// //     catch { toast.error('Failed to load sessions'); }
// //     finally { setLoading(false); }
// //   };

// //   const handleOpenModal = async (session: LabSession) => {
// //     setSelectedSession(session);
// //     setSelectedSlot(null);
// //     setAvailableSlots([]);

// //     if (session.availableSlots > 0) {
// //       setLoadingSlots(true);
// //       try {
// //         const slots = await timeSlotService.getAvailable(session.id);
// //         setAvailableSlots(slots);
// //       } catch {
// //         toast.error('Failed to load available slots');
// //       } finally {
// //         setLoadingSlots(false);
// //       }
// //     }
// //   };

// //   const handleRegister = async () => {
// //     if (!selectedSession) return;
// //     if (selectedSession.availableSlots > 0 && !selectedSlot) {
// //       toast.error('Please select a time slot');
// //       return;
// //     }
// //     setRegistering(true);
// //     try {
// //       const result = await registrationService.create({
// //         labSessionId: selectedSession.id,
// //         timeSlotId: selectedSlot?.id ?? undefined,
// //       });
// //       if (result.status === 'WAITLISTED') {
// //         toast.success(`Added to waitlist! Position: #${result.waitlistPosition}`);
// //       } else {
// //         toast.success('Registration confirmed!');
// //       }
// //       setSelectedSession(null);
// //       fetchSessions();
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || 'Registration failed');
// //     } finally {
// //       setRegistering(false);
// //     }
// //   };

// //   const formatDays = (days: string | string[] | undefined) => {
// //     const daysArray = Array.isArray(days) ? days : days ? days.split(',') : [];
// //     return daysArray.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3)).join(', ');
// //   };

// //   if (loading) return <Loading text="Loading sessions..." />;

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-2xl font-bold text-gray-900">Available Lab Sessions</h1>
// //         <p className="text-gray-600 mt-1">Browse and register for lab sessions available to your program</p>
// //       </div>

// //       {sessions.length === 0 ? (
// //         <Card><CardContent className="py-12 text-center"><Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-medium text-gray-900">No sessions available</h3></CardContent></Card>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {sessions.map((session) => (
// //             <Card key={session.id}>
// //               <CardHeader>
// //                 <div className="flex justify-between items-start">
// //                   <div><h3 className="font-semibold text-gray-900">{session.name}</h3><p className="text-sm text-gray-500">{session.courseCode}</p></div>
// //                   <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'}>
// //                     {session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}
// //                   </Badge>
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-2 text-sm text-gray-600">
// //                   <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2" /><span>{session.durationWeeks} weeks</span></div>
// //                   <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /><span>{formatDays(session.sessionDays)}</span></div>
// //                   <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{session.startTime} - {session.endTime}</div>
// //                   <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{session.labRoom}</div>
// //                   <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{session.currentRegistrationCount}/{session.totalCapacity} registered</div>
// //                 </div>
// //                 <Button className="w-full mt-4" onClick={() => handleOpenModal(session)}>
// //                   {session.availableSlots > 0 ? 'Register' : 'Join Waitlist'}
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}

// //       <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Session" size="md">
// //         {selectedSession && (
// //           <div className="space-y-4">
// //             {/* Session Summary */}
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <h4 className="font-semibold">{selectedSession.name}</h4>
// //               <p className="text-sm text-gray-500">{selectedSession.courseCode}</p>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 {selectedSession.durationWeeks} weeks • {formatDays(selectedSession.sessionDays)} • {selectedSession.startTime} - {selectedSession.endTime}
// //               </p>
// //             </div>

// //             {/* Slot Picker — only shown when slots are available */}
// //             {selectedSession.availableSlots > 0 && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Select a Time Slot <span className="text-red-500">*</span>
// //                 </label>
// //                 {loadingSlots ? (
// //                   <Loading text="Loading slots..." />
// //                 ) : availableSlots.length === 0 ? (
// //                   <p className="text-sm text-gray-500">No slots available.</p>
// //                 ) : (
// //                   <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
// //                     {availableSlots.map(slot => (
// //                       <div
// //                         key={slot.id}
// //                         onClick={() => setSelectedSlot(slot)}
// //                         className={`p-3 border rounded-lg cursor-pointer transition-colors ${
// //                           selectedSlot?.id === slot.id
// //                             ? 'border-blue-500 bg-blue-50'
// //                             : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
// //                         }`}
// //                       >
// //                         <p className="text-sm font-medium">{slot.displayName}</p>
// //                         <p className="text-xs text-gray-500 mt-0.5">
// //                           {slot.availableSlots} of {slot.maxStudents} spots remaining
// //                         </p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Waitlist info */}
// //             {selectedSession.availableSlots === 0 && (
// //               <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
// //                 All slots are full. You will be added to the waitlist and notified when a spot opens.
// //               </div>
// //             )}

// //             <div className="flex justify-end space-x-3 pt-2">
// //               <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
// //               <Button onClick={handleRegister} isLoading={registering}>
// //                 {selectedSession.availableSlots > 0 ? 'Confirm Registration' : 'Join Waitlist'}
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AvailableSessionsPage;




// // import { useEffect, useState } from 'react';
// // import { Calendar, Clock, Users, MapPin, CalendarDays, Tag } from 'lucide-react';
// // import { toast } from 'react-hot-toast';
// // import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal, Alert, EmptyState } from '../../components/ui';
// // import { labSessionService, registrationService } from '../../services';
// // import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';
// // import { timeSlotService } from '../../services/TimeSlotService';

// // const AvailableSessionsPage = () => {
// //   const [sessions, setSessions] = useState<LabSession[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
// //   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
// //   const [loadingSlots, setLoadingSlots] = useState(false);
// //   const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
// //   const [registering, setRegistering] = useState(false);

// //   useEffect(() => { fetchSessions(); }, []);

// //   const fetchSessions = async () => {
// //     try {
// //       setSessions(await labSessionService.getAvailableForMe());
// //     } catch { toast.error('Failed to load sessions'); }
// //     finally { setLoading(false); }
// //   };

// //   const handleSelectSession = async (session: LabSession) => {
// //     setSelectedSession(session);
// //     setSelectedSlotNumber(null);
// //     setAvailableSlots([]);
// //     setLoadingSlots(true);
// //     try {
// //       const slots = await timeSlotService.getAvailable(session.id);
// //       setAvailableSlots(slots);
// //     } catch {
// //       toast.error('Failed to load available slots');
// //     } finally {
// //       setLoadingSlots(false);
// //     }
// //   };

// //   const handleRegister = async () => {
// //     if (!selectedSession) return;
// //     setRegistering(true);
// //     try {
// //       const timeSlot = selectedSlotNumber !== null
// //         ? availableSlots.find(ts => ts.slotNumber === selectedSlotNumber)
// //         : undefined;

// //       const result = await registrationService.create({
// //         labSessionId: selectedSession.id,
// //         timeSlotId: timeSlot?.id,
// //       });

// //       if (result.status === 'WAITLISTED') {
// //         toast.success(`Added to waitlist! Position: #${result.waitlistPosition}`);
// //       } else {
// //         toast.success(`Registration confirmed! You've been assigned to Slot ${result.slotNumber}.`);
// //       }
// //       setSelectedSession(null);
// //       fetchSessions();
// //     } catch (error: any) {
// //       toast.error(error.response?.data?.message || 'Registration failed');
// //     } finally {
// //       setRegistering(false);
// //     }
// //   };

// //   // Group by slotNumber since same slot repeats each week
// //   const getSlotSummary = (slots: TimeSlot[]) => {
// //     const slotMap = new Map<number, { total: number; filled: number; startTime: string; endTime: string }>();

// //     slots.forEach(slot => {
// //       if (!slotMap.has(slot.slotNumber)) {
// //         slotMap.set(slot.slotNumber, {
// //           total: slot.maxStudents,
// //           filled: slot.currentCount,
// //           startTime: slot.startTime,
// //           endTime: slot.endTime,
// //         });
// //       }
// //     });

// //     return Array.from(slotMap.entries())
// //       .map(([slotNumber, data]) => ({
// //         slotNumber,
// //         ...data,
// //         available: data.total - data.filled,
// //         isFull: data.filled >= data.total,
// //       }))
// //       .sort((a, b) => a.slotNumber - b.slotNumber);
// //   };

// //   const formatDateRange = (start: string, end: string) => {
// //     const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// //     const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
// //     return `${s} - ${e}`;
// //   };

// //   const formatSessionDays = (days: string | string[] | undefined) => {
// //     const daysArray = Array.isArray(days) ? days : days ? days.split(',') : [];
// //     return daysArray.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3)).join(', ');
// //   };

// //   if (loading) return <Loading text="Loading available sessions..." />;

// //   return (
// //     <div className="space-y-6">
// //       <div>
// //         <h1 className="text-2xl font-bold text-gray-900">Available Lab Sessions</h1>
// //         <p className="text-gray-600 mt-1">Browse and register for lab sessions available to your program</p>
// //       </div>

// //       {sessions.length === 0 ? (
// //         <Card><CardContent>
// //           <EmptyState icon={Calendar} title="No sessions available" description="There are no lab sessions currently open for your program." />
// //         </CardContent></Card>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {sessions.map((session) => (
// //             <Card key={session.id} className="hover:shadow-md transition-shadow">
// //               <CardHeader>
// //                 <div className="flex justify-between items-start">
// //                   <div className="flex-1 min-w-0">
// //                     <h3 className="font-semibold text-gray-900 truncate">{session.name}</h3>
// //                     <p className="text-sm text-gray-500">{session.courseCode} - {session.course?.courseName}</p>
// //                   </div>
// //                   <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'} className="ml-2 flex-shrink-0">
// //                     {session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}
// //                   </Badge>
// //                 </div>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-2 text-sm text-gray-600">
// //                   <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatDateRange(session.startDate, session.endDate)}</span><Badge variant="info" className="ml-2">{session.durationWeeks}w</Badge></div>
// //                   <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatSessionDays(session.sessionDays)}</span></div>
// //                   <div className="flex items-center"><Clock className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.startTime} - {session.endTime}</span></div>
// //                   <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.labRoom}</span></div>
// //                   <div className="flex items-center"><Users className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.currentRegistrationCount}/{session.totalCapacity} registered</span></div>
// //                 </div>
// //                 <Button className="w-full mt-4" onClick={() => handleSelectSession(session)}>
// //                   {session.availableSlots > 0 ? 'Register Now' : 'Join Waitlist'}
// //                 </Button>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       )}

// //       <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Lab Session" size="lg">
// //         {selectedSession && (
// //           <div className="space-y-4">
// //             {/* Session Info */}
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <h4 className="font-semibold text-gray-900">{selectedSession.name}</h4>
// //               <p className="text-sm text-gray-600">{selectedSession.courseCode} - {selectedSession.course?.courseName}</p>
// //               <div className="mt-2 text-sm text-gray-500 space-y-1">
// //                 <p><strong>Duration:</strong> {formatDateRange(selectedSession.startDate, selectedSession.endDate)} ({selectedSession.durationWeeks} weeks)</p>
// //                 <p><strong>Days:</strong> {formatSessionDays(selectedSession.sessionDays)}</p>
// //                 <p><strong>Location:</strong> {selectedSession.labRoom}</p>
// //               </div>
// //             </div>

// //             <Alert variant="info" title="One Registration for Entire Duration">
// //               You'll be assigned to <strong>one time slot</strong> that you attend every session day for the full {selectedSession.durationWeeks} weeks.
// //             </Alert>

// //             {/* Slot Picker */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Preferred Time Slot</label>
// //               {loadingSlots ? (
// //                 <Loading text="Loading slots..." />
// //               ) : (
// //                 <div className="space-y-2">
// //                   {getSlotSummary(availableSlots).map((slot) => (
// //                     <label key={slot.slotNumber}
// //                       className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
// //                         selectedSlotNumber === slot.slotNumber
// //                           ? 'border-blue-500 bg-blue-50'
// //                           : 'border-gray-200 hover:border-gray-300'
// //                       }`}
// //                     >
// //                       <div className="flex items-center">
// //                         <input type="radio" name="timeSlot" value={slot.slotNumber}
// //                           checked={selectedSlotNumber === slot.slotNumber}
// //                           onChange={() => setSelectedSlotNumber(slot.slotNumber)}
// //                           className="mr-4 w-4 h-4 text-blue-600" />
// //                         <div>
// //                           <div className="font-medium text-gray-900">Slot {slot.slotNumber}: {slot.startTime} - {slot.endTime}</div>
// //                           <div className="text-sm text-gray-500">
// //                             {slot.isFull ? 'Full — you will be added to the waitlist' : `${slot.available} of ${slot.total} spots available`}
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <Badge variant={slot.isFull ? 'warning' : 'success'}>
// //                         {slot.isFull ? 'Waitlist' : `${slot.available} left`}
// //                       </Badge>
// //                     </label>
// //                   ))}

// //                   {/* Auto-assign option */}
// //                   <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
// //                     selectedSlotNumber === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
// //                   }`}>
// //                     <div className="flex items-center">
// //                       <input type="radio" name="timeSlot" checked={selectedSlotNumber === null}
// //                         onChange={() => setSelectedSlotNumber(null)}
// //                         className="mr-4 w-4 h-4 text-blue-600" />
// //                       <div>
// //                         <div className="font-medium text-gray-900">Auto-assign (Recommended)</div>
// //                         <div className="text-sm text-gray-500">System assigns you to the first available slot</div>
// //                       </div>
// //                     </div>
// //                     <Badge variant="info">Auto</Badge>
// //                   </label>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Warning if selected slot is full */}
// //             {selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull && (
// //               <Alert variant="warning" title="This slot is full">
// //                 You will be added to the waitlist and notified when a spot opens.
// //               </Alert>
// //             )}

// //             <div className="flex justify-end space-x-3 pt-4 border-t">
// //               <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
// //               <Button onClick={handleRegister} isLoading={registering}>
// //                 {selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull
// //                   ? 'Join Waitlist'
// //                   : 'Confirm Registration'
// //                 }
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AvailableSessionsPage;
















// import { useEffect, useState } from 'react';
// import { Calendar, Clock, Users, MapPin, CalendarDays } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal, Alert } from '../../components/ui';
// import { labSessionService, registrationService } from '../../services';
// import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';
// import { timeSlotService } from '../../services/TimeSlotService';

// const AvailableSessionsPage = () => {
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
//   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
//   const [registering, setRegistering] = useState(false);

//   useEffect(() => { fetchSessions(); }, []);

//   const fetchSessions = async () => {
//     try {
//       setSessions(await labSessionService.getAvailableForMe());
//     } catch { toast.error('Failed to load sessions'); }
//     finally { setLoading(false); }
//   };

//   const handleSelectSession = async (session: LabSession) => {
//     setSelectedSession(session);
//     setSelectedSlotNumber(null);
//     setAvailableSlots([]);
//     setLoadingSlots(true);
//     try {
//       const slots = await timeSlotService.getAvailable(session.id);
//       setAvailableSlots(slots);
//     } catch {
//       toast.error('Failed to load available slots');
//     } finally {
//       setLoadingSlots(false);
//     }
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
//       fetchSessions();
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
//       .map(([slotNumber, data]) => ({
//         slotNumber,
//         ...data,
//         available: data.total - data.filled,
//         isFull: data.filled >= data.total,
//       }))
//       .sort((a, b) => a.slotNumber - b.slotNumber);
//   };

//   const formatDateRange = (start: string, end: string) => {
//     const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     return `${s} - ${e}`;
//   };

//   const formatSessionDays = (days: string | string[] | undefined) => {
//     const daysArray = Array.isArray(days) ? days : days ? days.split(',') : [];
//     return daysArray.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3)).join(', ');
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
//           {sessions.map((session) => (
//             <Card key={session.id} className="hover:shadow-md transition-shadow">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-gray-900 truncate">{session.name}</h3>
//                     <p className="text-sm text-gray-500">{session.courseCode} - {session.course?.courseName}</p>
//                   </div>
//                   <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'} className="ml-2 flex-shrink-0">
//                     {session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatDateRange(session.startDate, session.endDate)}</span><Badge variant="info" className="ml-2">{session.durationWeeks}w</Badge></div>
//                   <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatSessionDays(session.sessionDays)}</span></div>
//                   <div className="flex items-center"><Clock className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.startTime} - {session.endTime}</span></div>
//                   <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.labRoom}</span></div>
//                   <div className="flex items-center"><Users className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.currentRegistrationCount}/{session.totalCapacity} registered</span></div>
//                 </div>
//                 <Button className="w-full mt-4" onClick={() => handleSelectSession(session)}>
//                   {session.availableSlots > 0 ? 'Register Now' : 'Join Waitlist'}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Lab Session" size="lg">
//         {selectedSession && (
//           <div className="space-y-4">
//             {/* Session Info */}
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
//               You'll be assigned to <strong>one time slot</strong> that you attend every session day for the full {selectedSession.durationWeeks} weeks.
//             </Alert>

//             {/* Slot Picker */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Preferred Time Slot</label>
//               {loadingSlots ? (
//                 <Loading text="Loading slots..." />
//               ) : (
//                 <div className="space-y-2">
//                   {getSlotSummary(availableSlots).map((slot) => (
//                     <label key={slot.slotNumber}
//                       className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                         selectedSlotNumber === slot.slotNumber
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <div className="flex items-center">
//                         <input type="radio" name="timeSlot" value={slot.slotNumber}
//                           checked={selectedSlotNumber === slot.slotNumber}
//                           onChange={() => setSelectedSlotNumber(slot.slotNumber)}
//                           className="mr-4 w-4 h-4 text-blue-600" />
//                         <div>
//                           <div className="font-medium text-gray-900">Slot {slot.slotNumber}: {slot.startTime} - {slot.endTime}</div>
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

//                   {/* Auto-assign option */}
//                   <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                     selectedSlotNumber === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
//                   }`}>
//                     <div className="flex items-center">
//                       <input type="radio" name="timeSlot" checked={selectedSlotNumber === null}
//                         onChange={() => setSelectedSlotNumber(null)}
//                         className="mr-4 w-4 h-4 text-blue-600" />
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

//             {/* Warning if selected slot is full */}
//             {selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull && (
//               <Alert variant="warning" title="This slot is full">
//                 You will be added to the waitlist and notified when a spot opens.
//               </Alert>
//             )}

//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
//               <Button onClick={handleRegister} isLoading={registering}>
//                 {selectedSlotNumber !== null && getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull
//                   ? 'Join Waitlist'
//                   : 'Confirm Registration'
//                 }
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default AvailableSessionsPage;



import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, MapPin, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal, Alert } from '../../components/ui';
import { labSessionService, registrationService } from '../../services';
import { LabSession, TimeSlot, DAY_OF_WEEK_OPTIONS } from '../../types';
import { timeSlotService } from '../../services/TimeSlotService';

// import { Badge } from '../../components/ui/Badge';


const AvailableSessionsPage = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<LabSession | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState<number | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      setSessions(await labSessionService.getAvailableForMe());
    } catch { toast.error('Failed to load sessions'); }
    finally { setLoading(false); }
  };

  const handleSelectSession = async (session: LabSession) => {
    setSelectedSession(session);
    setSelectedSlotNumber(null);
    setAvailableSlots([]);
    setLoadingSlots(true);
    try {
      const slots = await timeSlotService.getAvailable(session.id);
      setAvailableSlots(slots);
    } catch {
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedSession) return;
    setRegistering(true);
    try {
      const timeSlot = selectedSlotNumber !== null
        ? availableSlots.find(ts => ts.slotNumber === selectedSlotNumber)
        : undefined;

      const result = await registrationService.create({
        labSessionId: selectedSession.id,
        timeSlotId: timeSlot?.id,
      });

      if (result.status === 'WAITLISTED') {
        toast.success(`Added to waitlist! Position: #${result.waitlistPosition}`);
      } else {
        toast.success(`Registration confirmed! You've been assigned to Slot ${result.slotNumber}.`);
      }
      setSelectedSession(null);
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  // Group by slotNumber — same slot repeats each week, we show it once.
  // NOTE: Jackson serializes Java boolean isFull → JSON key "full" (strips "is" prefix)
  const getSlotSummary = (slots: TimeSlot[]) => {
    const slotMap = new Map<number, {
      total: number; filled: number; startTime: string; endTime: string;
    }>();

    slots.forEach(slot => {
      if (!slotMap.has(slot.slotNumber)) {
        slotMap.set(slot.slotNumber, {
          total: slot.maxStudents,
          filled: slot.currentCount,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    });

    return Array.from(slotMap.entries())
      .map(([slotNumber, d]) => ({
        slotNumber,
        ...d,
        available: d.total - d.filled,
        isFull: d.filled >= d.total,   // recomputed client-side — avoids Jackson "full" vs "isFull" mismatch
      }))
      .sort((a, b) => a.slotNumber - b.slotNumber);
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} - ${e}`;
  };

  const formatSessionDays = (days: string | string[] | undefined) => {
    const daysArray = Array.isArray(days) ? days : days ? days.split(',') : [];
    return daysArray
      .map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d.trim())?.short || d.trim().substring(0, 3))
      .join(', ');
  };

  if (loading) return <Loading text="Loading available sessions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Lab Sessions</h1>
        <p className="text-gray-600 mt-1">Browse and register for lab sessions available to your program</p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No sessions available</h3>
            <p className="text-sm text-gray-500 mt-1">There are no lab sessions currently open for your program.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{session.name}</h3>
                    <p className="text-sm text-gray-500">{session.courseCode} - {session.course?.courseName}</p>
                  </div>
                  <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'} className="ml-2 flex-shrink-0">
                    {session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formatDateRange(session.startDate, session.endDate)}</span>
                    <Badge variant="info" className="ml-2">{session.durationWeeks}w</Badge>
                  </div>
                  <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 flex-shrink-0" /><span>{formatSessionDays(session.sessionDays)}</span></div>
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.startTime} - {session.endTime}</span></div>
                  <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.labRoom}</span></div>
                  <div className="flex items-center"><Users className="w-4 h-4 mr-2 flex-shrink-0" /><span>{session.currentRegistrationCount}/{session.totalCapacity} registered</span></div>
                </div>
                <Button className="w-full mt-4" onClick={() => handleSelectSession(session)}>
                  {session.availableSlots > 0 ? 'Register Now' : 'Join Waitlist'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} title="Register for Lab Session" size="lg">
        {selectedSession && (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">{selectedSession.name}</h4>
              <p className="text-sm text-gray-600">{selectedSession.courseCode} - {selectedSession.course?.courseName}</p>
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p><strong>Duration:</strong> {formatDateRange(selectedSession.startDate, selectedSession.endDate)} ({selectedSession.durationWeeks} weeks)</p>
                <p><strong>Days:</strong> {formatSessionDays(selectedSession.sessionDays)}</p>
                <p><strong>Location:</strong> {selectedSession.labRoom}</p>
              </div>
            </div>

            <Alert variant="info" title="One Registration for Entire Duration">
              You'll be assigned to <strong>one time slot and roup</strong> that you attend every session day for the full {selectedSession.durationWeeks} weeks.
            </Alert>

            {/* Slot Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Preferred Group</label>
              {loadingSlots ? (
                <Loading text="Loading slots..." />
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No time slots and groups have been configured for this session yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getSlotSummary(availableSlots).map((slot) => (
                    <label
                      key={slot.slotNumber}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSlotNumber === slot.slotNumber
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot.slotNumber}
                          checked={selectedSlotNumber === slot.slotNumber}
                          onChange={() => setSelectedSlotNumber(slot.slotNumber)}
                          className="mr-4 w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            Group {slot.slotNumber}: {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slot.isFull
                              ? 'Full — you will be added to the waitlist'
                              : `${slot.available} of ${slot.total} spots available`}
                          </div>
                        </div>
                      </div>
                      <Badge variant={slot.isFull ? 'warning' : 'success'}>
                        {slot.isFull ? 'Waitlist' : `${slot.available} left`}
                      </Badge>
                    </label>
                  ))}

                  {/* Auto-assign option */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSlotNumber === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="timeSlot"
                        checked={selectedSlotNumber === null}
                        onChange={() => setSelectedSlotNumber(null)}
                        className="mr-4 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Auto-assign (Recommended)</div>
                        <div className="text-sm text-gray-500">System assigns you to the first available slot</div>
                      </div>
                    </div>
                    <Badge variant="info">Auto</Badge>
                  </label>
                </div>
              )}
            </div>

            {/* Warning if selected slot is full */}
            {selectedSlotNumber !== null &&
              getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull && (
              <Alert variant="warning" title="This slot is full">
                You will be added to the waitlist and notified when a spot opens.
              </Alert>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setSelectedSession(null)}>Cancel</Button>
              <Button onClick={handleRegister} isLoading={registering}>
                {selectedSlotNumber !== null &&
                  getSlotSummary(availableSlots).find(s => s.slotNumber === selectedSlotNumber)?.isFull
                  ? 'Join Waitlist'
                  : 'Confirm Registration'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailableSessionsPage;