import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Button, Input, Select, Loading } from '../../components/ui';
import { labSessionService } from '../../services/labSessionService';
import { courseService } from '../../services/courseService';
import { Course, CreateLabSessionRequest } from '../../types';

const CreateEditSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateLabSessionRequest>({
    name: '',
    description: '',
    labRoom: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    maxGroupSize: 4,
    maxGroups: 5,
    courseId: 0,
    status: 'DRAFT',
    autoCreateGroups: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await courseService.getActive();
        setCourses(coursesData);

        if (isEdit && id) {
          const session = await labSessionService.getById(parseInt(id));
          setFormData({
            name: session.name,
            description: session.description || '',
            labRoom: session.labRoom,
            sessionDate: session.sessionDate,
            startTime: session.startTime,
            endTime: session.endTime,
            maxGroupSize: session.maxGroupSize,
            maxGroups: session.maxGroups,
            courseId: session.course?.id || 0,
            status: session.status,
            autoCreateGroups: false,
          });
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Session name is required';
    if (!formData.labRoom) newErrors.labRoom = 'Lab room is required';
    if (!formData.sessionDate) newErrors.sessionDate = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (formData.maxGroupSize < 1) newErrors.maxGroupSize = 'Must be at least 1';
    if (formData.maxGroups < 1) newErrors.maxGroups = 'Must be at least 1';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
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
        await labSessionService.update(parseInt(id), formData);
        toast.success('Session updated successfully');
      } else {
        await labSessionService.create(formData);
        toast.success('Session created successfully');
      }
      navigate('/admin/sessions');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save session';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/sessions')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Lab Session' : 'Create Lab Session'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update session details' : 'Schedule a new lab session'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Session Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Session Name"
                name="name"
                placeholder="e.g., Physics Lab - Monday Morning"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Select
                label="Course"
                name="courseId"
                options={[
                  { value: '', label: 'Select a course' },
                  ...courses.map((c) => ({
                    value: c.id.toString(),
                    label: `${c.courseCode} - ${c.courseName}`,
                  })),
                ]}
                value={formData.courseId.toString()}
                onChange={handleChange}
                error={errors.courseId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Optional description..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Lab Room"
                name="labRoom"
                placeholder="e.g., Science Building 101"
                value={formData.labRoom}
                onChange={handleChange}
                error={errors.labRoom}
              />

              <Input
                label="Session Date"
                name="sessionDate"
                type="date"
                value={formData.sessionDate}
                onChange={handleChange}
                error={errors.sessionDate}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  error={errors.startTime}
                />
                <Input
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  error={errors.endTime}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Max Students per Group"
                name="maxGroupSize"
                type="number"
                min={1}
                max={50}
                value={formData.maxGroupSize}
                onChange={handleChange}
                error={errors.maxGroupSize}
              />

              <Input
                label="Number of Groups"
                name="maxGroups"
                type="number"
                min={1}
                max={20}
                value={formData.maxGroups}
                onChange={handleChange}
                error={errors.maxGroups}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Total Capacity:</strong> {formData.maxGroupSize * formData.maxGroups} students
                ({formData.maxGroups} groups × {formData.maxGroupSize} students each)
              </p>
            </div>

            {!isEdit && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoCreateGroups"
                  name="autoCreateGroups"
                  checked={formData.autoCreateGroups}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="autoCreateGroups" className="ml-2 text-sm text-gray-700">
                  Automatically create groups (Group 1, Group 2, etc.)
                </label>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/sessions')}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                {isEdit ? 'Update Session' : 'Create Session'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateEditSessionPage;
