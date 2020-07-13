var api = "AIzaSyDPDVh2zxw_0DqmSUxfeAW-Zzdhh5cWA3o";
function findDonut() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function giphyDonut(cb) {
  var mapi = `7707V2ugjiHVu7IBmawngyunCUKEIfxE`;
  var queryURL = `http://api.giphy.com/v1/gifs/search?q=donut&api_key=${mapi}&limit=100`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var rand = Math.floor(Math.random() * 100) + 1;
    var randResponse = response.data[rand];
    var gifUrl = randResponse.images.fixed_height.url;
    var gifTitle = randResponse.title;
    $(".victory").attr({
      src: gifUrl,
      alt: gifTitle,
    });

    cb(response);
  });
}

function initMap() {
  // The location of VOODOO
  var voodoo = { lat: 45.519692, lng: -122.680496 };
  // The map, centered at VOODOO
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: voodoo,
  });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: voodoo, map: map });
}

function error(err) {
  console.log(err);
}

function mapDonut(lats, long) {
  var pyrmont = new google.maps.LatLng(lats, long);

  map = new google.maps.Map(document.getElementById("map"), {
    center: pyrmont,
    zoom: 12,
  });

  var request = {
    location: pyrmont,
    radius: "500",
    query: "donut",
  };

  service = new google.maps.places.PlacesService(map);

  service.textSearch(request, callback);

  function callback(results, status) {
    var closest = results[0];
    openDialog(closest);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var place = results[0];
      var id = place.place_id;

      createMarker(results[0]);
      var idUrl = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,rating,review,formatted_phone_number&key=${api}`;
      $.ajax({
        url: idUrl,
        method: "GET",
      }).then(function (results) {
        var review = results.result.reviews;
        var liText =
          `<li><p>Author:` +
          review[0].author_name +
          `</p><p>Rating: ` +
          review[0].rating +
          `</p><p>` +
          review[0].text +
          `</p></li>`;
        $("#ratingText").append(liText);
      });
    }
  }
  function createMarker(place) {
    new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });
  }
}

function openDialog(closest) {
  giphyDonut(function (response) {
    var dis = response;
  });

  var name = closest.name;
  var address = closest.formatted_address;
  var isOpen = closest.opening_hours.isOpen();
  $(".donut-shop-name").text(name);
  $(".donut-shop-address").text(address);
  $("#dialog").dialog({
    buttons: [
      {
        text: "Ok",
        click: function () {
          $(this).dialog("close");
        },

        // Uncommenting the following line would hide the text,
        // resulting in the label being used as a tooltip
        //showText: false
      },
    ],
  });
}

function success(pos) {
  var crd = pos.coords;
  var lats = crd.latitude;
  var long = crd.longitude;
  successDrawMap(lats, long);
}

function successDrawMap(lats, long) {
  var coordinates = { lat: lats, lng: long };
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: coordinates,
  });
  var marker = new google.maps.Marker({ position: coordinates, map: map });
  mapDonut(lats, long);
}
$("#zip").on("submit", function (e) {
  zipDonut(e);
});

function zipDonut(event) {
  event.preventDefault();
  var zip = $("#distant-input").val();
  var api = "AIzaSyDPDVh2zxw_0DqmSUxfeAW-Zzdhh5cWA3o";
  var zipUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${api}&components=postal_code:${zip}`;

  $.ajax({
    url: zipUrl,
    method: "GET",
  }).then(function (response) {
    var lats = response.results[0].geometry.location.lat;
    var long = response.results[0].geometry.location.lng;
    successDrawMap(lats, long);
  });
}
