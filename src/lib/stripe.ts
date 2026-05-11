import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const PRICING = {
  BASIC: {
    priceId: process.env.STRIPE_PRICE_BASIC!,
    label: "Basic",
    amountPence: 2900,
    days: 30,
    description: "Standard listing, 30 days",
    features: ["Standard search placement", "Up to 5 photos", "Application management"],
  },
  FEATURED: {
    priceId: process.env.STRIPE_PRICE_FEATURED!,
    label: "Featured",
    amountPence: 5900,
    days: 60,
    description: "Highlighted listing, top of category, 60 days",
    features: ["Everything in Basic", "Featured badge & highlight", "Top of category listing", "60-day run"],
  },
  PREMIUM: {
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    label: "Premium",
    amountPence: 9900,
    days: 90,
    description: "Featured + company logo + social push, 90 days",
    features: ["Everything in Featured", "Company logo on listing", "Social media promotion", "90-day run", "Priority support"],
  },
} as const;

export type PricingTier = keyof typeof PRICING;
