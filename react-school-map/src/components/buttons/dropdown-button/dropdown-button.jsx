import React, { useState } from "react";
import "./dropdown-button.css";

const DropdownButton = ({ text, dropdownContent, changingText=false, onSelect, committedView, currentView }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleItemClick = (itemText) => {
        if (!changingText) return;
        onSelect?.(itemText)
        setIsHovered(false)
    }

    const isChanged = changingText && currentView !== "View" && currentView !== committedView;


  return (
    <div
        className="dropdown-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} 
    >
      {/* Dropdown Button */}
      <a className={`dropdown-button ${isChanged ? "changed" : ""}`}>
        <div className="dropdown-text">{`${text}`}</div>
        <div className="small-arrow-container">
          {/* Downward Arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </a>

      {/* Dropdown Content */}
      <div className={`dropdown-content ${isHovered ? 'active' : ''}`}>

        {/* Placeholder div */}
        <div className="dropdown-content-wrapper">
            { dropdownContent ? (React.cloneElement(dropdownContent, { onSelect: handleItemClick })) : 
                    (<div style={{
                        height: 100,
                        width: 300,
                        backgroundColor: "black",
                    }}></div>)
                }
            </div>
        </div>
    </div>
  );
};

export default DropdownButton;
