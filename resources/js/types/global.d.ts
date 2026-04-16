import type { Auth } from '@/types/auth';
import type { Config } from 'ziggy-js';

declare global {
    function route(name: string, params?: Record<string, unknown>, absolute?: boolean, config?: Config): string;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
