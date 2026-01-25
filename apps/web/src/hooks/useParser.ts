/**
 * useParser Hook
 * @module hooks/useParser
 *
 * Hook for parsing social media data exports using Web Worker.
 */

import { useCallback, useRef, useState } from 'react';
import type { Platform } from '@vsg/shared';
import type {
  WorkerMessage,
  ParseStartPayload,
  ParseProgressPayload,
  ParseCompletePayload,
  ParseErrorPayload,
  ParsingProgress,
  ParsedResult,
} from '../workers/parsers/types';
import type { ParsedGraphData } from './useUpload';

// ============================================================
// TYPES
// ============================================================

export interface ParserState {
  isReady: boolean;
  isLoading: boolean;
  progress: ParsingProgress | null;
  error: string | null;
}

// ============================================================
// HOOK
// ============================================================

export function useParser() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<ParserState>({
    isReady: false,
    isLoading: false,
    progress: null,
    error: null,
  });

  /**
   * Create a new Web Worker instance
   */
  const createWorker = useCallback((): Worker => {
    // Terminate existing worker if any
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Create new worker using Vite's worker syntax
    const worker = new Worker(
      new URL('../workers/parser.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current = worker;
    return worker;
  }, []);

  /**
   * Parse a file using the Web Worker
   */
  const parseFile = useCallback(
    async (file: File, platform: Platform): Promise<ParsedGraphData> => {
      return new Promise((resolve, reject) => {
        const worker = createWorker();

        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          progress: null,
        }));

        // Handle worker messages
        worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
          const { type, payload } = event.data;

          switch (type) {
            case 'WORKER_READY':
              // Worker is ready, send parse request
              file.arrayBuffer().then((fileData) => {
                const startPayload: ParseStartPayload = {
                  platform,
                  fileData,
                  fileName: file.name,
                };
                worker.postMessage({ type: 'PARSE_START', payload: startPayload });
              });
              break;

            case 'PARSE_PROGRESS':
              const progressPayload = payload as ParseProgressPayload;
              setState((prev) => ({
                ...prev,
                progress: progressPayload.progress,
              }));
              break;

            case 'PARSE_COMPLETE':
              const completePayload = payload as ParseCompletePayload;
              setState((prev) => ({
                ...prev,
                isLoading: false,
                progress: null,
              }));

              // Convert ParsedResult to ParsedGraphData
              // Convert Date objects to ISO strings for API compatibility
              const timePeriod = completePayload.result.metadata.timePeriod
                ? {
                    start: completePayload.result.metadata.timePeriod.start instanceof Date
                      ? completePayload.result.metadata.timePeriod.start.toISOString()
                      : String(completePayload.result.metadata.timePeriod.start),
                    end: completePayload.result.metadata.timePeriod.end instanceof Date
                      ? completePayload.result.metadata.timePeriod.end.toISOString()
                      : String(completePayload.result.metadata.timePeriod.end),
                  }
                : undefined;

              // Map nodes and edges to CreateGraphBody format
              const nodes = completePayload.result.nodes.map((node) => ({
                id: node.id,
                type: node.type as 'SELF' | 'USER',
                displayName: node.displayName,
                username: node.username,
                followerCount: node.followerCount,
                followingCount: node.followingCount,
                engagementScore: node.engagementScore,
              }));

              const edges = completePayload.result.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type as 'FOLLOWS' | 'FOLLOWED_BY' | 'MUTUAL' | 'ENGAGES_WITH',
                weight: edge.weight,
                interactions: edge.interactions,
              }));

              const result: ParsedGraphData = {
                nodes,
                edges,
                metadata: {
                  parseVersion: completePayload.result.metadata.parseVersion,
                  parsingErrors: completePayload.result.metadata.parsingErrors.map((e) => ({
                    code: e.code,
                    message: e.message,
                    recoverable: e.recoverable,
                  })),
                  sourceFileInfo: completePayload.result.metadata.sourceFileInfo,
                  timePeriod,
                },
              };

              worker.terminate();
              workerRef.current = null;
              resolve(result);
              break;

            case 'PARSE_ERROR':
              const errorPayload = payload as ParseErrorPayload;
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorPayload.error,
                progress: null,
              }));

              worker.terminate();
              workerRef.current = null;
              reject(new Error(errorPayload.error));
              break;
          }
        };

        // Handle worker errors
        worker.onerror = (error) => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error.message || 'Worker error',
            progress: null,
          }));

          worker.terminate();
          workerRef.current = null;
          reject(new Error(error.message || 'Worker error'));
        };
      });
    },
    [createWorker]
  );

  /**
   * Cancel ongoing parsing
   */
  const cancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'CANCEL' });
      workerRef.current.terminate();
      workerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      progress: null,
    }));
  }, []);

  /**
   * Reset parser state
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      isReady: false,
      isLoading: false,
      progress: null,
      error: null,
    });
  }, [cancel]);

  return {
    ...state,
    parseFile,
    cancel,
    reset,
  };
}

export default useParser;
