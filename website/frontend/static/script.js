const FLOOR_DISPLAY = document.getElementById("floors");
const MAP = document.getElementById("map");
const PIN_BUTTON = document.getElementById("drop-pin");
const HAMBURGER_MENU = document.getElementById("openSidebarMenu");
const SAVED_POPUP = document.getElementById("saved-noti");

const INCIDENT_TYPE = document.getElementById("select-your-incident");
const INCIDENT_DETAILS = document.getElementById("incident-details");
const STUDENT_ID = document.getElementById("studentId");
const FLOOR = document.getElementById("floor-level");

const redPin = document.getElementById("red-pin-button");
const bluePin = document.getElementById("blue-pin-button");
const greenPin = document.getElementById("green-pin-button");
const purplePin = document.getElementById("purple-pin-button");

const textInput = document.getElementById("map-view-selectRoot");
const dropdownOptions = document.querySelectorAll(
  ".pin-view-dropdown-optionRoot"
);

function date() {
  return new Date();
}

const TOP_VIEW = "../static/images/map_pictures//top_view.jpg";
const NORM_VIEW = "../static/images/map_pictures/map.png";

const topAttri = "No attribution";
const normAttri = "No attribution";

const TOP_LAYER = L.tileLayer(TOP_VIEW, { attribution: topAttri });
const NORM_LAYER = L.tileLayer(NORM_VIEW, { attribution: normAttri });

const normMarkerLayer = L.layerGroup();
const topMarkerLayer = L.layerGroup();

const greenIcon = L.icon({
  iconUrl: "../static/images/pins/pin-green.png",
  shadowUrl: "../static/images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const blueIcon = L.icon({
  iconUrl: "../static/images/pins/pin-blue.png",
  shadowUrl: "../static/images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const redIcon = L.icon({
  iconUrl: "../static/images/pins/map-pin-icon.png",
  shadowUrl: "../static/images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const purpleIcon = L.icon({
  iconUrl: "../static/images/pins/pin-purple.png",
  shadowUrl: "../static/images/pins/pin-shadow.png",
  iconSize: [34, 52],
  shadowSize: [75, 117],
  iconAnchor: [17, 50],
  shadowAnchor: [38, 105],
  popupAnchor: [0, -45],
});

const pictureDict = {
  red: "../static/images/pins/map-pin-icon.png",
  blue: "../static/images/pins/pin-blue.png",
  green: "../static/images/pins/pin-green.png",
  purple: "../static/images/pins/pin-purple.png",
};

const pinList = {
  red: redIcon,
  blue: blueIcon,
  green: greenIcon,
  purple: purpleIcon,
};

let current_color = "";
let current_layer = "norm";
let pinDropActive = false;
let mapInstance;
let markersList = [];
let topMarkersList = [];

let markerIdCounter = 0;
let markersById = {};
let serverMarkersById = {};
let currentMarked;

let currentView = "SESSION VIEW";
let field = "SESSION VIEW";

let defaultIncidents = {
  red: "fighting",
  blue: "drugs",
  green: " ",
  purple: " ",
};

let changes = false;
let changedDetail = {};

function onlyOne(checkbox) {
  // makes sure only one checkbox is checked by manually unchecking every other box while checking the target box
  var checkboxes = document.querySelectorAll(".pin-button");
  checkboxes.forEach((item) => {
    if (item !== checkbox) item.checked = false;
  });
  checkTheBox();
}

function checkTheBox() {
  //
  var checkBoxes = document.querySelectorAll(".pin-button");
  checkBoxes.forEach(function (checkBox) {
    // iterates through all the checkboxes, sees if a checkbox is checked and if so, applies the CSS. also removes any styling for
    var parentElement = checkBox.parentElement; // an unchecked box
    var picture = parentElement.querySelector("img");
    if (checkBox.checked == true) {
      if (picture) picture.style.outline = "2px solid white";
      current_color = checkBox.getAttribute("data-color");
      console.log(current_color);
    } else {
      if (picture) picture.style.outline = "none";
    }
  });
}

