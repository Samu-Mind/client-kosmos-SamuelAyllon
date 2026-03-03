import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type TutorialStep = {
    id: number;
    botMessage: string;
    highlight?: string;
    icon: string;
};

const tutorialSteps: TutorialStep[] = [
    {
        id: 1,
        botMessage: '¡Hola! Soy Flowy, tu asistente personal. Te voy a enseñar cómo usar Flowly para organizar tu productividad. ¿Empezamos?',
        icon: '👋',
    },
    {
        id: 2,
        botMessage: 'En el Dashboard puedes ver un resumen de tu actividad: tareas pendientes, ideas activas y proyectos. ¡Es tu centro de control!',
        highlight: 'Dashboard',
        icon: '📊',
    },
    {
        id: 3,
        botMessage: 'Las Tareas te ayudan a gestionar lo que necesitas hacer. Puedes crear tareas con prioridad alta, media o baja, y marcarlas como completadas.',
        highlight: 'Tareas',
        icon: '✅',
    },
    {
        id: 4,
        botMessage: 'Las Ideas son perfectas para capturar inspiración al vuelo. No las pierdas, guárdalas aquí y desarróllalas cuando estés listo.',
        highlight: 'Ideas',
        icon: '💡',
    },
    {
        id: 5,
        botMessage: 'Con Premium puedes crear Proyectos para organizar trabajos más grandes, usar Cajas para agrupar recursos, ¡y hasta dictar con tu voz!',
        highlight: 'Premium',
        icon: '✨',
    },
    {
        id: 6,
        botMessage: '¡Eso es todo! Ya conoces lo básico de Flowly. Si tienes dudas, revisa cada sección. ¡Buena suerte con tu productividad!',
        icon: '🎉',
    },
];

type TutorialChatbotProps = {
    show: boolean;
    onComplete: () => void;
};

export default function TutorialChatbot({ show, onComplete }: TutorialChatbotProps) {
    const [isOpen, setIsOpen] = useState(show);
    const [currentStep, setCurrentStep] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [displayedMessage, setDisplayedMessage] = useState('');

    const step = tutorialSteps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === tutorialSteps.length - 1;

    // Efecto de escritura del bot
    useEffect(() => {
        if (!isOpen) return;

        setIsTyping(true);
        setDisplayedMessage('');

        const message = step.botMessage;
        let index = 0;

        const typingInterval = setInterval(() => {
            if (index < message.length) {
                setDisplayedMessage(message.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, 25);

        return () => clearInterval(typingInterval);
    }, [currentStep, isOpen, step.botMessage]);

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        setIsOpen(false);
        router.post('/tutorial/complete', {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onComplete(),
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleSkip();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{step.icon}</span>
                        <span>Tutorial de Flowly</span>
                    </DialogTitle>
                    <DialogDescription>
                        Paso {currentStep + 1} de {tutorialSteps.length}
                    </DialogDescription>
                </DialogHeader>

                <Card className="bg-muted/50 border-0">
                    <CardContent className="pt-4">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                F
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Flowy</p>
                                <p className="text-sm leading-relaxed">
                                    {displayedMessage}
                                    {isTyping && <span className="animate-pulse">|</span>}
                                </p>
                                {step.highlight && !isTyping && (
                                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        {step.highlight}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5">
                    {tutorialSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${
                                index === currentStep
                                    ? 'bg-primary'
                                    : index < currentStep
                                    ? 'bg-primary/50'
                                    : 'bg-muted-foreground/30'
                            }`}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSkip}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Saltar tutorial
                    </Button>

                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevious}
                                disabled={isTyping}
                            >
                                Anterior
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleNext}
                            disabled={isTyping}
                        >
                            {isLastStep ? '¡Empezar!' : 'Siguiente'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
