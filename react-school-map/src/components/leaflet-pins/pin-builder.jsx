import L from "leaflet";
import pinShadow from "../../static/images/pins/pin-shadow.png";

const PinBuilder = (imageUrl) => {
  return L.icon({
    iconUrl: imageUrl,
    shadowUrl: pinShadow,
    iconSize: [34, 52],
    shadowSize: [75, 117],
    iconAnchor: [17, 50],
    shadowAnchor: [38, 105],
    popupAnchor: [0, -45],
  });
};

export default PinBuilder;
