import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AvailableSessionsPage from './pages/student/AvailableSessionsPage';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSessionsPage from './pages/admin/AdminSessionsPage';
import AdminWeeklyNotesPage from './pages/admin/AdminWeeklyNotesPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';

import { useAuthStore } from './store/authStore';
import { isStaff } from './types';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import LabManagersPage from './pages/admin/LabManagersPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import SessionTimeSlotsPage from './pages/admin/SessionTimeSlotsPage';
import AdminAttendancePage from './pages/admin/AdminAttendancePage';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const getDefaultPath = () => !user ? '/login' : isStaff(user.role) ? '/admin' : '/dashboard';

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#363636', color: '#fff' }, success: { style: { background: '#22c55e' } }, error: { style: { background: '#ef4444' } } }} />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultPath()} replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute allowedRoles={['STUDENT']}><Layout><AvailableSessionsPage /></Layout></ProtectedRoute>} />
        <Route path="/my-registrations" element={<ProtectedRoute allowedRoles={['STUDENT']}><Layout><MyRegistrationsPage /></Layout></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/sessions" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminSessionsPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/weekly-notes" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminWeeklyNotesPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/registrations" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminRegistrationsPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><DepartmentsPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/lab-managers" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><LabManagersPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminCoursesPage /></Layout></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminAttendancePage /></Layout></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'LAB_MANAGER']}><Layout><AdminReportsPage /></Layout></ProtectedRoute>} />


        <Route path="/" element={isAuthenticated ? <Navigate to={getDefaultPath()} replace /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-gray-300">404</h1><p className="text-xl text-gray-600 mt-4">Page not found</p></div></div>} />
      </Routes>
    </Router>
  );
}

export default App;
