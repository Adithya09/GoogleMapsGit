//Defining map as a global variable
let map;

//Defining a global drawingManager object
let drawingManager;

//Defining a global marker object
let marker;

//Defining a global newShape
let newShape;

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
  google.maps.event.addListener(map, "click", function(event2){
  alert(event2.latLng + " does not lie inside the polygon");
  console.log(event2.latLng + "does not lie inside the polygon");
  });
  google.maps.event.addListener(drawingManager, "overlaycomplete", function(e){
    newShape = e.overlay;
    newShape.type = e.type;
    var coordinatesArray = newShape.getPath().getArray();
    google.maps.event.addListener(newShape, "click", function(event){
      if(google.maps.geometry.poly.containsLocation(event.latLng, newShape)){
      alert(event.latLng + " lies inside the polygon with paths: " + coordinatesArray);
    }
  });
});
}
