//Defining map as a global variable
let map;

//Defining a global drawingManager object
let drawingManager;

//Defining a global marker object
let marker;

//Defining a global newShape
let newShape;

//Defining a shape that has been selected
let selectedShape;

//Defining an array of polygons
let polygonArray = [];

function initMap(){
  //Creating a new map with the center in London
   map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: 51.507, lng: 0.127 }
  });

  //Creating a drawing manager object containing the drawing tools
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.POLYGON
      ],
    },
    markerOptions: {
      draggable: true,
      clickable: true,
    },
    polygonOptions: {
      draggable: true,
      editable: true,
      clickable: true
    }
  });
  drawingManager.setMap(map);

  /*Adding functionality to check if a clicked point lies inside a polygon or
    outside
  */
  google.maps.event.addListener(map, "click", function(E){
  alert(E.latLng + " does not lie inside a polygon");
  });
  google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
    var coordinatesArray = e.overlay.getPath().getArray();
    google.maps.event.addListener(e.overlay, "click", function(event){
      if(google.maps.geometry.poly.containsLocation(event.latLng, e.overlay)){
      alert(event.latLng + " lies inside the polygon with paths: " + coordinatesArray);
    }
  });
  });
}
