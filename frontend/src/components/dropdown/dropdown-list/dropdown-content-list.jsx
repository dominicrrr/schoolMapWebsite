import React from "react";
import "./dropdown-content-list.css";

const DropdownContentList = ({ listItems, onClick, onSelect, horizontalWrap, gridWrap}) => {
    return (
      <div className="content-list-wrapper">
        {listItems.map((item, index) => (
          <div key={index} className="content-list-item">
            <a
              className="content-list-item-entry"
            >
              <div
                className={`content-list-item-text-wrapper ${horizontalWrap? "horizontal" : ""}`}
                onClick={() => {
                  onSelect?.(item); // Call onSelect with the item text if onSelect is provided
                  onClick?.(); // Call onClick if provided
                }}
              >
                <div className="content-list-item-padding">
                  {typeof item === "string" ? <div>{item}</div> : item}
                  {/* Render the item directly if it's a JSX element */}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  };
  
export default DropdownContentList;
