
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, ExternalLink, Users, Activity, TrendingUp } from 'lucide-react';

interface NodeDetailsProps {
    nodeId: string | null;
    onClose: () => void;
    className?: string;
}

export function NodeDetails({ nodeId, onClose, className }: NodeDetailsProps) {
    if (!nodeId) return null;

    return (
        <div className={cn("absolute right-0 top-0 h-full w-80 bg-white dark:bg-vsg-neutral-900 border-l border-vsg-neutral-200 dark:border-vsg-neutral-800 shadow-xl transform transition-transform duration-300 ease-in-out z-10 flex flex-col", className)}>
            <div className="p-4 border-b border-vsg-neutral-200 dark:border-vsg-neutral-800 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Node Details</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-vsg-orange-100 flex items-center justify-center text-2xl font-bold text-vsg-primary">
                        {nodeId.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-bold text-xl">{nodeId}</h2>
                        <span className="text-sm text-vsg-neutral-500">@username</span>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Badge>Tech</Badge>
                    <Badge variant="secondary">Influencer</Badge>
                    <Badge variant="outline">High Centrality</Badge>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-vsg-neutral-500 uppercase tracking-wider">Metrics</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-vsg-neutral-50 dark:bg-vsg-neutral-800">
                            <div className="flex items-center gap-2 text-vsg-neutral-500 mb-1">
                                <Users className="h-4 w-4" />
                                <span className="text-xs">Degree</span>
                            </div>
                            <span className="text-xl font-bold">142</span>
                        </div>
                        <div className="p-3 rounded-lg bg-vsg-neutral-50 dark:bg-vsg-neutral-800">
                            <div className="flex items-center gap-2 text-vsg-neutral-500 mb-1">
                                <Activity className="h-4 w-4" />
                                <span className="text-xs">Betweenness</span>
                            </div>
                            <span className="text-xl font-bold">0.85</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg border border-vsg-neutral-200 dark:border-vsg-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-vsg-success" />
                            <span className="font-medium">Top Connector</span>
                        </div>
                        <p className="text-sm text-vsg-neutral-500">
                            This node bridges the <span className="font-semibold text-vsg-neutral-900 dark:text-vsg-neutral-100">Tech</span> and <span className="font-semibold text-vsg-neutral-900 dark:text-vsg-neutral-100">VC</span> communities.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button className="w-full">View Full Profile</Button>
                    <Button variant="outline" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open on Twitter
                    </Button>
                </div>
            </div>
        </div>
    );
}
