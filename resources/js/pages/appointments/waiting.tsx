import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import type { Auth } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Appointment {
    id: number;
    status: string;
    patient_id: number;
    professional_id: number;
    patient_joined_at: string | null;
    professional_joined_at: string | null;
    meeting_room_id: string | null;
    patient: User | null;
    professional: User | null;
}

interface Props {
    appointment: Appointment;
}

const initials = (name: string | undefined) =>
    (name ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase();

export default function AppointmentWaiting({ appointment }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const viewerIsProfessional = auth.user.id === appointment.professional_id;
    const other = viewerIsProfessional ? appointment.patient : appointment.professional;
    const message = viewerIsProfessional ? 'Esperando al paciente' : 'Esperando al profesional';
    const bothPresent = !!appointment.patient_joined_at && !!appointment.professional_joined_at;

    useEffect(() => {
        const id = setInterval(() => {
            router.reload({ only: ['appointment'], preserveUrl: true, preserveScroll: true });
        }, 4000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (bothPresent && appointment.meeting_room_id) {
            window.location.href = `/call/${appointment.meeting_room_id}`;
        }
    }, [bothPresent, appointment.meeting_room_id]);

    return (
        <>
            <Head title="Sala de espera" />

            <div className="flex flex-1 items-center justify-center p-8 min-h-[70vh]">
                <div className="flex flex-col items-center gap-6 text-center max-w-md">
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-24 w-24 rounded-full bg-[var(--color-primary)] opacity-20 animate-ping" />
                        <div className="relative w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                            <span className="text-2xl font-semibold text-white">
                                {initials(other?.name)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-display-xl text-[var(--color-text)]">{message}</h1>
                        <p className="mt-2 text-body-md text-[var(--color-text-secondary)]">
                            La sesión comenzará automáticamente cuando ambos estéis presentes.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5" aria-hidden="true">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse [animation-delay:200ms]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse [animation-delay:400ms]" />
                    </div>

                    <Link href={AppointmentShowAction.url(appointment.id)}>
                        <Button variant="secondary" size="sm">
                            Cancelar
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

AppointmentWaiting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
