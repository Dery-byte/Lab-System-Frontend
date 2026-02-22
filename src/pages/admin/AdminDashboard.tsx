// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Users, ClipboardList, ArrowRight, CheckCircle, Clock, FileText } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, CardHeader, Badge, Loading } from '../../components/ui/index';
// import { useAuthStore } from '../../store/authStore';
// import { labSessionService, adminService } from '../../services';
// import { LabSession } from '../../types';

// const AdminDashboard = () => {
//   const { user, isSuperAdmin } = useAuthStore();
//   const [stats, setStats] = useState<any>(null);
//   const [sessions, setSessions] = useState<LabSession[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const sessionsData = await labSessionService.getAll();
//         setSessions(sessionsData.slice(0, 5));
//         if (isSuperAdmin()) {
//           try { setStats(await adminService.getDashboardStats()); } catch {}
//         }
//       } catch { toast.error('Failed to load data'); }
//       finally { setLoading(false); }
//     };
//     fetchData();
//   }, [isSuperAdmin]);

//   if (loading) return <Loading text="Loading dashboard..." />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">{isSuperAdmin() ? 'Admin' : 'Lab Manager'} Dashboard</h1>
//         <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card><CardContent className="flex items-center p-6">
//           <div className="p-3 bg-green-100 rounded-lg"><Calendar className="w-6 h-6 text-green-600" /></div>
//           <div className="ml-4"><p className="text-sm text-gray-500">Open Sessions</p><p className="text-2xl font-bold">{stats?.openSessions ?? sessions.filter(s => s.status === 'OPEN').length}</p></div>
//         </CardContent></Card>
//         <Card><CardContent className="flex items-center p-6">
//           <div className="p-3 bg-blue-100 rounded-lg"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
//           <div className="ml-4"><p className="text-sm text-gray-500">Confirmed</p><p className="text-2xl font-bold">{stats?.confirmedRegistrations ?? '—'}</p></div>
//         </CardContent></Card>
//         <Card><CardContent className="flex items-center p-6">
//           <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="w-6 h-6 text-yellow-600" /></div>
//           <div className="ml-4"><p className="text-sm text-gray-500">Waitlisted</p><p className="text-2xl font-bold">{stats?.waitlistedRegistrations ?? '—'}</p></div>
//         </CardContent></Card>
//         {isSuperAdmin() && <Card><CardContent className="flex items-center p-6">
//           <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
//           <div className="ml-4"><p className="text-sm text-gray-500">Students</p><p className="text-2xl font-bold">{stats?.totalStudents ?? '—'}</p></div>
//         </CardContent></Card>}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><h2 className="text-lg font-semibold">Quick Actions</h2></CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <Link to="/admin/sessions" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
//                 <div className="flex items-center"><Calendar className="w-5 h-5 text-blue-600 mr-3" /><span className="font-medium">Manage Sessions</span></div>
//                 <ArrowRight className="w-5 h-5 text-gray-400" />
//               </Link>
//               <Link to="/admin/weekly-notes" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
//                 <div className="flex items-center"><FileText className="w-5 h-5 text-green-600 mr-3" /><span className="font-medium">Manage Weekly Notes</span></div>
//                 <ArrowRight className="w-5 h-5 text-gray-400" />
//               </Link>
//               <Link to="/admin/registrations" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
//                 <div className="flex items-center"><ClipboardList className="w-5 h-5 text-purple-600 mr-3" /><span className="font-medium">View Registrations</span></div>
//                 <ArrowRight className="w-5 h-5 text-gray-400" />
//               </Link>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><div className="flex justify-between items-center"><h2 className="text-lg font-semibold">Recent Sessions</h2><Link to="/admin/sessions" className="text-blue-600 text-sm flex items-center">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></div></CardHeader>
//           <CardContent>
//             {sessions.length === 0 ? <p className="text-gray-500 text-center py-4">No sessions yet</p> : (
//               <div className="space-y-3">
//                 {sessions.map((session) => (
//                   <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div><p className="font-medium">{session.name}</p><p className="text-sm text-gray-500">{session.courseCode} • {session.currentRegistrations}/{session.totalCapacity}</p></div>
//                     <Badge variant={session.status === 'OPEN' ? 'success' : 'default'}>{session.status}</Badge>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ClipboardList, ArrowRight, CheckCircle, Clock, FileText, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Loading } from '../../components/ui/index';
import { useAuthStore } from '../../store/authStore';
import { labSessionService, adminService } from '../../services';
import { LabSession } from '../../types';

const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionsData = await labSessionService.getAll();
        setSessions(sessionsData.slice(0, 5));
        if (isSuperAdmin()) {
          try { setStats(await adminService.getDashboardStats()); } catch {}
        }
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [isSuperAdmin]);

  if (loading) return <Loading text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isSuperAdmin() ? 'Admin' : 'Lab Manager'} Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-lg"><Calendar className="w-6 h-6 text-green-600" /></div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Open Sessions</p>
              <p className="text-2xl font-bold">{stats?.openSessions ?? sessions.filter(s => s.status === 'OPEN').length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-lg"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold">{stats?.confirmedRegistrations ?? '—'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="w-6 h-6 text-yellow-600" /></div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Waitlisted</p>
              <p className="text-2xl font-bold">{stats?.waitlistedRegistrations ?? '—'}</p>
            </div>
          </CardContent>
        </Card>

        {isSuperAdmin() && (
          <>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="text-2xl font-bold">{stats?.totalStudents ?? '—'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="p-3 bg-primary-100 rounded-lg"><BookOpen className="w-6 h-6 text-primary-600" /></div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Courses</p>
                  <p className="text-2xl font-bold">{stats?.totalCourses ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/sessions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Manage Sessions</h3>
              <p className="text-sm text-gray-500 mt-1">Create and manage lab sessions</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/registrations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-gray-900">View Registrations</h3>
              <p className="text-sm text-gray-500 mt-1">Manage student registrations</p>
            </CardContent>
          </Card>
        </Link>
        {isSuperAdmin() && (
          <Link to="/admin/courses">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Manage Courses</h3>
                <p className="text-sm text-gray-500 mt-1">Add and configure courses</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Quick Actions & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">Quick Actions</h2></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/admin/sessions" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center"><Calendar className="w-5 h-5 text-blue-600 mr-3" /><span className="font-medium">Manage Sessions</span></div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link to="/admin/weekly-notes" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center"><FileText className="w-5 h-5 text-green-600 mr-3" /><span className="font-medium">Manage Weekly Notes</span></div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link to="/admin/registrations" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center"><ClipboardList className="w-5 h-5 text-purple-600 mr-3" /><span className="font-medium">View Registrations</span></div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              {isSuperAdmin() && (
                <Link to="/admin/courses" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center"><BookOpen className="w-5 h-5 text-primary-600 mr-3" /><span className="font-medium">Manage Courses</span></div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Sessions</h2>
              <Link to="/admin/sessions" className="text-blue-600 text-sm flex items-center">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sessions yet</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{session.name}</p>
                      <p className="text-sm text-gray-500">{session.courseCode} • {session.currentRegistrationCount}/{session.totalCapacity}</p>
                    </div>
                    <Badge variant={session.status === 'OPEN' ? 'success' : 'default'}>{session.status}</Badge>
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

export default AdminDashboard;