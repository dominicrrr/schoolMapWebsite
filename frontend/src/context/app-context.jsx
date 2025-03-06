// context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Date Range state
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    // Pin Filter state
    const [pinFilter, setPinFilter] = useState({
        type: 'all',
        color: null
    });

    // View state
    const [viewSettings, setViewSettings] = useState({
        currentView: 'default',
        zoom: 1
    });

    const value = {
        // Date Range
        dateRange,
        setDateRange,
        
        // Pin Filters
        pinFilter,
        setPinFilter,
        
        // View Settings
        viewSettings,
        setViewSettings
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hooks for each context domain
export const useDateRange = () => {
    const context = useContext(AppContext);
    return {
        dateRange: context.dateRange,
        setDateRange: context.setDateRange
    };
};

export const usePinFilter = () => {
    const context = useContext(AppContext);
    return {
        pinFilter: context.pinFilter,
        setPinFilter: context.setPinFilter
    };
};

export const useViewSettings = () => {
    const context = useContext(AppContext);
    return {
        viewSettings: context.viewSettings,
        setViewSettings: context.setViewSettings
    };
};
