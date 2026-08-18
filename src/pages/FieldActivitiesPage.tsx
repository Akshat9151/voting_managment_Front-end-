import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Map, Plus, Camera, Clock, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { FileDropzone } from '../components/ui/FileDropzone';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

interface FieldActivity {
  id: string;
  volunteerId: string;
  volunteerName: string;
  activityType: string;
  location: string;
  dateTime: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  photosCount: number;
  createdAt: string;
}

export const FieldActivitiesPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, currentRole } = useAuth();
  const { showToast } = useToast();

  const [activities, setActivities] = useState<FieldActivity[]>([
    {
      id: '1',
      volunteerId: 'v1',
      volunteerName: 'Rajesh Kumar',
      activityType: 'door-to-door-campaign',
      location: 'Ward A, Block 1-5',
      dateTime: '2026-08-18T14:30',
      description: 'Visited 25 households for campaign awareness',
      status: 'approved',
      photosCount: 3,
      createdAt: '2026-08-18'
    },
    {
      id: '2',
      volunteerId: 'v2',
      volunteerName: 'Priya Singh',
      activityType: 'event-participation',
      location: 'Community Center',
      dateTime: '2026-08-18T10:00',
      description: 'Organized and participated in campaign rally',
      status: 'pending',
      photosCount: 5,
      createdAt: '2026-08-18'
    }
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [formData, setFormData] = useState({
    activityType: 'door-to-door-campaign',
    location: '',
    dateTime: '',
    description: '',
    photos: [] as File[]
  });

  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN';
  const isVolunteer = currentRole === 'VOLUNTEER';

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.dateTime || !formData.description) {
      showToast(t('fillAllRequiredFields'), 'error');
      return;
    }

    // [Frontend-ready] TODO: Connect to POST /field-activities/submit endpoint
    // const newActivity = await fieldActivitiesApi.submit(formData);
    // TODO: Handle photo uploads to backend storage

    const newActivity: FieldActivity = {
      id: Date.now().toString(),
      volunteerId: user?.id || 'unknown',
      volunteerName: `${user?.first_name} ${user?.last_name}`,
      activityType: formData.activityType,
      location: formData.location,
      dateTime: formData.dateTime,
      description: formData.description,
      status: 'pending',
      photosCount: formData.photos.length,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActivities([...activities, newActivity]);
    setFormData({
      activityType: 'door-to-door-campaign',
      location: '',
      dateTime: '',
      description: '',
      photos: []
    });
    setShowSubmitModal(false);
    showToast(t('activitySubmitted'), 'success');
  };

  const handleStatusChange = (activityId: string, newStatus: FieldActivity['status']) => {
    // [Frontend-ready] TODO: Connect to PUT /field-activities/{id}/status endpoint
    // await fieldActivitiesApi.updateStatus(activityId, newStatus);
    
    setActivities(activities.map(a => a.id === activityId ? { ...a, status: newStatus } : a));
    showToast(t('taskUpdated'), 'success');
  };

  const filteredActivities = filterStatus === 'all'
    ? activities
    : activities.filter(a => a.status === filterStatus);

  const displayActivities = isVolunteer
    ? activities.filter(a => a.volunteerId === user?.id)
    : filteredActivities;

  const getStatusColor = (status: FieldActivity['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-rose-100 text-rose-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {isVolunteer ? t('fieldActivityReport') : t('navItemFieldActivities')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isVolunteer
              ? 'Submit and track your field activities'
              : 'Review and manage field activity reports from volunteers'}
          </p>
        </div>

        {isVolunteer && (
          <Button
            onClick={() => setShowSubmitModal(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('submitActivity')}
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
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'approved'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'rejected'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rejected
          </button>
        </div>
      )}

      {/* Activities List */}
      {displayActivities.length === 0 ? (
        <EmptyState
          icon={Map}
          title={t('noActivitiesYet')}
          description="Field activities submitted by volunteers will appear here"
        />
      ) : (
        <div className="space-y-3">
          {displayActivities.map(activity => (
            <Card key={activity.id} className="space-y-3 p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {activity.activityType.replace('-', ' ').toUpperCase()}
                    </h3>
                    {isAdmin && (
                      <p className="text-xs text-slate-500 mt-1">
                        {t('submitBy')}: {activity.volunteerName}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-slate-700">{activity.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="slate" className="text-[11px] gap-1 flex items-center">
                      <MapPin className="w-3 h-3" />
                      {activity.location}
                    </Badge>
                    <Badge variant="slate" className="text-[11px] gap-1 flex items-center">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.dateTime).toLocaleString()}
                    </Badge>
                    <Badge variant="slate" className="text-[11px] gap-1 flex items-center">
                      <Camera className="w-3 h-3" />
                      {activity.photosCount} {activity.photosCount === 1 ? 'photo' : 'photos'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col">
                  <Badge className={`text-[11px] ${getStatusColor(activity.status)}`}>
                    {activity.status === 'pending' && 'Pending'}
                    {activity.status === 'approved' && 'Approved'}
                    {activity.status === 'rejected' && 'Rejected'}
                  </Badge>

                  {isAdmin && (
                    <Select
                      value={activity.status}
                      onChange={(e) => handleStatusChange(activity.id, e.target.value as FieldActivity['status'])}
                      className="text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Activity Modal */}
      {isVolunteer && (
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title={t('submitActivity')}
        >
          <form onSubmit={handleSubmitActivity} className="space-y-4">
            <Select
              label={t('activityType')}
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
            >
              <option value="door-to-door-campaign">Door-to-Door Campaign</option>
              <option value="event-participation">Event Participation</option>
              <option value="material-distribution">Material Distribution</option>
              <option value="voter-survey">Voter Survey</option>
              <option value="complaint-registration">Complaint Registration</option>
              <option value="other">Other</option>
            </Select>

            <FormInput
              label={t('activityLocation')}
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location or address"
              required
            />

            <FormInput
              label={t('activityDateTime')}
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              required
            />

            <Textarea
              label={t('activityDescription')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the activity in detail"
              required
            />

            <FileDropzone
              title={t('activityPhotos')}
              onFileSelect={(file: File) => setFormData({ ...formData, photos: [...formData.photos, file] })}
              accept="image/*"
            />

            {formData.photos.length > 0 && (
              <p className="text-xs text-slate-600">
                {formData.photos.length} file(s) selected
              </p>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(false)}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('submit')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
