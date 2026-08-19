import React, { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Phone, Search, CheckCircle2, PencilLine, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { TeamMember } from '../types';

export const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const { currentRole } = useAuth();
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState<'ALL' | 'ADMIN' | 'VOLUNTEER'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [wardName, setWardName] = useState('All Wards (Campaign HQ)');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [roleCode, setRoleCode] = useState<'ADMIN' | 'VOLUNTEER'>('ADMIN');
  const [isActive, setIsActive] = useState(true);

  const normalizeRole = (value?: string | null): 'SUPER_ADMIN' | 'ADMIN' | 'VOLUNTEER' => {
    const raw = (value ?? '').toString().toUpperCase();
    if (raw.includes('SUPER')) return 'SUPER_ADMIN';
    if (raw.includes('ADMIN')) return 'ADMIN';
    return 'VOLUNTEER';
  };

  const visibilityMap: Record<string, Array<'SUPER_ADMIN' | 'ADMIN' | 'VOLUNTEER'>> = {
    SUPER_ADMIN: ['SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'],
    ADMIN: ['VOLUNTEER'],
    VOLUNTEER: []
  };

  const permissionMap: Record<string, { add: Array<'ADMIN' | 'VOLUNTEER'>; remove: Array<'ADMIN' | 'VOLUNTEER'> }> = {
    SUPER_ADMIN: { add: ['ADMIN', 'VOLUNTEER'], remove: ['ADMIN', 'VOLUNTEER'] },
    ADMIN: { add: ['VOLUNTEER'], remove: ['VOLUNTEER'] },
    VOLUNTEER: { add: [], remove: [] }
  };

  const loadTeam = useCallback(async () => {
    setIsLoading(true);
    try {
      const { items } = await usersApi.list();
      const normalizedUsers = (items ?? []).map((u: any) => {
        const derivedRole = normalizeRole(u.roles?.[0] ?? u.role ?? u.roleTitle ?? 'VOLUNTEER');
        return {
          ...u,
          name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.name || 'Unnamed User',
          role: derivedRole,
          roleTitle: u.roles?.[0] ? u.roles[0].replace('_', ' ') : (derivedRole === 'SUPER_ADMIN' ? 'Super Admin' : derivedRole === 'ADMIN' ? 'Admin' : 'Volunteer'),
          status: u.is_active ? 'Active' : 'Inactive',
          addedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'N/A',
          ward: u.ward ?? '',
          phone: u.phone ?? '',
          votersHandled: u.votersHandled ?? 0,
        } as TeamMember;
      });

      const allowedRoles = visibilityMap[currentRole] ?? [];
      const normalizedTeam = normalizedUsers.length
        ? normalizedUsers.filter((member) => allowedRoles.includes(normalizeRole(member.role ?? member.roleTitle ?? 'VOLUNTEER')))
        : [];

      setTeam(normalizedTeam);
    } catch {
      setTeam([]);
      showToast(t('failedLoadingTeamMembers'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentRole, showToast]);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  useEffect(() => {
    const allowedRoles = currentRole === 'SUPER_ADMIN' ? ['ADMIN', 'VOLUNTEER'] : ['VOLUNTEER'];
    if (!allowedRoles.includes(roleCode)) {
      setRoleCode(allowedRoles[0] as 'ADMIN' | 'VOLUNTEER');
    }
  }, [currentRole, roleCode]);

  const canViewRole = (memberRole: string) => {
    const visibleRoles = visibilityMap[currentRole] ?? [];
    return visibleRoles.includes(normalizeRole(memberRole));
  };

  const canManageRole = (memberRole: string) => {
    const normalizedMemberRole = normalizeRole(memberRole);
    if (normalizedMemberRole === 'SUPER_ADMIN') return currentRole === 'SUPER_ADMIN';
    const authorized = permissionMap[currentRole] ?? { add: [], remove: [] };
    return authorized.remove.includes(normalizedMemberRole);
  };

  const allowedAddRoles = (permissionMap[currentRole] ?? { add: [] }).add;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || (!editingMember && (!email || !password))) return;
    if (!editingMember && password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    const authorizedRole = editingMember || allowedAddRoles.includes(roleCode as 'ADMIN' | 'VOLUNTEER');
    if (!authorizedRole) {
      showToast(t('notAuthorizedAddRole'), 'error');
      return;
    }
    try {
      if (editingMember) {
        await usersApi.update(editingMember.id, {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          is_active: isActive,
        });
        showToast(`${firstName} ${lastName} updated successfully.`, 'success');
      } else {
        await usersApi.create({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone: phone || null,
          role_code: roleCode.toUpperCase(),
        });
        showToast(`${t('teamMemberAddedSuccessPrefix')} ${firstName} ${lastName} ${t('teamMemberAddedSuccessSuffix')}`, 'success');
      }
      setIsAddModalOpen(false);
      setEditingMember(null);
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setPhone('');
      setIsActive(true);
      loadTeam();
    } catch (err: any) {
      showToast(
        err?.response?.data?.error?.message
          || err?.response?.data?.message
          || err?.response?.data?.detail
          || 'Failed to add team member',
        'error'
      );
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setFirstName(member.first_name || member.name?.split(' ')[0] || '');
    setLastName(member.last_name || member.name?.split(' ').slice(1).join(' ') || '');
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setIsActive(member.is_active !== false);
    setIsAddModalOpen(true);
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!canManageRole(member.role ?? 'VOLUNTEER')) {
      showToast(t('noPermissionRemoveRole'), 'error');
      return;
    }
    if (!window.confirm(`Remove ${member.name || 'this team member'}? They will no longer be able to sign in.`)) return;
    try {
      await usersApi.remove(member.id);
      setTeam((current) => current.filter((item) => item.id !== member.id));
      showToast(`${member.name || 'Team member'} removed successfully.`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || 'Failed to remove team member.', 'error');
    }
  };

  const filteredTeam = team.filter((m) => {
    const normalizedMemberRole = normalizeRole(m.role ?? m.roleTitle ?? 'VOLUNTEER');
    if (!canViewRole(normalizedMemberRole)) return false;
    if (memberFilter !== 'ALL' && normalizedMemberRole !== memberFilter) return false;
    const safeName = (m.name ?? '').toLowerCase();
    const safeWard = (m.ward ?? '').toLowerCase();
    const safeRole = (m.roleTitle ?? '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return safeName.includes(q) || safeWard.includes(q) || safeRole.includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('campaignTeam')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('teamDescription')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" className="px-3 py-1 text-xs">
            {team.length} Team Members
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingMember(null);
              setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setPhone('');
              setIsActive(true);
              setIsAddModalOpen(true);
            }}
            leftIcon={<UserPlus className="w-4 h-4" />}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : t('addMember')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 w-full max-w-md overflow-x-auto">
          {(['ALL', 'ADMIN', 'VOLUNTEER'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setMemberFilter(filter)}
              className={`flex-1 min-w-[90px] rounded-lg px-3 py-2 text-[11px] font-bold transition-all ${
                memberFilter === filter
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {filter === 'ALL' ? t('memberFilterAll') : filter === 'ADMIN' ? t('memberFilterAdmins') : t('memberFilterVolunteers')}
            </button>
          ))}
        </div>

        <div className="w-full sm:max-w-md">
          <FormInput
            placeholder={t('memberSearchPlaceholder')}
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Team Roster Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => {
          const memberRole = normalizeRole(member.role ?? member.roleTitle ?? 'VOLUNTEER');
          const isOwner = memberRole === 'SUPER_ADMIN';
          const isAdmin = memberRole === 'ADMIN';
          const canRemove = canManageRole(memberRole);

          return (
            <Card key={member.id} variant="interactive" className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      isOwner ? 'bg-violet-100 text-violet-700' : isAdmin ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {(member.name ?? 'U').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <div className="text-xs text-slate-500">{member.roleTitle}</div>
                    </div>
                  </div>
                  <Badge variant={isOwner ? 'purple' : isAdmin ? 'cyan' : 'mint'} size="sm">
                    {memberRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : memberRole === 'ADMIN' ? 'ADMIN' : 'VOLUNTEER'}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Ward:</span>
                    <span className="font-bold text-slate-800 text-right">{member.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voters Handled:</span>
                    <span className="font-bold text-sky-600">{(member.votersHandled ?? 0).toLocaleString()} {t('memberElectorsLabel')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Added Date:</span>
                    <span className="font-medium text-slate-700">{member.addedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </a>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('memberActiveStatus')}
                </span>
              </div>

              {canRemove && (
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleEditMember(member)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-700"
                  >
                    <PencilLine className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-[11px] font-bold text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingMember(null); }}
        title={
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-600" />
            <span>{editingMember ? 'Edit Team Member' : t('addCampaignTeamMember')}</span>
          </div>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <FormInput
            label={t('formLabelFirstName')}
            placeholder={t('formPlaceholderFirstName')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <FormInput
            label={t('formLabelLastName')}
            placeholder={t('formPlaceholderLastName')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          {!editingMember && <div className="grid grid-cols-2 gap-3">
            <Select
              label={t('formLabelRoleHierarchy')}
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value as 'ADMIN' | 'VOLUNTEER')}
            >
              {allowedAddRoles.length === 0 && <option value="VOLUNTEER">{t('roleVolunteerFieldWorker')}</option>}
              {allowedAddRoles.includes('ADMIN') && <option value="ADMIN">{t('roleAdminCampaignManager')}</option>}
              {allowedAddRoles.includes('VOLUNTEER') && <option value="VOLUNTEER">{t('roleVolunteerFieldWorker')}</option>}
            </Select>

            <FormInput
              label={t('formLabelEmail')}
              placeholder={t('formPlaceholderEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>}

          {editingMember ? (
            <FormInput
              label="Email"
              type="email"
              value={email}
              readOnly
              className="bg-slate-50"
            />
          ) : (
            <FormInput
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          )}

          {!editingMember && <Select
            label={t('formLabelWardName')}
            value={wardName}
            onChange={(e) => setWardName(e.target.value)}
          >
            <option value="All Wards (Campaign HQ)">{t('wardAllCampaignHQ')}</option>
            <option value="Ward 01 – Old Village">Ward 01 – Old Village</option>
            <option value="Ward 02 – Patel Basti">Ward 02 – Patel Basti</option>
            <option value="Ward 03 – Main Market">Ward 03 – Main Market</option>
            <option value="Ward 04 – Rampur HQ">Ward 04 – Rampur HQ</option>
            <option value="Ward 05 – South Colony">Ward 05 – South Colony</option>
            <option value="Ward 06 – Krishi Upaj">Ward 06 – Krishi Upaj</option>
          </Select>}

          <FormInput
            label="Mobile Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {editingMember && (
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Account active
            </label>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {editingMember ? 'Save Changes' : t('memberSave')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
