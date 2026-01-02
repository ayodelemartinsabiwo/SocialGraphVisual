
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Search, Settings, HelpCircle, LogOut, Network, Share2, Download } from 'lucide-react';

export function Sidebar({ className }: { className?: string }) {
    return (
        <div className={cn("w-64 border-r border-vsg-neutral-200 bg-white dark:border-vsg-neutral-800 dark:bg-vsg-neutral-900 flex flex-col h-screen", className)}>
            <div className="p-6 border-b border-vsg-neutral-200 dark:border-vsg-neutral-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-vsg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    VSG
                </div>
                <span className="font-bold text-lg tracking-tight">SocialGraph</span>
            </div>

            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-vsg-neutral-500" />
                    <Input placeholder="Search nodes..." className="pl-9" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                <div>
                    <h4 className="px-3 text-xs font-semibold text-vsg-neutral-500 uppercase tracking-wider mb-2">
                        Filters
                    </h4>
                    <div className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-vsg-neutral-900 dark:text-vsg-neutral-100 flex items-center justify-between cursor-pointer hover:bg-vsg-neutral-50 dark:hover:bg-vsg-neutral-800 rounded-md transition-colors">
                            <span>Communities</span>
                            <Badge variant="secondary">8</Badge>
                        </div>
                        <div className="px-3 py-2">
                            <div className="space-y-2">
                                {['Tech', 'Design', 'Marketing', 'Crypto', 'VC', 'Media'].map((label, i) => (
                                    <label key={label} className="flex items-center gap-3 text-sm text-vsg-neutral-600 dark:text-vsg-neutral-400 cursor-pointer hover:text-vsg-neutral-900 dark:hover:text-vsg-neutral-200 group transition-colors">
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                            i < 3 ? "bg-vsg-primary border-vsg-primary text-white" : "border-vsg-neutral-300 dark:border-vsg-neutral-600 group-hover:border-vsg-primary"
                                        )}>
                                            {i < 3 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        </div>
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="px-3 text-xs font-semibold text-vsg-neutral-500 uppercase tracking-wider mb-2">
                        Metrics
                    </h4>
                    <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                            <Network className="mr-2 h-4 w-4" />
                            Centrality
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                            <Share2 className="mr-2 h-4 w-4" />
                            PageRank
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-vsg-neutral-200 dark:border-vsg-neutral-800 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export Graph
                </Button>
                <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-vsg-error hover:text-vsg-error hover:bg-red-50">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
