function loadPage() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    var lats = crd.latitude;
    var long = crd.longitude;

    var coordinates = { lat: lats, lng: long };
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: coordinates,
    });
    var marker = new google.maps.Marker({ position: coordinates, map: map });
    findDonut(lats, long);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  function findDonut(lats, long) {
    var pyrmont = new google.maps.LatLng(lats, long);

    map = new google.maps.Map(document.getElementById("map"), {
      center: pyrmont,
      zoom: 15,
    });

    var request = {
      location: pyrmont,
      radius: "500",
      query: "restaurant",
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          console.log(place);
          //   createMarker(results[i]);
        }
      }
    }
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

var api = "AIzaSyDPDVh2zxw_0DqmSUxfeAW-Zzdhh5cWA3o";

function initMap() {
  // The location of Uluru
  var uluru = { lat: 45.519692, lng: -122.680496 };
  // The map, centered at Uluru
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: uluru, map: map });
}
