

// import { ReactNode, useState, useRef, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Home, Calendar, ClipboardList, BookOpen, Users, LogOut,
//   Menu, X, Building, Building2, FileText, GraduationCap,
//   ChevronRight, BarChart3, UserCircle, Settings, Shield
// } from 'lucide-react';
// import { useAuthStore } from '../../store/authStore';

// // ─── Nav items ────────────────────────────────────────────────────────────────

// const studentNav = [
//   { name: 'Dashboard',         href: '/dashboard',         icon: Home },
//   { name: 'Available Sessions',href: '/sessions',           icon: Calendar },
//   { name: 'My Registrations',  href: '/my-registrations',  icon: ClipboardList },
// ];

// const staffNav = [
//   { name: 'Dashboard',     href: '/admin',                 icon: Home },
//   { name: 'Lab Sessions',  href: '/admin/sessions',        icon: Calendar },
//   { name: 'Weekly Notes',  href: '/admin/weekly-notes',    icon: FileText },
//   { name: 'Registrations', href: '/admin/registrations',   icon: ClipboardList },
// ];

// const superAdminNav = [
//   ...staffNav,
//   { name: 'Lab Managers',  href: '/admin/lab-managers',    icon: Users },
//   { name: 'Departments',   href: '/admin/departments',     icon: Building },
//   { name: 'Faculties',     href: '/admin/faculty',         icon: GraduationCap },
//   { name: 'Courses',       href: '/admin/courses',         icon: BookOpen },
//   { name: 'Attendance',    href: '/admin/attendance',      icon: ClipboardList },
//   { name: 'Reports',       href: '/admin/Reports',         icon: BarChart3 },
// ];

// // ─── Role colour helper ───────────────────────────────────────────────────────

// const roleStyle = (role?: string) => {
//   if (role === 'SUPER_ADMIN')  return { dot: 'bg-rose-400',   text: 'text-rose-300',   label: 'Super Admin' };
//   if (role === 'LAB_MANAGER')  return { dot: 'bg-amber-400',  text: 'text-amber-300',  label: 'Lab Manager' };
//   return                              { dot: 'bg-emerald-400', text: 'text-emerald-300',label: 'Student'     };
// };

// // ─── Avatar initials ──────────────────────────────────────────────────────────

// const Initials = ({ name, size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) => {
//   const letters = (name ?? '??').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
//   const sizes   = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
//   return (
//     <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center font-bold text-white flex-shrink-0`}>
//       {letters}
//     </div>
//   );
// };

// // ─── Profile panel (slide-over inside sidebar) ───────────────────────────────

// const ProfilePanel = ({
//   open, onClose, user, onLogout,
// }: {
//   open: boolean;
//   onClose: () => void;
//   user: any;
//   onLogout: () => void;
// }) => {
//   const rs = roleStyle(user?.role);

//   return (
//     <>
//       {/* Backdrop inside sidebar */}
//       <div
//         className={`absolute inset-0 bg-slate-950/60 z-10 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
//         onClick={onClose}
//       />

//       {/* Panel slides up from bottom */}
//       <div className={`absolute bottom-0 left-0 right-0 z-20 bg-slate-800 border-t border-slate-700 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>

//         {/* Handle */}
//         <div className="flex justify-center pt-3 pb-1">
//           <div className="w-8 h-1 rounded-full bg-slate-600" />
//         </div>

