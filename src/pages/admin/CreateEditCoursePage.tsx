import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
import { courseService } from '../../services/courseService';
import { CreateCourseRequest, Level, LEVEL_OPTIONS } from '../../types';

const CreateEditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateCourseRequest>({
    courseCode: '',
    courseName: '',
    description: '',
    department: '',
    level: 'LEVEL_100',
    semester: '',
    creditHours: 3,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchCourse(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchCourse = async (courseId: number) => {
    try {
      const course = await courseService.getById(courseId);
      setFormData({
        courseCode: course.courseCode,
        courseName: course.courseName,
        description: course.description || '',
        department: course.department,
        level: course.level,
        semester: course.semester,
        creditHours: course.creditHours,
      });
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.courseCode) newErrors.courseCode = 'Course code is required';
    if (!formData.courseName) newErrors.courseName = 'Course name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (formData.creditHours < 1 || formData.creditHours > 6) {
      newErrors.creditHours = 'Credit hours must be between 1 and 6';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        await courseService.update(parseInt(id), formData);
        toast.success('Course updated successfully');
      } else {
        await courseService.create(formData);
        toast.success('Course created successfully');
      }
      navigate('/admin/courses');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save course';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading course..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Course' : 'Create Course'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update course details' : 'Add a new course to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Course Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Course Code"
                name="courseCode"
                placeholder="e.g., PHY101"
                value={formData.courseCode}
                onChange={handleChange}
                error={errors.courseCode}
              />

              <Input
                label="Course Name"
                name="courseName"
                placeholder="e.g., Introduction to Physics"
                value={formData.courseName}
                onChange={handleChange}
                error={errors.courseName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Course description..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Department"
                name="department"
                placeholder="e.g., Physics"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />

              <Select
                label="Level"
                name="level"
                options={LEVEL_OPTIONS}
                value={formData.level}
                onChange={handleChange}
                error={errors.level}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Semester"
                name="semester"
                placeholder="e.g., Spring 2025"
                value={formData.semester}
                onChange={handleChange}
                error={errors.semester}
              />

              <Input
                label="Credit Hours"
                name="creditHours"
                type="number"
                min={1}
                max={6}
                value={formData.creditHours}
                onChange={handleChange}
                error={errors.creditHours}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/courses')}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                {isEdit ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateEditCoursePage;
