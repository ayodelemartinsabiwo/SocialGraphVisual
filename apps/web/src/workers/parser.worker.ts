/**
 * Parser Web Worker
 * @module workers/parser.worker
 *
 * Web Worker for parsing social media data exports.
 * Handles ZIP extraction and platform-specific parsing in a background thread.
 */

import JSZip from 'jszip';
import type { Platform } from '@vsg/shared';
import { getParser } from './parsers';
import type {
  WorkerMessage,
  ParseStartPayload,
  ParseProgressPayload,
  ParseCompletePayload,
  ParseErrorPayload,
  ParsingProgress,
  ParsedResult,
} from './parsers/types';

// ============================================================
// WORKER CONTEXT
// ============================================================

const ctx: Worker = self as unknown as Worker;

// ============================================================
// MESSAGE HANDLER
// ============================================================

ctx.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'PARSE_START':
      await handleParseStart(payload as ParseStartPayload);
      break;

    case 'CANCEL':
      // Worker will be terminated by main thread
      break;

    default:
      sendError(`Unknown message type: ${type}`);
  }
};

// ============================================================
// PARSE HANDLER
// ============================================================

/**
 * Handle parse start message
 */
async function handleParseStart(payload: ParseStartPayload): Promise<void> {
  const { platform, fileData, fileName } = payload;

  try {
    // Phase 1: Extract ZIP
    sendProgress({
      phase: 'extracting',
      current: 0,
      total: 100,
      percentage: 5,
      message: 'Extracting ZIP archive...',
    });

    const files = await extractZip(fileData, (progress) => {
      sendProgress({
        phase: 'extracting',
        current: progress,
        total: 100,
        percentage: Math.min(15, 5 + progress * 0.1),
        message: `Extracting files... ${progress}%`,
      });
    });

    if (files.size === 0) {
      throw new Error('ZIP archive is empty or invalid');
    }

    // Phase 2: Get platform parser
    sendProgress({
      phase: 'validating',
      current: 0,
      total: 100,
      percentage: 18,
      message: 'Validating platform data...',
    });

    const parser = getParser(platform);

    // Phase 3: Validate files
    const validation = parser.validateFiles(files);

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Log warnings
    if (validation.warnings.length > 0) {
      console.warn('Parser warnings:', validation.warnings);
    }

    // Phase 4: Parse data
    const result = await parser.parse(files, (progress) => {
      // Adjust percentage to fit in remaining range (20-100)
      const adjustedPercentage = 20 + (progress.percentage * 0.8);
      sendProgress({
        ...progress,
        percentage: adjustedPercentage,
      });
    });

    // Phase 5: Send result
    sendComplete(result);
  } catch (error) {
    sendError((error as Error).message || 'Unknown parsing error');
  }
}

// ============================================================
// ZIP EXTRACTION
// ============================================================

/**
 * Extract files from ZIP archive
 */
async function extractZip(
  data: ArrayBuffer,
  onProgress: (progress: number) => void
): Promise<Map<string, ArrayBuffer>> {
  const zip = await JSZip.loadAsync(data);
  const files = new Map<string, ArrayBuffer>();

  const fileNames = Object.keys(zip.files).filter(
    (name) => !zip.files[name].dir
  );

  let processed = 0;
  const total = fileNames.length;

  for (const fileName of fileNames) {
    const file = zip.files[fileName];

    // Skip directories and hidden files
    if (file.dir || fileName.startsWith('.') || fileName.startsWith('__MACOSX')) {
      processed++;
      continue;
    }

    try {
      const content = await file.async('arraybuffer');
      files.set(fileName, content);
    } catch (error) {
      console.warn(`Failed to extract ${fileName}:`, error);
    }

    processed++;
    onProgress(Math.round((processed / total) * 100));
  }

  return files;
}

// ============================================================
// MESSAGE SENDERS
// ============================================================

/**
 * Send progress update to main thread
 */
function sendProgress(progress: ParsingProgress): void {
  const message: WorkerMessage = {
    type: 'PARSE_PROGRESS',
    payload: { progress } as ParseProgressPayload,
  };
  ctx.postMessage(message);
}

/**
 * Send completion message to main thread
 */
function sendComplete(result: ParsedResult): void {
  const message: WorkerMessage = {
    type: 'PARSE_COMPLETE',
    payload: { result } as ParseCompletePayload,
  };
  ctx.postMessage(message);
}

/**
 * Send error message to main thread
 */
function sendError(error: string, details?: unknown): void {
  const message: WorkerMessage = {
    type: 'PARSE_ERROR',
    payload: { error, details } as ParseErrorPayload,
  };
  ctx.postMessage(message);
}

// ============================================================
// WORKER INITIALIZATION
// ============================================================

// Signal that worker is ready
ctx.postMessage({ type: 'WORKER_READY' });
