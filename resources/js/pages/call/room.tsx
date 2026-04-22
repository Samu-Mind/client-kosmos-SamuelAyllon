import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import type { IJitsiMeetExternalApi } from '@jitsi/react-sdk/lib/types';
import type { ReactNode } from 'react';
import { LiveTranscriptPanel } from '@/components/live-transcript-panel';
import { useAudioChunks } from '@/hooks/use-audio-chunks';
import type { Auth } from '@/types';

interface AppointmentUser {
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
    starts_at: string;
    ends_at: string;
    meeting_room_id: string;
    patient: AppointmentUser;
    professional: AppointmentUser;
}

interface Props {
    appointment: Appointment;
    jitsiDomain: string;
    jitsiRoomName: string;
    recordingConsentGiven: boolean;
    exitUrl: string;
}

function LoadingScreen() {
    return (
        <Flex h="100vh" w="100%" alignItems="center" justifyContent="center" bg="black" direction="column" gap="4">
            <Spinner size="xl" color="white" />
            <Text color="whiteAlpha.700" fontSize="sm">
                Conectando a la videoconsulta...
            </Text>
        </Flex>
    );
}

export default function CallRoom({ appointment, jitsiDomain, jitsiRoomName, recordingConsentGiven, exitUrl }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isProfessional = auth.user.id === appointment.professional_id;
    const isPatient = auth.user.id === appointment.patient_id;

    const audioCaptureEnabled = isProfessional || (isPatient && recordingConsentGiven);

    useAudioChunks({
        appointmentId: appointment.id,
        enabled: audioCaptureEnabled,
    });

    const handleApiReady = (api: IJitsiMeetExternalApi) => {
        api.addEventListener('readyToClose', () => {
            if (isProfessional) {
                router.post(
                    `/appointments/${appointment.id}/end-call`,
                    {},
                    {
                        onFinish: () => {
                            window.location.href = exitUrl;
                        },
                    },
                );
            } else {
                window.location.href = exitUrl;
            }
        });
    };

    return (
        <>
            <Head title="Videoconsulta" />

            <Flex h="100vh" w="100vw" overflow="hidden" bg="black" direction={{ base: 'column', lg: 'row' }}>
                <Box flex="1" minH="0">
                    <JitsiMeeting
                        domain={jitsiDomain}
                        roomName={jitsiRoomName}
                        configOverwrite={{
                            startWithAudioMuted: false,
                            startWithVideoMuted: false,
                            disableModeratorIndicator: true,
                            enableWelcomePage: false,
                            prejoinPageEnabled: false,
                            enableEmailInRegistration: false,
                            disableDeepLinking: true,
                            toolbarButtons: [
                                'microphone',
                                'camera',
                                'desktop',
                                'chat',
                                'hangup',
                                'tileview',
                            ],
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            SHOW_JITSI_WATERMARK: false,
                            SHOW_WATERMARK_FOR_GUESTS: false,
                            MOBILE_APP_PROMO: false,
                        }}
                        userInfo={{
                            displayName: auth.user.name,
                            email: auth.user.email,
                        }}
                        spinner={LoadingScreen}
                        onApiReady={handleApiReady}
                        getIFrameRef={(node) => {
                            node.style.height = '100%';
                            node.style.width = '100%';
                            node.style.border = 'none';
                        }}
                    />
                </Box>

                {isProfessional && (
                    <LiveTranscriptPanel
                        appointmentId={appointment.id}
                        professionalId={appointment.professional_id}
                        patientId={appointment.patient_id}
                    />
                )}
            </Flex>
        </>
    );
}

CallRoom.layout = (page: ReactNode) => <>{page}</>;
