import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';

const layoutTitle = 'Código de autenticación';
const layoutDescription = 'Introduce el código de 6 dígitos de tu aplicación de autenticación.';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
        icon: typeof ShieldCheck;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Código de recuperación',
                description:
                    'Introduce uno de tus códigos de recuperación de emergencia para acceder a tu cuenta.',
                toggleText: 'usar código de autenticación',
                icon: KeyRound,
            };
        }

        return {
            title: 'Código de autenticación',
            description:
                'Introduce el código de 6 dígitos de tu aplicación de autenticación.',
            toggleText: 'usar código de recuperación',
            icon: ShieldCheck,
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    const IconComponent = authConfigContent.icon;

    return (
        <>
            <Head title="Autenticación en dos pasos" />

            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary" />
                </div>
            </div>

            <div className="space-y-6">
                <Form
                    action={store.url()}
                    method="post"
                    className="space-y-5"
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }) => (
                        <>
                            {showRecoveryInput ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            name="recovery_code"
                                            type="text"
                                            placeholder="XXXX-XXXX-XXXX"
                                            autoFocus={showRecoveryInput}
                                            required
                                            className="pl-10 h-11 border-2 rounded-xl transition-all focus:ring-2 focus:ring-primary/20 font-mono text-center tracking-wider"
                                        />
                                    </div>
                                    <InputError message={errors.recovery_code} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                    <div className="flex w-full items-center justify-center">
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(value) => setCode(value)}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="h-12 w-12 border-2 rounded-xl text-lg font-semibold"
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <ArrowRight className="h-4 w-4 mr-2" />}
                                Continuar
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                <span>O puedes </span>
                                <button
                                    type="button"
                                    className="cursor-pointer text-primary font-semibold underline underline-offset-4 transition-colors duration-300 ease-out hover:text-primary/80"
                                    onClick={() =>
                                        toggleRecoveryMode(clearErrors)
                                    }
                                >
                                    {authConfigContent.toggleText}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

TwoFactorChallenge.layout = (page: ReactNode) => (
    <AuthLayout title={layoutTitle} description={layoutDescription}>{page}</AuthLayout>
);
