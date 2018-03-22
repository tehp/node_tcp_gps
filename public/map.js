var x = 0;
var y = 0;
var name;

var marker;
var map;

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

setInterval(loop, 5000);

function loop() {
  var Httpreq = new XMLHttpRequest();

  Httpreq.open("GET", "http://localhost:8080/json", false);
  Httpreq.send(null);

  json = JSON.parse(Httpreq.responseText);

  for (i in json) { // i bet this is incredibly inneficient for weird key dictionaries.
    for (j in json[i]) {

      var t = json[i][j];
      x = t.point.x;
      y = t.point.y;
      name = t.name;
      console.log("name: " + name + " (" + x + "," + y + ")");

      var client_marker = new google.maps.Marker({
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
      var lat_lon = new google.maps.LatLng(x, y); // mac_49.249889599999996_-123.00167519999998_
      client_marker.setPosition(lat_lon);
    }
  }

}