function pin_drop() {
  // function is called by the click of the drop a pin button, simply enables the pinDrop variable and enables some responsive css
  PIN_BUTTON.textContent = pinDropActive ? "Drop a pin" : "[CANCEL]";
  PIN_BUTTON.classList.toggle("active");
  MAP.classList.toggle("active");
  pinDropActive = !pinDropActive;
}

document.addEventListener("DOMContentLoaded", display_map); // runs the display_map function on the loading of the document

function display_map() {
  redPin.checked = true; //when the document loads, makes the redPin the default pin and calls the function to check the box.
  checkTheBox();
  mapInstance.on("click", function (e) {
    //this function generally works outside the display_map function but its purpose is unaffected.
    const todaysDate = date().toLocaleDateString(); // grabs the current date
    const markerPlace = document.getElementById("marker-position");
    let proper_pin = pinBasedOnCheckbox(); // gets the pin color from the pinBasedOnCheckbox function and assigning it to a variable
    console.log(proper_pin); // test
    let incident = defaultIncidents[current_color];
    if (pinDropActive) {
      markerPlace.textContent = e.latlng;
      markerIdCounter++;
      let markerId = `marker-${markerIdCounter}`;
      const marker = L.marker(e.latlng, {
        icon: proper_pin,
        draggable: true,
        xy: e.latlng,
        layer: current_layer,
        id: markerId,
        color: current_color,
        date: todaysDate,
        incidentType: incident,
        studentId: "",
        details: "",
      }).addTo(mapInstance); //adds pin

      markersById[markerId] = marker;

      for (const markerId in markersById) {
        // iterates through the all markers and assigns the marker a value
        if (markersById.hasOwnProperty(markerId)) {
          const marker = markersById[markerId];
          marker.on("click", function () {
            currentMarked = markersById[markerId];
            console.log(`${currentMarked.details}, id: ${currentMarked.id}`);
            INCIDENT_DETAILS.value = currentMarked.details;
            STUDENT_ID.value = currentMarked.id;
            FLOOR.value = currentMarked.layer;
            console.log("Hey Hey Hey Hello I've been clicked!"); // test
            openHamburgerMenu();
            updatePinDetails(markersById[markerId]);
            currentMarked = markersById[markerId];
          });
        }
      }

      Object.keys(markersById).forEach((markerId) => {
        // for testing purposes
        const marker = markersById[markerId];
        const markerJSON = {
          id: marker.options.id, // Get the id from the marker options
          color: marker.options.color, // Get the color from the marker options
          layer: marker.options.layer, // Get the layer from the marker options
          xy: marker.options.xy, // Get the xy from the marker options
          date: marker.options.date,
          studentId: marker.options.studentId,
          details: marker.options.details,
          incidentType: marker.options.incidentType,
        };
        console.log(JSON.stringify(markerJSON));
      });

      const popupContent = document.createElement("div");
      popupContent.innerHTML = `${todaysDate} <i style="color: grey; font-size: smaller;">${markerId}</i><br><button type="button" class="remove" id=${markerId}>delete marker 💔</button>`;
      marker.bindPopup(popupContent); // binds popup to maker on click containing the date the marker was placed and the button to delete the marker

      const removeButton = popupContent.querySelector("button.remove");
      removeButton.onclick = function removeMarker() {
        const markerToRemove = markersById[markerId];
        if (markerToRemove) {
          mapInstance.removeLayer(markerToRemove); //removes selected marker from the map
          delete markersById[markerId];
        }
      };
    }
  });
}

function openHamburgerMenu() {
  const showThingy = document.getElementById("hide-me-pls");
  const hideThingy = document.getElementById("so-cold");
  showThingy.style.display = "block";
  hideThingy.style.display = "none";

  if (HAMBURGER_MENU.checked == false) {
    HAMBURGER_MENU.checked = true;
  }
}

