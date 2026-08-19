import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useElection } from '../context/ElectionContext';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { useNavigate } from 'react-router-dom';

export const VolunteerAddPage: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { activeElectionId } = useElection();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [mobile, setMobile] = useState('');
  const [house, setHouse] = useState('House #');
  const [slipHanded, setSlipHanded] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    if (!activeElectionId) {
      showToast(t('selectActiveElectionBeforeAdding'), 'error');
      return;
    }
    try {
      await Promise.all([
        api.addVoter({
        election_id: activeElectionId,
        voter_id_number: `V-02-${Date.now()}`,
        first_name: name,
        last_name: '',
        age,
        gender: 'Male',
        ward_name: 'Ward 02',
        phone_number: mobile || '+91 94140 00000',
        house_number: house,
        status: 'Valid',
        source: 'Volunteer Entry',
        }),
        api.addVolunteerVoter({
        name,
        age,
        mobile: mobile || '',
        house: house || '',
        status: 'Pending',
        slipHanded
        })
      ]);
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.response?.data?.detail || t('errorSavingData'), 'error');
      return;
    }

    showToast(`Elector ${name} logged directly into Ward 02!`, 'success');
    navigate('/volunteer-ward');
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/volunteer-ward')}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold font-heading text-slate-900">
            Quick Elector Entry (Ward 02)
          </h1>
          <p className="text-xs text-slate-500">Auto-tagged to Ward 02 – Patel Basti</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Elector Full Name"
            placeholder="e.g. Radheshyam Patel"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Age (Years)"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
            <FormInput
              label="House / Mohalla Address"
              placeholder="e.g. House #45, Patel Chowk"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
            />
          </div>

          <FormInput
            label="Mobile Number (with +91)"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer min-h-[48px]">
            <input
              type="checkbox"
              checked={slipHanded}
              onChange={(e) => setSlipHanded(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Panna voting slip handed over during this visit</span>
          </label>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate('/volunteer-ward')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Commit Entry
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
