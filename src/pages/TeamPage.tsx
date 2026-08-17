import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Phone, Search, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { TeamMember } from '../types';

export const TeamPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Volunteer'>('Volunteer');
  const [roleTitle, setRoleTitle] = useState('');
  const [ward, setWard] = useState('Ward 02 – Patel Basti');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const data = await api.getTeamMembers();
    setTeam(data);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    await api.addTeamMember({
      name,
      role,
      roleTitle: roleTitle || (role === 'Admin' ? 'Campaign Operations' : 'Booth Incharge'),
      ward,
      phone,
      status: 'Active'
    });
    showToast(`Team member ${name} added successfully!`, 'success');
    setIsAddModalOpen(false);
    setName('');
    setRoleTitle('');
    setPhone('');
    loadTeam();
  };

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            {t('addMember')}
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="w-full sm:max-w-md">
        <FormInput
          placeholder="Search team member by name, ward or role..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Team Roster Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => {
          const isOwner = member.role === 'Super Admin';
          const isAdmin = member.role === 'Admin';

          return (
            <Card key={member.id} variant="interactive" className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      isOwner ? 'bg-violet-100 text-violet-700' : isAdmin ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <div className="text-xs text-slate-500">{member.roleTitle}</div>
                    </div>
                  </div>
                  <Badge variant={isOwner ? 'purple' : isAdmin ? 'cyan' : 'mint'} size="sm">
                    {member.role}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Ward:</span>
                    <span className="font-bold text-slate-800 text-right">{member.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voters Handled:</span>
                    <span className="font-bold text-sky-600">{member.votersHandled.toLocaleString()} Electors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Added Date:</span>
                    <span className="font-medium text-slate-700">{member.addedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </a>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Team Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-600" />
            <span>Add Campaign Team Member</span>
          </div>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="e.g. Ramesh Saini"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Role Hierarchy"
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'Volunteer')}
            >
              <option value="Volunteer">Volunteer (Field Worker)</option>
              <option value="Admin">Admin (Campaign Manager)</option>
            </Select>

            <FormInput
              label="Role Title"
              placeholder="e.g. Panna Pramukh"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>

          <Select
            label="Ward / Area Assignment"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          >
            <option value="All Wards (Campaign HQ)">All Wards (Campaign HQ)</option>
            <option value="Ward 01 – Old Village">Ward 01 – Old Village</option>
            <option value="Ward 02 – Patel Basti">Ward 02 – Patel Basti</option>
            <option value="Ward 03 – Main Market">Ward 03 – Main Market</option>
            <option value="Ward 04 – Rampur HQ">Ward 04 – Rampur HQ</option>
            <option value="Ward 05 – South Colony">Ward 05 – South Colony</option>
            <option value="Ward 06 – Krishi Upaj">Ward 06 – Krishi Upaj</option>
          </Select>

          <FormInput
            label="Mobile Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
