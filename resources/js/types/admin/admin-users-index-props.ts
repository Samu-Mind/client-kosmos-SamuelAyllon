import { AdminUser } from './admin-user';
import { PaginatedData } from '../shared/pagination';

export interface AdminUsersIndexProps {
    users: PaginatedData<AdminUser>;
}
