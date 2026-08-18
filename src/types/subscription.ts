export type PlanTier = 'basic' | 'professional' | 'enterprise';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  tagline: string;
  features: string[];
  candidateLimit: number | 'Unlimited';
  volunteerLimit: number | 'Unlimited';
  badge?: string;
  isPopular?: boolean;
}

export interface AddonModule {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface Invoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  gateway: 'Razorpay' | 'Stripe' | 'Cashfree' | 'PayU';
  transactionId: string;
  pdfUrl?: string;
}

export interface CurrentSubscription {
  planId: PlanTier;
  planName: string;
  status: 'Active' | 'Expiring' | 'Expired';
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  activeCandidates: number;
  activeVolunteers: number;
  whatsappCredits: number;
  smsCredits: number;
}
