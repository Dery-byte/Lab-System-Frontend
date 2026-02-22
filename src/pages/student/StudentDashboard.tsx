import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, ArrowRight, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Loading } from '../../components/ui/index';
import { useAuthStore } from '../../store/authStore';
import { labSessionService, registrationService } from '../../services';
import { LabSession, Registration } from '../../types';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([labSessionService.getAvailableForMe(), registrationService.getMyActiveRegistrations()])
      .then(([s, r]) => { setSessions(s.slice(0, 3)); setRegistrations(r); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string, waitlistPosition?: number) => {
    if (status === 'CONFIRMED') return <Badge variant="success">Confirmed</Badge>;
    if (status === 'WAITLISTED') return <Badge variant="warning">Waitlisted #{waitlistPosition}</Badge>;
    return <Badge>{status}</Badge>;
  };

  if (loading) return <Loading text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your lab registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="flex items-center p-6">
          <div className="p-3 bg-blue-100 rounded-lg"><ClipboardList className="w-6 h-6 text-blue-600" /></div>
          <div className="ml-4"><p className="text-sm text-gray-500">Active Registrations</p><p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 'CONFIRMED').length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center p-6">
          <div className="p-3 bg-yellow-100 rounded-lg"><Calendar className="w-6 h-6 text-yellow-600" /></div>
          <div className="ml-4"><p className="text-sm text-gray-500">On Waitlist</p><p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 'WAITLISTED').length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center p-6">
          <div className="p-3 bg-green-100 rounded-lg"><GraduationCap className="w-6 h-6 text-green-600" /></div>
          <div className="ml-4"><p className="text-sm text-gray-500">Program</p><p className="text-lg font-semibold text-gray-900 truncate">{user?.programName || 'N/A'}</p></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><div className="flex justify-between items-center"><h2 className="text-lg font-semibold">My Registrations</h2><Link to="/my-registrations" className="text-blue-600 text-sm flex items-center">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></div></CardHeader>
          <CardContent>
            {registrations.length === 0 ? <p className="text-gray-500 text-center py-4">No registrations yet</p> : (
              <div className="space-y-3">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-medium text-gray-900">{reg.labSessionName}</p><p className="text-sm text-gray-500">{reg.courseCode} • {reg.durationWeeks} weeks</p></div>
                    {getStatusBadge(reg.status, reg.waitlistPosition)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Available Sessions</h2><Link to="/sessions" className="text-blue-600 text-sm flex items-center">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></div></CardHeader>
          <CardContent>
            {sessions.length === 0 ? <p className="text-gray-500 text-center py-4">No sessions available</p> : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div><p className="font-medium text-gray-900">{session.name}</p><p className="text-sm text-gray-500">{session.courseCode} • {session.durationWeeks} weeks</p></div>
                    <Badge variant={session.availableSlots > 0 ? 'success' : 'warning'}>{session.availableSlots > 0 ? `${session.availableSlots} slots` : 'Waitlist'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
