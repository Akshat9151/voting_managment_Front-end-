import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Task, TaskPriority, TaskStatus, Volunteer } from '../types';

export const TasksPage: React.FC = () => {
  const { currentRole } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newDeadline, setNewDeadline] = useState('Tomorrow, 05:00 PM');
  const [newAssigned, setNewAssigned] = useState('');
  const [newWard, setNewWard] = useState('Ward 02 – Patel Basti');
  const [newCategory, setNewCategory] = useState<Task['category']>('Voter Contact');

  const loadData = async () => {
    const [taskList, volList] = await Promise.all([
      api.getTasks(),
      api.getVolunteers()
    ]);
    setTasks(taskList);
    setVolunteers(volList);
    if (volList.length > 0) {
      setNewAssigned(volList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter task title', 'info');
      return;
    }
    const assignedVol = volunteers.find(v => v.id === newAssigned);
    await api.addTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'pending',
      deadline: newDeadline,
      assignedTo: newAssigned,
      assignedVolunteerName: assignedVol?.name || 'Assigned Volunteer',
      wardOrBooth: newWard,
      category: newCategory
    });
    showToast('Campaign task assigned successfully!', 'success');
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    loadData();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await api.updateTaskStatus(id, status);
    showToast(`Task status updated to ${status.replace('_', ' ').toUpperCase()}`, 'info');
    loadData();
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignedVolunteerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.wardOrBooth.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
              Task Assignment & Field Operations
            </h1>
            <Badge variant="cyan" size="sm">
              Section 7.5
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign priority field duties to volunteers, track deadlines, and monitor ground fulfillment.
          </p>
        </div>

        {currentRole !== 'volunteer' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create & Assign Task
          </Button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{tasks.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Action</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{completedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, volunteer, or ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-bold">Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span className="font-bold">Priority:</span>
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((t) => {
          const isUrgent = t.priority === 'urgent';
          const isHigh = t.priority === 'high';
          const isCompleted = t.status === 'completed';

          return (
            <Card key={t.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                      {t.category}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      t.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status === 'in_progress' ? 'In Progress' : t.status.toUpperCase()}
                  </span>
                </div>

                <h3 className={`font-heading font-extrabold text-base ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{t.assignedVolunteerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Task Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{t.wardOrBooth}</span>
                <div className="flex items-center gap-2">
                  {t.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(t.id, 'in_progress')}
                    >
                      Start Task
                    </Button>
                  )}
                  {t.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStatusChange(t.id, 'completed')}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    >
                      Mark Done
                    </Button>
                  )}
                  {t.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Fulfilled on {t.completedDate || 'Aug 18'}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-1">
              Create & Assign Field Task
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Set priority, assign dedicated field volunteer, and define execution deadline.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distribute 300 Panna Slips in Ward 04"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Specific requirements, house numbers, or banner spots..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Task Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="Voter Contact">Voter Contact</option>
                    <option value="Slip Distribution">Slip Distribution</option>
                    <option value="Banner Setup">Banner Setup</option>
                    <option value="Rally Prep">Rally Prep</option>
                    <option value="Grievance Resolution">Grievance Resolution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">⚪ Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assign Volunteer *</label>
                  <select
                    value={newAssigned}
                    onChange={(e) => setNewAssigned(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    {volunteers.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.ward})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Ward / Booth</label>
                  <input
                    type="text"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deadline</label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" leftIcon={<ArrowRight className="w-4 h-4" />}>
                  Dispatch Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
