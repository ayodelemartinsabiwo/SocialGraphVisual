/**
 * useUpload Hook
 * @module hooks/useUpload
 *
 * Custom hook for file upload workflow management.
 * Handles file parsing, API upload, and progress tracking.
 */

import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { initiateUpload, createGraph, cancelUpload } from '../services/api';
import { graphKeys } from './useGraph';
import type { Platform, CreateGraphBody } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export type UploadStep = 'idle' | 'selecting' | 'parsing' | 'uploading' | 'processing' | 'complete' | 'error';

export interface UploadProgress {
  step: UploadStep;
  progress: number;
  message: string;
}

export interface UploadResult {
  graphId: string;
  nodeCount: number;
  edgeCount: number;
}

export interface ParsedGraphData {
  nodes: CreateGraphBody['nodes'];
  edges: CreateGraphBody['edges'];
  metadata: CreateGraphBody['metadata'];
}

// ============================================================
// HOOK
// ============================================================

export function useUpload() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const uploadIdRef = useRef<string | null>(null);
  const abortRef = useRef(false);

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setMessage('');
    setError(null);
    setResult(null);
    uploadIdRef.current = null;
    abortRef.current = false;
  }, []);

  /**
   * Cancel ongoing upload
   */
  const cancel = useCallback(async () => {
    abortRef.current = true;

    if (uploadIdRef.current) {
      try {
        await cancelUpload(uploadIdRef.current);
      } catch {
        // Ignore cancel errors
      }
    }

    reset();
  }, [reset]);

  /**
   * Update progress state
   */
  const updateProgress = useCallback((newStep: UploadStep, newProgress: number, newMessage: string) => {
    if (abortRef.current) return;
    setStep(newStep);
    setProgress(newProgress);
    setMessage(newMessage);
  }, []);

  /**
   * Process file upload workflow
   */
  const processUpload = useCallback(async (
    file: File,
    platform: Platform,
    parseFile: (file: File) => Promise<ParsedGraphData>
  ): Promise<UploadResult> => {
    try {
      abortRef.current = false;
      setError(null);

      // Step 1: Parse file
      updateProgress('parsing', 10, 'Parsing file...');

      const parsedData = await parseFile(file);

      if (abortRef.current) throw new Error('Upload cancelled');
      updateProgress('parsing', 30, `Found ${parsedData.nodes.length} connections`);

      // Step 2: Initiate upload
      updateProgress('uploading', 40, 'Initiating upload...');

      const { uploadId } = await initiateUpload(platform, file.name, file.size);
      uploadIdRef.current = uploadId;

      if (abortRef.current) throw new Error('Upload cancelled');
      updateProgress('uploading', 60, 'Preparing graph data...');

      // NOTE: Skip raw file upload - not implemented yet (cloud storage integration pending)
      // The parsed data is sent directly to createGraph instead

      // Step 3: Create graph
      updateProgress('processing', 70, 'Creating graph...');

      const graphData: CreateGraphBody = {
        uploadId,
        platform,
        nodes: parsedData.nodes,
        edges: parsedData.edges,
        metadata: parsedData.metadata,
      };

      const graphResponse = await createGraph(graphData);

      if (abortRef.current) throw new Error('Upload cancelled');
      updateProgress('processing', 90, 'Finalizing...');

      // Step 4: Complete
      updateProgress('complete', 100, 'Upload complete!');

      const uploadResult: UploadResult = {
        graphId: graphResponse.id,
        nodeCount: graphResponse.nodeCount,
        edgeCount: graphResponse.edgeCount,
      };

      setResult(uploadResult);

      // Invalidate graph list queries
      queryClient.invalidateQueries({ queryKey: graphKeys.lists() });

      return uploadResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setStep('error');
      throw err;
    }
  }, [updateProgress, queryClient]);

  /**
   * Upload mutation for simpler usage
   */
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      platform,
      parseFile,
    }: {
      file: File;
      platform: Platform;
      parseFile: (file: File) => Promise<ParsedGraphData>;
    }) => processUpload(file, platform, parseFile),
  });

  return {
    // State
    step,
    progress,
    message,
    error,
    result,
    isUploading: step !== 'idle' && step !== 'complete' && step !== 'error',
    isComplete: step === 'complete',
    isError: step === 'error',

    // Actions
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    cancel,
    reset,

    // Progress helper
    getProgress: (): UploadProgress => ({ step, progress, message }),
  };
}

/**
 * Hook for tracking multiple concurrent uploads
 */
export function useMultiUpload() {
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const queryClient = useQueryClient();

  const addUpload = useCallback((id: string) => {
    setUploads((prev) => {
      const next = new Map(prev);
      next.set(id, { step: 'idle', progress: 0, message: '' });
      return next;
    });
  }, []);

  const updateUpload = useCallback((id: string, progress: UploadProgress) => {
    setUploads((prev) => {
      const next = new Map(prev);
      next.set(id, progress);
      return next;
    });
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => {
      const next = new Map(prev);
      for (const [id, progress] of next) {
        if (progress.step === 'complete' || progress.step === 'error') {
          next.delete(id);
        }
      }
      return next;
    });
  }, []);

  return {
    uploads: Array.from(uploads.entries()),
    addUpload,
    updateUpload,
    removeUpload,
    clearCompleted,
    hasActiveUploads: Array.from(uploads.values()).some(
      (p) => p.step !== 'idle' && p.step !== 'complete' && p.step !== 'error'
    ),
  };
}

export default useUpload;
