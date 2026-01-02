
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Bell, Sun, Moon } from 'lucide-react';

export function Header({ className, isDark, toggleTheme }: { className?: string; isDark?: boolean; toggleTheme?: () => void }) {
    return (
        <header className={cn("h-16 border-b border-vsg-neutral-200 bg-white dark:border-vsg-neutral-800 dark:bg-vsg-neutral-900 flex items-center justify-between px-6", className)}>
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-vsg-neutral-900 dark:text-vsg-neutral-50">
                    My Network Graph
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-vsg-neutral-100 text-xs font-medium text-vsg-neutral-600 dark:bg-vsg-neutral-800 dark:text-vsg-neutral-400">
                    Last updated: Just now
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-vsg-neutral-500" />
                </Button>
                <div className="h-8 w-px bg-vsg-neutral-200 dark:bg-vsg-neutral-700 mx-2" />
                <Button variant="ghost" className="gap-2 pl-2 pr-4">
                    <div className="h-8 w-8 rounded-full bg-vsg-orange-100 flex items-center justify-center text-vsg-primary font-medium">
                        AM
                    </div>
                    <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">Ayodele Martins</span>
                        <span className="text-xs text-vsg-neutral-500">Pro Plan</span>
                    </div>
                </Button>
            </div>
        </header>
    );
}
