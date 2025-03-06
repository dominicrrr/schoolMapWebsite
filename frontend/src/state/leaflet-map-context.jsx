// mapStore.js
import create from "zustand";

const useMapStore = create((set) => ({
  pinDropActive: false,
  togglePinDrop: () => set((state) => ({ pinDropActive: !state.pinDropActive })),
  currentColor: "red",
  setColor: (color) => set({ currentColor: color }),
  markersById: {},
  setMarkersById: (newMarkers) => set({ markersById: newMarkers }),
}));

export default useMapStore;
