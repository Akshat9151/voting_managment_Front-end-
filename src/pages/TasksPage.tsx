import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckSquare, Plus, PencilLine, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { tasksApi } from '../services/api';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  createdAt: string;
}

type TaskPriority = 'high' | 'medium' | 'low';

export const TasksPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, currentRole } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    deadline: ''
  });

  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN';
  const isVolunteer = currentRole === 'VOLUNTEER';

  React.useEffect(() => {
    let active = true;
    tasksApi.list()
      .then((items) => {
        if (!active) return;
        setTasks(items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          assignedTo: item.assigned_volunteer_name || item.assigned_to_id || 'Unassigned',
          status: item.status === 'in_progress' ? 'in-progress' : item.status,
          priority: item.priority === 'urgent' ? 'high' : item.priority,
          deadline: item.deadline || '',
          createdAt: item.created_at || '',
        })));
      })
      .catch((err) => showToast(err?.response?.data?.detail || 'Unable to load tasks.', 'error'));
    return () => { active = false; };
  }, [showToast]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo || !formData.deadline) {
      showToast(t('fillAllRequiredFields'), 'error');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        assigned_volunteer_name: formData.assignedTo,
        priority: formData.priority,
        deadline: formData.deadline,
      };
      const created = editingTask
        ? await tasksApi.update(editingTask.id, payload)
        : await tasksApi.create(payload);
      setTasks((current) => [{
        id: created.id,
        title: created.title,
        description: created.description || '',
        assignedTo: created.assigned_volunteer_name || 'Unassigned',
        status: created.status === 'in_progress' ? 'in-progress' : created.status,
        priority: created.priority === 'urgent' ? 'high' : created.priority,
        deadline: created.deadline || '',
        createdAt: created.created_at || '',
      }, ...current]);
      setFormData({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
      setShowCreateModal(false);
      setEditingTask(null);
      showToast(editingTask ? t('taskUpdated') : t('taskCreated'), 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Unable to create task.', 'error');
    }
  };

  const openCreateTask = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
    setShowCreateModal(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo === 'Unassigned' ? '' : task.assignedTo,
      priority: task.priority,
      deadline: task.deadline,
    });
    setShowCreateModal(true);
  };

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    try {
      await tasksApi.remove(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      showToast('Task deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Unable to delete task.', 'error');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updated = await tasksApi.updateStatus(taskId, newStatus === 'in-progress' ? 'in_progress' : newStatus);
      setTasks((current) => current.map((task) => task.id === taskId ? {
        ...task,
        status: updated.status === 'in_progress' ? 'in-progress' : updated.status,
      } : task));
      showToast(t('taskUpdated'), 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Unable to update task.', 'error');
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const myTasks = isVolunteer 
    ? tasks.filter(t => t.assignedTo === user?.first_name || t.assignedTo.includes(user?.last_name || ''))
    : tasks;

  const displayTasks = isVolunteer ? myTasks : filteredTasks;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-rose-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-emerald-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {isVolunteer ? t('myTasks') : t('taskManagement')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isVolunteer 
              ? 'Track and manage your assigned tasks'
              : 'Create and assign tasks to volunteers for campaign activities'}
          </p>
        </div>

        {isAdmin && (
          <Button 
            onClick={openCreateTask}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('createTask')}
          </Button>
        )}
      </div>

      {/* Filter Bar (Admin only) */}
      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'pending' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('taskPending')}
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'in-progress' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('taskInProgress')}
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'completed' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('taskCompleted')}
          </button>
        </div>
      )}

      {/* Tasks List */}
      {displayTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={t('noTasksYet')}
          description={t('noTasksDescription')}
        />
      ) : (
        <div className="space-y-3">
          {displayTasks.map(task => (
            <Card key={task.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{task.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="slate" className="text-[11px]">
                    {t('assignedTo')}: {task.assignedTo}
                  </Badge>
                  <Badge 
                    variant="slate" 
                    className={`text-[11px] ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="slate" className="text-[11px]">
                    📅 {task.deadline}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col">
                <Badge className={`text-[11px] ${getStatusColor(task.status)}`}>
                  {task.status === 'pending' && t('taskPending')}
                  {task.status === 'in-progress' && t('taskInProgress')}
                  {task.status === 'completed' && t('taskCompleted')}
                </Badge>

                {(isAdmin || isVolunteer) && (
                  <Select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    className="text-xs"
                  >
                    <option value="pending">{t('taskPending')}</option>
                    <option value="in-progress">{t('taskInProgress')}</option>
                    <option value="completed">{t('taskCompleted')}</option>
                  </Select>
                )}
                {isAdmin && (
                  <div className="flex gap-1">
                    <button type="button" title="Edit task" onClick={() => openEditTask(task)} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                      <PencilLine className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Delete task" onClick={() => handleDeleteTask(task)} className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {isAdmin && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingTask ? 'Edit Task' : t('createTask')}
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <FormInput
              label={t('taskTitle')}
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />

            <Textarea
              label={t('taskDescription')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
            />

            <FormInput
              label={t('assignToVolunteer')}
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Volunteer name or email"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t('taskPriority')}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>

              <FormInput
                label={t('taskDeadline')}
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button type="button"
                variant="outline" 
                onClick={() => { setShowCreateModal(false); setEditingTask(null); }}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {editingTask ? 'Save Changes' : t('createTask')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
