
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Calendar, Users, ClipboardList, ArrowRight, CheckCircle, Clock, FileText, BookOpen } from 'lucide-react';
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

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="flex items-center p-6">
//             <div className="p-3 bg-green-100 rounded-lg"><Calendar className="w-6 h-6 text-green-600" /></div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Open Sessions</p>
//               <p className="text-2xl font-bold">{stats?.openSessions ?? sessions.filter(s => s.status === 'OPEN').length}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center p-6">
//             <div className="p-3 bg-blue-100 rounded-lg"><CheckCircle className="w-6 h-6 text-blue-600" /></div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Confirmed</p>
//               <p className="text-2xl font-bold">{stats?.confirmedRegistrations ?? '—'}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center p-6">
//             <div className="p-3 bg-yellow-100 rounded-lg"><Clock className="w-6 h-6 text-yellow-600" /></div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Waitlisted</p>
//               <p className="text-2xl font-bold">{stats?.waitlistedRegistrations ?? '—'}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {isSuperAdmin() && (
//           <>
//             <Card>
//               <CardContent className="flex items-center p-6">
//                 <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
//                 <div className="ml-4">
//                   <p className="text-sm text-gray-500">Students</p>
//                   <p className="text-2xl font-bold">{stats?.totalStudents ?? '—'}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="flex items-center p-6">
//                 <div className="p-3 bg-primary-100 rounded-lg"><BookOpen className="w-6 h-6 text-primary-600" /></div>
//                 <div className="ml-4">
//                   <p className="text-sm text-gray-500">Courses</p>
//                   <p className="text-2xl font-bold">{stats?.totalCourses ?? '—'}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>

//       {/* Navigation Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Link to="/admin/sessions">
//           <Card className="hover:shadow-md transition-shadow cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-600" />
//               <h3 className="font-semibold text-gray-900">Manage Sessions</h3>
//               <p className="text-sm text-gray-500 mt-1">Create and manage lab sessions</p>
//             </CardContent>
//           </Card>
//         </Link>
//         <Link to="/admin/registrations">
//           <Card className="hover:shadow-md transition-shadow cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <ClipboardList className="w-12 h-12 mx-auto mb-4 text-green-600" />
//               <h3 className="font-semibold text-gray-900">View Registrations</h3>
//               <p className="text-sm text-gray-500 mt-1">Manage student registrations</p>
//             </CardContent>
//           </Card>
//         </Link>
//         {isSuperAdmin() && (
//           <Link to="/admin/courses">
//             <Card className="hover:shadow-md transition-shadow cursor-pointer">
//               <CardContent className="p-6 text-center">
//                 <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-600" />
//                 <h3 className="font-semibold text-gray-900">Manage Courses</h3>
//                 <p className="text-sm text-gray-500 mt-1">Add and configure courses</p>
//               </CardContent>
//             </Card>
//           </Link>
//         )}
//       </div>

//       {/* Quick Actions & Recent Sessions */}
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
//               {isSuperAdmin() && (
//                 <Link to="/admin/courses" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
//                   <div className="flex items-center"><BookOpen className="w-5 h-5 text-primary-600 mr-3" /><span className="font-medium">Manage Courses</span></div>
//                   <ArrowRight className="w-5 h-5 text-gray-400" />
//                 </Link>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold">Recent Sessions</h2>
//               <Link to="/admin/sessions" className="text-blue-600 text-sm flex items-center">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {sessions.length === 0 ? (
//               <p className="text-gray-500 text-center py-4">No sessions yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {sessions.map((session) => (
//                   <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium">{session.name}</p>
//                       <p className="text-sm text-gray-500">{session.courseCode} • {session.currentRegistrationCount}/{session.totalCapacity}</p>
//                     </div>
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
import {
  Calendar, Users, ClipboardList, ArrowRight, CheckCircle,
  Clock, FileText, BookOpen, TrendingUp, BarChart3,
  ChevronRight, Activity, Zap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loading } from '../../components/ui/index';
import { useAuthStore } from '../../store/authStore';
import { labSessionService, adminService } from '../../services';
import { LabSession } from '../../types';

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const statusStyle = (status: string) => {
  if (status === 'OPEN')      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'CLOSED')    return 'bg-slate-100 text-slate-500 border border-slate-200';
  if (status === 'DRAFT')     return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (status === 'COMPLETED') return 'bg-blue-50 text-blue-700 border border-blue-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

const fmt = (n: any) => (n === undefined || n === null || n === '—') ? '—' : Number(n).toLocaleString();

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: any;
  icon: React.ReactNode;
  accent: string;       // tailwind bg class for the icon blob
  iconColor: string;    // tailwind text class
  delay?: number;
  trend?: string;
}

