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
import { designTemplatesApi, fieldActivitiesApi } from '../services/api';

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

  const [activities, setActivities] = useState<FieldActivity[]>([]);

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

  React.useEffect(() => {
    let active = true;
    fieldActivitiesApi.list()
      .then((items) => {
        if (!active) return;
        setActivities(items.map((item) => ({
          id: item.id,
          volunteerId: item.volunteer_id || '',
          volunteerName: item.volunteer_name,
          activityType: item.activity_type,
          location: item.location,
          dateTime: item.created_at,
          description: item.description,
          status: item.status === 'Verified' ? 'approved' : item.status === 'Flagged' ? 'rejected' : 'pending',
          photosCount: item.photo_url ? 1 : 0,
          createdAt: item.created_at,
        })));
      })
      .catch((err) => showToast(err?.response?.data?.detail || 'Unable to load field activities.', 'error'));
    return () => { active = false; };
  }, [showToast]);

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.dateTime || !formData.description) {
      showToast(t('fillAllRequiredFields'), 'error');
      return;
    }

    try {
      let photoUrl: string | undefined;
      if (formData.photos[0]) {
        const uploaded = await designTemplatesApi.uploadAsset(formData.photos[0]);
        photoUrl = uploaded.url;
      }
      const created = await fieldActivitiesApi.submit({
        volunteer_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
        activity_type: formData.activityType,
        location: formData.location,
        description: formData.description,
        photo_url: photoUrl,
      });
      setActivities((current) => [{
        id: created.id,
        volunteerId: created.volunteer_id || '',
        volunteerName: created.volunteer_name,
        activityType: created.activity_type,
        location: created.location,
        dateTime: created.created_at,
        description: created.description,
        status: 'pending',
        photosCount: created.photo_url ? 1 : 0,
        createdAt: created.created_at,
      }, ...current]);
      setFormData({ activityType: 'door-to-door-campaign', location: '', dateTime: '', description: '', photos: [] });
      setShowSubmitModal(false);
      showToast(t('activitySubmitted'), 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Unable to submit activity.', 'error');
    }
  };

  const handleStatusChange = async (activityId: string, newStatus: FieldActivity['status']) => {
    const backendStatus = newStatus === 'approved' ? 'Verified' : newStatus === 'rejected' ? 'Flagged' : 'Submitted';
    try {
      const updated = await fieldActivitiesApi.updateStatus(activityId, backendStatus);
      setActivities((current) => current.map((activity) => activity.id === activityId ? {
        ...activity,
        status: updated.status === 'Verified' ? 'approved' : updated.status === 'Flagged' ? 'rejected' : 'pending',
      } : activity));
      showToast(t('taskUpdated'), 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Unable to update activity.', 'error');
    }
  };

  const filteredActivities = filterStatus === 'all'
    ? activities
    : activities.filter(a => a.status === filterStatus);

  const currentVolunteerName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim().toLowerCase();
  const displayActivities = isVolunteer
    ? activities.filter((activity) =>
        activity.volunteerId === user?.id ||
        activity.volunteerName.trim().toLowerCase() === currentVolunteerName
      )
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
              ? t('submitTrackActivities')
              : t('reviewManageActivities')}
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
            {t('pending')}
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'approved'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('approved')}
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterStatus === 'rejected'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('rejected')}
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
                    {activity.status === 'pending' && t('pending')}
                    {activity.status === 'approved' && t('approved')}
                    {activity.status === 'rejected' && t('rejected')}
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
              label={t('activityLocation') || t('activityLocation')}
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={t('activityLocation')}
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
              placeholder={t('activityDescription')}
              required
            />

            <FileDropzone
              title={t('activityPhotos')}
              onFileSelect={(file: File) => setFormData({ ...formData, photos: [...formData.photos, file] })}
              accept="image/*"
            />

            {formData.photos.length > 0 && (
              <p className="text-xs text-slate-600">
                {formData.photos.length} {t('filesSelected')}
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
