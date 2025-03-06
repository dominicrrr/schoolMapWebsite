import React, { useState } from "react";
import DropdownButton from "../../buttons/dropdown-button/dropdown-button";
import DropdownContentList from "../../dropdown/dropdown-list/dropdown-content-list";
import { PinList, DefaultPins } from "../../leaflet-pins/pin-list";

const SelectPin = ({ onPinSelect }) => {
    const [selectedPin, setSelectedPin] = useState(null);

    const handlePinSelect = (pin) => {
        setSelectedPin(pin);
        onPinSelect?.(pin);
    };

    // Custom view content for the pin button
    const pinViewContent = (
        <div className="dropdown-text">
            {selectedPin ? (
                <img 
                    src={PinList[selectedPin].options.iconUrl} 
                    alt={selectedPin} 
                    style={{ height: '20px', width: 'auto' }}
                />
            ) : (
                "Select Pin"
            )}
        </div>
    );

    return (
        <div className="select-pin">
            <DropdownButton 
                text="Select Pin"
                viewContent={pinViewContent}
                dropdownContent={
                    <DropdownContentList 
                        listItems={DefaultPins()}
                        onSelect={handlePinSelect}
                    />
                }
            />
        </div>
    );
};
export default SelectPin;
