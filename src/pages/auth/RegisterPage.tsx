import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui/index';
import { authService, publicService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { Program, LEVEL_OPTIONS, Level } from '../../types';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ studentId: '', email: '', password: '', firstName: '', lastName: '', phoneNumber: '', programId: 0, level: 'LEVEL_100' as Level });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => { publicService.getPrograms().then(setPrograms).catch(() => toast.error('Failed to load programs')); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.programId) { toast.error('Please select a program'); return; }
    setLoading(true);
    try {
      const response = await authService.register(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
            </div>
            <Input label="Student ID" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            <Select label="Program" value={formData.programId.toString()} onChange={(e) => setFormData({ ...formData, programId: parseInt(e.target.value) || 0 })}
              options={programs.map(p => ({ value: p.id, label: p.name }))} placeholder="Select your program" required />
            <Select label="Level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })} options={LEVEL_OPTIONS} required />
            <Button type="submit" className="w-full" isLoading={loading}>Create Account</Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
