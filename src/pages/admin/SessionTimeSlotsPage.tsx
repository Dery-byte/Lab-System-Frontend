import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, Calendar, Users, Edit, Trash2, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Input, Loading, Modal, Select } from '../../components/ui';
import { labSessionService } from '../../services/labSessionService';
import { groupService } from '../../services/groupService';
import { timeSlotService } from '../../services/TimeSlotService';
import { reportService, ReportFormat } from '../../services/reportService';
import { LabSession, LabGroup, CreateLabGroupRequest } from '../../types';

const SessionTimeSlotsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = parseInt(id!);

  const [session, setSession] = useState<LabSession | null>(null);
  const [groups, setGroups] = useState<LabGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LabGroup | null>(null);
  const [formData, setFormData] = useState<CreateLabGroupRequest>({
    groupName: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    maxSize: 4,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [reportFormat, setReportFormat] = useState<ReportFormat>('excel');
  const [showReportModal, setShowReportModal] = useState(false);

  // useEffect(() => {
  //   fetchData();
  // }, [sessionId]);

  useEffect(() => {
  if (!sessionId || isNaN(sessionId)) {
    toast.error('Invalid session ID');
    navigate('/admin/session');
    return;
  }
  fetchData();
}, [sessionId]);

  const fetchData = async () => {
    try {
      const [sessionData, groupsData] = await Promise.all([
        labSessionService.getById(sessionId),
        groupService.getBySessionWithMembers(sessionId),
      ]);
      setSession(sessionData);
      setGroups(groupsData);
    } catch (error) {
      toast.error('Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = () => {
    setEditingGroup(null);
    setFormData({
      groupName: `Time Slot ${groups.length + 1}`,
      sessionDate: session?.sessionDays || '',
      startTime: '09:00',
      endTime: '10:00',
      maxSize: session?.maxGroupSize || 4,
    });
    setIsModalOpen(true);
  };

  const handleEditTimeSlot = (group: LabGroup) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      sessionDate: group.sessionDate,
      startTime: group.startTime,
      endTime: group.endTime,
      maxSize: group.maxSize,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.groupName || !formData.sessionDate || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingGroup) {
        await groupService.update(editingGroup.id, formData);
        toast.success('Time slot updated successfully');
      } else {
        await groupService.create(sessionId, formData);
        toast.success('Time slot created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save time slot';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTimeSlot = async (groupId: number) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await groupService.delete(groupId);
      toast.success('Time slot deleted');
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete time slot';
      toast.error(message);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await reportService.downloadSessionReport(sessionId, reportFormat);
      toast.success('Report downloaded');
      setShowReportModal(false);
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleReopenSession = async () => {
    if (!confirm('Are you sure you want to reopen this session for registration?')) return;
    
    try {
      await labSessionService.updateStatus(sessionId, 'OPEN');
      toast.success('Session reopened for registration');
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reopen session';
      toast.error(message);
    }
  };

  // Get slot status color - GREEN = Empty, YELLOW = Has members, RED = Full
  const getSlotColor = (group: LabGroup) => {
    if (group.isFull) {
      return 'bg-red-50 border-red-300'; // Full - Red
    } else if (group.currentSize > 0) {
      return 'bg-yellow-50 border-yellow-300'; // Has members - Yellow
    } else {
      return 'bg-green-50 border-green-300'; // Empty - Green
    }
  };

  const getSlotBadge = (group: LabGroup) => {
    if (group.isFull) {
      return <Badge variant="danger">Full</Badge>;
    } else if (group.currentSize > 0) {
      return <Badge variant="warning">{group.availableSlots} slots left</Badge>;
    } else {
      return <Badge variant="success">Available</Badge>;
    }
  };

  if (loading) {
    return <Loading text="Loading session..." />;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  // Group time slots by date
  const groupedByDate = groups.reduce((acc, group) => {
    const date = group.sessionDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(group);
    return acc;
  }, {} as Record<string, LabGroup[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sessions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
            <p className="text-gray-600 mt-1">
              {session.course?.courseCode} - {session.course?.courseName}
              {session.course?.levelDisplayName && (
                <span className="ml-2 text-primary-600">({session.course.levelDisplayName})</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {session.status === 'CLOSED' && (
            <Button variant="secondary" onClick={handleReopenSession}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reopen Session
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowReportModal(true)}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={handleAddTimeSlot}>
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-gray-500">Lab Room:</span>
              <span className="ml-2 font-medium">{session.labRoom}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge className="ml-2" variant={
                session.status === 'OPEN' ? 'success' : 
                session.status === 'CLOSED' ? 'warning' : 'default'
              }>
                {session.status}
              </Badge>
            </div>
            <div>
              <span className="text-gray-500">Department:</span>
              <span className="ml-2 font-medium">{session.course?.department}</span>
            </div>
            <div>
              <span className="text-gray-500">Total Capacity:</span>
              <span className="ml-2 font-medium">{session.totalCapacity} students</span>
            </div>
            <div>
              <span className="text-gray-500">Registered:</span>
              <span className="ml-2 font-medium">{session.currentRegistrationCount} students</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Legend */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-gray-700">Slot Status:</span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-green-200 border border-green-400"></span>
              Empty (Available)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-yellow-200 border border-yellow-400"></span>
              Has members
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-red-200 border border-red-400"></span>
              Full
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots by Date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No time slots yet</h3>
            <p className="text-gray-500 mt-1">Add time slots for students to register</p>
            <Button className="mt-4" onClick={handleAddTimeSlot}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Time Slot
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dateGroups]) => (
            <Card key={date}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dateGroups
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((group) => (
                      <div
                        key={group.id}
                        className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border-2 ${getSlotColor(group)}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Clock className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{group.groupName}</h4>
                            <p className="text-sm text-gray-600">
                              {group.startTime} - {group.endTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 lg:mt-0">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {group.currentSize}/{group.maxSize}
                            </span>
                            {getSlotBadge(group)}
                          </div>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTimeSlot(group)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTimeSlot(group.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={group.currentSize > 0}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Members List */}
                        {group.members && group.members.length > 0 && (
                          <div className="w-full mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Registered Students:</p>
                            <div className="flex flex-wrap gap-2">
                              {group.members.map((reg) => (
                                <span
                                  key={reg.id}
                                  className="inline-flex items-center px-2 py-1 bg-white rounded text-xs border"
                                >
                                  {reg.student.fullName} ({reg.student.studentId})
                                  {reg.student.department && (
                                    <span className="ml-1 text-gray-400">- {reg.student.department}</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))
      )}

      {/* Add/Edit Time Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? 'Edit Time Slot' : 'Add Time Slot'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Time Slot Name"
            placeholder="e.g., Morning Session, Monday 11:30 AM"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
          />

          <Input
            label="Date"
            type="date"
            value={formData.sessionDate}
            onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
          </div>

          <Input
            label="Max Students"
            type="number"
            min={1}
            value={formData.maxSize}
            onChange={(e) => setFormData({ ...formData, maxSize: parseInt(e.target.value) || 1 })}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSaving}>
              {editingGroup ? 'Update' : 'Create'} Time Slot
            </Button>
          </div>
        </div>
      </Modal>

      {/* Download Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Download Session Report"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select the format for your report download.
          </p>
          <Select
            label="Report Format"
            options={[
              { value: 'txt', label: 'Text (.txt)' },
              { value: 'csv', label: 'CSV (.csv)' },
              { value: 'excel', label: 'Excel (.xlsx)' },
              { value: 'pdf', label: 'PDF (.pdf)' },
            ]}
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value as ReportFormat)}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SessionTimeSlotsPage;
