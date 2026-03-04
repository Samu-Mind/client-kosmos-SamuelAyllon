// Components
import { Form, Head } from '@inertiajs/react';
import { Mail, CheckCircle2, LogOut, MailCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verifica tu email"
            description="Por favor verifica tu dirección de correo electrónico haciendo clic en el enlace que te enviamos."
        >
            <Head title="Verificar email" />

            {status === 'verification-link-sent' && (
                <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Se ha enviado un nuevo enlace de verificación a tu email.
                    </span>
                </div>
            )}

            <div className="flex flex-col items-center gap-4 py-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MailCheck className="h-8 w-8 text-primary" />
                </div>
            </div>

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="outline"
                            className="w-full h-11 text-base font-semibold rounded-xl border-2 transition-all hover:bg-primary/5"
                        >
                            {processing ? <Spinner /> : <Mail className="h-4 w-4 mr-2" />}
                            Reenviar email de verificación
                        </Button>

                        <TextLink
                            href={logout()}
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
