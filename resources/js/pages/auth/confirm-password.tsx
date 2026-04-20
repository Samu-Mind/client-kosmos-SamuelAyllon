import { Form, Head } from '@inertiajs/react';
import { Lock, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

const layoutTitle = 'Confirma tu contraseña';
const layoutDescription = 'Esta es una zona segura. Confirma tu contraseña para continuar.';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmar contraseña" />

            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <ShieldAlert className="h-8 w-8 text-amber-600" />
                </div>
            </div>

            <Form action={store.url()} method="post" resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Tu contraseña actual"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing ? <Spinner /> : <Lock className="h-4 w-4 mr-2" />}
                            Confirmar contraseña
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
