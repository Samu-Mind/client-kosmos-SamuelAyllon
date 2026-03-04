import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, Archive, FileText, Tag, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Cajas', href: '/boxes' },
    { title: 'Nueva caja', href: '#' },
];

export default function BoxCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/boxes');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva caja" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                            <Archive className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Nueva caja</h1>
                            <p className="text-sm text-muted-foreground">Organiza tus recursos en cajas temáticas</p>
                        </div>
                    </div>
                    <Link href="/boxes">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                {/* Form Card */}
                <Card className="max-w-2xl shadow-sm">
                    <CardHeader className="border-b bg-muted/30 pb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <CardTitle className="text-base font-semibold">Datos de la caja</CardTitle>
                        </div>
                        <CardDescription>
                            Crea una caja para agrupar recursos relacionados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Nombre <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ej: Recursos de diseño, Tutoriales..."
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    Categoría
                                </Label>
                                <Input
                                    id="category"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    placeholder="Ej: Programación, Diseño, Marketing..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Opcional. Ayuda a clasificar tus cajas por temática.
                                </p>
                                {errors.category && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    Descripción
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Describe el propósito de esta caja..."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex items-center gap-3 border-t pt-6">
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creando...
                                        </span>
                                    ) : (
                                        'Crear caja'
                                    )}
                                </Button>
                                <Link href="/boxes">
                                    <Button type="button" variant="ghost">
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
