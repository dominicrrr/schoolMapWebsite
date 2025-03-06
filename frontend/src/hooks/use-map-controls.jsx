// hooks/use-map-controls.js
import { useState, useCallback } from 'react';
import L from 'leaflet';
import { PinList } from '../components/leaflet-pins/pin-list';

export const useMapControls = (mapRef) => {
  const [pinDropActive, setPinDropActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("red");
  const [currentLayer, setCurrentLayer] = useState("norm");
  const [markersById, setMarkersById] = useState({});
  const [markerIdCounter, setMarkerIdCounter] = useState(0);

  const handlePinSelect = useCallback((pin) => {
    setCurrentColor(pin);
  }, []);

  const togglePinDrop = useCallback(() => {
    setPinDropActive(prev => !prev);
  }, []);

  const handleMapClick = useCallback((e) => {
    if (!pinDropActive) return;

    const todaysDate = new Date().toLocaleDateString();
    const markerId = `marker-${markerIdCounter + 1}`;
    const icon = PinList[currentColor] || PinList.red;

    const marker = L.marker(e.latlng, {
      icon,
      draggable: true,
      xy: e.latlng,
      layer: currentLayer,
      id: markerId,
      color: currentColor,
      date: todaysDate,
    }).addTo(mapRef.current);

    setMarkersById(prev => ({
      ...prev,
      [markerId]: marker,
    }));

    setMarkerIdCounter(prev => prev + 1);

    const popupContent = document.createElement("div");
    popupContent.innerHTML = `${todaysDate} <i style="color: grey; font-size: smaller;">${markerId}</i><br>
      <button type="button" class="remove" id=${markerId}>delete marker 💔</button>`;
    marker.bindPopup(popupContent);
  }, [pinDropActive, currentColor, currentLayer, markerIdCounter]);

  return {
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
  };
};
