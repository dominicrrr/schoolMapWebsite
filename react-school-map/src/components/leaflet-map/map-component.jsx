import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
// import PinList from "../leaflet-pins/pin-list";
import {PinList, DefaultPins} from "../leaflet-pins/pin-list";
import normImage from "../../static/images/map_pictures/map.png"
import topImage from "../../static/images/map_pictures/top_view.jpg"
import HeaderButton from "../buttons/header-button/header-button";
import FilterButton from "../buttons/filter-button/filter-button";
import DropdownButton from "../buttons/dropdown-button/dropdown-button";
import DropdownContentList from "../dropdown/dropdown-list/dropdown-content-list";

import DatePickerComoponent from "../date-picker/date-picker";
import "leaflet/dist/leaflet.css";
import "./map-component.css"


const MapComponent = () => {
  const mapRef = useRef(null);
  const [pinDropActive, setPinDropActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("red");
  const [currentLayer, setCurrentLayer] = useState("norm");
  const [markersById, setMarkersById] = useState({});
  const [markerIdCounter, setMarkerIdCounter] = useState(0);

// State handeling for the different types of filters
  // Session view
  const [currentView, setCurrentView] = useState("View");
  const [committedView, setCommittedView] = useState("Session View");

  // Pin views
  const [currentPinFilter, setCurrentPinFilter] = useState("All");
  const [committedPinFilter, setCommittedPinFilter] = useState("All");

  const [hasChanged, setHasChanged] = useState(false);

  // Incident Views
  const [currentIncidentView, setCurrentIncidentView ] = useState("All")
  const [committedIncidentView, setCommittedIncidentView] = useState("All")

  // Date Views
  const [currentFromDate, setCurrentFromDate] = useState("All Dates")
  const [comittedFromDate, setCommitedFromDate] = useState ("All Dates")
  const [currentToDate, setCurrentToDate] = useState("Now")
  const [committedToDate, setCommittedToDate] = useState("Now")


  // Create a function to check if any states have changed
  const compareChangedStates = () => {
    // Check if either view or pin filter has changed from their committed values
    const hasViewChanged = currentView !== "View" && currentView !== committedView;
    const hasFilterChanged = currentPinFilter !== committedPinFilter;
    
    // Update hasChanged state based on whether any values are different
    setHasChanged(hasViewChanged || hasFilterChanged);
  };

  // Call compareChangedStates whenever relevant states change
  useEffect(() => {
    compareChangedStates();
  }, [currentView, currentPinFilter, committedView, committedPinFilter]);

  // Create a commit function to apply changes
  const commitChanges = () => {
    if (currentView !== "View") {
      setCommittedView(currentView);
    }
    setCommittedPinFilter(currentPinFilter);
    setCurrentView("View");
    setHasChanged(false);
  };


  const handleViewSelect = (selectedView) => {
      let newView = ""
      console.log("working...")
      if (selectedView == committedView) {
        newView = "View"
      } else {
        newView = selectedView
      }
      console.log("we are on view: ", newView)
      setCurrentView(newView);
  };

  const commitView = () => {
    setHasChanged(!hasChanged);
    console.log("has changed is now:", hasChanged)
  }

  const bounds = [[0, 0], [500, 1100]];
  const TOP_VIEW = topImage;
  const NORM_VIEW = normImage;
  
  useEffect(() => {
    console.log("PinDropActive changed to:", pinDropActive);
  }, [pinDropActive]);
  
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("click", handleMapClick);
    }
  
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, [pinDropActive]); // Include pinDropActive to ensure the latest value is used
  

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        crs: L.extend({}, L.CRS.Simple, { infinite: false }), // Restrict infinite map wrapping
        maxZoom: 2,
        minZoom: -0.1,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0, // Constrain the map to bounds
        zoomDelta: 0.5,
        zoomSnap: 0.5,
      });

      const normLayer = L.tileLayer(NORM_VIEW, {
        attribution: "No attribution",
        noWrap: true, // Prevent tile wrapping
      });
      const topLayer = L.tileLayer(TOP_VIEW, {
        attribution: "No attribution",
        noWrap: true, // Prevent tile wrapping
      });
  
      const baseLayers = {
        "Normal view": normLayer,
        "Top view": topLayer,
      };
  
      normLayer.addTo(mapRef.current);
      L.control.layers(baseLayers).addTo(mapRef.current);
      L.imageOverlay(NORM_VIEW, bounds, { noWrap: true }).addTo(mapRef.current);
      mapRef.current.fitBounds(bounds);
  
      mapRef.current.on("click", handleMapClick);
  
      mapRef.current.on("baselayerchange", (eventLayer) => {
        if (eventLayer.name === "Normal view") {
          setCurrentLayer("norm");
          mapRef.current.removeLayer(topLayer);
          L.imageOverlay(NORM_VIEW, bounds, { noWrap: true }).addTo(mapRef.current);
        } else if (eventLayer.name === "Top view") {
          setCurrentLayer("top");
          mapRef.current.removeLayer(normLayer);
          L.imageOverlay(TOP_VIEW, bounds, { noWrap: true }).addTo(mapRef.current);
        }
      });
  
      // Constrain map to bounds
      mapRef.current.setMaxBounds(bounds);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  const togglePinDrop = () => {
    setPinDropActive(!pinDropActive); // Ensures state is toggled correctly
    console.log(pinDropActive)
  }
  
  const handleMapClick = (e) => {
    let activity = pinDropActive
    console.log("activry var is ", activity)
    console.log("im reading activity as", pinDropActive)
    if (!pinDropActive) return;
    
    console.log("we are past the check")
    const todaysDate = new Date().toLocaleDateString();
    const markerId = `marker-${markerIdCounter + 1}`;
    const icon = PinList[currentColor] || PinList.red; // Fallback to red if undefined

    const marker = L.marker(e.latlng, {
      icon: icon,
      draggable: true,
      xy: e.latlng,
      layer: currentLayer,
      id: markerId,
      color: currentColor,
      date: todaysDate,
    }).addTo(mapRef.current);
  
    setMarkersById((prev) => ({
      ...prev,
      [markerId]: marker,
    }));

    setMarkerIdCounter(prev => prev + 1);

    const popupContent = document.createElement("div");
    popupContent.innerHTML = `${todaysDate} <i style="color: grey; font-size: smaller;">${markerId}</i><br>
      <button type="button" class="remove" id=${markerId}>delete marker 💔</button>`;
    marker.bindPopup(popupContent);
  };

  return (
    <div className="map-comp-wrapper">
        <div 
          id="map"
          style={{
            cursor: pinDropActive ? "crosshair" : "grab", // Dynamic cursor
          }}
          >
        </div>
        <div id="marker-position"></div>
        <div className="map-buttons-row">
          <FilterButton onClick={commitView} hasChanged={hasChanged}/>
          <DropdownButton
            text={currentView}
            changingText
            committedView={committedView}
            currentView={currentView}
            hasChanged={hasChanged}
            onSelect={handleViewSelect}
            dropdownContent={
              <DropdownContentList
                listItems={["Session View", "Database View"]}
              />
            }
          />
          <DropdownButton 
            text={"All Incidents"} 
            dropdownContent={ 
              <DropdownContentList
                listItems={DefaultPins()}
                // listItems={["you", "aer", "not", "sigma"]}
                horizontalWrap={true}
                onClick={() => console.log("Item clicked")}
                onSelect={(item) => console.log("Selected:", item)}
              />
            }
          />
          <HeaderButton text={"Drop a pin"} activatesOnClick={true} onClick={togglePinDrop}/>
          {/* <DatePickerComoponent /> */}
        </div>
      </div>
    );
};

export default MapComponent;


