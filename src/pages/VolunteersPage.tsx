import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Volunteer, Booth } from '../types';

export const VolunteersPage: React.FC = () => {
  const { t } = useLanguage();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [volData, boothData] = await Promise.all([
      api.getVolunteers(),
      api.getBooths()
    ]);
    setVolunteers(volData);
    setBooths(boothData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('boothOps')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ward-wise polling booth coverage, incharge assignments, and voter slip distribution.
          </p>
        </div>

        <Badge variant="mint" className="px-3 py-1 text-xs">
          6 Polling Booths Active • 86% Average Coverage
        </Badge>
      </div>

      {/* Booths Grid */}
      <div className="space-y-3">
        <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          <span>Polling Stations &amp; Panna Roster</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {booths.map((b) => (
            <Card key={b.boothNo} variant="interactive" className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="purple" size="sm">{b.boothNo}</Badge>
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 mt-1 leading-tight">
                    {b.location}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {b.coverage}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booth Incharge:</span>
                  <span className="font-bold text-slate-800">{b.incharge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Electors:</span>
                  <span className="font-bold text-slate-900">{b.voters} Voters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slips Distributed:</span>
                  <span className="font-bold text-sky-600">{b.slips} Slips</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: b.coverage }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Field Volunteer Leaderboard */}
      <Card className="space-y-4">
        <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Field Volunteer Performance Metrics</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
              <tr>
                <th className="p-3">Volunteer Name</th>
                <th className="p-3">Assigned Area</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Voters Added</th>
                <th className="p-3">Calls Made</th>
                <th className="p-3">Slips Handed</th>
                <th className="p-3">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{vol.name}</td>
                  <td className="p-3 text-slate-600">{vol.ward}</td>
                  <td className="p-3">
                    <a href={`tel:${vol.phone}`} className="text-sky-600 font-mono font-bold">
                      {vol.phone}
                    </a>
                  </td>
                  <td className="p-3 font-extrabold text-emerald-700">+{vol.votersAdded}</td>
                  <td className="p-3 font-extrabold text-sky-700">{vol.callsMade}</td>
                  <td className="p-3 font-extrabold text-violet-700">{vol.slipsDistributed}</td>
                  <td className="p-3">
                    <Badge variant="mint" size="sm">{vol.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
