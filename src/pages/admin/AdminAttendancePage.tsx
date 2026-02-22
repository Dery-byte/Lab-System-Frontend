import { useEffect, useState } from 'react';
import { UserCheck, Calendar, Save, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader,Alert,Badge, Button, Loading, Select, EmptyState, Input } from '../../components/ui';
import { labSessionService, registrationService, attendanceService } from '../../services';
import { Registration, LabSession, Attendance, MarkAttendanceRequest } from '../../types';
// import { Badge } from '../../components/ui/Badge';


const AdminAttendancePage = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { present: boolean; notes: string }>>({});

  useEffect(() => {
    labSessionService.getAll().then(data => {
      setSessions(data.filter(s => s.status === 'OPEN'));
    }).catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setLoading(true);
      Promise.all([
        registrationService.getBySession(selectedSession),
        selectedDate ? attendanceService.getBySessionAndDate(selectedSession, selectedDate) : Promise.resolve([]),
      ]).then(([regs, attendance]) => {
        const confirmed = regs.filter(r => r.status === 'CONFIRMED');
        setRegistrations(confirmed);
        setExistingAttendance(attendance);
        
        // Initialize attendance map
        const map: Record<number, { present: boolean; notes: string }> = {};
        confirmed.forEach(reg => {
          const existing = attendance.find(a => a.registrationId === reg.id);
          map[reg.id] = { present: existing?.present ?? false, notes: existing?.notes ?? '' };
        });
        setAttendanceMap(map);
      }).catch(() => toast.error('Failed to load data'))
        .finally(() => setLoading(false));
    }
  }, [selectedSession, selectedDate]);

  const toggleAttendance = (regId: number) => {
    setAttendanceMap(prev => ({
      ...prev,
      [regId]: { ...prev[regId], present: !prev[regId]?.present }
    }));
  };

  const updateNotes = (regId: number, notes: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [regId]: { ...prev[regId], notes }
    }));
  };

  const handleSave = async () => {
    if (!selectedSession || !selectedDate) return;
    
    setSaving(true);
    try {
      const request: MarkAttendanceRequest = {
        labSessionId: selectedSession,
        sessionDate: selectedDate,
        attendances: Object.entries(attendanceMap).map(([regId, data]) => ({
          registrationId: parseInt(regId),
          present: data.present,
          notes: data.notes || undefined,
        })),
      };
      
      await attendanceService.markAttendance(request);
      toast.success('Attendance saved successfully!');
      
      // Refresh existing attendance
      const attendance = await attendanceService.getBySessionAndDate(selectedSession, selectedDate);
      setExistingAttendance(attendance);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const markAllPresent = () => {
    const newMap: Record<number, { present: boolean; notes: string }> = {};
    registrations.forEach(reg => {
      newMap[reg.id] = { present: true, notes: attendanceMap[reg.id]?.notes ?? '' };
    });
    setAttendanceMap(newMap);
  };

  const markAllAbsent = () => {
    const newMap: Record<number, { present: boolean; notes: string }> = {};
    registrations.forEach(reg => {
      newMap[reg.id] = { present: false, notes: attendanceMap[reg.id]?.notes ?? '' };
    });
    setAttendanceMap(newMap);
  };

  const presentCount = Object.values(attendanceMap).filter(a => a.present).length;
  const totalCount = registrations.length;

  if (loading && !selectedSession) return <Loading text="Loading..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Mark attendance for lab sessions</p>
      </div>

      {/* Session and Date Selection */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select label="Select Lab Session" value={selectedSession?.toString() || ''}
                onChange={e => setSelectedSession(e.target.value ? parseInt(e.target.value) : null)}
                options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode})` }))}
                placeholder="Choose a session..." />
            </div>
            <div className="w-48">
              <Input label="Date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSession ? (
        <Card><CardContent>
          <EmptyState icon={UserCheck} title="Select a session" description="Choose a lab session to mark attendance" />
        </CardContent></Card>
      ) : loading ? (
        <Loading text="Loading registrations..." />
      ) : registrations.length === 0 ? (
        <Card><CardContent>
          <EmptyState icon={UserCheck} title="No confirmed registrations" description="There are no confirmed students for this session" />
        </CardContent></Card>
      ) : (
        <>
          {/* Summary and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="success" size="md">{presentCount} Present</Badge>
              <Badge variant="danger" size="md">{totalCount - presentCount} Absent</Badge>
              <span className="text-gray-500">of {totalCount} students</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={markAllPresent}>Mark All Present</Button>
              <Button variant="secondary" size="sm" onClick={markAllAbsent}>Mark All Absent</Button>
              <Button onClick={handleSave} isLoading={saving}>
                <Save className="w-4 h-4 mr-2" />Save Attendance
              </Button>
            </div>
          </div>

          {existingAttendance.length > 0 && (
            <Alert variant="info">
              Attendance has already been recorded for this date. You can update it below.
            </Alert>
          )}

          {/* Attendance List */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Present</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map(reg => {
                    const attendance = attendanceMap[reg.id] || { present: false, notes: '' };
                    return (
                      <tr key={reg.id} className={attendance.present ? 'bg-green-50' : 'bg-red-50'}>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleAttendance(reg.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              attendance.present ? 'bg-green-500 text-white' : 'bg-red-200 text-red-600'
                            }`}>
                            {attendance.present ? '✓' : '✗'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{reg.studentName}</p>
                          <p className="text-sm text-gray-500">{reg.studentIdNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="info">Slot {reg.slotNumber}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={attendance.notes} onChange={e => updateNotes(reg.id, e.target.value)}
                            placeholder="Add notes..."
                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminAttendancePage;
