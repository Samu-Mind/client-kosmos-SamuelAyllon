import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between bg-[#111b12] p-10 text-white lg:flex">
                <Link href={home()} className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold tracking-[0.25em] uppercase text-white">ClientKosmos</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Therapeutic Harmony</span>
                </Link>

                <div className="space-y-5">
                    <h2 className="text-[2.6rem] font-bold leading-[1.15] text-white">
                        A digital sanctuary for your{' '}
                        <span className="text-emerald-400">clinical mastery.</span>
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-white/50">
                        Transition from the noise of administration to the clarity of therapy.
                        Designed for practitioners who value deep focus and human connection.
                    </p>
                </div>

                <div />
            </div>

            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
