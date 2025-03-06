// hooks/use-map-filters.jsx
import { useState, useEffect, useCallback } from "react";

export const useMapFilters = (initialState = {}) => {
  // Group related states into objects
  const [viewState, setViewState] = useState({
    current: initialState.currentView || "View",
    committed: initialState.committedView || "Session View"
  });

  const [pinFilter, setPinFilter] = useState({
    current: initialState.currentPinFilter || "All",
    committed: initialState.committedPinFilter || "All"
  });

  const [hasChanged, setHasChanged] = useState(false);

  // Memoize complex functions with useCallback
  const compareChangedStates = useCallback(() => {
    const hasViewChanged = 
      viewState.current !== "View" && 
      viewState.current !== viewState.committed;

    const hasFilterChanged = 
      pinFilter.current !== pinFilter.committed;

    setHasChanged(hasViewChanged || hasFilterChanged);
  }, [viewState, pinFilter]);

  // Handle view selection with validation
  const handleViewSelect = useCallback((selectedView) => {
    if (!selectedView) return;

    setViewState(prev => ({
      ...prev,
      current: selectedView === prev.committed ? "View" : selectedView
    }));
  }, []);

  // Commit changes with immutable updates
  const commitChanges = useCallback(() => {
    setViewState(prev => ({
      committed: prev.current !== "View" ? prev.current : prev.committed,
      current: "View"
    }));

    setPinFilter(prev => ({
      ...prev,
      committed: prev.current
    }));

    setHasChanged(false);
  }, []);

  // Update filters
  const updatePinFilter = useCallback((newFilter) => {
    setPinFilter(prev => ({
      ...prev,
      current: newFilter
    }));
  }, []);

  // Monitor state changes
  useEffect(() => {
    compareChangedStates();
  }, [
    viewState.current, 
    viewState.committed,
    pinFilter.current, 
    pinFilter.committed,
    compareChangedStates
  ]);

  return {
    // View states
    currentView: viewState.current,
    committedView: viewState.committed,
    
    // Pin filter states
    currentPinFilter: pinFilter.current,
    committedPinFilter: pinFilter.committed,
    
    // State indicators
    hasChanged,
    
    // Actions
    handleViewSelect,
    commitChanges,
    updatePinFilter
  };
};

