import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string; description: string }[] = [
        { value: 'light', icon: Sun, label: 'Claro', description: 'Tema luminoso' },
        { value: 'dark', icon: Moon, label: 'Oscuro', description: 'Tema oscuro' },
        { value: 'system', icon: Monitor, label: 'Sistema', description: 'Según tu dispositivo' },
    ];

    return (
        <div
            className={cn(
                'grid grid-cols-3 gap-3',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label, description }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-muted/50',
                        appearance === value
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-transparent bg-muted/30 hover:border-muted-foreground/20',
                    )}
                >
                    <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                        appearance === value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                        <span className={cn(
                            'block text-sm font-medium',
                            appearance === value ? 'text-primary' : ''
                        )}>{label}</span>
                        <span className="block text-xs text-muted-foreground">{description}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}