//         <div className="px-5 py-4 space-y-4">
//           {/* User card */}
//           <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
//             <Initials name={user?.fullName} size="lg" />
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-white truncate">{user?.fullName}</p>
//               <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
//               <div className="flex items-center gap-1.5 mt-1.5">
//                 <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
//                 <span className={`text-xs font-semibold ${rs.text}`}>{rs.label}</span>
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           {user?.studentId && (
//             <div className="px-1 space-y-1.5 text-xs text-slate-400">
//               <div className="flex justify-between">
//                 <span>Student ID</span>
//                 <span className="text-slate-300 font-mono">{user.studentId}</span>
//               </div>
//               {user?.programName && (
//                 <div className="flex justify-between">
//                   <span>Programme</span>
//                   <span className="text-slate-300 text-right max-w-[140px] truncate">{user.programName}</span>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="space-y-1 pb-2">
//             <button
//               onClick={onLogout}
//               className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm font-semibold"
//             >
//               <LogOut className="w-4 h-4" />
//               Sign out
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ─── Sidebar ──────────────────────────────────────────────────────────────────

// const Sidebar = ({
//   open, onClose, navItems, isActive, user, onLogout,
// }: {
//   open: boolean;
//   onClose: () => void;
//   navItems: typeof studentNav;
//   isActive: (href: string) => boolean;
//   user: any;
//   onLogout: () => void;
// }) => {
//   const [profileOpen, setProfileOpen] = useState(false);

//   return (
//     <aside className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
//     >
//       {/* Logo */}
//       <div className="flex items-center justify-between h-16 px-5 border-b border-slate-700/60">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
//             <Building2 className="w-4 h-4 text-white" />
//           </div>
//           <div>
//             <p className="text-sm font-bold text-white leading-none">Lab System</p>
//             <p className="text-[10px] text-slate-500 mt-0.5">Registration Portal</p>
//           </div>
//         </div>
//         <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
//         {navItems.map((item) => {
//           const active = isActive(item.href);
//           return (
//             <Link
//               key={item.href}
//               to={item.href}
//               onClick={onClose}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
//                 ${active
//                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
//                   : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
//                 }`}
//             >
//               <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${active ? '' : 'group-hover:scale-110'}`} />
//               <span className="flex-1">{item.name}</span>
//               {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Profile trigger at bottom */}
//       <div className="relative border-t border-slate-700/60">
//         <ProfilePanel
//           open={profileOpen}
//           onClose={() => setProfileOpen(false)}
//           user={user}
//           onLogout={onLogout}
//         />
//         <button
//           onClick={() => setProfileOpen(p => !p)}
//           className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/40 transition-colors"
//         >
//           <Initials name={user?.fullName} size="sm" />
//           <div className="flex-1 min-w-0 text-left">
//             <p className="text-sm font-semibold text-slate-200 truncate leading-none">{user?.fullName ?? 'User'}</p>
//             <p className={`text-[10px] font-medium mt-0.5 ${roleStyle(user?.role).text}`}>
//               {roleStyle(user?.role).label}
//             </p>
//           </div>
//           <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${profileOpen ? '-rotate-90' : 'rotate-90'}`} />
//         </button>
//       </div>
//     </aside>
//   );
// };

// // ─── Layout ───────────────────────────────────────────────────────────────────

// const Layout = ({ children }: { children: ReactNode }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout, isStaff, isSuperAdmin } = useAuthStore();
//   const location  = useLocation();
//   const navigate  = useNavigate();

//   const handleLogout = () => { logout(); navigate('/login'); };

//   const navItems = isSuperAdmin() ? superAdminNav : isStaff() ? staffNav : studentNav;

//   const isActive = (href: string) =>
//     location.pathname === href ||
//     (href !== '/admin' && href !== '/dashboard' && location.pathname.startsWith(href));

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile backdrop */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <Sidebar
//         open={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         navItems={navItems}
//         isActive={isActive}
//         user={user}
//         onLogout={handleLogout}
//       />

//       {/* Main content */}
//       <div className="lg:pl-64">
//         {/* Topbar */}
//         <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
//           <div className="flex items-center justify-between h-14 px-4 lg:px-8">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
//             >
//               <Menu className="w-5 h-5 text-slate-600" />
//             </button>

//             {/* Breadcrumb hint */}
//             <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
//               <span className="font-semibold text-slate-800">
//                 {navItems.find(n => isActive(n.href))?.name ?? 'Dashboard'}
//               </span>
//             </div>

//             <div className="flex-1" />

//             {/* Top-right user chip */}
//             <div className="flex items-center gap-2.5">
//               <div className="hidden sm:block text-right">
//                 <p className="text-xs font-semibold text-slate-800 leading-none">{user?.fullName}</p>
//                 <p className="text-[10px] text-slate-400 mt-0.5">{user?.programName || user?.role?.replace('_', ' ')}</p>
//               </div>
//               <Initials name={user?.fullName} size="sm" />
//             </div>
//           </div>
//         </header>

//         <main className="p-4 lg:p-8">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;








import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Calendar, ClipboardList, BookOpen, Users, LogOut,
  Menu, X, Building, Building2, FileText, GraduationCap,
  BarChart3, ChevronUp, Mail, Hash, Layers, UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// ─── Nav definitions ──────────────────────────────────────────────────────────

const studentNav = [
  { name: 'Dashboard',          href: '/dashboard',        icon: Home },
  { name: 'Available Sessions', href: '/sessions',          icon: Calendar },
  { name: 'My Registrations',   href: '/my-registrations', icon: ClipboardList },
];

const staffNav = [
  { name: 'Dashboard',     href: '/admin',               icon: Home },
  { name: 'Lab Sessions',  href: '/admin/sessions',       icon: Calendar },
  { name: 'Weekly Notes',  href: '/admin/weekly-notes',   icon: FileText },
  { name: 'Registrations', href: '/admin/registrations',  icon: ClipboardList },
];

const superAdminNav = [
  ...staffNav,
  { name: 'Lab Managers', href: '/admin/lab-managers', icon: Users },
  { name: 'Departments',  href: '/admin/departments',  icon: Building },
  { name: 'Faculties',    href: '/admin/faculty',      icon: GraduationCap },
  { name: 'Courses',      href: '/admin/courses',      icon: BookOpen },
  { name: 'Attendance',   href: '/admin/attendance',   icon: UserCheck },
  { name: 'Reports',      href: '/admin/Reports',      icon: BarChart3 },
  { name: 'Programs',      href: '/admin/Programs',      icon: Layers },

];

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'text-violet-300', bg: 'bg-violet-500/15 border-violet-500/30', dot: 'bg-violet-400' },
  LAB_MANAGER: { label: 'Lab Manager', color: 'text-amber-300',  bg: 'bg-amber-500/15 border-amber-500/30',  dot: 'bg-amber-400'  },
  STUDENT:     { label: 'Student',     color: 'text-cyan-300',   bg: 'bg-cyan-500/15 border-cyan-500/30',    dot: 'bg-cyan-400'   },
};
const getRole = (r?: string) => ROLE_CONFIG[r ?? ''] ?? ROLE_CONFIG.STUDENT;

