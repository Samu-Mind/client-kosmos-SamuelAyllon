// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

const layoutTitle = '¿Olvidaste tu contraseña?';
const layoutDescription = 'Introduce tu email para recibir un enlace de recuperación';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Recuperar contraseña" />

            {status && (
                <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">{status}</span>
                </div>
            )}

            <div className="space-y-6">
                <Form action={email.url()} method="post">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="email@ejemplo.com"
                                        className="pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Mail className="h-4 w-4 mr-2" />
                                    )}
                                    Enviar enlace de recuperación
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a</span>
                    <TextLink href={login()} className="text-primary font-semibold hover:underline">iniciar sesión</TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
