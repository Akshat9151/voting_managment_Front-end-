export interface AnalyticsData {
  wardCoverage: { ward: string; percentage: number }[];
  channelDelivery: { channel: string; count: number; color: string }[];
  materialPrints: { type: string; count: number }[];
  volunteerProductivity: { name: string; slips: number; calls: number }[];
}
