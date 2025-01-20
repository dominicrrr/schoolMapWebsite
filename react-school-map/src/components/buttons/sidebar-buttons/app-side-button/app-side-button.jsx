import React from "react";
import "./app-side-button.css";

const AppSideButton = ( { onclick = false, content, text="" }) => {

    return(
        <div className="app-side-button">
            <div className="app-side-button-content-wrapper">
                <div>{content}</div>
                <div>{text}</div>
            </div>
        </div>
    );
}

export default AppSideButton