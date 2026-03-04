import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Table2, LayoutGrid, Package, Plus, CheckCircle2, Archive, Files, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Box, SimpleViewType } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cajas', href: '/boxes' },
];

function deleteBox(box: Box) {
    if (confirm(`¿Eliminar "${box.name}"? Se eliminarán también sus recursos.`)) {
        router.delete(`/boxes/${box.id}`);
    }
}

// ── Vista tabla ─────────────────────────────────────────────────────────────

function TableView({ boxes }: { boxes: Box[] }) {
    if (boxes.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Archive className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay cajas con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border-2 bg-card/50">
            <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b">
                    <tr>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Nombre</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground sm:table-cell">Categoría</th>
                        <th className="hidden p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground md:table-cell">Descripción</th>
                        <th className="p-4 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Recursos</th>
                        <th className="p-4 text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {boxes.map(box => (
                        <tr key={box.id} className="group transition-all hover:bg-primary/5">
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                                        <Package className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <span className="font-medium">{box.name}</span>
                                </div>
                            </td>
                            <td className="hidden p-4 sm:table-cell">
                                {box.category ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                        <Tag className="h-3 w-3" />
                                        {box.category}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                            </td>
                            <td className="hidden p-4 text-muted-foreground md:table-cell">
                                <span className="line-clamp-1">{box.description ?? '—'}</span>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center gap-1.5 text-sm">
                                    <Files className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="font-semibold">{box.resources_count ?? 0}</span>
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/boxes/${box.id}`}>
                                        <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg border-2">Ver</Button>
                                    </Link>
                                    <Link href={`/boxes/${box.id}/edit`}>
                                        <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" title="Eliminar" onClick={() => deleteBox(box)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Vista galería ───────────────────────────────────────────────────────────

function GalleryView({ boxes }: { boxes: Box[] }) {
    if (boxes.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Archive className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No hay cajas con el filtro actual.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boxes.map(box => (
                <Card key={box.id} className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
                    <CardHeader className="pb-2 pl-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Package className="h-5 w-5 text-teal-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="truncate text-base font-semibold">{box.name}</CardTitle>
                                {box.category && (
                                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                                        <Tag className="h-3 w-3" />
                                        {box.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pl-5">
                        {box.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{box.description}</p>
                        )}
                        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Files className="h-3.5 w-3.5" />
                            <span className="font-semibold text-foreground">{box.resources_count ?? 0}</span> recurso{(box.resources_count ?? 0) !== 1 ? 's' : ''}
                        </p>
                        <div className="mt-auto flex gap-2 pt-2">
                            <Link href={`/boxes/${box.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full border-2 rounded-lg">Ver</Button>
                            </Link>
                            <Link href={`/boxes/${box.id}/edit`}>
                                <Button size="sm" variant="ghost" title="Editar" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar" onClick={() => deleteBox(box)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ── Página principal ────────────────────────────────────────────────────────

export default function BoxesIndex({ boxes }: { boxes: Box[] }) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [view, setView] = useState<SimpleViewType>('gallery');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const categories = [...new Set(boxes.map(b => b.category).filter((c): c is string => c !== null && c !== ''))];
    const filtered = boxes.filter(b => categoryFilter === 'all' || b.category === categoryFilter);

    const viewButtons: Array<{ value: SimpleViewType; icon: React.ReactNode; title: string }> = [
        { value: 'table',   icon: <Table2 className="h-4 w-4" />,    title: 'Vista tabla' },
        { value: 'gallery', icon: <LayoutGrid className="h-4 w-4" />, title: 'Vista galería' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cajas" />

            <div className="flex flex-col gap-6 p-6">

                {/* Cabecera mejorada */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-background to-primary/5 border-2 p-6">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
                                <Archive className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Mis cajas</h1>
                                <p className="text-sm text-muted-foreground">{boxes.length} caja{boxes.length !== 1 ? 's' : ''} de conocimiento</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-xl border-2 p-1 gap-1 bg-background/50">
                                {viewButtons.map(({ value, icon, title }) => (
                                    <Button key={value} size="sm" variant={view === value ? 'default' : 'ghost'}
                                        className={`h-8 w-8 p-0 rounded-lg transition-all ${view === value ? 'shadow-sm' : ''}`} onClick={() => setView(value)} title={title}>
                                        {icon}
                                    </Button>
                                ))}
                            </div>
                            <Link href="/boxes/create">
                                <Button className="gap-2 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4" />
                                    Nueva caja
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filtros por categoría mejorados */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant={categoryFilter === 'all' ? 'default' : 'outline'}
                            className={`h-8 px-4 text-xs rounded-lg font-semibold border-2 transition-all ${categoryFilter === 'all' ? 'shadow-sm' : ''}`} onClick={() => setCategoryFilter('all')}>
                            Todas
                        </Button>
                        {categories.map(cat => (
                            <Button key={cat} size="sm" variant={categoryFilter === cat ? 'default' : 'outline'}
                                className={`h-8 px-4 text-xs rounded-lg font-semibold border-2 transition-all ${categoryFilter === cat ? 'shadow-sm' : ''}`} onClick={() => setCategoryFilter(cat)}>
                                {cat}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Flash mejorado */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border-2 border-green-500/20 px-4 py-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">{flash.success}</span>
                    </div>
                )}

                {/* Sin cajas */}
                {boxes.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                            <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                                <Archive className="h-8 w-8 text-teal-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">No tienes cajas todavía</p>
                                <p className="text-sm text-muted-foreground">Las cajas te permiten organizar recursos como enlaces, documentos y videos</p>
                            </div>
                            <Link href="/boxes/create">
                                <Button className="gap-2 shadow-lg shadow-primary/25">
                                    <Plus className="h-4 w-4" />
                                    Crear primera caja
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {boxes.length > 0 && filtered.length === 0 && (
                    <Card className="border-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                <Archive className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-center">No hay cajas en la categoría "{categoryFilter}".</p>
                        </CardContent>
                    </Card>
                )}

                {/* Vistas */}
                {filtered.length > 0 && view === 'table'   && <TableView   boxes={filtered} />}
                {filtered.length > 0 && view === 'gallery' && <GalleryView boxes={filtered} />}
            </div>
        </AppLayout>
    );
}
