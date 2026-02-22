// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Plus, BookOpen, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card, CardContent, Badge, Button, Loading } from '../../components/ui';
// import { courseService } from '../../services/courseService';
// import { Course } from '../../types';

// const AdminCoursesPage = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const data = await courseService.getAll();
//       setCourses(data);
//     } catch (error) {
//       toast.error('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (id: number) => {
//     try {
//       await courseService.toggleStatus(id);
//       toast.success('Course status updated');
//       fetchCourses();
//     } catch (error) {
//       toast.error('Failed to update course status');
//     }
//   };

//   if (loading) {
//     return <Loading text="Loading courses..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
//           <p className="text-gray-600 mt-1">Manage courses and their lab sessions</p>
//         </div>
//         <Link to="/admin/courses">
//           <Button>
//             <Plus className="w-4 h-4 mr-2" />
//             Add Course
//           </Button>
//         </Link>
//       </div>

//       {courses.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center">
//             <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//             <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
//             <p className="text-gray-500 mt-1">Create your first course to get started</p>
//             <Link to="/admin/courses" className="mt-4 inline-block">
//               <Button>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Course
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {courses.map((course) => (
//             <Card key={course.id}>
//               <CardContent className="p-5">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-medium text-primary-600">{course.courseCode}</span>
//                       <Badge variant={course.active ? 'success' : 'default'}>
//                         {course.active ? 'Active' : 'Inactive'}
//                       </Badge>
//                     </div>
//                     <h3 className="font-semibold text-gray-900 mt-1">{course.courseName}</h3>
//                   </div>
//                 </div>

//                 <div className="space-y-2 text-sm text-gray-600 mb-4">
//                   <p><strong>Level:</strong> {course.levelDisplayName}</p>
//                   <p><strong>Department:</strong> {course.department}</p>
//                   <p><strong>Semester:</strong> {course.semester}</p>
//                   <p><strong>Credit Hours:</strong> {course.creditHours}</p>
//                   <p><strong>Lab Sessions:</strong> {course.labSessionsCount}</p>
//                   <p><strong>Enrolled:</strong> {course.enrolledStudentsCount} students</p>
//                 </div>

//                 <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
//                   <Link to={`/admin/courses/${course.id}/edit`} className="flex-1">
//                     <Button size="sm" variant="secondary" className="w-full">
//                       <Edit className="w-4 h-4 mr-1" />
//                       Edit
//                     </Button>
//                   </Link>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleToggleStatus(course.id)}
//                     title={course.active ? 'Deactivate' : 'Activate'}
//                   >
//                     {course.active ? (
//                       <ToggleRight className="w-5 h-5 text-green-600" />
//                     ) : (
//                       <ToggleLeft className="w-5 h-5 text-gray-400" />
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCoursesPage;



import { useEffect, useState } from 'react';
import { Plus, BookOpen, Edit, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal } from '../../components/ui';
import { courseService } from '../../services/courseService';
import { departmentService } from '../../services/departmentService';
import { Course, CreateCourseRequest, Department } from '../../types';
import { Level, Semester } from '../../types/enums';

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateCourseRequest>({
    courseCode: '',
    courseName: '',
    department: '',
    departmentId: 0,
    semester: Semester.FIRST_SEMESTER,
    creditHours: 3,
    level: Level.LEVEL_100,
  });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to load departments');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      courseName: '',
      department: '',
      departmentId: 0,
      semester: Semester.FIRST_SEMESTER,
      creditHours: 3,
      level: Level.LEVEL_100,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      department: course.department,
      departmentId: course.departmentId ?? 0,
      semester: (course.semester as Semester) ?? Semester.FIRST_SEMESTER,
      creditHours: course.creditHours,
      level: (course.level as Level) ?? Level.LEVEL_100,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await courseService.toggleStatus(id);
      toast.success('Course status updated');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const handleSubmit = async () => {
    if (!formData.courseCode || !formData.courseName || !formData.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.id, formData);
        toast.success('Course updated successfully');
      } else {
        await courseService.create(formData);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save course';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading text="Loading courses..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage courses and their lab sessions</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try a different search term' : 'Create your first course to get started'}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.courseName}</h3>
                      <p className="text-sm text-gray-500">{course.courseCode}</p>
                    </div>
                  </div>
                  <Badge variant={course.active ? 'success' : 'default'}>
                    {course.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="text-gray-500">Level:</span> {course.levelDisplayName}</p>
                  <p><span className="text-gray-500">Department:</span> {course.department}</p>
                  <p><span className="text-gray-500">Semester:</span> {course.semester}</p>
                  <p><span className="text-gray-500">Credit Hours:</span> {course.creditHours}</p>
                  <p><span className="text-gray-500">Lab Sessions:</span> {course.labSessionsCount}</p>
                  <p><span className="text-gray-500">Enrolled:</span> {course.enrolledStudentsCount} students</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(course)} className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleStatus(course.id)}
                    title={course.active ? 'Deactivate' : 'Activate'}
                  >
                    {course.active ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
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
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Code *"
              placeholder="e.g., CS101"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
              maxLength={20}
            />
            <Input
              label="Course Name *"
              placeholder="e.g., Introduction to Programming"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <select
              value={formData.departmentId}
              onChange={(e) => {
                const dept = departments.find(d => d.id === Number(e.target.value));
                setFormData({
                  ...formData,
                  departmentId: Number(e.target.value),
                  department: dept?.name ?? '',
                });
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={0}>Select Department</option>
              {departments.filter(d => d.active).map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={formData.semester as string}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value as Semester })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {Object.values(Semester).map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <Input
              label="Credit Hours"
              type="number"
              placeholder="e.g., 3"
              value={formData.creditHours}
              onChange={(e) => setFormData({ ...formData, creditHours: Number(e.target.value) })}
              min={1}
              max={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={formData.level as string}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value as Level })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.values(Level).map((l) => (
                <option key={l} value={l}>{l.replace('LEVEL_', 'Level ')}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingCourse ? 'Update' : 'Create'} Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCoursesPage;