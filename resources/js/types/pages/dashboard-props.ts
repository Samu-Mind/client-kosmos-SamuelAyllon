import { Task } from '../models/task';
import { Idea } from '../models/idea';
import { Subscription } from '../models/subscription';

export interface DashboardProps {
    pendingTasks: Task[];
    activeIdeas: Idea[];
    activeProjects: { id: number; name: string; color: string }[];
    subscription: Subscription | null;
}
