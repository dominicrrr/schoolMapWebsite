// context/Providers.jsx
import React from 'react';
import { DateRangeProvider } from './DateRangeContext';
import { PinFilterProvider } from './PinFilterContext';
import { ViewSettingsProvider } from './ViewSettingsContext';

export const AppProviders = ({ children }) => {
    return (
        <DateRangeProvider>
            <PinFilterProvider>
                <ViewSettingsProvider>
                    {children}
                </ViewSettingsProvider>
            </PinFilterProvider>
        </DateRangeProvider>
    );
};
