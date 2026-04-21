import { Badge, Box, Flex, Grid, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CalendarDays, CheckCircle, Receipt } from 'lucide-react';
import type { ReactNode } from 'react';
import AppointmentShowAction from '@/actions/App/Http/Controllers/Appointment/ShowAction';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Auth } from '@/types';

const ChakraLink = chakra(Link);

interface UpcomingAppointment {
    id: number;
    scheduled_at: string;
    modality: string;
    status: string;
    professional: {
        id: number;
        name: string;
        specialty: string | null;
        avatar_path: string | null;
    };
    service_name: string | null;
}

interface RecentInvoice {
    id: number;
    amount: number;
    status: string;
    due_at: string | null;
    created_at: string | null;
}

interface PatientStats {
    upcoming_appointments: number;
    completed_sessions: number;
    pending_invoices: number;
}

interface Props {
    upcomingAppointments: UpcomingAppointment[];
    recentInvoices: RecentInvoice[];
    stats: PatientStats;
}

const greeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
};

const formatDate = (): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

const formatDateTime = (dt: string): string =>
    new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dt));

const getModalityLabel = (modality: string): string => {
    const map: Record<string, string> = {
        in_person: 'Presencial',
        video_call: 'Videollamada',
        online: 'Online',
        telefono: 'Teléfono',
    };
    return map[modality?.toLowerCase()] ?? modality ?? 'Presencial';
};

const isOnlineModality = (modality: string): boolean =>
    ['video_call', 'online', 'telefono'].includes(modality?.toLowerCase());

const invoiceStatusLabel: Record<string, string> = {
    draft: 'Borrador',
    sent: 'Pendiente',
    paid: 'Pagada',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
};

const invoiceStatusColorPalette: Record<string, string> = {
    paid: 'green',
    overdue: 'red',
    sent: 'orange',
    draft: 'gray',
    cancelled: 'gray',
};

const getInitials = (name: string): string =>
    name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

