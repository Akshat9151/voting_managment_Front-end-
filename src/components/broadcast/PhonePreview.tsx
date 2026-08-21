import React from 'react';
import { MessageCircle, Smartphone, Wifi, Battery, CheckCheck } from 'lucide-react';
import { BroadcastChannel } from '../../types';

interface PhonePreviewProps {
  message: string;
  channel: BroadcastChannel;
  includePoster: boolean;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  message,
  channel,
  includePoster
}) => {
  // Replace template variables with sample values for live preview
  const interpolated = (message || '')
    .replace(/{{name}}/g, '')
    .replace(/{{ward}}/g, 'Ward 04')
    .replace(/{{booth}}/g, 'Govt School Booth 01')
    .replace(/{{symbol}}/g, '🚜 Tractor');

  const isWhatsApp = channel === 'whatsapp' || channel === 'all';

  return (
    <div className="w-full max-w-[320px] mx-auto bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 relative">
      {/* Dynamic Island / Speaker Notch */}
      <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mr-1.5" />
        <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
      </div>

      {/* Screen Frame */}
      <div className="bg-[#efeae2] rounded-[28px] overflow-hidden min-h-[480px] flex flex-col justify-between border border-slate-700/40">
        {/* Status Bar */}
        <div className="bg-[#075e54] text-white px-4 py-1.5 flex justify-between items-center text-[10px] font-semibold">
          <span>10:45 AM</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>

        {/* Chat Header */}
        <div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white border border-emerald-500">
            {isWhatsApp ? <MessageCircle className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">VoteVictory</div>
            <div className="text-[9px] text-emerald-200">Official Campaign Channel</div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="p-3 flex-1 flex flex-col justify-end space-y-2">
          <div className="text-center">
            <span className="text-[9px] bg-white/70 text-slate-600 px-2 py-0.5 rounded-md shadow-xs">
              TODAY
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-200/60 max-w-[92%] self-start space-y-2">
            {includePoster && (
              <div className="rounded-xl overflow-hidden bg-sky-900 text-white p-2.5 text-center text-xs font-bold shadow-inner">
                <div className="text-[10px] text-sky-300 mb-1">CAMPAIGN POSTER</div>
                <div>🚜 रमेशवर पटेल - सरपंच प्रत्याशी</div>
                <div className="text-[9px] text-emerald-400 mt-1">चुनाव चिह्न: ट्रैक्टर</div>
              </div>
            )}
            <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {interpolated || 'Type a message to see live preview...'}
            </p>
            <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-medium">
              <span>10:45 AM</span>
              {isWhatsApp && <CheckCheck className="w-3 h-3 text-sky-500" />}
            </div>
          </div>
        </div>

        {/* Channel Indicator Footer */}
        <div className="bg-slate-100 p-2 border-t border-slate-200 text-center text-[10px] font-bold text-slate-600">
          {isWhatsApp ? '🟢 WhatsApp Broadcast Pipeline' : '🔵 SMS Fallback Route'}
        </div>
      </div>
    </div>
  );
};
