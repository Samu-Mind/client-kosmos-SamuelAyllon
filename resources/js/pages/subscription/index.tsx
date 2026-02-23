import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SubscriptionProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Suscripción', href: '/subscription' },
];

const planColors: Record<string, string> = {
    free:            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    premium_monthly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    premium_yearly:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const planLabels: Record<string, string> = {
    free: 'Gratuito', premium_monthly: 'Premium mensual', premium_yearly: 'Premium anual',
};

const statusColors: Record<string, string> = {
    active:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    expired:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const statusLabels: Record<string, string> = {
    active: 'Activa', expired: 'Expirada', cancelled: 'Cancelada',
};

export default function SubscriptionIndex({ subscription, plans }: SubscriptionProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const isPremium = subscription && (subscription.plan === 'premium_monthly' || subscription.plan === 'premium_yearly') && subscription.status === 'active';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suscripción" />

            <div className="flex flex-col gap-6 p-6">

                <div>
                    <h1 className="text-2xl font-bold">Suscripción</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tu plan y acceso a funcionalidades</p>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Plan actual */}
                {subscription && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Plan actual</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Plan</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${planColors[subscription.plan]}`}>
                                    {planLabels[subscription.plan]}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Estado</span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[subscription.status]}`}>
                                    {statusLabels[subscription.status]}
                                </span>
                            </div>
                            {subscription.expires_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Válido hasta</span>
                                    <span className="text-sm">
                                        {new Date(subscription.expires_at).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                            )}
                            {!isPremium && (
                                <div className="mt-2 border-t pt-3">
                                    <Link href="/checkout">
                                        <Button className="w-full">Actualizar a Premium</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Planes disponibles */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold">Planes disponibles</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {plans.map(plan => (
                            <Card key={plan.key} className={isPremium && (plan.key === subscription?.plan) ? 'ring-2 ring-purple-500' : ''}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{plan.name}</CardTitle>
                                        {isPremium && subscription?.plan === plan.key && (
                                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                Activo
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    <p className="text-2xl font-bold">
                                        {plan.price === 0 ? 'Gratis' : `$${plan.price.toFixed(2)}`}
                                        {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
                                    </p>
                                    <ul className="flex flex-col gap-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="mt-0.5 text-green-600">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    {!isPremium && plan.key !== 'free' && (
                                        <Link href="/checkout">
                                            <Button className="w-full" size="sm">Seleccionar</Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
