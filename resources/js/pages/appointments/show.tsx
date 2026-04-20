import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, FileText, Folder, MessageSquare, Paperclip, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import JoinWaitingRoomAction from '@/actions/App/Http/Controllers/Appointment/JoinWaitingRoomAction';
import DashboardIndexAction from '@/actions/App/Http/Controllers/Dashboard/IndexAction';
import PatientShowAction from '@/actions/App/Http/Controllers/Patient/ShowAction';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
}

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
}

interface Agreement {
    id: number;
    content: string;
    is_completed: boolean;
    created_at: string;
}

interface Document {
    id: number;
    name: string;
    storage_type: string | null;
    gdrive_file_id: string | null;
    gdrive_url: string | null;
    mime_type: string | null;
    size_bytes: number | null;
    category: string | null;
}

interface PatientProfile {
    id: number;
    diagnosis: string | null;
    clinical_notes: string | null;
    documents: Document[];
}

interface ClinicalNote {
    id: number;
    content: string;
    type: string;
    created_at: string;
}

interface Appointment {
    id: number;
    starts_at: string;
    ends_at: string | null;
    status: string;
    patient: (User & { patient_profile: PatientProfile | null }) | null;
    professional: User | null;
    service: Service | null;
    agreements: Agreement[];
}

interface Props {
    appointment: Appointment;
    lastClinicalNote: ClinicalNote | null;
}

const formatTime = (dt: string) =>
    new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(dt));

const formatSyncedAt = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `Sincronizado hoy ${hh}:${mm}`;
};

const formatRelativeDate = (dt: string) => {
    const now = new Date();
    const then = new Date(dt);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    return `hace ${diffDays} días`;
};

const formatFileSize = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

const extFromMime = (mime: string | null) => {
    if (!mime) return 'Archivo';
    if (mime.includes('pdf')) return 'PDF';
    if (mime.includes('word') || mime.includes('document')) return 'DOCX';
    if (mime.includes('sheet') || mime.includes('excel')) return 'XLSX';
    if (mime.startsWith('image/')) return 'Imagen';
    if (mime.startsWith('audio/')) return 'Audio';
    if (mime.startsWith('video/')) return 'Vídeo';
    return 'Archivo';
};

const resourceMeta = (doc: Document): { Icon: typeof Paperclip; subtitle: string } => {
    if (doc.gdrive_file_id || doc.storage_type === 'gdrive') {
        return { Icon: Folder, subtitle: 'Directorio Compartido' };
    }
    if (doc.storage_type === 'local') {
        const size = formatFileSize(doc.size_bytes);
        return { Icon: Paperclip, subtitle: size ? `${extFromMime(doc.mime_type)} · ${size}` : extFromMime(doc.mime_type) };
    }
    return { Icon: BookOpen, subtitle: 'Recursos Externos' };
};

export default function AppointmentShow({ appointment, lastClinicalNote }: Props) {
    const patient = appointment.patient;
    const profile = patient?.patient_profile ?? null;
    const resources = profile?.documents ?? [];

    return (
        <>
            <Head title={`Sesión — ${patient?.name ?? 'Paciente'}`} />

            <div className="flex flex-col gap-6 p-6 lg:p-8">
                <div>
                    <Link
                        href={DashboardIndexAction.url()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-3"
                    >
                        <ArrowLeft size={14} />
                        Volver al dashboard
                    </Link>
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h1 className="text-display-2xl text-[var(--color-text)]">
                            {patient?.name ?? 'Paciente'}
                        </h1>
                        <p className="text-body-md text-[var(--color-text-secondary)] tabular-nums">
                            {formatTime(appointment.starts_at)}
                            {appointment.ends_at && ` — ${formatTime(appointment.ends_at)}`}
                        </p>
                    </div>
                    <div className="mt-4 border-b border-[var(--color-border-subtle)]" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="lg:col-span-2 rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] bg-[var(--color-surface-alt)]">
                        <header className="flex items-center justify-between px-5 py-3 bg-[var(--color-primary)] text-white">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} />
                                <span className="text-caption">Resumen clínico automático</span>
                            </div>
                            <span className="text-[10px] opacity-80">{formatSyncedAt()}</span>
                        </header>

                        <div className="px-6 py-5 flex flex-col gap-6">
                            <div>
                                <h2 className="text-caption text-[var(--color-text-muted)] mb-2">Diagnóstico</h2>
                                <p className="text-body-md italic text-[var(--color-text)] leading-relaxed">
                                    {profile?.diagnosis?.trim()
                                        ? profile.diagnosis
                                        : 'Sin diagnóstico registrado.'}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-caption text-[var(--color-text-muted)] mb-3">Acuerdos establecidos</h2>
                                {appointment.agreements.length === 0 ? (
                                    <p className="text-sm italic text-[var(--color-text-secondary)]">
                                        Sin acuerdos registrados.
                                    </p>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {appointment.agreements.map((a) => (
                                            <li key={a.id} className="flex items-start gap-3">
                                                <span className="mt-[7px] w-2 h-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                                <span className={`text-body-md text-[var(--color-text)] ${a.is_completed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                                                    {a.content}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <div className="flex items-baseline justify-between mb-2">
                                    <h2 className="text-caption text-[var(--color-text-muted)]">Última nota clínica</h2>
                                    {lastClinicalNote && (
                                        <span className="text-[10px] text-[var(--color-text-muted)]">
                                            {formatRelativeDate(lastClinicalNote.created_at)}
                                        </span>
                                    )}
                                </div>
                                {lastClinicalNote ? (
                                    <>
                                        <p className="text-body-md italic text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                                            {lastClinicalNote.content}
                                        </p>
                                        {patient && (
                                            <Link
                                                href={PatientShowAction.url(patient.id)}
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                                            >
                                                Ver historial completo
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm italic text-[var(--color-text-secondary)]">
                                        Sin notas clínicas registradas.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="flex flex-col gap-4">
                        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-sm)]">
                            <header className="px-4 py-3 bg-[var(--color-surface-alt)] border-b border-[var(--color-border-subtle)]">
                                <span className="text-caption text-[var(--color-text-muted)]">Recursos del cliente</span>
                            </header>
                            {resources.length === 0 ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Sin recursos"
                                    description="Aún no has añadido recursos para este paciente."
                                />
                            ) : (
                                <ul className="max-h-[360px] overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
                                    {resources.map((doc) => {
                                        const { Icon, subtitle } = resourceMeta(doc);
                                        return (
                                            <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
                                                <Icon size={16} className="shrink-0 text-[var(--color-text-secondary)]" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                                                        {subtitle}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            {appointment.service?.duration_minutes && (
                                <p className="text-caption text-[var(--color-text-muted)] tabular-nums">
                                    Duración: {appointment.service.duration_minutes} min
                                </p>
                            )}
                            <Form
                                action={JoinWaitingRoomAction.url(appointment.id)}
                                method="post"
                                className="w-full"
                            >
                                <Button type="submit" variant="primary" size="lg" className="w-full">
                                    <Play size={16} className="fill-current" />
                                    Iniciar sesión
                                </Button>
                            </Form>
                            <p className="text-xs text-center text-[var(--color-text-muted)]">
                                Kosmo comenzará a transcribir y analizar una vez inicies la sesión.
                            </p>
                        </div>
                    </aside>
                </div>

                <div className="text-center text-[10px] text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border-subtle)]">
                    Kosmo IA puede cometer errores
                </div>
            </div>
        </>
    );
}

AppointmentShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
