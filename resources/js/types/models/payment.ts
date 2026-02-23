export interface Payment {
    id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string; email: string };
}

export interface RecentPayment extends Payment {
    user: { id: number; name: string; email: string };
}
