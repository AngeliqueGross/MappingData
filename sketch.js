//I created this map to visualize hate crime incidents reported in the United states from the FBI in 2021. There was a sharp increase in hate crimes and this map shows where the most incidents were reported visualized by ellipses.

//The data can be found here:  //https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/explorer/crime/hate-crime

//I used the Mappa library along with Leaflet to load a tile map. I used a json file with the longitute and latitude of each state to plot the data.

//I based this project on The Coding Train challenge 109 which mapped subscriber data but I made changes to adapt it to my needs.

//Declare global functions.
let hateData;
let states = [];

let mappa;
let hateMap;
let canvas;

let data = [];

const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
};

//Preloaded my data. Added 'header' to preload lets it know that the top row is the header to get the colums of data from.

function preload() {
  hateData = loadTable("hate.csv", "csv", "header");

  states = loadJSON("USstates.json");
}

//At setup I created the canvas, the map, the overlay for data, and then created an array to hold the values of the states and the incidents reported.

function setup() {
  console.log(states.states);
  canvas = createCanvas(windowWidth, windowHeight);

  mappa = new Mappa("Leaflet");
  hateMap = mappa.tileMap(options);
  hateMap.overlay(canvas);

  let maxInc = 0;
  let minInc = Infinity;

  for (let row of hateData.rows) {
    let state = row.get("Participating_state").toLowerCase();
    let lat = 0;
    let lon = 0;

    //console.log(states) things got a little messy here. I shouldn't have used state so many times. 
    for (let i = 0; i < states.states.length; i++) {
      console.log("ArrayState: " + states.states[i].state + " Name: " + state);
      if (states.states[i].state.toLowerCase() === state) {
        lat = states.states[i].latitude;
        lon = states.states[i].longitude;
        let count = Number(row.get("incidents_reported"));

        data.push({
          lat,
          lon,
          count,
        });

        if (count > maxInc) {
          maxInc = count;
        }
        if (count < minInc) {
          minInc = count;
        }
      }
    }
  }

  let minD = sqrt(minInc);
  let maxD = sqrt(maxInc);

  for (let state of data) {
    state.diameter = map(sqrt(state.count), minD, maxD, 1, 5);
  }
}
//the draw function creates the ellipses over states and creates the size of the ellipse based on the number of incidents reported.
function draw() {
  clear();
  for (let state of data) {
    const pix = hateMap.latLngToPixel(state.lat, state.lon);
    fill(frameCount % 255, 0, 200, 100);
    const zoom = hateMap.zoom();
    const scl = pow(2, zoom);
    ellipse(pix.x, pix.y, state.diameter * scl);
  }
}
