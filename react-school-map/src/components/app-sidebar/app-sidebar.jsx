import React from "react";
import "./app-sidebar.css"
import OutlinedPinIcon from "../svg-icons/outlined-pin-icon";
import FilledPinIcon from "../svg-icons/filled-pin-icon";
import CloudIcon from "../svg-icons/cloud-icon";
import AppSideButton from "../buttons/sidebar-buttons/app-side-button/app-side-button";

const Sidebar = (sidebarItems, stateVar) => {
    
    return (
        <div className="app-sidebar">
            <div className="app-sidebar-icon-column">
                <div className="app-sidebar-icon-column-padding">
                    <div className="app-sidebar-icon-column-content">
                    <div className="app-sidebar-icon-column-item">
                            <AppSideButton text="Pins" content={<FilledPinIcon/>}/>                            
                        </div>
                        <div className="app-sidebar-icon-column-item">
                            <AppSideButton text="Data base" content={<CloudIcon />}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="app-sidebar-content">
                <div className="app-sidebar-content-wrapper">
                    bruh
                </div>
            </div>
        </div>
    );
}

export default Sidebar