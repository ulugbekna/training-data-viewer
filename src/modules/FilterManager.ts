/**
 * FilterManager - Handles data filtering by language and other criteria
 */

import { FilterType, TrainingData } from '../types.js';
import { DataManager } from './DataManager.js';

export class FilterManager {
  private dataManager: DataManager;

  constructor() {
    this.dataManager = new DataManager();
  }

  /**
   * Filter data by language or other criteria
   */
  public filterData(data: TrainingData, filter: FilterType): TrainingData {
    if (filter === 'all') {
      return data;
    }

    return data.filter(conversation => {
      return conversation.messages.some(message => {
        if (message.role === 'user') {
          const msgLanguage = this.dataManager.extractLanguageFromPath(message.content);
          return msgLanguage === filter;
        }
        return false;
      });
    });
  }

  /**
   * Get global indices for filtered data
   */
  public getFilteredIndices(
    allGlobalIndices: number[],
    data: TrainingData,
    filter: FilterType,
    page: number,
    itemsPerPage: number
  ): number[] {
    if (filter === 'all') {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allGlobalIndices.slice(startIndex, endIndex);
    }

    const filteredIndices: number[] = [];
    data.forEach((conversation, index) => {
      const hasLanguage = conversation.messages.some(message => {
        if (message.role === 'user') {
          const msgLanguage = this.dataManager.extractLanguageFromPath(message.content);
          return msgLanguage === filter;
        }
        return false;
      });

      if (hasLanguage) {
        filteredIndices.push(allGlobalIndices[index]);
      }
    });

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredIndices.slice(startIndex, endIndex);
  }
}
