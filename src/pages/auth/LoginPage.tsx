import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Building2, Mail, Lock } from 'lucide-react';
import { Button, Input } from '../../components/ui/index';
import { authService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { isStaff } from '../../types';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success(`Welcome back, ${response.user.firstName}!`);
      navigate(isStaff(response.user.role) ? '/admin' : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Registration System</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
            </div>
            <Button type="submit" className="w-full py-3" isLoading={loading}>Sign In</Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
