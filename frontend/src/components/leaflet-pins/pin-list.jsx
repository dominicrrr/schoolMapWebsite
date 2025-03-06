import PinBuilder from "./pin-builder";
import redPin from "../../static/images/pins/map-pin-icon.png";
import bluePin from "../../static/images/pins/pin-blue.png";
import greenPin from "../../static/images/pins/pin-green.png";
import purplePin from "../../static/images/pins/pin-purple.png";
import "./pins.css"

// Create a static list of Default Pins
const pinImages = [
  redPin, bluePin, greenPin, purplePin
]

const DefaultPins = () =>
  pinImages.map((pinImage, index) => (
    <img
      key={index}
      src={pinImage}
      className="pin-list-items"
      alt={`Pin ${index + 1}`}
    />
  ));


// Create a static PinList object
const PinList = {
  red: PinBuilder(redPin),
  blue: PinBuilder(bluePin),
  green: PinBuilder(greenPin),
  purple: PinBuilder(purplePin),
};

export { PinList, DefaultPins};
