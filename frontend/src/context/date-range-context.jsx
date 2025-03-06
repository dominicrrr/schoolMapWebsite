// context/DateRangeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    return (
        <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};

export const useDateRange = () => useContext(DateRangeContext);