function updatePinDetails(pin_marker) {
  // inside the sidebar menu changes the big pin based on selected pin
  const MARKER_ID_DISPLAY = document.getElementById("marker-id-counter");
  STUDENT_ID.value = pin_marker.options.studentId;
  INCIDENT_DETAILS.value = pin_marker.options.details;
  FLOOR.value = pin_marker.options.layer;
  MARKER_ID_DISPLAY.textContent = pin_marker.options.id;
  INCIDENT_TYPE.value = pin_marker.options.incidentType;
  const img = document.getElementById("pin-display");
  img.src = pictureDict[pin_marker.options.color]; // changes the big pin
}

function saveDetails() {
  //save details and assign it to the marker
  currentMarked.options.details = INCIDENT_DETAILS.value;
  currentMarked.options.studentId = STUDENT_ID.value;
  currentMarked.options.incidentType = INCIDENT_TYPE.value;
  savedPopup();
}

function savedPopup() {
  // toggle the thingy
  SAVED_POPUP.classList.toggle("active");
  setTimeout(function () {
    SAVED_POPUP.classList.toggle("active");
  }, 3000);
}

function pinBasedOnCheckbox() {
  // indexes the pinList dict with the current color and returns the corresponding active icon

  const key = Object.keys(pinList).find((k) => k === current_color);
  return pinList[key]; //returns the icon
}

function masterMarkerDisplay() {
  // function to display markers depending on the layer
  for (let markerId in markersById) {
    if (markersById.hasOwnProperty(markerId)) {
      let marker = markersById[markerId];

      if (current_layer === "top") {
        if (marker.options.layer === "norm") {
          if (mapInstance.hasLayer(marker)) {
            mapInstance.removeLayer(marker);
          }
        } else {
          if (!mapInstance.hasLayer(marker)) {
            marker.addTo(mapInstance);
          }
        }
      } else {
        if (marker.options.layer === "top") {
          if (mapInstance.hasLayer(marker)) {
            mapInstance.removeLayer(marker);
          }
        } else {
          if (!mapInstance.hasLayer(marker)) {
            marker.addTo(mapInstance);
          }
        }
      }
    }
  }
  if (currentView === "DATABASE VIEW") {
    for (let markerId in serverMarkersById) {
      if (serverMarkersById.hasOwnProperty(markerId)) {
        console.log("helllo poopie");
        let marker = serverMarkersById[markerId];

        if (current_layer === "top") {
          if (marker.options.layer === "norm") {
            if (mapInstance.hasLayer(marker)) {
              mapInstance.removeLayer(marker);
            }
          } else {
            if (!mapInstance.hasLayer(marker)) {
              marker.addTo(mapInstance);
            }
          }
        } else {
          if (marker.options.layer === "top") {
            if (mapInstance.hasLayer(marker)) {
              mapInstance.removeLayer(marker);
            }
          } else {
            if (!mapInstance.hasLayer(marker)) {
              marker.addTo(mapInstance);
            }
          }
        }
      }
    }
  } else {
    console.log("peepeepie");
    for (let marker in serverMarkersById) {
      mapInstance.removeLayer(serverMarkersById[marker]);
    }
  }
}

function close_create_incident() {
  var blurBackground = document.querySelector(".blur-background");
  blurBackground.style.display = "none";
}

function create_incident() {
  var selectedValue = INCIDENT_TYPE.value;
  var blurBackground = document.querySelector(".blur-background");
  if (selectedValue === "create") {
    blurBackground.style.display = "flex";
  }
}

document
  .getElementById("studentId")
  .addEventListener("input", function (event) {
    // This event listener will log the input value to the console
    console.log("Current value:", event.target.value);
  });

function change_create_pic() {
  var redChecked = document.getElementById("red-checkie").checked;
  var blueChecked = document.getElementById("blue-checkie").checked;
  var greenChecked = document.getElementById("green-checkie").checked;
  var purpleChecked = document.getElementById("purple-checkie").checked;
  var picToChange = document.getElementById("selected-input-pic");

  if (redChecked) {
    console.log("i am red");
    picToChange.src = pictureDict["red"];
  }

  if (blueChecked) {
    console.log("i am blue");
    picToChange.src = pictureDict["blue"];
  }

  if (greenChecked) {
    console.log("i am greend");
    picToChange.src = pictureDict["green"];
  }

  if (purpleChecked) {
    console.log("i am purple");
    picToChange.src = pictureDict["purple"];
  }
}

