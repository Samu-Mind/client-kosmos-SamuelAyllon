import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const layoutTitle = 'Welcome back.';
const layoutDescription = 'Step into your focused workspace.';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="flex items-center gap-3 rounded-xl border-2 border-green-500/20 bg-green-500/10 px-4 py-3 mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">{status}</span>
                </div>
            )}

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@ejemplo.com"
                                    className="h-11 rounded-xl border-2 transition-all focus:ring-2 focus:ring-primary/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-muted-foreground hover:text-foreground"
                                            tabIndex={5}
                                        >
                                            Forgot?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••••"
                                    className="h-11 rounded-xl border-2 transition-all focus:ring-2 focus:ring-primary/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor="remember" className="cursor-pointer text-sm text-muted-foreground">
                                    Keep my session active
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full rounded-xl text-sm font-semibold"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? <Spinner /> : 'Sign in'}
                            </Button>
                        </div>

                        {canRegister && (
                            <p className="text-center text-sm text-muted-foreground">
                                No tienes cuenta?{' '}
                                <TextLink href={register()} tabIndex={5} className="font-semibold text-foreground hover:underline">
                                    Regístrate aquí
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = (page: ReactNode) => (
    <AuthSplitLayout title={layoutTitle} description={layoutDescription}>{page}</AuthSplitLayout>
);
