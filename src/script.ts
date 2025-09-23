/**
 * Training Data Viewer - Main Application
 * TypeScript implementation with modular architecture
 */

import { DataManager } from './modules/DataManager.js';
import { FilterManager } from './modules/FilterManager.js';
import { PaginationManager } from './modules/PaginationManager.js';
import { TagHighlighter } from './modules/TagHighlighter.js';
import { UIRenderer } from './modules/UIRenderer.js';
import {
    AppState,
    FileInputEvent,
    FilterType,
    TrainingData,
    UIElements
} from './types.js';

/**
 * Main Application Class
 */
class TrainingDataViewer {
  private dataManager!: DataManager;
  private uiRenderer!: UIRenderer;
  private filterManager!: FilterManager;
  private paginationManager!: PaginationManager;
  private tagHighlighter!: TagHighlighter;
  private uiElements!: UIElements;
  private appState!: AppState;

  constructor() {
    this.initializeUIElements();
    this.initializeModules();
    this.initializeAppState();
    this.attachEventListeners();
  }

  /**
   * Initialize DOM element references
   */
  private initializeUIElements(): void {
    this.uiElements = {
      fileInput: document.getElementById('fileInput') as HTMLInputElement,
      loadSampleBtn: document.getElementById('loadSampleBtn') as HTMLButtonElement,
      messagesContainer: document.getElementById('messagesContainer') as HTMLDivElement,
      languageStatsContainer: document.getElementById('languageStats') as HTMLDivElement
    };

    // Validate that all required DOM elements exist
    Object.entries(this.uiElements).forEach(([key, element]) => {
      if (!element) {
        throw new Error(`Required DOM element not found: ${key}`);
      }
    });
  }

  /**
   * Initialize application modules
   */
  private initializeModules(): void {
    this.dataManager = new DataManager();
    this.uiRenderer = new UIRenderer(this.uiElements);
    this.filterManager = new FilterManager();
    this.paginationManager = new PaginationManager();
    this.tagHighlighter = new TagHighlighter();
  }

  /**
   * Initialize application state
   */
  private initializeAppState(): void {
    this.appState = {
      currentData: [],
      filteredData: [],
      globalIndices: [],
      currentFilter: 'all',
      pagination: {
        currentPage: 1,
        itemsPerPage: 5,
        totalItems: 0,
        totalPages: 0
      },
      languageStats: {}
    };
  }

  /**
   * Attach event listeners to UI elements
   */
  private attachEventListeners(): void {
    this.uiElements.fileInput.addEventListener('change', (event) => {
      this.handleFileSelect(event as FileInputEvent);
    });

    this.uiElements.loadSampleBtn.addEventListener('click', () => {
      this.loadSampleData();
    });
  }

  /**
   * Handle file selection and processing
   */
  private async handleFileSelect(event: FileInputEvent): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data, indices } = await this.dataManager.processFile(file);
      this.updateAppState(data, indices);
      this.renderApplication();
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Invalid file format. Please check the file.');
    }
  }

  /**
   * Load sample data
   */
  private loadSampleData(): void {
    const sampleData = this.dataManager.getSampleData();
    const indices = sampleData.map((_: any, index: number) => index);
    this.updateAppState(sampleData, indices);
    this.renderApplication();
  }

  /**
   * Update application state with new data
   */
  private updateAppState(data: TrainingData, indices: number[]): void {
    this.appState.currentData = data;
    this.appState.globalIndices = indices;
    this.appState.currentFilter = 'all';
    this.appState.pagination.currentPage = 1;
    this.appState.languageStats = this.dataManager.getLanguageStats(data);
    
    // Update filtered data and pagination
    this.updateFilteredData();
  }

  /**
   * Update filtered data based on current filter
   */
  private updateFilteredData(): void {
    this.appState.filteredData = this.filterManager.filterData(
      this.appState.currentData,
      this.appState.currentFilter
    );
    
    this.appState.pagination.totalItems = this.appState.filteredData.length;
    this.appState.pagination.totalPages = Math.ceil(
      this.appState.pagination.totalItems / this.appState.pagination.itemsPerPage
    );
  }

  /**
   * Handle filter change
   */
  public handleFilterChange(newFilter: FilterType): void {
    this.appState.currentFilter = newFilter;
    this.appState.pagination.currentPage = 1;
    this.updateFilteredData();
    this.renderApplication();
  }

  /**
   * Handle pagination change
   */
  public handlePaginationChange(page?: number, itemsPerPage?: number): void {
    if (page !== undefined) {
      this.appState.pagination.currentPage = page;
    }
    if (itemsPerPage !== undefined) {
      this.appState.pagination.itemsPerPage = itemsPerPage;
      this.appState.pagination.currentPage = 1; // Reset to first page
      this.updateFilteredData();
    }
    this.renderApplication();
  }

  /**
   * Render the entire application
   */
  private renderApplication(): void {
    // Clear containers
    this.uiElements.messagesContainer.innerHTML = '';
    this.uiElements.languageStatsContainer.innerHTML = '';

    // Render language statistics
    this.uiRenderer.renderLanguageStats(
      this.appState.currentData,
      this.appState.languageStats,
      this.appState.currentFilter,
      (filter: FilterType) => this.handleFilterChange(filter)
    );

    // Get paginated data
    const paginatedData = this.paginationManager.getPaginatedData(
      this.appState.filteredData,
      this.appState.pagination.currentPage,
      this.appState.pagination.itemsPerPage
    );

    const paginatedIndices = this.filterManager.getFilteredIndices(
      this.appState.globalIndices,
      this.appState.currentData,
      this.appState.currentFilter,
      this.appState.pagination.currentPage,
      this.appState.pagination.itemsPerPage
    );

    // Render filter controls
    this.uiRenderer.renderFilterControls(
      this.dataManager.getAllLanguages(this.appState.currentData),
      this.appState.currentFilter,
      (filter: FilterType) => this.handleFilterChange(filter)
    );

    // Render pagination controls
    this.uiRenderer.renderPaginationControls(
      this.appState.pagination,
      (page?: number, itemsPerPage?: number) => this.handlePaginationChange(page, itemsPerPage)
    );

    // Render conversations
    this.uiRenderer.renderConversations(
      paginatedData,
      paginatedIndices,
      this.tagHighlighter
    );

    // Render bottom pagination controls
    this.uiRenderer.renderBottomPaginationControls(
      this.appState.pagination,
      (page?: number, itemsPerPage?: number) => this.handlePaginationChange(page, itemsPerPage)
    );
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TrainingDataViewer();
});