const StatCard = ({ label, value, icon, accent, iconColor, delay = 0, trend }: StatCardProps) => (
  <div
    className="relative bg-white rounded-2xl border border-slate-200/80 p-5 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Subtle corner decoration */}
    <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-[48px] opacity-[0.04] bg-slate-900 pointer-events-none" />

    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{fmt(value)}</p>
        {trend && (
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            {trend}
          </p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <span className={iconColor}>{icon}</span>
      </div>
    </div>
  </div>
);

// ─── Quick action row ─────────────────────────────────────────────────────────

const QuickAction = ({
  to, icon, label, sub, iconBg, iconColor,
}: {
  to: string; icon: React.ReactNode; label: string; sub: string;
  iconBg: string; iconColor: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-150 group active:scale-[0.99]"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-slate-800 leading-tight">{label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
  </Link>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { user, isSuperAdmin } = useAuthStore();
  const [stats,    setStats]   = useState<any>(null);
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sessionsData = await labSessionService.getAll();
        setSessions(sessionsData.slice(0, 6));
        if (isSuperAdmin()) {
          try { setStats(await adminService.getDashboardStats()); } catch {}
        }
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    })();
  }, [isSuperAdmin]);

  if (loading) return <Loading text="Loading dashboard…" />;

  const hour    = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const openCount = stats?.openSessions ?? sessions.filter(s => s.status === 'OPEN').length;

  return (
    <div className="space-y-7 pb-8">

      {/* ── Hero greeting ──────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2235 50%, #0f1a2e 100%)' }}>
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', transform: 'translate(30%,-30%)' }}
        />

        <div className="relative z-10 px-7 py-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1.5">
              {isSuperAdmin() ? 'Super Admin' : 'Lab Manager'} · Dashboard
            </p>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {greeting}, {user?.firstName ?? user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {openCount > 0
                ? <><span className="text-emerald-400 font-semibold">{openCount} session{openCount !== 1 ? 's' : ''}</span> currently open for registration</>
                : 'No sessions currently open'}
            </p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Open Sessions"
            value={openCount}
            icon={<Calendar className="w-5 h-5" />}
            accent="bg-blue-50" iconColor="text-blue-600"
            delay={0}
          />
          <StatCard
            label="Confirmed"
            value={stats?.confirmedRegistrations}
            icon={<CheckCircle className="w-5 h-5" />}
            accent="bg-emerald-50" iconColor="text-emerald-600"
            delay={60}
          />
          <StatCard
            label="Waitlisted"
            value={stats?.waitlistedRegistrations}
            icon={<Clock className="w-5 h-5" />}
            accent="bg-amber-50" iconColor="text-amber-600"
            delay={120}
          />
          {isSuperAdmin() ? (
            <StatCard
              label="Students"
              value={stats?.totalStudents}
              icon={<Users className="w-5 h-5" />}
              accent="bg-violet-50" iconColor="text-violet-600"
              delay={180}
            />
          ) : (
            <StatCard
              label="Total Sessions"
              value={sessions.length}
              icon={<BarChart3 className="w-5 h-5" />}
              accent="bg-indigo-50" iconColor="text-indigo-600"
              delay={180}
            />
          )}
        </div>

        {/* Super admin second row */}
        {isSuperAdmin() && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatCard
              label="Courses"
              value={stats?.totalCourses}
              icon={<BookOpen className="w-5 h-5" />}
              accent="bg-pink-50" iconColor="text-pink-600"
              delay={240}
            />
            <StatCard
              label="Total Sessions"
              value={sessions.length}
              icon={<BarChart3 className="w-5 h-5" />}
              accent="bg-indigo-50" iconColor="text-indigo-600"
              delay={300}
            />
          </div>
        )}
      </div>

      {/* ── Bottom two columns ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Quick actions — 2 of 5 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-slate-400" />
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Quick Actions</h2>
          </div>
          <div className="space-y-1">
            <QuickAction
              to="/admin/sessions"
              icon={<Calendar className="w-4 h-4" />}
              label="Manage Sessions"
              sub="Create and configure lab sessions"
              iconBg="bg-blue-50" iconColor="text-blue-600"
            />
            <QuickAction
              to="/admin/registrations"
              icon={<ClipboardList className="w-4 h-4" />}
              label="Registrations"
              sub="View and manage student sign-ups"
              iconBg="bg-emerald-50" iconColor="text-emerald-600"
            />
            <QuickAction
              to="/admin/weekly-notes"
              icon={<FileText className="w-4 h-4" />}
              label="Weekly Notes"
              sub="Publish session content by week"
              iconBg="bg-amber-50" iconColor="text-amber-600"
            />
            {isSuperAdmin() && (
              <>
                <QuickAction
                  to="/admin/courses"
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Courses"
                  sub="Add and configure course catalogue"
                  iconBg="bg-violet-50" iconColor="text-violet-600"
                />
                <QuickAction
                  to="/admin/Reports"
                  icon={<BarChart3 className="w-4 h-4" />}
                  label="Reports"
                  sub="Export registrations and rosters"
                  iconBg="bg-pink-50" iconColor="text-pink-600"
                />
              </>
            )}
          </div>
        </div>

        {/* Recent sessions — 3 of 5 */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Recent Sessions</h2>
            </div>
            <Link
              to="/admin/sessions"
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No sessions yet</p>
              <p className="text-xs mt-1 opacity-70">Create your first lab session to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session, i) => {
                const pct = session.totalCapacity > 0
                  ? Math.round((session.currentRegistrationCount / session.totalCapacity) * 100) : 0;
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Colour dot */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      session.status === 'OPEN' ? 'bg-emerald-400' :
                      session.status === 'DRAFT' ? 'bg-amber-400' : 'bg-slate-300'
                    }`} />

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">{session.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] text-slate-400 font-mono">{session.courseCode}</p>
                        <span className="text-slate-200">·</span>
                        {/* Fill bar */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                pct >= 100 ? 'bg-amber-400' : pct >= 80 ? 'bg-orange-400' : 'bg-blue-400'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {session.currentRegistrationCount}/{session.totalCapacity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyle(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;