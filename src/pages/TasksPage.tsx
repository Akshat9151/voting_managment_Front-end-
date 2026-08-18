import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckSquare, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

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

export const TasksPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, currentRole } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Survey voter database for Ward A',
      description: 'Complete voter survey and update records in the system',
      assignedTo: 'Volunteer A',
      status: 'in-progress',
      priority: 'high',
      deadline: '2026-08-25',
      createdAt: '2026-08-18'
    },
    {
      id: '2',
      title: 'Distribute campaign materials',
      description: 'Distribute posters and flyers to booth 45-50',
      assignedTo: 'Volunteer B',
      status: 'pending',
      priority: 'medium',
      deadline: '2026-08-26',
      createdAt: '2026-08-18'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    deadline: ''
  });

  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN';
  const isVolunteer = currentRole === 'VOLUNTEER';

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo || !formData.deadline) {
      showToast(t('fillAllRequiredFields'), 'error');
      return;
    }

    // [Frontend-ready] TODO: Connect to POST /tasks/create endpoint
    // const newTask = await tasksApi.create(formData);

    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, newTask]);
    setFormData({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
    setShowCreateModal(false);
    showToast(t('taskCreated'), 'success');
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    // [Frontend-ready] TODO: Connect to PUT /tasks/{id}/status endpoint
    // await tasksApi.updateStatus(taskId, newStatus);

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    showToast(t('taskUpdated'), 'success');
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
            onClick={() => setShowCreateModal(true)}
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
          title={t('createTask')}
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
                onChange={(val) => setFormData({ ...formData, priority: val as any })}
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
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('createTask')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
