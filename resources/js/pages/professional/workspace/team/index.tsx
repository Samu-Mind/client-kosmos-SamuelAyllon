import { Avatar, Badge, Box, Flex, Heading, Stack, Table, Text } from '@chakra-ui/react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import type { ReactNode } from 'react';
import InviteAction from '@/actions/App/Http/Controllers/Workspace/Team/InviteAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

interface Member {
    id: number;
    name: string;
    email: string;
    avatar_path: string | null;
    pivot: {
        role: string;
        joined_at: string | null;
        is_active: boolean;
    };
}

interface Workspace {
    id: number;
    name: string;
}

interface Props {
    workspace: Workspace;
    members: Member[];
}

const roleLabel: Record<string, string> = {
    owner: 'Propietario',
    admin: 'Administrador',
    member: 'Miembro',
};

export default function TeamIndex({ workspace, members }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({ email: '' });

    function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        post(InviteAction.url(), { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title={`Equipo — ${workspace.name}`} />

            <Stack gap="8" p={{ base: '6', lg: '8' }}>
                <Flex alignItems="center" justifyContent="space-between">
                    <Heading as="h1" fontSize="3xl" fontWeight="bold" color="fg">
                        Equipo
                    </Heading>
                </Flex>

                <Box as="form" onSubmit={handleInvite}>
                    <Stack gap="3">
                        <Text fontWeight="medium" color="fg">
                            Invitar miembro
                        </Text>
                        <Flex gap="3" alignItems="flex-start">
                            <Stack gap="1" flex="1">
                                <Input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <Text fontSize="sm" color="red.500">
                                        {errors.email}
                                    </Text>
                                )}
                            </Stack>
                            <Button type="submit" variant="primary" loading={processing}>
                                <Box as={UserPlus} w="4" h="4" mr="2" />
                                Invitar
                            </Button>
                        </Flex>
                    </Stack>
                </Box>

                <Table.Root variant="outline" size="md">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Miembro</Table.ColumnHeader>
                            <Table.ColumnHeader>Rol</Table.ColumnHeader>
                            <Table.ColumnHeader>Estado</Table.ColumnHeader>
                            <Table.ColumnHeader>Se unió</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {members.map((member) => (
                            <Table.Row key={member.id}>
                                <Table.Cell>
                                    <Flex alignItems="center" gap="3">
                                        <Avatar.Root size="sm">
                                            {member.avatar_path ? (
                                                <Avatar.Image src={member.avatar_path} alt={member.name} />
                                            ) : (
                                                <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
                                            )}
                                        </Avatar.Root>
                                        <Stack gap="0">
                                            <Text fontWeight="medium" color="fg">
                                                {member.name}
                                            </Text>
                                            <Text fontSize="sm" color="fg.muted">
                                                {member.email}
                                            </Text>
                                        </Stack>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="fg">{roleLabel[member.pivot.role] ?? member.pivot.role}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Badge colorPalette={member.pivot.is_active ? 'green' : 'gray'}>
                                        {member.pivot.is_active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="fg.muted" fontSize="sm">
                                        {member.pivot.joined_at
                                            ? new Date(member.pivot.joined_at).toLocaleDateString('es-ES')
                                            : '—'}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Stack>
        </>
    );
}

TeamIndex.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
