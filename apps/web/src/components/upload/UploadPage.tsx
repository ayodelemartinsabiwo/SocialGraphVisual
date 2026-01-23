import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import UploadZone from './UploadZone';
import PlatformSelector from './PlatformSelector';
import ParsingProgress from './ParsingProgress';

/**
 * Upload page state machine
 */
type UploadState = 'select-platform' | 'upload' | 'parsing' | 'complete' | 'error';

/**
 * Supported platforms
 */
export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok';

/**
 * Platform configuration
 */
export const platformConfig: Record<Platform, {
  name: string;
  color: string;
  bgColor: string;
  instructions: string[];
  exportUrl: string;
}> = {
  twitter: {
    name: 'Twitter/X',
    color: 'text-black dark:text-white',
    bgColor: 'bg-black dark:bg-white dark:text-black',
    instructions: [
      'Go to Settings > Your Account > Download an archive of your data',
      'Request your archive and wait for the email',
      'Download the ZIP file when ready',
      'Upload the complete ZIP file here',
    ],
    exportUrl: 'https://twitter.com/settings/download_your_data',
  },
  instagram: {
    name: 'Instagram',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-purple-600 to-pink-500',
    instructions: [
      'Go to Settings > Privacy and Security > Download Data',
      'Request download in JSON format',
      'Wait for email with download link',
      'Upload the complete ZIP file here',
    ],
    exportUrl: 'https://www.instagram.com/download/request/',
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'text-[#0077B5]',
    bgColor: 'bg-[#0077B5]',
    instructions: [
      'Go to Settings > Data Privacy > Get a copy of your data',
      'Select the data you want to download',
      'Request archive and wait for email',
      'Upload the complete ZIP file here',
    ],
    exportUrl: 'https://www.linkedin.com/mypreferences/d/download-my-data',
  },
  facebook: {
    name: 'Facebook',
    color: 'text-[#1877F2]',
    bgColor: 'bg-[#1877F2]',
    instructions: [
      'Go to Settings > Your Facebook Information > Download Your Information',
      'Select JSON format for your data',
      'Create file and wait for download',
      'Upload the complete ZIP file here',
    ],
    exportUrl: 'https://www.facebook.com/dyi/',
  },
  tiktok: {
    name: 'TikTok',
    color: 'text-black dark:text-white',
    bgColor: 'bg-black dark:bg-white dark:text-black',
    instructions: [
      'Go to Profile > Menu > Settings and Privacy > Privacy',
      'Tap Download your data > Request data',
      'Select JSON file format',
      'Upload the complete ZIP file here',
    ],
    exportUrl: 'https://www.tiktok.com/setting/download-your-data',
  },
};

/**
 * UploadPage Component
 *
 * Multi-step upload flow:
 * 1. Select platform
 * 2. Upload ZIP file
 * 3. Parse data (with progress)
 * 4. Complete / Error
 */
function UploadPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>('select-platform');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStep, setParseStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle platform selection
   */
  const handlePlatformSelect = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
    setState('upload');
  }, []);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file);
    setState('parsing');
    setError(null);

    try {
      // Simulate parsing progress (will be replaced with actual Web Worker)
      const steps = [
        'Extracting archive...',
        'Detecting platform format...',
        'Parsing connections...',
        'Building graph structure...',
        'Computing communities...',
        'Calculating influence scores...',
        'Generating insights...',
      ];

      for (let i = 0; i < steps.length; i++) {
        setParseStep(steps[i]);
        setParseProgress(((i + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setState('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during parsing');
      setState('error');
    }
  }, []);

  /**
   * Handle navigation to graph
   */
  const handleViewGraph = useCallback(() => {
    navigate('/graph');
  }, [navigate]);

  /**
   * Handle retry
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setUploadedFile(null);
    setState('upload');
  }, []);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    if (state === 'upload') {
      setState('select-platform');
      setSelectedPlatform(null);
    } else if (state === 'error') {
      setState('upload');
      setError(null);
    }
  }, [state]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
          Upload Your Data
        </h1>
        <p className="mt-2 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400">
          {state === 'select-platform' && 'Select the platform to analyze'}
          {state === 'upload' && selectedPlatform && `Upload your ${platformConfig[selectedPlatform].name} data export`}
          {state === 'parsing' && 'Processing your data...'}
          {state === 'complete' && 'Your network is ready!'}
          {state === 'error' && 'Something went wrong'}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {['Select Platform', 'Upload File', 'Process', 'Done'].map((step, index) => {
            const stepStates: UploadState[] = ['select-platform', 'upload', 'parsing', 'complete'];
            const currentIndex = stepStates.indexOf(state);
            const isComplete = index < currentIndex || state === 'complete';
            const isCurrent = stepStates[index] === state || (state === 'error' && index === 2);

            return (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-medium transition-colors',
                      isComplete && 'bg-vsg-success-500 text-white',
                      isCurrent && !isComplete && 'bg-vsg-orange-500 text-white',
                      !isComplete && !isCurrent && 'bg-vsg-gray-200 dark:bg-vsg-gray-800 text-vsg-gray-500'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-body-sm hidden sm:block',
                      (isComplete || isCurrent) ? 'text-vsg-gray-900 dark:text-white font-medium' : 'text-vsg-gray-500'
                    )}
                  >
                    {step}
                  </span>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-vsg-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Platform Selection */}
        {state === 'select-platform' && (
          <PlatformSelector onSelect={handlePlatformSelect} />
        )}

        {/* File Upload */}
        {state === 'upload' && selectedPlatform && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UploadZone
                platform={selectedPlatform}
                onUpload={handleFileUpload}
              />
            </div>

            {/* Instructions sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-vsg-orange-500" />
                  How to Export
                </CardTitle>
                <CardDescription>
                  Follow these steps to get your data from {platformConfig[selectedPlatform].name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {platformConfig[selectedPlatform].instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-body-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vsg-orange-100 dark:bg-vsg-orange-500/20 text-vsg-orange-600 dark:text-vsg-orange-400 flex items-center justify-center text-caption font-medium">
                        {index + 1}
                      </span>
                      <span className="text-vsg-gray-700 dark:text-vsg-gray-300">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>

                <a
                  href={platformConfig[selectedPlatform].exportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-body-sm text-vsg-orange-500 hover:text-vsg-orange-600 font-medium"
                >
                  Open {platformConfig[selectedPlatform].name} export page
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Button
                  variant="ghost"
                  className="mt-4 w-full"
                  onClick={handleBack}
                >
                  Choose different platform
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Parsing Progress */}
        {state === 'parsing' && (
          <div className="max-w-2xl mx-auto">
            <ParsingProgress
              progress={parseProgress}
              step={parseStep}
              fileName={uploadedFile?.name || ''}
            />
          </div>
        )}

        {/* Complete */}
        {state === 'complete' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card padding="lg">
              <CardContent className="py-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-vsg-success-100 dark:bg-vsg-success-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-vsg-success-500" />
                </div>
                <h2 className="text-h3 font-bold text-vsg-gray-900 dark:text-white mb-2">
                  Analysis Complete!
                </h2>
                <p className="text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 mb-8">
                  Your network graph is ready. Explore your connections, communities, and insights.
                </p>

                {/* Stats preview */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-vsg-gray-50 dark:bg-vsg-gray-800 rounded-lg">
                  <div>
                    <p className="text-h3 font-bold text-vsg-orange-500">247</p>
                    <p className="text-caption text-vsg-gray-500">Connections</p>
                  </div>
                  <div>
                    <p className="text-h3 font-bold text-vsg-community-blue">5</p>
                    <p className="text-caption text-vsg-gray-500">Communities</p>
                  </div>
                  <div>
                    <p className="text-h3 font-bold text-vsg-community-purple">12</p>
                    <p className="text-caption text-vsg-gray-500">Bridges</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleViewGraph}>
                    View Network Graph
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/insights')}>
                    See Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card padding="lg">
              <CardContent className="py-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-vsg-error-100 dark:bg-vsg-error-500/20 flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-vsg-error-500" />
                </div>
                <h2 className="text-h3 font-bold text-vsg-gray-900 dark:text-white mb-2">
                  Upload Failed
                </h2>
                <p className="text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 mb-4">
                  {error || 'We couldn\'t process your data export. Please try again.'}
                </p>
                <p className="text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400 mb-8">
                  Make sure you're uploading the complete, unmodified ZIP file from your platform's data export.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={handleRetry}>
                    Try Again
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleBack}>
                    Choose Different Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
