/**
 * Type definitions for the Training Data Viewer application
 */

/**
 * Represents a single message in a conversation
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Represents a conversation containing multiple messages
 */
export interface Conversation {
  messages: Message[];
}

/**
 * Training data structure - array of conversations
 */
export type TrainingData = Conversation[];

/**
 * Language statistics for code detection
 */
export interface LanguageStats {
  [languageName: string]: number;
}

/**
 * Filter types for conversation filtering
 */
export type FilterType = 'all' | 'system' | 'user' | 'assistant' | 'code';

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Tag highlighting color configuration
 */
export interface TagColors {
  [tagName: string]: string;
}

/**
 * Application state interface
 */
export interface AppState {
  currentData: TrainingData;
  filteredData: TrainingData;
  globalIndices: number[];
  currentFilter: FilterType;
  pagination: PaginationConfig;
  languageStats: LanguageStats;
}

/**
 * File input event with proper typing
 */
export interface FileInputEvent extends Event {
  target: HTMLInputElement & {
    files: FileList;
  };
}

/**
 * Code block detection result
 */
export interface CodeBlock {
  language: string;
  code: string;
  startIndex: number;
  endIndex: number;
}

/**
 * UI Elements interface for type safety
 */
export interface UIElements {
  fileInput: HTMLInputElement;
  loadSampleBtn: HTMLButtonElement;
  messagesContainer: HTMLDivElement;
  languageStatsContainer: HTMLDivElement;
}
