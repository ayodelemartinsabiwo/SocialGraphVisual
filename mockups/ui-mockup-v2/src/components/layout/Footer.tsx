import { cn } from '../../lib/utils';

export function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("py-12 border-t border-vsg-neutral-200 dark:border-vsg-neutral-800 bg-white dark:bg-vsg-neutral-950 transition-colors", className)}>
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-vsg-primary rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            VSG
                        </div>
                        <span className="font-bold text-sm tracking-tight text-vsg-neutral-900 dark:text-white">SocialGraphVisual</span>
                    </div>
                    <p className="text-xs text-vsg-neutral-500">
                        © {new Date().getFullYear()} Open Source Project.
                    </p>
                </div>

                <div className="flex items-center gap-8 text-sm font-medium text-vsg-neutral-600 dark:text-vsg-neutral-400">
                    <a href="#" className="hover:text-vsg-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-vsg-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-vsg-primary transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
