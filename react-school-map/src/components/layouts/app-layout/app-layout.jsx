import React from "react";
import "./app-layout.css"
import MapComponent from "../../leaflet-map/map-component.jsx"
import Sidebar from "../../app-sidebar/app-sidebar.jsx";

const AppLayout = () => {
    return(
        <div className="app-view">
            <div className="app-flex-layout">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="map-container"> 
                    <MapComponent />
                </div>
            </div>
        </div>
    );
}

export default AppLayout