export type BroadcastChannel = 'all' | 'whatsapp' | 'sms';
export type DeliveryStatus = 'Delivered' | 'Failed' | 'Sending';

export interface DeliveryLog {
  id: string;
  name: string;
  ward: string;
  mobile: string;
  route: 'WhatsApp' | 'SMS Fallback';
  status: DeliveryStatus;
  read: string;
  time: string;
}

export interface BroadcastPayload {
  message: string;
  channel: BroadcastChannel;
  includePoster: boolean;
  selectedWards: string[];
}
