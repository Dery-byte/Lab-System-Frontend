import { useEffect, useState } from 'react';
import { FileText, Check, X, Eye, EyeOff, Save, ChevronDown, ChevronRight, Calendar, BookOpen, Target, Package, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, Badge, Button, Loading, Select, Alert } from '../../components/ui/index';
import { labSessionService, weeklyNoteService } from '../../services';
import { LabSession, WeeklyNote, UpdateWeeklyNoteRequest } from '../../types';

const AdminWeeklyNotesPage = () => {
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [weeklyNotes, setWeeklyNotes] = useState<WeeklyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [editingWeeks, setEditingWeeks] = useState<Set<number>>(new Set());
  const [editData, setEditData] = useState<Record<number, UpdateWeeklyNoteRequest>>({});
  const [savingWeek, setSavingWeek] = useState<number | null>(null);

  useEffect(() => {
    labSessionService.getAll()
      .then(data => setSessions(data.filter(s => s.status === 'OPEN' || s.status === 'DRAFT')))
      .catch(() => toast.error('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      setLoadingNotes(true);
      weeklyNoteService.getAllForSession(selectedSessionId)
        .then(data => {
          setWeeklyNotes(data);
          const initialEditData: Record<number, UpdateWeeklyNoteRequest> = {};
          data.forEach(note => {
            initialEditData[note.weekNumber] = {
              labSessionId: selectedSessionId,
              weekNumber: note.weekNumber,
              title: note.title || '',
              content: note.content || '',
              learningObjectives: note.learningObjectives || '',
              materialsNeeded: note.materialsNeeded || '',
            };
          });
          setEditData(initialEditData);
          setEditingWeeks(new Set());
        })
        .catch(() => toast.error('Failed to load weekly notes'))
        .finally(() => setLoadingNotes(false));
    } else {
      setWeeklyNotes([]);
      setEditData({});
    }
  }, [selectedSessionId]);

  const toggleExpand = (weekNum: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekNum)) newSet.delete(weekNum);
      else newSet.add(weekNum);
      return newSet;
    });
  };

  const toggleEditing = (weekNum: number) => {
    setEditingWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekNum)) {
        newSet.delete(weekNum);
      } else {
        newSet.add(weekNum);
        setExpandedWeeks(prev => new Set([...prev, weekNum]));
      }
      return newSet;
    });
  };

  const updateEditData = (weekNum: number, field: keyof UpdateWeeklyNoteRequest, value: string) => {
    setEditData(prev => ({
      ...prev,
      [weekNum]: { ...prev[weekNum], [field]: value }
    }));
  };

  const handleSave = async (weekNum: number, publish: boolean = false) => {
    if (!selectedSessionId) return;
    setSavingWeek(weekNum);
    try {
      const data = editData[weekNum];
      await weeklyNoteService.update({ ...data, publish });
      const updatedNotes = await weeklyNoteService.getAllForSession(selectedSessionId);
      setWeeklyNotes(updatedNotes);
      setEditingWeeks(prev => { const n = new Set(prev); n.delete(weekNum); return n; });
      toast.success(publish ? 'Saved and published!' : 'Saved!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSavingWeek(null);
    }
  };

  const handlePublishToggle = async (weekNum: number, currentlyPublished: boolean) => {
    if (!selectedSessionId) return;
    setSavingWeek(weekNum);
    try {
      if (currentlyPublished) {
        await weeklyNoteService.unpublish(selectedSessionId, weekNum);
        toast.success('Unpublished');
      } else {
        await weeklyNoteService.publish(selectedSessionId, weekNum);
        toast.success('Published! Students can now see this content.');
      }
      const updatedNotes = await weeklyNoteService.getAllForSession(selectedSessionId);
      setWeeklyNotes(updatedNotes);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSavingWeek(null);
    }
  };

  const getWeekBadge = (week: WeeklyNote) => {
    if (week.isCurrentWeek) return <Badge variant="success">Current Week</Badge>;
    if (week.isPastWeek) return <Badge variant="default">Past</Badge>;
    return <Badge variant="info">Upcoming</Badge>;
  };

  if (loading) return <Loading text="Loading..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Notes Management</h1>
        <p className="text-gray-600 mt-1">Add content for each week of your lab sessions. Check the box to enable editing.</p>
      </div>

      <Card>
        <CardContent className="py-4">
          <Select
            label="Select Lab Session"
            value={selectedSessionId?.toString() || ''}
            onChange={(e) => setSelectedSessionId(e.target.value ? parseInt(e.target.value) : null)}
            options={sessions.map(s => ({ value: s.id, label: `${s.name} (${s.courseCode}) - ${s.durationWeeks} weeks` }))}
            placeholder="Choose a session..."
          />
        </CardContent>
      </Card>

      {!selectedSessionId ? (
        <Card><CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">Select a session</h3>
          <p className="text-gray-500">Choose a lab session to manage its weekly notes</p>
        </CardContent></Card>
      ) : loadingNotes ? (
        <Loading text="Loading weekly notes..." />
      ) : (
        <div className="space-y-4">
          <Alert variant="info">
            <strong>How it works:</strong> Check the "Edit" checkbox to enable editing for a week. 
            Add your content and click Save. Students will only see published notes.
          </Alert>

          {weeklyNotes.map((week) => {
            const isExpanded = expandedWeeks.has(week.weekNumber);
            const isEditing = editingWeeks.has(week.weekNumber);
            const data = editData[week.weekNumber] || {};

            return (
              <Card key={week.weekNumber} className={`${week.isCurrentWeek ? 'ring-2 ring-green-200 border-green-300' : ''}`}>
                {/* Week Header */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleExpand(week.weekNumber)} className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                      <span className="font-semibold text-gray-900">Week {week.weekNumber}</span>
                    </button>
                    <span className="text-sm text-gray-500">{week.dateRange}</span>
                    {getWeekBadge(week)}
                    {week.isPublished ? (
                      <Badge variant="success"><Eye className="w-3 h-3 mr-1" />Published</Badge>
                    ) : (
                      <Badge variant="default"><EyeOff className="w-3 h-3 mr-1" />Draft</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Edit Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEditing}
                        onChange={() => toggleEditing(week.weekNumber)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        <Edit2 className="w-4 h-4 inline mr-1" />Edit
                      </span>
                    </label>

                    {/* Publish Toggle */}
                    {week.id && (
                      <Button
                        variant={week.isPublished ? 'secondary' : 'success'}
                        size="sm"
                        onClick={() => handlePublishToggle(week.weekNumber, week.isPublished)}
                        isLoading={savingWeek === week.weekNumber}
                        disabled={!week.content && !week.title}
                      >
                        {week.isPublished ? <><EyeOff className="w-4 h-4 mr-1" />Unpublish</> : <><Eye className="w-4 h-4 mr-1" />Publish</>}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Week Content - Expanded */}
                {isExpanded && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {isEditing ? (
                      /* Editing Mode */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <BookOpen className="w-4 h-4 inline mr-1" />Week Title
                          </label>
                          <input
                            type="text"
                            value={data.title || ''}
                            onChange={(e) => updateEditData(week.weekNumber, 'title', e.target.value)}
                            placeholder="e.g., Introduction to Microscopy"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText className="w-4 h-4 inline mr-1" />Content / Overview
                          </label>
                          <textarea
                            value={data.content || ''}
                            onChange={(e) => updateEditData(week.weekNumber, 'content', e.target.value)}
                            placeholder="Brief overview of what will be covered this week..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Target className="w-4 h-4 inline mr-1" />Learning Objectives
                          </label>
                          <textarea
                            value={data.learningObjectives || ''}
                            onChange={(e) => updateEditData(week.weekNumber, 'learningObjectives', e.target.value)}
                            placeholder="What students should learn this week..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Package className="w-4 h-4 inline mr-1" />Materials Needed
                          </label>
                          <textarea
                            value={data.materialsNeeded || ''}
                            onChange={(e) => updateEditData(week.weekNumber, 'materialsNeeded', e.target.value)}
                            placeholder="Materials or preparation students should bring..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <Button variant="secondary" size="sm" onClick={() => toggleEditing(week.weekNumber)}>
                            <X className="w-4 h-4 mr-1" />Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSave(week.weekNumber, false)} isLoading={savingWeek === week.weekNumber}>
                            <Save className="w-4 h-4 mr-1" />Save
                          </Button>
                          <Button variant="success" size="sm" onClick={() => handleSave(week.weekNumber, true)} isLoading={savingWeek === week.weekNumber}>
                            <Check className="w-4 h-4 mr-1" />Save & Publish
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="space-y-4">
                        {week.title && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
                            <p className="text-gray-900">{week.title}</p>
                          </div>
                        )}
                        {week.content && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Content</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{week.content}</p>
                          </div>
                        )}
                        {week.learningObjectives && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Learning Objectives</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{week.learningObjectives}</p>
                          </div>
                        )}
                        {week.materialsNeeded && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Materials Needed</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{week.materialsNeeded}</p>
                          </div>
                        )}
                        {!week.title && !week.content && !week.learningObjectives && !week.materialsNeeded && (
                          <p className="text-gray-400 italic">No content added yet. Check "Edit" to add content for this week.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminWeeklyNotesPage;
