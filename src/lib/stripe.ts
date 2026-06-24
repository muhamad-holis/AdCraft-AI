// src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const PLANS = {
  STARTER: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
    credits: 20,
    price: 19,
  },
  PRO: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    credits: 100,
    price: 49,
  },
  AGENCY: {
    monthly: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_AGENCY_YEARLY_PRICE_ID!,
    credits: 500,
    price: 149,
  },
} as const;
