import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Mail, Lock, KeyRound, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

const layoutTitle = 'Nueva contraseña';
const layoutDescription = 'Introduce tu nueva contraseña para continuar';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Restablecer contraseña" />

            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
            </div>

            <Form
                action={update.url()}
                method="post"
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold">Correo electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    className="pl-10 h-11 border-2 rounded-xl bg-muted/50"
                                    readOnly
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-semibold">Nueva contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    className="pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                                    autoFocus
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-semibold">Confirmar contraseña</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    className="pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20"
                                    placeholder="Repite tu contraseña"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full h-11 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? <Spinner /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                            Restablecer contraseña
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