export default function PatientDashboard({ upcomingAppointments, recentInvoices, stats }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const nextAppointment = upcomingAppointments[0] ?? null;

    return (
        <>
            <Head title="Inicio — ClientKosmos" />

            <Stack gap="6" p={{ base: '6', lg: '8' }}>

                <Box>
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        {greeting()}, {auth.user.name.split(' ')[0]}
                    </Heading>
                    <Text mt="0.5" fontSize="md" color="fg.muted" textTransform="capitalize">
                        {formatDate()}
                    </Text>
                </Box>

                <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap="4">
                    <Flex
                        borderRadius="lg"
                        bg="brand.solid"
                        p="5"
                        alignItems="center"
                        justifyContent="space-between"
                        boxShadow="sm"
                    >
                        <Box>
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="white/70">
                                Próximas citas
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color="white" mt="1" lineHeight="none">
                                {stats.upcoming_appointments.toString().padStart(2, '0')}
                            </Text>
                        </Box>
                        <Flex borderRadius="md" bg="white/15" p="2.5">
                            <Box as={CalendarDays} w="22px" h="22px" color="white" />
                        </Flex>
                    </Flex>

                    <Flex
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="5"
                        alignItems="center"
                        justifyContent="space-between"
                        boxShadow="sm"
                    >
                        <Box>
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                                Sesiones completadas
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color="fg" mt="1" lineHeight="none">
                                {stats.completed_sessions.toString().padStart(2, '0')}
                            </Text>
                        </Box>
                        <Flex borderRadius="md" bg="bg.subtle" p="2.5">
                            <Box as={CheckCircle} w="22px" h="22px" color="fg.muted" />
                        </Flex>
                    </Flex>

                    <Flex
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        bg="bg.surface"
                        p="5"
                        alignItems="center"
                        justifyContent="space-between"
                        boxShadow="sm"
                    >
                        <Box>
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                                Facturas pendientes
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color="fg" mt="1" lineHeight="none">
                                {Number(stats.pending_invoices).toLocaleString('es-ES', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })} €
                            </Text>
                        </Box>
                        <Flex borderRadius="md" bg="bg.subtle" p="2.5">
                            <Box as={Receipt} w="22px" h="22px" color="fg.muted" />
                        </Flex>
                    </Flex>
                </Grid>

                <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap="6">

                    <Box gridColumn={{ lg: 'span 2' }}>
                        <Flex alignItems="center" justifyContent="space-between" mb="4">
                            <Heading as="h2" fontSize="xl" fontWeight="semibold" color="fg">
                                Próximas citas
                            </Heading>
                            <ChakraLink
                                href="/appointments"
                                fontSize="sm"
                                fontWeight="medium"
                                color="brand.solid"
                                _hover={{ textDecoration: 'underline' }}
                                display="flex"
                                alignItems="center"
                                gap="1"
                            >
                                Ver todas <Box as={ArrowRight} w="3.5" h="3.5" />
                            </ChakraLink>
                        </Flex>

                        {upcomingAppointments.length === 0 ? (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="10"
                                textAlign="center"
                            >
                                <Box as={CalendarDays} w="8" h="8" mx="auto" mb="3" color="fg.subtle" />
                                <Text fontSize="sm" color="fg.muted">
                                    No tienes citas próximas programadas.
                                </Text>
                            </Box>
                        ) : (
                            <Stack gap="3">
                                {upcomingAppointments.map((appointment, index) => {
                                    const isNext = index === 0;
                                    const isOnline = isOnlineModality(appointment.modality);

                                    return (
                                        <Flex
                                            key={appointment.id}
                                            alignItems="center"
                                            gap="4"
                                            borderRadius="lg"
                                            borderWidth="1px"
                                            borderColor={isNext ? 'brand.solid' : 'border'}
                                            bg="bg.surface"
                                            p="4"
                                            boxShadow={isNext ? 'sm' : undefined}
                                            _hover={isNext ? undefined : { boxShadow: 'sm' }}
                                            transition="box-shadow 0.2s"
                                        >
                                            <Flex
                                                w="10"
                                                h="10"
                                                borderRadius="full"
                                                bg="brand.subtle"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                color="brand.solid"
                                            >
                                                {getInitials(appointment.professional.name)}
                                            </Flex>

                                            <Box flex="1" minW={0}>
                                                <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
                                                    {appointment.professional.name}
                                                </Text>
                                                <Text fontSize="xs" color="fg.muted" mt="0.5">
                                                    {appointment.professional.specialty
                                                        ? `${appointment.professional.specialty} • `
                                                        : ''}
                                                    {formatDateTime(appointment.scheduled_at)}
                                                </Text>
                                                <Flex flexWrap="wrap" gap="1.5" mt="2">
                                                    <Badge
                                                        variant="subtle"
                                                        colorPalette={isOnline ? 'gray' : 'green'}
                                                        borderRadius="full"
                                                        px="2"
                                                        py="0.5"
                                                        fontSize="2xs"
                                                        fontWeight="semibold"
                                                        textTransform="uppercase"
                                                        letterSpacing="wider"
                                                    >
                                                        {getModalityLabel(appointment.modality)}
                                                    </Badge>
                                                    {appointment.service_name && (
                                                        <Badge
                                                            variant="subtle"
                                                            colorPalette="gray"
                                                            borderRadius="full"
                                                            px="2"
                                                            py="0.5"
                                                            fontSize="2xs"
                                                            fontWeight="semibold"
                                                            textTransform="uppercase"
                                                            letterSpacing="wider"
                                                        >
                                                            {appointment.service_name}
                                                        </Badge>
                                                    )}
                                                </Flex>
                                            </Box>

                                            {isNext && (
                                                <Button asChild variant="primary" size="sm" flexShrink={0}>
                                                    <ChakraLink href={AppointmentShowAction.url(appointment.id)}>
                                                        Ver cita
                                                    </ChakraLink>
                                                </Button>
                                            )}
                                        </Flex>
                                    );
                                })}
                            </Stack>
                        )}
                    </Box>

                    <Stack gap="4">
                        {recentInvoices.length > 0 && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                overflow="hidden"
                                boxShadow="sm"
                            >
                                <Box px="4" py="3" borderBottomWidth="1px" borderColor="border">
                                    <Text
                                        fontSize="xs"
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        color="fg.muted"
                                    >
                                        Facturas recientes
                                    </Text>
                                </Box>
                                {recentInvoices.map((invoice, index) => (
                                    <Flex
                                        key={invoice.id}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        px="4"
                                        py="3"
                                        borderTopWidth={index > 0 ? '1px' : undefined}
                                        borderColor="border"
                                    >
                                        <Box minW={0}>
                                            <Text fontSize="sm" fontWeight="medium" color="fg">
                                                {Number(invoice.amount).toLocaleString('es-ES', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })} €
                                            </Text>
                                            {invoice.due_at && (
                                                <Text fontSize="xs" color="fg.subtle" mt="0.5">
                                                    Vence: {invoice.due_at}
                                                </Text>
                                            )}
                                        </Box>
                                        <Badge
                                            variant="subtle"
                                            colorPalette={invoiceStatusColorPalette[invoice.status] ?? 'gray'}
                                            borderRadius="full"
                                            px="2"
                                            py="0.5"
                                            fontSize="2xs"
                                            fontWeight="semibold"
                                            textTransform="uppercase"
                                            letterSpacing="wider"
                                        >
                                            {invoiceStatusLabel[invoice.status] ?? invoice.status}
                                        </Badge>
                                    </Flex>
                                ))}
                                <Box px="4" py="2.5" borderTopWidth="1px" borderColor="border">
                                    <ChakraLink
                                        href="/invoices"
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color="brand.solid"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        Ver todas las facturas
                                    </ChakraLink>
                                </Box>
                            </Box>
                        )}

                        {nextAppointment && (
                            <Box
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor="border"
                                bg="bg.surface"
                                p="5"
                                boxShadow="sm"
                            >
                                <Text
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    color="fg.muted"
                                    mb="3"
                                >
                                    Tu próxima cita
                                </Text>
                                <Text fontSize="sm" fontWeight="semibold" color="fg">
                                    {nextAppointment.professional.name}
                                </Text>
                                {nextAppointment.professional.specialty && (
                                    <Text fontSize="xs" color="fg.muted" mt="0.5">
                                        {nextAppointment.professional.specialty}
                                    </Text>
                                )}
                                <Text fontSize="xs" color="fg.subtle" mt="2" textTransform="capitalize">
                                    {formatDateTime(nextAppointment.scheduled_at)}
                                </Text>
                                <ChakraLink
                                    href={AppointmentShowAction.url(nextAppointment.id)}
                                    mt="3"
                                    display="flex"
                                    alignItems="center"
                                    gap="1"
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color="brand.solid"
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    Ver detalles <Box as={ArrowRight} w="3" h="3" />
                                </ChakraLink>
                            </Box>
                        )}
                    </Stack>

                </Grid>
            </Stack>
        </>
    );
}

PatientDashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
