// map-app.jsx
import React from "react";
import "./map-app.css"
import NavBar from "../../components/nav/nav-bar";
import AppLayout from "../../components/layouts/app-layout/app-layout";
import { AppProvider } from "../../context/app-context";
import { DateRangeProvider } from "../../context/date-range-context";

const MapApp = () => {
    return(
        <AppProvider>
            <DateRangeProvider>
                <NavBar />
                <AppLayout />
            </DateRangeProvider>
        </AppProvider>
    );
}

export default MapApp;
