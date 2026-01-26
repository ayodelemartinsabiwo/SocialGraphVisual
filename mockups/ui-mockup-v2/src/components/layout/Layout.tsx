import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
    isDark?: boolean;
    toggleTheme?: () => void;
}

export function Layout({ children, isDark, toggleTheme }: LayoutProps) {
    return (
        <div className="flex h-screen bg-vsg-neutral-50 dark:bg-vsg-neutral-950 overflow-hidden transition-colors">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 flex flex-col min-w-0">
                <Header isDark={isDark} toggleTheme={toggleTheme} />
                <main className="flex-1 overflow-auto p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
