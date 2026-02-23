import { AdminStats } from './admin-stats';
import { Payment } from '../models/payment';
import { User } from '../models/user';

export interface AdminDashboardProps {
    stats: AdminStats;
    recentPayments: Payment[];
    recentUsers: User[];
}
