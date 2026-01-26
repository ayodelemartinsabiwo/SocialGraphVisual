import { useState, useCallback, useRef } from 'react';
import { Upload, FileArchive, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { type Platform, platformConfig } from './UploadPage';

interface UploadZoneProps {
  platform: Platform;
  onUpload: (file: File) => void;
}

/**
 * File validation
 */
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ['application/zip', 'application/x-zip-compressed'];

/**
 * UploadZone Component
 *
 * Drag-and-drop file upload zone with:
 * - File type validation (ZIP only)
 * - File size validation
 * - Visual feedback for drag states
 * - Click to browse fallback
 */
function UploadZone({ platform, onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = platformConfig[platform];

  /**
   * Validate file
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.zip') && !ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a ZIP file. Only ZIP archives are supported.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }
    return null;
  }, []);

  /**
   * Handle file selection
   */
  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  }, [validateFile]);

  /**
   * Handle drag events
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  /**
   * Handle file input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  /**
   * Handle browse click
   */
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle upload confirmation
   */
  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  /**
   * Handle file removal
   */
  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload file"
      />

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!selectedFile ? handleBrowseClick : undefined}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-all duration-normal',
          'min-h-[300px] flex flex-col items-center justify-center p-8',
          !selectedFile && 'cursor-pointer',
          isDragging && 'border-vsg-orange-500 bg-vsg-orange-50 dark:bg-vsg-orange-500/10',
          !isDragging && !error && 'border-vsg-gray-300 dark:border-vsg-gray-700 hover:border-vsg-orange-400 dark:hover:border-vsg-orange-500',
          error && 'border-vsg-error-500 bg-vsg-error-50 dark:bg-vsg-error-500/10'
        )}
      >
        {/* Dragging overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-vsg-orange-500/10 rounded-lg">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto text-vsg-orange-500 mb-4" />
              <p className="text-h4 font-semibold text-vsg-orange-600 dark:text-vsg-orange-400">
                Drop your file here
              </p>
            </div>
          </div>
        )}

        {/* No file selected */}
        {!selectedFile && !isDragging && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-xl bg-vsg-gray-100 dark:bg-vsg-gray-800 flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-vsg-gray-400" />
            </div>
            <h3 className="text-h4 font-semibold text-vsg-gray-900 dark:text-white mb-2">
              Drop your {config.name} export here
            </h3>
            <p className="text-body text-vsg-gray-500 dark:text-vsg-gray-400 mb-4">
              or click to browse your files
            </p>
            <p className="text-body-sm text-vsg-gray-400">
              ZIP files only, up to 500MB
            </p>
          </div>
        )}

        {/* File selected */}
        {selectedFile && !isDragging && (
          <div className="text-center w-full max-w-md">
            <div className="w-20 h-20 mx-auto rounded-xl bg-vsg-success-100 dark:bg-vsg-success-500/20 flex items-center justify-center mb-6">
              <FileArchive className="w-10 h-10 text-vsg-success-500" />
            </div>

            {/* File info card */}
            <div className="bg-white dark:bg-vsg-gray-900 rounded-lg border border-vsg-gray-200 dark:border-vsg-gray-800 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <FileArchive className="w-8 h-8 text-vsg-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-body font-medium text-vsg-gray-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-body-sm text-vsg-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-2 hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800 rounded-md transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-vsg-gray-500" />
                </button>
              </div>
            </div>

            {/* Upload button */}
            <Button size="lg" onClick={handleUpload} className="w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                <span>Start Analysis</span>
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-vsg-error-50 dark:bg-vsg-error-500/10 border border-vsg-error-200 dark:border-vsg-error-500/30">
          <AlertCircle className="w-5 h-5 text-vsg-error-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body font-medium text-vsg-error-700 dark:text-vsg-error-400">
              Invalid file
            </p>
            <p className="text-body-sm text-vsg-error-600 dark:text-vsg-error-300">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="text-center">
        <p className="text-caption text-vsg-gray-500 dark:text-vsg-gray-400">
          Your data is processed locally in your browser. We never upload or store your raw social media data.
        </p>
      </div>
    </div>
  );
}

export default UploadZone;
