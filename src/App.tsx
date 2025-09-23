import React, { useCallback, useState } from 'react';
import ConversationList from './components/ConversationList';
import FileControls from './components/FileControls';
import FilterControls from './components/FilterControls';
import Header from './components/Header';
import PaginationControls from './components/PaginationControls';
import Sidebar from './components/Sidebar';
import { DataManager } from './modules/DataManager';
import { FilterManager } from './modules/FilterManager';
import { PaginationManager } from './modules/PaginationManager';
import { TagHighlighter } from './modules/TagHighlighter';
import { AppState, FilterType, TrainingData } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
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
  });

  // Initialize managers
  const dataManager = new DataManager();
  const filterManager = new FilterManager();
  const paginationManager = new PaginationManager();
  const tagHighlighter = new TagHighlighter();

  const updateFilteredData = useCallback((data: TrainingData, filter: FilterType) => {
    const filteredData = filterManager.filterData(data, filter);
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / appState.pagination.itemsPerPage);

    return { filteredData, totalItems, totalPages };
  }, [filterManager, appState.pagination.itemsPerPage]);

  const updateAppState = useCallback((data: TrainingData, indices: number[]) => {
    const languageStats = dataManager.getLanguageStats(data);
    const { filteredData, totalItems, totalPages } = updateFilteredData(data, 'all');

    setAppState(prevState => ({
      ...prevState,
      currentData: data,
      globalIndices: indices,
      currentFilter: 'all',
      filteredData,
      languageStats,
      pagination: {
        ...prevState.pagination,
        currentPage: 1,
        totalItems,
        totalPages
      }
    }));
  }, [dataManager, updateFilteredData]);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const { data, indices } = await dataManager.processFile(file);
      updateAppState(data, indices);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Invalid file format. Please check the file.');
    }
  }, [dataManager, updateAppState]);

  const handleLoadSample = useCallback(() => {
    const sampleData = dataManager.getSampleData();
    const indices = sampleData.map((_, index) => index);
    updateAppState(sampleData, indices);
  }, [dataManager, updateAppState]);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    const { filteredData, totalItems, totalPages } = updateFilteredData(appState.currentData, newFilter);

    setAppState(prevState => ({
      ...prevState,
      currentFilter: newFilter,
      filteredData,
      pagination: {
        ...prevState.pagination,
        currentPage: 1,
        totalItems,
        totalPages
      }
    }));
  }, [appState.currentData, updateFilteredData]);

  const handlePaginationChange = useCallback((page?: number, itemsPerPage?: number) => {
    setAppState(prevState => {
      const newItemsPerPage = itemsPerPage ?? prevState.pagination.itemsPerPage;
      const newPage = page ?? (itemsPerPage ? 1 : prevState.pagination.currentPage);
      
      let newFilteredData = prevState.filteredData;
      let newTotalItems = prevState.pagination.totalItems;
      let newTotalPages = prevState.pagination.totalPages;

      if (itemsPerPage) {
        const result = updateFilteredData(prevState.currentData, prevState.currentFilter);
        newFilteredData = result.filteredData;
        newTotalItems = result.totalItems;
        newTotalPages = Math.ceil(newTotalItems / newItemsPerPage);
      }

      return {
        ...prevState,
        filteredData: newFilteredData,
        pagination: {
          ...prevState.pagination,
          currentPage: newPage,
          itemsPerPage: newItemsPerPage,
          totalItems: newTotalItems,
          totalPages: newTotalPages
        }
      };
    });
  }, [updateFilteredData]);

  // Get paginated data for current view
  const paginatedData = paginationManager.getPaginatedData(
    appState.filteredData,
    appState.pagination.currentPage,
    appState.pagination.itemsPerPage
  );

  const paginatedIndices = filterManager.getFilteredIndices(
    appState.globalIndices,
    appState.currentData,
    appState.currentFilter,
    appState.pagination.currentPage,
    appState.pagination.itemsPerPage
  );

  const allLanguages = dataManager.getAllLanguages(appState.currentData);

  return (
    <div className="app">
      <Sidebar
        currentData={appState.currentData}
        languageStats={appState.languageStats}
        currentFilter={appState.currentFilter}
        onFilterChange={handleFilterChange}
      />
      
      <div className="container">
        <Header />
        
        <div className="main-content">
          <div className="content-area">
            <FileControls
              onFileSelect={handleFileSelect}
              onLoadSample={handleLoadSample}
            />

            {appState.currentData.length > 0 && (
              <>
                <FilterControls
                  allLanguages={allLanguages}
                  currentFilter={appState.currentFilter}
                  onFilterChange={handleFilterChange}
                />

                <PaginationControls
                  pagination={appState.pagination}
                  onPaginationChange={handlePaginationChange}
                />

                <ConversationList
                  conversations={paginatedData}
                  indices={paginatedIndices}
                  tagHighlighter={tagHighlighter}
                />

                <PaginationControls
                  pagination={appState.pagination}
                  onPaginationChange={handlePaginationChange}
                  isBottom={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
