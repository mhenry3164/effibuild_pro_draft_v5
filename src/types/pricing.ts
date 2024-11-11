import { type LucideIcon } from 'lucide-react';

export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  period?: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}