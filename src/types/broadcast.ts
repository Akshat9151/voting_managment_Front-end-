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

export interface BroadcastGroup {
  id: string;
  name: string;
  filter_criteria_snapshot: Record<string, unknown>;
  message_text?: string | null;
  status: string;
  recipient_count: number;
  whatsapp_count: number;
  sms_count: number;
  excluded_no_contact: number;
  created_at: string;
}

export interface BroadcastResult {
  success: boolean;
  group_id: string;
  total: number;
  whatsapp_sent: number;
  sms_sent: number;
  failed: number;
}