// ─── Avatar initials ──────────────────────────────────────────────────────────

const Avatar = ({ name, px = 36 }: { name?: string; px?: number }) => {
  const letters = (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className="rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: px, height: px, fontSize: px * 0.38 }}
    >
      {letters}
    </div>
  );
};

// ─── Profile Popover ──────────────────────────────────────────────────────────

const ProfilePopover = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [open, setOpen] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);
  const rc              = getRole(user?.role);

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Use capture phase so nav link clicks also close the popover
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  }, [open]);

  // ── Close when user navigates (e.g. clicks a nav item while open) ──────────
  useEffect(() => { setOpen(false); }, [user]);

  return (
    <div ref={containerRef} className="relative px-2 pb-2">

      {/* ── Card floats above trigger ─────────────────────────────────────── */}
      <div
        className="absolute bottom-full left-0 right-0 mb-1.5 rounded-2xl overflow-hidden border border-white/[0.09] shadow-[0_-4px_32px_rgba(0,0,0,0.5)]"
        style={{
          background: 'linear-gradient(145deg,#1a2035,#141926)',
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)',
          transition: 'opacity 180ms ease, transform 180ms ease',
        }}
      >
        {/* Identity */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.fullName} px={44} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-white leading-tight truncate">{user?.fullName ?? 'User'}</p>
              <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${rc.bg} ${rc.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                {rc.label}
              </span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.07] mx-4" />

        {/* Details */}
        <div className="px-4 py-3 space-y-2.5">
          {user?.email && (
            <Row icon={<Mail className="w-3.5 h-3.5" />} value={user.email} />
          )}
          {user?.studentId && (
            <Row icon={<Hash className="w-3.5 h-3.5" />} value={user.studentId} mono />
          )}
          {user?.programName && (
            <Row icon={<Layers className="w-3.5 h-3.5" />} value={user.programName} />
          )}
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.07] mx-4" />

        {/* Sign out */}
        <div className="p-3">
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150 active:scale-[0.97]"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </div>

      {/* ── Trigger ──────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
          ${open ? 'bg-white/10' : 'hover:bg-white/6'}`}
      >
        <Avatar name={user?.fullName} px={32} />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[12px] font-semibold text-slate-200 truncate leading-none">{user?.fullName ?? 'User'}</p>
          <p className={`text-[10px] font-medium mt-0.5 ${rc.color}`}>{rc.label}</p>
        </div>
        <ChevronUp
          className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );
};

// Helper row for profile detail lines
const Row = ({ icon, value, mono = false }: { icon: ReactNode; value: string; mono?: boolean }) => (
  <div className="flex items-center gap-2.5 text-xs text-slate-400">
    <span className="text-slate-600 flex-shrink-0">{icon}</span>
    <span className={`truncate ${mono ? 'font-mono text-slate-300' : ''}`}>{value}</span>
  </div>
);

// ─── Sidebar inner content ────────────────────────────────────────────────────

const SidebarInner = ({
  onClose,
  navItems,
  isActive,
  user,
  onLogout,
}: {
  onClose: () => void;
  navItems: { name: string; href: string; icon: any }[];
  isActive: (href: string) => boolean;
  user: any;
  onLogout: () => void;
}) => (
  <div
    className="relative flex flex-col h-full overflow-hidden"
    style={{ background: 'linear-gradient(175deg,#0d1117 0%,#131929 55%,#0d1117 100%)' }}
  >
    {/* Faint grid texture */}
    <div
      className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />

    {/* Logo row */}
    <div className="relative z-10 flex items-center justify-between h-[60px] px-4 border-b border-white/[0.07]">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
          <Building2 className="w-[18px] h-[18px] text-white" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white tracking-tight leading-none">Lab Portal</p>
          <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500 mt-0.5">Registration System</p>
        </div>
      </Link>
      <button
        onClick={onClose}
        className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Nav */}
    <nav className="relative z-10 flex-1 overflow-y-auto px-2.5 py-4 space-y-[2px]">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={`
              relative flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-medium
              transition-all duration-150 group overflow-hidden
              ${active
                ? 'text-white bg-white/[0.09]'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]'
              }
            `}
          >
            {/* Blue left accent line for active */}
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-blue-400 transition-all duration-200
              ${active ? 'h-[18px] opacity-100' : 'h-0 opacity-0'}`}
            />
            <item.icon className={`w-[15px] h-[15px] flex-shrink-0 transition-colors duration-150
              ${active ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}
            />
            <span className="flex-1 leading-none">{item.name}</span>
            {active && <span className="w-[5px] h-[5px] rounded-full bg-blue-400/60 flex-shrink-0" />}
          </Link>
        );
      })}
    </nav>

    {/* Profile */}
    <div className="relative z-10 border-t border-white/[0.07] pt-1.5">
      <ProfilePopover user={user} onLogout={onLogout} />
    </div>
  </div>
);

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const { user, logout, isStaff, isSuperAdmin } = useAuthStore();
  const location  = useLocation();
  const navigate  = useNavigate();

  const handleLogout  = () => { logout(); navigate('/login'); };
  const navItems      = isSuperAdmin() ? superAdminNav : isStaff() ? staffNav : studentNav;
  const isActive      = (href: string) =>
    location.pathname === href ||
    (href !== '/admin' && href !== '/dashboard' && location.pathname.startsWith(href));
  const currentPage   = [...navItems].reverse().find(n => isActive(n.href));

  // Close mobile sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/55 z-20 lg:hidden backdrop-blur-[2px] transition-opacity duration-200
          ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[216px]
          lg:translate-x-0 transition-transform duration-[220ms] ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarInner
          onClose={() => setSidebarOpen(false)}
          navItems={navItems}
          isActive={isActive}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content area */}
      <div className="lg:pl-[216px] flex flex-col min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-10 flex items-center h-[60px] px-4 lg:px-6 gap-4 bg-white border-b border-slate-200/90 shadow-sm">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>

          {/* Page title */}
          {currentPage && (
            <div className="flex items-center gap-2">
              <currentPage.icon className="w-[15px] h-[15px] text-slate-400" />
              <span className="text-[14px] font-semibold text-slate-800 tracking-tight">{currentPage.name}</span>
            </div>
          )}

          <div className="flex-1" />

          {/* User chip (right side of topbar) */}
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <p className="text-[12px] font-semibold text-slate-700 leading-none">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{user?.programName || getRole(user?.role).label}</p>
            </div>
            <Avatar name={user?.fullName} px={32} />
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 lg:p-7">{children}</main>
      </div>
    </div>
  );
};

export default Layout;