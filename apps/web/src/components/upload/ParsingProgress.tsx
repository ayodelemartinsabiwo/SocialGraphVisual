import { FileArchive, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ParsingProgressProps {
  progress: number;
  step: string;
  fileName: string;
}

/**
 * ParsingProgress Component
 *
 * Displays parsing progress with:
 * - Animated progress bar
 * - Current step indicator
 * - File name display
 * - Processing animation
 */
function ParsingProgress({ progress, step, fileName }: ParsingProgressProps) {
  return (
    <Card padding="lg">
      <CardContent className="py-8">
        {/* Processing animation */}
        <div className="w-24 h-24 mx-auto mb-8 relative">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-vsg-gray-200 dark:border-vsg-gray-700" />

          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-vsg-orange-500"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-vsg-orange-500 animate-spin" />
          </div>
        </div>

        {/* Progress percentage */}
        <div className="text-center mb-6">
          <p className="text-display font-bold text-vsg-gray-900 dark:text-white">
            {Math.round(progress)}%
          </p>
          <p className="text-body-lg text-vsg-orange-500 font-medium mt-2">
            {step}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="h-2 bg-vsg-gray-200 dark:bg-vsg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vsg-orange-500 to-vsg-orange-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* File info */}
        <div className="flex items-center justify-center gap-2 text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400">
          <FileArchive className="w-4 h-4" />
          <span className="truncate max-w-[200px]">{fileName}</span>
        </div>

        {/* Processing steps */}
        <div className="mt-8 max-w-sm mx-auto">
          <ProcessingSteps progress={progress} />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Processing steps indicator
 */
function ProcessingSteps({ progress }: { progress: number }) {
  const steps = [
    { label: 'Extract archive', threshold: 0 },
    { label: 'Detect format', threshold: 15 },
    { label: 'Parse connections', threshold: 30 },
    { label: 'Build graph', threshold: 50 },
    { label: 'Find communities', threshold: 65 },
    { label: 'Calculate scores', threshold: 80 },
    { label: 'Generate insights', threshold: 95 },
  ];

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const isComplete = progress > step.threshold + 10;
        const isActive = progress >= step.threshold && progress <= step.threshold + 15;

        return (
          <div
            key={step.label}
            className={cn(
              'flex items-center gap-3 text-body-sm transition-all duration-300',
              isComplete && 'text-vsg-success-500',
              isActive && 'text-vsg-orange-500 font-medium',
              !isComplete && !isActive && 'text-vsg-gray-400'
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                isComplete && 'bg-vsg-success-500',
                isActive && 'bg-vsg-orange-500 scale-150',
                !isComplete && !isActive && 'bg-vsg-gray-300 dark:bg-vsg-gray-700'
              )}
            />
            <span>{step.label}</span>
            {isActive && (
              <Loader2 className="w-3 h-3 animate-spin ml-auto" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ParsingProgress;
