export interface Subscription {
    id: number;
    user_id: number;
    plan: 'free' | 'premium_monthly' | 'premium_yearly';
    status: 'active' | 'expired' | 'cancelled';
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string; email: string };
}