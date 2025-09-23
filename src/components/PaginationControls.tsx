import React from 'react';
import { PaginationConfig } from '../types';

interface PaginationControlsProps {
  pagination: PaginationConfig;
  onPaginationChange: (page?: number, itemsPerPage?: number) => void;
  isBottom?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPaginationChange,
  isBottom = false
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination-controls ${isBottom ? 'bottom' : ''}`}>
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} conversations
      </div>
      
      <div className="pagination-buttons">
        <button
          onClick={() => onPaginationChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => onPaginationChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => onPaginationChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => onPaginationChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>

      {!isBottom && (
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onPaginationChange(undefined, parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
