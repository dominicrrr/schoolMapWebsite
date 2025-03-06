import React, { useState, useEffect } from "react";
import { DateRangePicker, DefinedRange, DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDateRange } from "../../context/date-range-context";
import "./date-picker.css"

// Custom label component
const CustomStaticRangeLabelContent = ({ text }) => {
  const [currentDateString, setCurrentDateString] = useState(new Date().toString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateString(new Date().toString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span>
      <i>{text}</i>
      <span className="random-date-string">
        {/* <b>{currentDateString}</b> */}
      </span>
    </span>
  );
};

// Function to render the label
const renderStaticRangeLabel = () => (
  <CustomStaticRangeLabelContent text="Reset to All Time" />
);

const DatePickerComponent = () => {
  const { setDateRange } = useDateRange();
  const [localDateRange, setLocalDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setLocalDateRange([ranges.selection]);
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
    console.log("Selected range:", ranges);
  };

  return (
    <div className="date-picker-view">
      <h3>Pick a Date Range</h3>
      <div className="date-picker-content">
        {/* Defined Range */}
        <DefinedRange
          ranges={localDateRange}
          onChange={(item) => setLocalDateRange([item.selection])}
          renderStaticRangeLabel={renderStaticRangeLabel}
          staticRanges={[
            {
              label: "Hoy",
              hasCustomRendering: true,
              range: () => ({
                startDate: new Date(),
                endDate: new Date(),
              }),
              isSelected() {
                return true;
              },
            },
          ]}
        />

        {/* <DateRangePicker */}
        <DateRange
          ranges={localDateRange}
          onChange={handleSelect}
          // months={1}
          // direction="vertical"
          // showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          editableDateInputs={true}
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
