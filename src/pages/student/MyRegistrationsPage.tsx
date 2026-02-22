import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, CheckCircle, Clock, MapPin, BookOpen, Target, Package, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Loading, Modal } from '../../components/ui/index';
import { registrationService } from '../../services';
import { Registration, WeeklyNote, DAY_OF_WEEK_OPTIONS } from '../../types';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegs, setExpandedRegs] = useState<Set<number>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
      // Auto-expand confirmed registrations
      // const confirmed = data.filter(r => r.status === 'CONFIRMED').map(r => r.id);
      // setExpandedRegs(new Set(confirmed));
    } catch { toast.error('Failed to load registrations'); }
    finally { setLoading(false); }
  };

  const handleCancelClick = (reg: Registration) => { setSelectedReg(reg); setShowCancelModal(true); };

  const handleConfirmCancel = async () => {
    if (!selectedReg) return;
    setCancellingId(selectedReg.id);
    try {
      await registrationService.cancel(selectedReg.id);
      toast.success('Registration cancelled');
      setShowCancelModal(false);
      setSelectedReg(null);
      fetchRegistrations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  const toggleReg = (regId: number) => {
    setExpandedRegs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(regId)) newSet.delete(regId);
      else newSet.add(regId);
      return newSet;
    });
  };

  const toggleWeek = (regId: number, weekNum: number) => {
    const key = `${regId}-${weekNum}`;
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const getStatusBadge = (status: string, waitlistPosition?: number) => {
    if (status === 'CONFIRMED') return <Badge variant="success">Confirmed</Badge>;
    if (status === 'WAITLISTED') return <Badge variant="warning">Waitlisted #{waitlistPosition}</Badge>;
    if (status === 'CANCELLED') return <Badge variant="danger">Cancelled</Badge>;
    if (status === 'COMPLETED') return <Badge variant="info">Completed</Badge>;
    return <Badge>{status}</Badge>;
  };

  const getWeekBadge = (week: WeeklyNote) => {
    if (week.isCurrentWeek) return <Badge variant="success">This Week</Badge>;
    if (week.isPastWeek) return <Badge variant="default">Completed</Badge>;
    return <Badge variant="info">Upcoming</Badge>;
  };

  const formatDays = (days?: string[]) => {
    if (!days) return '';
    return days.map(d => DAY_OF_WEEK_OPTIONS.find(o => o.value === d)?.short || d.substring(0, 3)).join(', ');
  };

  if (loading) return <Loading text="Loading your registrations..." />;

  const activeRegs = registrations.filter(r => ['CONFIRMED', 'WAITLISTED', 'PENDING'].includes(r.status));
  const pastRegs = registrations.filter(r => ['CANCELLED', 'COMPLETED'].includes(r.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-600 mt-1">View your lab sessions and weekly content</p>
      </div>

      {registrations.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">No registrations yet</h3>
          <p className="text-gray-500 mt-1">Register for a lab session to get started</p>
        </CardContent></Card>
      ) : (
        <>
          {/* Active Registrations */}
          {activeRegs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Active Registrations ({activeRegs.length})</h2>
              {activeRegs.map((reg) => (
                <Card key={reg.id} className={`${reg.status === 'CONFIRMED' ? 'border-l-4 border-l-green-500' : reg.status === 'WAITLISTED' ? 'border-l-4 border-l-yellow-500' : ''}`}>
                  {/* Registration Header - Clickable to expand */}
                  <div 
                    className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => reg.status === 'CONFIRMED' && toggleReg(reg.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {reg.status === 'CONFIRMED' && (
                          expandedRegs.has(reg.id) 
                            ? <ChevronDown className="w-5 h-5 text-gray-400" />
                            : <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{reg.labSessionName}</h3>
                          <p className="text-sm text-gray-500">{reg.courseCode} - {reg.courseName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(reg.status, reg.waitlistPosition)}
                        <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleCancelClick(reg); }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                    
                    {/* Session Info */}
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 ml-8">
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{reg.durationWeeks} weeks</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{formatDays(reg.sessionDays)} • {reg.sessionStartTime?.substring(0, 5)} - {reg.sessionEndTime?.substring(0, 5)}</span>
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{reg.labRoom}</span>
                    </div>

                    {reg.status === 'WAITLISTED' && (
                      <div className="mt-3 ml-8 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          You're #{reg.waitlistPosition} on the waitlist. You'll be notified when a spot opens.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Weekly Notes - Collapsible */}
                  {reg.status === 'CONFIRMED' && expandedRegs.has(reg.id) && reg.weeklyNotes && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />Weekly Session Content
                      </h4>
                      <div className="space-y-2">
                        {reg.weeklyNotes.map((week) => (
                          <div key={week.weekNumber} className={`bg-white rounded-lg border ${week.isCurrentWeek ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'}`}>
                            {/* Week Header */}
                            <div 
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${week.isPublished ? '' : 'opacity-60'}`}
                              onClick={() => week.isPublished && toggleWeek(reg.id, week.weekNumber)}
                            >
                              <div className="flex items-center gap-3">
                                {week.isPublished ? (
                                  expandedWeeks.has(`${reg.id}-${week.weekNumber}`) 
                                    ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                    : <ChevronRight className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-300" />
                                )}
                                <div>
                                  <span className="font-medium text-gray-900">{week.displayName}</span>
                                  <span className="text-sm text-gray-500 ml-2">({week.dateRange})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getWeekBadge(week)}
                                {!week.isPublished && <span className="text-xs text-gray-400">Content not yet available</span>}
                              </div>
                            </div>

                            {/* Week Content - Expanded */}
                            {week.isPublished && expandedWeeks.has(`${reg.id}-${week.weekNumber}`) && (
                              <div className="px-4 py-4 border-t border-gray-100 space-y-4">
                                {week.content && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                      <BookOpen className="w-4 h-4 mr-1" />Overview
                                    </h5>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{week.content}</p>
                                  </div>
                                )}
                                {week.learningObjectives && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                      <Target className="w-4 h-4 mr-1" />Learning Objectives
                                    </h5>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{week.learningObjectives}</p>
                                  </div>
                                )}
                                {week.materialsNeeded && (
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                      <Package className="w-4 h-4 mr-1" />Materials Needed
                                    </h5>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{week.materialsNeeded}</p>
                                  </div>
                                )}
                                {!week.content && !week.learningObjectives && !week.materialsNeeded && (
                                  <p className="text-sm text-gray-400 italic">No additional details provided for this week.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Past Registrations */}
          {pastRegs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Past Registrations ({pastRegs.length})</h2>
              {pastRegs.map((reg) => (
                <Card key={reg.id} className="opacity-75">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{reg.labSessionName}</h3>
                        <p className="text-sm text-gray-500">{reg.courseCode}</p>
                      </div>
                      {getStatusBadge(reg.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Cancel Modal */}
      <Modal isOpen={showCancelModal} onClose={() => { setShowCancelModal(false); setSelectedReg(null); }} title="Cancel Registration" size="sm">
        {selectedReg && (
          <div className="space-y-4">
            <p className="text-gray-600">Are you sure you want to cancel your registration for:</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">{selectedReg.labSessionName}</p>
              <p className="text-sm text-gray-500">{selectedReg.courseCode}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setShowCancelModal(false); setSelectedReg(null); }}>Keep</Button>
              <Button variant="danger" onClick={handleConfirmCancel} isLoading={cancellingId === selectedReg.id}>Yes, Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyRegistrationsPage;
