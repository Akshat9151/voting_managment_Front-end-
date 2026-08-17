import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Send, MessageCircle, Smartphone, CheckCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { PhonePreview } from '../components/broadcast/PhonePreview';
import { BroadcastChannel, DeliveryLog, AudienceSplit } from '../types';

export const BroadcastPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [message, setMessage] = useState(
    'प्रिय {{name}} जी,\n\nग्राम पंचायत रामपुर के समग्र विकास और खुशहाली के लिए 28 अगस्त को चुनाव चिह्न "{{symbol}}" के सामने वाला बटन दबाकर रामेश्वर पटेल को भारी मतों से विजयी बनाएं!\n\nवार्ड: {{ward}} • मतदान केंद्र: {{booth}}'
  );
  const [channel] = useState<BroadcastChannel>('all');
  const [includePoster, setIncludePoster] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [audienceSplit, setAudienceSplit] = useState<AudienceSplit>({ total: 3500, whatsapp: 2850, sms: 650, whatsappPercent: 81, smsPercent: 19 });
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'WhatsApp' | 'SMS Fallback'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [split, logs] = await Promise.all([
      api.getAudienceSplit(),
      api.getDeliveryLogs()
    ]);
    setAudienceSplit(split);
    setDeliveryLogs(logs);
  };

  const handleInsertTag = (tag: string) => {
    setMessage(prev => `${prev} {{${tag}}}`);
  };

  const handleDispatch = async () => {
    setIsSending(true);
    try {
      await api.sendBroadcast({
        message,
        channel,
        includePoster,
        selectedWards: ['All Wards']
      });
      showToast(`Broadcast successfully dispatched to ${audienceSplit.total} electors!`, 'success');
      loadData();
    } finally {
      setIsSending(false);
    }
  };

  const filteredLogs = deliveryLogs.filter(log => {
    if (reportFilter === 'all') return true;
    return log.route === reportFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">
            {t('broadcastTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('broadcastSub')}</p>
        </div>

        <Badge variant="mint" className="px-3 py-1 text-xs">
          Smart Dual Pipeline: WhatsApp + SMS Fallback
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">Primary Channel (WhatsApp)</div>
              <div className="text-base font-extrabold text-emerald-950 font-heading">
                {audienceSplit.whatsapp.toLocaleString()} Electors ({audienceSplit.whatsappPercent}%)
              </div>
            </div>
          </div>
          <Badge variant="mint">Rich Media + Blue Tick</Badge>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase text-sky-800 tracking-wider">Auto Fallback (SMS Gateway)</div>
              <div className="text-base font-extrabold text-sky-950 font-heading">
                {audienceSplit.sms.toLocaleString()} Electors ({audienceSplit.smsPercent}%)
              </div>
            </div>
          </div>
          <Badge variant="cyan">100% Deliverability</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-600" />
                <span>Compose Campaign Broadcast</span>
              </h3>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePoster}
                  onChange={(e) => setIncludePoster(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>Attach Poster Card</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Insert Dynamic Voter Tags:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: 'name', label: '+ Voter Name' },
                  { tag: 'ward', label: '+ Ward No.' },
                  { tag: 'booth', label: '+ Polling Booth' },
                  { tag: 'symbol', label: '+ Symbol' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleInsertTag(item.tag)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your personalized voting appeal..."
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSending}
              onClick={handleDispatch}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Dispatch Broadcast ({audienceSplit.whatsapp} WhatsApp + {audienceSplit.sms} SMS)
            </Button>
          </Card>

          <Card className="space-y-3 p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-slate-900">
                Live Delivery Reports &amp; Blue Ticks
              </h3>
              <div className="flex gap-1">
                {(['all', 'WhatsApp', 'SMS Fallback'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setReportFilter(tab)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      reportFilter === tab ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="p-3">Elector</th>
                    <th className="p-3">Ward</th>
                    <th className="p-3">Route</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{log.name}</td>
                      <td className="p-3 text-slate-600">{log.ward}</td>
                      <td className="p-3">
                        <Badge variant={log.route === 'WhatsApp' ? 'mint' : 'cyan'} size="sm">
                          {log.route}
                        </Badge>
                      </td>
                      <td className="p-3 text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5" /> {log.read}
                      </td>
                      <td className="p-3 text-slate-400">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm sticky top-20">
            <div className="text-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Live Voter Phone Screen Simulator
            </div>
            <PhonePreview
              message={message}
              channel={channel}
              includePoster={includePoster}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
