import type { Task } from './task';

export interface Project {
    id: number;
    name: string;
    description: string | null;
    status: 'inactive' | 'active' | 'completed';
    color: string | null;
    tasks_count?: number;
    pending_tasks_count?: number;
    tasks?: Task[];
    created_at: string;
    updated_at: string;
}
