/**
 * Upload Store
 * @module stores/uploadStore
 *
 * Zustand store for upload and parsing state management.
 * Handles file uploads, parsing progress, and validation.
 */

import { create } from 'zustand';
import type {
  Platform,
  GraphNode,
  GraphEdge,
  ParsingError,
  UploadStatus,
} from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export type UploadStep = 'select-platform' | 'upload-file' | 'parsing' | 'review' | 'complete';

export type ParsingPhase =
  | 'extracting'
  | 'validating'
  | 'parsing-followers'
  | 'parsing-following'
  | 'parsing-interactions'
  | 'building-graph'
  | 'pseudonymizing'
  | 'calculating-weights'
  | 'finalizing';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ParsingProgress {
  phase: ParsingPhase;
  current: number;
  total: number;
  percentage: number;
  message: string;
}

export interface ParsedData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    parseVersion: string;
    parsingErrors: ParsingError[];
    timePeriod?: {
      start: Date;
      end: Date;
    };
    sourceFileInfo: {
      fileName: string;
      fileSize: number;
      checksum: string;
    };
  };
}

export interface UploadValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface UploadState {
  // Current step
  currentStep: UploadStep;

  // Platform selection
  selectedPlatform: Platform | null;

  // File state
  file: File | null;
  fileInfo: FileInfo | null;
  validation: UploadValidation | null;

  // Upload progress
  uploadId: string | null;
  uploadProgress: number;
  uploadStatus: UploadStatus | null;

  // Parsing state
  isParsing: boolean;
  parsingProgress: ParsingProgress | null;
  parsingError: string | null;

  // Parsed result
  parsedData: ParsedData | null;

  // Worker reference
  worker: Worker | null;

  // Actions - Navigation
  setStep: (step: UploadStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  // Actions - Platform
  selectPlatform: (platform: Platform) => void;

  // Actions - File
  setFile: (file: File | null) => void;
  setValidation: (validation: UploadValidation | null) => void;
  clearFile: () => void;

  // Actions - Upload
  setUploadId: (id: string | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: UploadStatus | null) => void;

  // Actions - Parsing
  startParsing: () => void;
  updateParsingProgress: (progress: ParsingProgress) => void;
  setParsingError: (error: string | null) => void;
  setParsedData: (data: ParsedData | null) => void;
  cancelParsing: () => void;

  // Actions - Worker
  setWorker: (worker: Worker | null) => void;
  terminateWorker: () => void;
}

// ============================================================
// STEP ORDER
// ============================================================

const STEP_ORDER: UploadStep[] = [
  'select-platform',
  'upload-file',
  'parsing',
  'review',
  'complete',
];

// ============================================================
// STORE
// ============================================================

export const useUploadStore = create<UploadState>((set, get) => ({
  // Initial state
  currentStep: 'select-platform',
  selectedPlatform: null,
  file: null,
  fileInfo: null,
  validation: null,
  uploadId: null,
  uploadProgress: 0,
  uploadStatus: null,
  isParsing: false,
  parsingProgress: null,
  parsingError: null,
  parsedData: null,
  worker: null,

  // Navigation actions
  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: STEP_ORDER[currentIndex - 1] });
    }
  },

  reset: () => {
    const { worker } = get();
    if (worker) {
      worker.terminate();
    }
    set({
      currentStep: 'select-platform',
      selectedPlatform: null,
      file: null,
      fileInfo: null,
      validation: null,
      uploadId: null,
      uploadProgress: 0,
      uploadStatus: null,
      isParsing: false,
      parsingProgress: null,
      parsingError: null,
      parsedData: null,
      worker: null,
    });
  },

  // Platform actions
  selectPlatform: (platform) => {
    set({
      selectedPlatform: platform,
      // Clear file when platform changes
      file: null,
      fileInfo: null,
      validation: null,
      parsedData: null,
    });
  },

  // File actions
  setFile: (file) => {
    if (file) {
      set({
        file,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
        validation: null,
        parsedData: null,
        parsingError: null,
      });
    } else {
      set({
        file: null,
        fileInfo: null,
        validation: null,
      });
    }
  },

  setValidation: (validation) => set({ validation }),

  clearFile: () =>
    set({
      file: null,
      fileInfo: null,
      validation: null,
      parsedData: null,
      parsingError: null,
    }),

  // Upload actions
  setUploadId: (id) => set({ uploadId: id }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  setUploadStatus: (status) => set({ uploadStatus: status }),

  // Parsing actions
  startParsing: () => {
    set({
      isParsing: true,
      parsingProgress: {
        phase: 'extracting',
        current: 0,
        total: 100,
        percentage: 0,
        message: 'Starting to extract files...',
      },
      parsingError: null,
      parsedData: null,
    });
  },

  updateParsingProgress: (progress) =>
    set({
      parsingProgress: progress,
    }),

  setParsingError: (error) =>
    set({
      isParsing: false,
      parsingError: error,
    }),

  setParsedData: (data) =>
    set({
      isParsing: false,
      parsedData: data,
      parsingProgress: data
        ? {
            phase: 'finalizing',
            current: 100,
            total: 100,
            percentage: 100,
            message: 'Parsing complete!',
          }
        : null,
    }),

  cancelParsing: () => {
    const { worker } = get();
    if (worker) {
      worker.terminate();
    }
    set({
      isParsing: false,
      parsingProgress: null,
      parsingError: 'Parsing cancelled',
      worker: null,
    });
  },

  // Worker actions
  setWorker: (worker) => set({ worker }),

  terminateWorker: () => {
    const { worker } = get();
    if (worker) {
      worker.terminate();
      set({ worker: null });
    }
  },
}));

// ============================================================
// SELECTORS
// ============================================================

export const selectCurrentStep = (state: UploadState) => state.currentStep;
export const selectSelectedPlatform = (state: UploadState) => state.selectedPlatform;
export const selectFile = (state: UploadState) => state.file;
export const selectFileInfo = (state: UploadState) => state.fileInfo;
export const selectValidation = (state: UploadState) => state.validation;
export const selectUploadProgress = (state: UploadState) => state.uploadProgress;
export const selectIsParsing = (state: UploadState) => state.isParsing;
export const selectParsingProgress = (state: UploadState) => state.parsingProgress;
export const selectParsingError = (state: UploadState) => state.parsingError;
export const selectParsedData = (state: UploadState) => state.parsedData;

export const selectCanProceed = (state: UploadState): boolean => {
  switch (state.currentStep) {
    case 'select-platform':
      return state.selectedPlatform !== null;
    case 'upload-file':
      return state.file !== null && (state.validation?.isValid ?? false);
    case 'parsing':
      return state.parsedData !== null && !state.parsingError;
    case 'review':
      return state.parsedData !== null;
    case 'complete':
      return true;
    default:
      return false;
  }
};

export const selectStepNumber = (state: UploadState): number => {
  return STEP_ORDER.indexOf(state.currentStep) + 1;
};

export const selectTotalSteps = (): number => STEP_ORDER.length;

export default useUploadStore;
