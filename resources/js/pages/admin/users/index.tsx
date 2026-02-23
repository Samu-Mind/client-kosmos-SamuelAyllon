import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminUser, AdminUsersIndexProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Usuarios', href: '/admin/users' },
];

const roleColors: Record<string, string> = {
    admin:        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    premium_user: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    free_user:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const roleLabels: Record<string, string> = {
    admin: 'Admin', premium_user: 'Premium', free_user: 'Free',
};

const planLabels: Record<string, string> = {
    free: 'Free', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

function confirmDelete(user: AdminUser) {
    if (confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) {
        router.delete(`/admin/users/${user.id}`);
    }
}

export default function AdminUsersIndex({ users }: AdminUsersIndexProps) {
    const roleName = (user: AdminUser) => user.roles?.[0]?.name ?? 'free_user';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin — Usuarios" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Usuarios</h1>
                        <p className="text-sm text-muted-foreground">{users.total} usuarios registrados</p>
                    </div>
                </div>

                {/* Tabla */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Lista de usuarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.data.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Sin usuarios registrados.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {users.data.map(user => (
                                    <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">

                                        {/* Info principal */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-medium">{user.name}</p>
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[roleName(user)]}`}>
                                                    {roleLabels[roleName(user)] ?? roleName(user)}
                                                </span>
                                            </div>
                                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                        </div>

                                        {/* Plan */}
                                        <div className="shrink-0 text-center">
                                            <p className="text-xs text-muted-foreground">Plan</p>
                                            <p className="text-sm font-medium">
                                                {user.subscription ? planLabels[user.subscription.plan] : 'Sin plan'}
                                            </p>
                                        </div>

                                        {/* Conteos */}
                                        <div className="flex shrink-0 gap-4 text-center">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tareas</p>
                                                <p className="text-sm font-medium">{user.tasks_count ?? 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Ideas</p>
                                                <p className="text-sm font-medium">{user.ideas_count ?? 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Proyectos</p>
                                                <p className="text-sm font-medium">{user.projects_count ?? 0}</p>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex shrink-0 gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button size="sm" variant="outline">Ver</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => confirmDelete(user)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Paginación */}
                        {users.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-1">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`rounded px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground font-medium'
                                                : link.url
                                                    ? 'hover:bg-muted cursor-pointer'
                                                    : 'cursor-not-allowed text-muted-foreground'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
