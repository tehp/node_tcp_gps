var x = 0;
var y = 0;
var name;

var markers = [];
var map;

function clearOverlays() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {
      lat: 49.249889599999996,
      lng: -123.00167519999998
    }
  });
  // marker = new google.maps.Marker({
  //   position: {
  //     lat: x,
  //     lng: y
  //   },
  //   map: map
  // });
}

setInterval(loop, 1000);

function loop() {

  deleteMarkers();
  var Httpreq = new XMLHttpRequest();

  Httpreq.open("GET", "http://159.65.109.194/json", false);
  Httpreq.send(null);

  json = JSON.parse(Httpreq.responseText);

  for (i in json) { // i bet this is incredibly inneficient for weird key dictionaries.
    for (j in json[i]) {

      var t = json[i][j];

      x = t.point.x;
      y = t.point.y;
      name = t.name;

      console.log("name: " + name + " (" + x + "," + y + ")");

      var marker = new google.maps.Marker({
        position: {
          lat: parseInt(x),
          lng: parseInt(y)
        },
        map: map,
        label: {
          color: 'black',
          fontWeight: 'bold',
          text: name
        },
        icon: {
          labelOrigin: new google.maps.Point(15, 50),
          url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
          size: new google.maps.Size(30, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 40),
        }
      });

      markers.push(marker);

      var lat_lon = new google.maps.LatLng(x, y); // mac_49.249889599999996_-123.00167519999998_
      marker.setPosition(lat_lon);
    }
  }
  setMapOnAll(map);
  showMarkers();
}


// GMAPS TOOLS

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}