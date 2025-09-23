/**
 * PaginationManager - Handles pagination logic and data slicing
 */

import { TrainingData } from '../types.js';

export class PaginationManager {
  /**
   * Get paginated data for current page
   */
  public getPaginatedData(
    data: TrainingData,
    currentPage: number,
    itemsPerPage: number
  ): TrainingData {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  /**
   * Calculate total number of pages
   */
  public getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }

  /**
   * Check if there's a next page
   */
  public hasNextPage(currentPage: number, totalPages: number): boolean {
    return currentPage < totalPages;
  }

  /**
   * Check if there's a previous page
   */
  public hasPreviousPage(currentPage: number): boolean {
    return currentPage > 1;
  }

  /**
   * Get page information string
   */
  public getPageInfo(currentPage: number, totalPages: number): string {
    return `Page ${currentPage} of ${totalPages}`;
  }
}
