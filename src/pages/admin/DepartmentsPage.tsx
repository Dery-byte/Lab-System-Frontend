import { useEffect, useState } from 'react';
import { Building, Plus, Edit, Trash2, Search,CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal } from '../../components/ui';
import { departmentService } from '../../services/departmentService';
import { Department, CreateDepartmentRequest } from '../../types';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    code: '',
    name: '',
    description: '',
    faculty: '',
    headOfDepartment: '',
  });


  // const [formData, setFormData] = useState<CreateDepartmentRequest>({
  //   code: '',
  //   name: '',
  //   description: '',
  //   faculty: '',
  //   headOfDepartment: '',
  // });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      faculty: 'Faculty of Science',
      headOfDepartment: '',
    });
    setIsModalOpen(true);
  };


  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      description: dept.description || '',
      facultyId: dept.facultyId || 0,
      faculty: '',
      headOfDepartment: dept.headOfDepartment || '',
    });
    setIsModalOpen(true);
  };
  // const handleEdit = (dept: Department) => {
  //   setEditingDepartment(dept);
  //   setFormData({
  //     code: dept.code,
  //     name: dept.name,
  //     description: dept.description || '',
  //     faculty: dept.faculty,
  //     headOfDepartment: dept.headOfDepartment || '',
  //   });
  //   setIsModalOpen(true);
  // };

  const activateDepartment = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this department?')) return;

    try {
      await departmentService.activateDepartment(id);
      toast.success('Department deactivated');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to deactivate department');
    }
  };


   const deactivateDepartment = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this department?')) return;

    try {
      await departmentService.deactivateDepartment(id);
      toast.success('Department deactivated');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to deactivate department');
    }
  };


  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.faculty) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, formData);
        toast.success('Department updated successfully');
      } else {
        await departmentService.create(formData);
        toast.success('Department created successfully');
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save department';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };



  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading text="Loading departments..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage academic departments (Super Admin only)</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No departments found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try a different search term' : 'Add your first department'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Building className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                  </div>
                  <Badge variant={dept.active ? 'success' : 'default'}>
                    {dept.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Faculty:</span> {dept.faculty}</p>
                  {dept.headOfDepartment && (
                    <p><span className="text-gray-500">HOD:</span> {dept.headOfDepartment}</p>
                  )}
                  {dept.description && (
                    <p className="text-gray-600">{dept.description}</p>
                  )}
                  {dept.courseCount !== undefined && (
                    <p><span className="text-gray-500">Courses:</span> {dept.courseCount}</p>
                  )}
                </div>
               <div className="flex justify-between mt-4 pt-4 border-t">
  <Button size="sm" variant="secondary" onClick={() => handleEdit(dept)}>
    <Edit className="w-4 h-4 mr-1" />
    Edit
  </Button>
  {dept.active ? (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => deactivateDepartment(dept.id)}
      className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Deactivate
    </Button>
  ) : (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => activateDepartment(dept.id)}
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
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department Code *"
              placeholder="e.g., CS, PHY"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              maxLength={10}
            />
            <Input
              label="Department Name *"
              placeholder="e.g., Computer Science"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <Input
            label="Faculty *"
            placeholder="e.g., Faculty of Science"
            value={formData.faculty}
            onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
          />

          <Input
            label="Head of Department"
            placeholder="e.g., Dr. John Smith"
            value={formData.headOfDepartment}
            onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the department..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingDepartment ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
