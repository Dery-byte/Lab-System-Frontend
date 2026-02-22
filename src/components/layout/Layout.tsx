import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, ClipboardList, BookOpen, Users, LogOut, Menu, X, Bell, Building, Building2, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../ui/index';

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isStaff, isSuperAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const studentNav = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Available Sessions', href: '/sessions', icon: Calendar },
    { name: 'My Registrations', href: '/my-registrations', icon: ClipboardList },
  ];

  const staffNav = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Lab Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Weekly Notes', href: '/admin/weekly-notes', icon: FileText },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
  ];

  const superAdminNav = [...staffNav,
  { name: 'Lab Managers', href: '/admin/lab-managers', icon: Users },
  { name: 'Department', href: '/admin/departments', icon: Building, label: 'Departments' },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { name: 'Attendance', href: '/admin/attendance', icon: BookOpen, label: 'Attendance' },
  { name: 'Reports', href: '/admin/Reports', icon: BookOpen, label: 'Reports' },
  ];

  const navItems = isSuperAdmin() ? superAdminNav : isStaff() ? staffNav : studentNav;
  const isActive = (href: string) => location.pathname === href || (href !== '/admin' && href !== '/dashboard' && location.pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to={isStaff() ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-blue-600" /><span className="font-bold text-gray-900">Lab System</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-6 h-6" /></button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <item.icon className="w-5 h-5 mr-3" />{item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          {/* <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-medium">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
              <Badge variant={user?.role === 'SUPER_ADMIN' ? 'danger' : user?.role === 'LAB_MANAGER' ? 'warning' : 'info'}>
                {user?.role?.replace('_', ' ')}
              </Badge>
            </div>
          </div> */}
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5 mr-3" />Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6" /></button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.programName || user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
