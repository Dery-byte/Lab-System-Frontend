import { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, UserCog, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal, Select } from '../../components/ui';
import api from '../../services/api';
import { User, DEPARTMENT_OPTIONS } from '../../types';

interface CreateLabManagerRequest {
  studentId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
}

const LabManagersPage = () => {
  const [labManagers, setLabManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateLabManagerRequest>({
    studentId: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
  });

  useEffect(() => {
    fetchLabManagers();
  }, []);

  const fetchLabManagers = async () => {
    try {
      const response = await api.get('/admin/lab-managers');
      setLabManagers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load lab managers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingManager(null);
    setFormData({
      studentId: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      department: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (manager: User) => {
    setEditingManager(manager);
    setFormData({
      studentId: manager.studentId,
      email: manager.email,
      password: '',
      firstName: manager.firstName,
      lastName: manager.lastName,
      department: manager.department ?? '',
      // department: manager.department,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

    try {
      await api.delete(`/admin/lab-managers/${id}`);
      toast.success('Lab manager deactivated');
      fetchLabManagers();
    } catch (error) {
      toast.error('Failed to deactivate lab manager');
    }
  };


  const handleDeactivate = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

    try {
      await api.patch(`/admin/lab-managers/${id}/deactivate`);
      toast.success('Lab manager deactivated');
      fetchLabManagers();
    } catch (error) {
      toast.error('Failed to deactivate lab manager');
    }
  };


  const handleActivate = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this lab manager?')) return;

    try {
      await api.patch(`/admin/lab-managers/${id}/activate`);
      toast.success('Lab manager deactivated');
      fetchLabManagers();
    } catch (error) {
      toast.error('Failed to deactivate lab manager');
    }
  };

  const handleSubmit = async () => {
    if (!formData.studentId || !formData.email || !formData.firstName || !formData.lastName || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!editingManager && !formData.password) {
      toast.error('Password is required for new lab managers');
      return;
    }

    setIsSaving(true);
    try {
      if (editingManager) {
        await api.put(`/admin/lab-managers/${editingManager.id}`, formData);
        toast.success('Lab manager updated successfully');
      } else {
        await api.post('/admin/create-lab-manager', formData);
        toast.success('Lab manager created successfully');
      }
      setIsModalOpen(false);
      fetchLabManagers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save lab manager';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // const filteredManagers = labManagers.filter(manager =>
  //   manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   manager.department.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredManagers = labManagers.filter(manager =>
    manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (manager.department ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading text="Loading lab managers..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Managers</h1>
          <p className="text-gray-600 mt-1">Manage lab manager accounts (Super Admin only)</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lab Manager
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search lab managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lab Managers Grid */}
      {filteredManagers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCog className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No lab managers found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try a different search term' : 'Add your first lab manager'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Card key={manager.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <UserCog className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{manager.fullName}</h3>
                      <p className="text-sm text-gray-500">{manager.studentId}</p>
                    </div>
                  </div>
                  <Badge variant={manager.enabled ? 'success' : 'default'}>
                    {manager.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {/* <pre>{JSON.stringify(manager, null, 2)}</pre> */}
                  <p><span className="text-gray-500">Email:</span> {manager.email}</p>
                  <p><span className="text-gray-500">Department:</span> {manager.departmentName}</p>
                  <p><span className="text-gray-500">Role: </span>{manager.role}</p>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(manager)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {manager.enabled ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeactivate(manager.id)}
                      className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleActivate(manager.id)}
                      className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingManager ? 'Edit Lab Manager' : 'Add Lab Manager'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name *"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Employee ID *"
            placeholder="LABMGR001"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          />

          <Input
            label="Email *"
            type="email"
            placeholder="manager@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label={editingManager ? 'New Password (leave blank to keep current)' : 'Password *'}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Select
            label="Department *"
            options={[
              { value: '', label: 'Select Department' },
              ...DEPARTMENT_OPTIONS.map(d => ({ value: d, label: d })),
            ]}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingManager ? 'Update' : 'Create'} Lab Manager
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LabManagersPage;
