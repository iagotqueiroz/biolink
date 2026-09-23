export type SubscriptionStatus = "none" | "active" | "pending" | "cancelled" | "suspended";

export type Business = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo_url: string | null;
  photos: string[];
  primary_color: string;
  city: string;
  address: string | null;
  phone: string;
  whatsapp: string;
  instagram: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Subscription = {
  status: SubscriptionStatus;
  provider_subscription_id?: string | null;
  current_period_end?: string | null;
};
