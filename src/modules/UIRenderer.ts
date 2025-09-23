/**
 * UIRenderer - Handles all UI rendering and DOM manipulation
 */

import {
    FilterType,
    LanguageStats,
    PaginationConfig,
    TrainingData,
    UIElements
} from '../types.js';
import { TagHighlighter } from './TagHighlighter.js';

export class UIRenderer {
  private uiElements: UIElements;

  constructor(uiElements: UIElements) {
    this.uiElements = uiElements;
  }

  /**
   * Render language statistics in sidebar
   */
  public renderLanguageStats(
    data: TrainingData,
    languageStats: LanguageStats,
    currentFilter: FilterType,
    onFilterChange: (filter: FilterType) => void
  ): void {
    this.uiElements.languageStatsContainer.innerHTML = '';
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'language-stats';
    
    // Add "All Languages" option at the top
    const allItem = document.createElement('div');
    allItem.className = 'language-stat-item clickable';
    if (currentFilter === 'all') {
      allItem.classList.add('active');
    }
    
    const allName = document.createElement('span');
    allName.className = 'language-name';
    allName.textContent = 'All Languages';
    
    const allCount = document.createElement('span');
    allCount.className = 'language-count';
    allCount.textContent = data.length.toString();
    
    allItem.appendChild(allName);
    allItem.appendChild(allCount);
    
    // Add click handler for "All Languages"
    allItem.addEventListener('click', () => {
      onFilterChange('all');
    });
    
    statsContainer.appendChild(allItem);
    
    // Convert to array and sort by count (descending)
    const sortedLanguages = Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1]);
    
    sortedLanguages.forEach(([language, count]) => {
      const statItem = document.createElement('div');
      statItem.className = 'language-stat-item clickable';
      if (currentFilter === language) {
        statItem.classList.add('active');
      }
      
      const languageName = document.createElement('span');
      languageName.className = 'language-name';
      languageName.textContent = language.charAt(0).toUpperCase() + language.slice(1);
      
      const languageCount = document.createElement('span');
      languageCount.className = 'language-count';
      languageCount.textContent = count.toString();
      
      statItem.appendChild(languageName);
      statItem.appendChild(languageCount);
      
      // Add click handler to filter by this language
      statItem.addEventListener('click', () => {
        onFilterChange(language as FilterType);
      });
      
      statsContainer.appendChild(statItem);
    });
    
    this.uiElements.languageStatsContainer.appendChild(statsContainer);
  }

  /**
   * Render filter controls
   */
  public renderFilterControls(
    languages: string[],
    currentFilter: FilterType,
    onFilterChange: (filter: FilterType) => void
  ): void {
    const filterControls = document.createElement('div');
    filterControls.className = 'filter-controls';
    
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Filter by language: ';
    filterLabel.htmlFor = 'languageFilter';
    
    const languageFilter = document.createElement('select');
    languageFilter.id = 'languageFilter';
    
    // Add "All" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Languages';
    if (currentFilter === 'all') {
      allOption.selected = true;
    }
    languageFilter.appendChild(allOption);
    
    // Add language options
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
      if (lang === currentFilter) {
        option.selected = true;
      }
      languageFilter.appendChild(option);
    });
    
    // Set the current filter value in the dropdown
    languageFilter.value = currentFilter;
    
    // Event listener for language filter change
    languageFilter.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      onFilterChange(target.value as FilterType);
    });
    
    filterControls.appendChild(filterLabel);
    filterControls.appendChild(languageFilter);
    
    this.uiElements.messagesContainer.appendChild(filterControls);
  }

  /**
   * Render pagination controls
   */
  public renderPaginationControls(
    pagination: PaginationConfig,
    onPaginationChange: (page?: number, itemsPerPage?: number) => void
  ): void {
    const paginationControls = document.createElement('div');
    paginationControls.className = 'pagination-controls';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = pagination.currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (pagination.currentPage > 1) {
        onPaginationChange(pagination.currentPage - 1);
      }
    });
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = pagination.currentPage >= pagination.totalPages;
    nextButton.addEventListener('click', () => {
      if (pagination.currentPage < pagination.totalPages) {
        onPaginationChange(pagination.currentPage + 1);
      }
    });
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    pageInfo.className = 'page-info';
    
    // Items per page selector
    const itemsPerPageSelector = document.createElement('select');
    itemsPerPageSelector.className = 'items-per-page';
    
    // Add options for items per page
    const options = [5, 10, 20, 50];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toString();
      optionElement.textContent = `${option} per page`;
      if (option === pagination.itemsPerPage) {
        optionElement.selected = true;
      }
      itemsPerPageSelector.appendChild(optionElement);
    });
    
    // Event listener for items per page change
    itemsPerPageSelector.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      onPaginationChange(undefined, parseInt(target.value));
    });
    
    paginationControls.appendChild(prevButton);
    paginationControls.appendChild(pageInfo);
    paginationControls.appendChild(nextButton);
    paginationControls.appendChild(itemsPerPageSelector);
    
    this.uiElements.messagesContainer.appendChild(paginationControls);
  }

  /**
   * Render conversations
   */
  public renderConversations(
    conversations: TrainingData,
    globalIndices: number[],
    tagHighlighter: TagHighlighter
  ): void {
    conversations.forEach((conversation, index) => {
      const globalIndex = globalIndices[index];
      const conversationElement = document.createElement('div');
      conversationElement.className = 'conversation';
      conversationElement.innerHTML = `<h2>Conversation ${globalIndex}</h2>`;
      
      // Iterate through each message in the conversation
      conversation.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.role}`;
        
        const roleElement = document.createElement('div');
        roleElement.className = `role ${message.role}`;
        roleElement.textContent = message.role;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'content';
        const highlightedContent = tagHighlighter.highlightTags(message.content);
        
        // Check if content was highlighted (contains HTML spans)
        if (tagHighlighter.hasTags(message.content)) {
          contentElement.innerHTML = highlightedContent;
        } else {
          // No tags found, use textContent to preserve formatting and avoid XSS
          contentElement.textContent = message.content;
        }
        
        const headerElement = document.createElement('div');
        headerElement.className = 'message-header';
        headerElement.appendChild(roleElement);
        
        messageElement.appendChild(headerElement);
        messageElement.appendChild(contentElement);
        conversationElement.appendChild(messageElement);
      });
      
      this.uiElements.messagesContainer.appendChild(conversationElement);
    });
  }

  /**
   * Render bottom pagination controls
   */
  public renderBottomPaginationControls(
    pagination: PaginationConfig,
    onPaginationChange: (page?: number, itemsPerPage?: number) => void
  ): void {
    const bottomPaginationControls = document.createElement('div');
    bottomPaginationControls.className = 'pagination-controls bottom';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = pagination.currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (pagination.currentPage > 1) {
        onPaginationChange(pagination.currentPage - 1);
      }
    });
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = pagination.currentPage >= pagination.totalPages;
    nextButton.addEventListener('click', () => {
      if (pagination.currentPage < pagination.totalPages) {
        onPaginationChange(pagination.currentPage + 1);
      }
    });
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    pageInfo.className = 'page-info';
    
    // Items per page selector
    const itemsPerPageSelector = document.createElement('select');
    itemsPerPageSelector.className = 'items-per-page';
    
    // Add options for items per page
    const options = [5, 10, 20, 50];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toString();
      optionElement.textContent = `${option} per page`;
      if (option === pagination.itemsPerPage) {
        optionElement.selected = true;
      }
      itemsPerPageSelector.appendChild(optionElement);
    });
    
    // Event listener for items per page change
    itemsPerPageSelector.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      onPaginationChange(undefined, parseInt(target.value));
    });
    
    bottomPaginationControls.appendChild(prevButton);
    bottomPaginationControls.appendChild(pageInfo);
    bottomPaginationControls.appendChild(nextButton);
    bottomPaginationControls.appendChild(itemsPerPageSelector);
    
    this.uiElements.messagesContainer.appendChild(bottomPaginationControls);
  }
}
