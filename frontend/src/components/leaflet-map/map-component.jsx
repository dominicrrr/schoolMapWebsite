// map-component.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { PinList, DefaultPins } from "../leaflet-pins/pin-list";
import { useMapFilters } from "../../hooks/use-map-filters";
import { useMapControls } from "../../hooks/use-map-controls";
import { useDateRange } from "../../context/date-range-context";
import normImage from "../../static/images/map_pictures/map.png";
import topImage from "../../static/images/map_pictures/top_view.jpg";
import HeaderButton from "../buttons/header-button/header-button";
import FilterButton from "../buttons/filter-button/filter-button";
import DropdownButton from "../buttons/dropdown-button/dropdown-button";
import DropdownContentList from "../dropdown/dropdown-list/dropdown-content-list";
import DatePickerComponent from "../date-picker/date-picker";
import SelectPin from "./overlay-content/select-pin";
import "leaflet/dist/leaflet.css";
import "./map-component.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const bounds = [[0, 0], [500, 1100]];
  const TOP_VIEW = topImage;
  const NORM_VIEW = normImage;

  // Use custom hooks
  const {
    currentView,
    committedView,
    currentPinFilter,
    hasChanged,
    handleViewSelect,
    commitChanges,
    updatePinFilter
  } = useMapFilters();

  const {
    pinDropActive,
    currentColor,
    currentLayer,
    markersById,
    markerIdCounter,
    handlePinSelect,
    togglePinDrop,
    setCurrentLayer,
    handleMapClick,
    setMarkersById,
    setMarkerIdCounter
  } = useMapControls(mapRef);

  // Map initialization effect
  useEffect(() => {
    if (!mapRef.current) {
      initializeMap();
    }
    return () => cleanupMap();
  }, []);

  // Map click handler effect
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("click", handleMapClick);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.off("click", handleMapClick);
      }
    };
  }, [pinDropActive]);

  const initializeMap = () => {
    mapRef.current = L.map("map", {
      crs: L.extend({}, L.CRS.Simple, { infinite: false }),
      maxZoom: 2,
      minZoom: -0.1,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      zoomDelta: 0.5,
      zoomSnap: 0.5,
    });

    setupMapLayers();
  };

  const setupMapLayers = () => {
    const normLayer = L.tileLayer(NORM_VIEW, {
      attribution: "No attribution",
      noWrap: true,
    });
    const topLayer = L.tileLayer(TOP_VIEW, {
      attribution: "No attribution",
      noWrap: true,
    });

    const baseLayers = {
      "Normal view": normLayer,
      "Top view": topLayer,
    };

    normLayer.addTo(mapRef.current);
    L.control.layers(baseLayers).addTo(mapRef.current);
    L.imageOverlay(NORM_VIEW, bounds, { noWrap: true }).addTo(mapRef.current);
    mapRef.current.fitBounds(bounds);

    setupLayerChangeHandler(normLayer, topLayer);
  };

  const setupLayerChangeHandler = (normLayer, topLayer) => {
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
  };

  const cleanupMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  return (
    <div className="map-comp-wrapper">
      <div>
        <div className="map-overlay-buttons" />
        <div 
          id="map"
          style={{
            cursor: pinDropActive ? "crosshair" : "grab",
          }}
        />
      </div>
      <div id="marker-position" />
      <div className="map-buttons-row">
        <div className="map-buttons-row-left">
          <FilterButton onClick={commitChanges} hasChanged={hasChanged}/>
          <DropdownButton
            text={currentView}
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
                horizontalWrap={true}
                onSelect={updatePinFilter}
              />
            }
          />
          <DropdownButton
            text={"All Time"}
            dropdownContent={<DatePickerComponent />}
          />
        </div>
        <div className="map-buttons-row-right">
          <SelectPin onPinSelect={handlePinSelect}/>
          <HeaderButton 
            text={"Drop a pin"} 
            activatesOnClick={true} 
            onClick={togglePinDrop}
          />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
