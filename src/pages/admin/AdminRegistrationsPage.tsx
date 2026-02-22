import { useEffect, useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Loading, Select } from '../../components/ui/index';
import { labSessionService, registrationService } from '../../services';
import { Registration, LabSession } from '../../types';

const AdminRegistrationsPage = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    labSessionService.getAll().then(setSessions).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setLoading(true);
      registrationService.getBySession(selectedSession)
        .then(setRegistrations)
        .catch(() => toast.error('Failed to load registrations'))
        .finally(() => setLoading(false));
    }
  }, [selectedSession]);

  const getStatusBadge = (status: string, pos?: number) => {
    if (status === 'CONFIRMED') return <Badge variant="success">Confirmed</Badge>;
    if (status === 'WAITLISTED') return <Badge variant="warning">Waitlisted #{pos}</Badge>;
    return <Badge>{status}</Badge>;
  };

  if (loading && !selectedSession) return <Loading />;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Registrations</h1></div>
      <Card><CardContent className="py-4">
        <Select label="Select Lab Session" value={selectedSession?.toString() || ''} onChange={e => setSelectedSession(e.target.value ? parseInt(e.target.value) : null)}
          options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode})` }))} placeholder="Choose a session..." />
      </CardContent></Card>

      {!selectedSession ? (
        <Card><CardContent className="py-12 text-center"><ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" /><h3 className="text-lg font-medium">Select a session</h3></CardContent></Card>
      ) : loading ? <Loading /> : registrations.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><h3 className="text-lg font-medium">No registrations</h3></CardContent></Card>
      ) : (
        <Card>
          <CardHeader><h2 className="font-semibold">{registrations.length} Registrations</h2></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
              </tr></thead>
              <tbody className="divide-y">
                {registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><p className="font-medium">{reg.studentName}</p><p className="text-sm text-gray-500">{reg.studentIdNumber}</p></td>
                    <td className="px-4 py-3 text-sm">{reg.programName || 'N/A'}</td>
                    <td className="px-4 py-3">{getStatusBadge(reg.status, reg.waitlistPosition)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;