function save_incident() {
  var redChecked = document.getElementById("red-checkie").checked;
  var blueChecked = document.getElementById("blue-checkie").checked;
  var greenChecked = document.getElementById("green-checkie").checked;
  var purpleChecked = document.getElementById("purple-checkie").checked;

  let colorToUse;

  let checkList = {
    redChecked: "red",
    blueChecked: "blue",
    greenChecked: "green",
    purpleChecked: "purple",
  };

  for (i in checkList) {
    if (i) {
      colorToUse = checkList[i];
      console.log(checkList[i]);
    }
  }

  let select_menu = document.getElementById("select-your-incident");
  let new_incident_value = document.getElementById("new-incident-input");
  let text_value = new_incident_value.value; // Corrected from textContent to value
  let new_text_value = text_value.replace(/ /g, "-");

  // Create a new option element
  let new_select_option = document.createElement("option");
  new_select_option.value = new_text_value.toLowerCase();
  new_select_option.textContent = text_value;

  // Append the new option to the select menu
  select_menu.appendChild(new_select_option);
  defaultIncidents[colorToUse] = new_select_option.value;

  close_create_incident();
  savedPopup();
  masterDataAdjust(false, new_text_value, false);
}

dropdownOptions.forEach((option) => {
  option.addEventListener("click", function () {
    textInput.value = this.textContent;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("map-view-selectRoot");
  const dropdownOptions = document.querySelectorAll(
    ".pin-view-dropdown-optionRoot"
  );
  const dropdown = document.querySelector(".pin-view-dropdown");
  const filter_btn = document.getElementById("filter-btn");

  inputField.addEventListener("focus", function () {
    dropdown.style.display = "block";
  });

  dropdownOptions.forEach((option) => {
    option.addEventListener("click", function () {
      inputField.value = this.textContent;
      dropdown.style.display = "none";
      // Trigger the change event manually since programmatic value changes do not trigger it
      inputField.dispatchEvent(new Event("change"));
    });
  });

  inputField.addEventListener("change", function () {
    console.log("Input field value changed to:", inputField.value);
    field = inputField.value;
    // You can perform any additional actions you need here
    if (inputField.value !== currentView) {
      filter_btn.style.backgroundColor = "#60c5ff";
    } else {
      filter_btn.style.backgroundColor = "#0000";
    }
  });
});

function commitFilter() {
  const filter_btn = document.getElementById("filter-btn");
  if (currentView !== field) {
    filter_btn.style.backgroundColor = "#0000";
    console.log("I have filtered");
    currentView = field;
    if (current_layer === "norm") {
      console.log(currentView);
    }
  } else {
    console.log("Make a change silly!");
  }
  masterMarkerDisplay();
}

const bounds = [
  // bounds for leaflet map
  [0, 0],
  [500, 1100],
];

mapInstance = L.map("map", {
  // establishes leaflet map
  crs: L.CRS.Simple,
  layers: [NORM_LAYER],
  maxZoom: 2,
  minZoom: -0.1,
  maxBounds: bounds,
});

const baseLayers = {
  // layers for leaflet map
  "Normal view": NORM_LAYER,
  "Top view": TOP_LAYER,
};

L.control.layers(baseLayers).addTo(mapInstance); // adds layers to map

mapInstance.on("baselayerchange", function (eventLayer) {
  // on base layer change click, changes the layer to wanted layer.
  if (eventLayer.name === "Normal view") {
    mapInstance.removeLayer(TOP_LAYER);
    L.imageOverlay(NORM_VIEW, bounds).addTo(mapInstance);
    current_layer = "norm";
  } else if (eventLayer.name === "Top view") {
    mapInstance.removeLayer(NORM_LAYER);
    L.imageOverlay(TOP_VIEW, bounds).addTo(mapInstance);
    current_layer = "top";
  }
  masterMarkerDisplay();
});

L.imageOverlay(NORM_VIEW, bounds).addTo(mapInstance);

mapInstance.fitBounds(bounds);

document.addEventListener("DOMContentLoaded", function () {
  fetch("/sendData")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data) {
        data.forEach((pinDetails) => {
          const xyObj = JSON.parse(pinDetails.xy);
          const newPin = L.marker([xyObj.lat, xyObj.lng], {
            icon: pinList[pinDetails.color],
            draggable: true,
            xy: xyObj,
            layer: pinDetails.layer,
            id: pinDetails.markerId,
            color: pinDetails.color,
            date: pinDetails.date,
            studentId: pinDetails.studentId,
            details: pinDetails.details,
            incidentType: pinDetails.incidentType,
          });

          // Use pinDetails.markerId as the key
          serverMarkersById[pinDetails.markerId] = newPin;
          console.log(serverMarkersById);
          console.log("separator\n");

          // Binding popup to the new marker
          const popupContent = document.createElement("div");
          popupContent.innerHTML = `${newPin.options.date} <i style="color: grey; font-size: smaller;">${newPin.options.id}</i><i style = "color: red; font-size: medium;">*</i><br><button type="button" class="remove" id=${newPin.options.id}>delete marker 💔</button>`;
          newPin.bindPopup(popupContent); // Bind popup to the marker

          const removeButton = popupContent.querySelector("button.remove");
          removeButton.onclick = function removeMarker() {
            const markerToRemove = serverMarkersById[newPin.options.id];
            console.log(markerToRemove);
            if (markerToRemove) {
              mapInstance.removeLayer(markerToRemove); // Removes selected marker from the map
              delete serverMarkersById[newPin.options.id];
            }
          };

          newPin.on("click", function () {
            currentMarked = serverMarkersById[newPin.options.id];
            INCIDENT_DETAILS.value = currentMarked.options.details;
            STUDENT_ID.value = currentMarked.options.studentId;
            FLOOR.value = currentMarked.options.layer;
            openHamburgerMenu();
            updatePinDetails(currentMarked);
            currentMarked = serverMarkersById[newPin.options.id];
          });
        });

        const valuesArray = Object.values(serverMarkersById);
        if (valuesArray.length > 0) {
          const lastEntry = valuesArray[valuesArray.length - 1];
          console.log(lastEntry.options.id);

          // Find the highest marker ID
          let highestMarkerId = 0;
          valuesArray.forEach((marker) => {
            const markerId = marker.options.id;
            const markerNumber = parseInt(markerId.split("-")[1]);

            if (markerNumber > highestMarkerId) {
              highestMarkerId = markerNumber;
              markerIdCounter = highestMarkerId;
            }
          });

          console.log("Highest Marker ID:", highestMarkerId);
        } else {
          console.log("serverMarkersById is empty");
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function masterDataAdjust(add, change, del) {
  if (add === true) {
    returnList = [];
    console.log("poopie ");
    for (let markerId in markersById) {
      markerToAppend = [];
      j = markersById[markerId];
      markerToAppend.push(j.options.id);
      markerToAppend.push(j.options.color);
      markerToAppend.push(j.options.layer);
      markerToAppend.push(`${j.options.xy}`);
      markerToAppend.push(j.options.date);
      markerToAppend.push(j.options.studentId);
      markerToAppend.push(j.options.details);
      markerToAppend.push(j.options.incidentType);
      returnList.push(markerToAppend);
    }
    addDbData(returnList);
  }
  if (change === true) {
  }
  if (del === true) {
  }
  /* if (
    alert(
      "This page will refresh to apply your changes? Do you wish to proceed?"
    )
  ) {
  } else window.location.reload();
  */
}

function addDbData(data) {
  fetch("/append", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
