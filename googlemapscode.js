function initMap() {
  console.log("initMap!");
  var latlng = new google.maps.LatLng(52.5208941,13.3338992);
  var map = new google.maps.Map(document.querySelector('canvas'), {
    center: latlng,
    zoom: 10
  });

  var l = new google.maps.LatLng(52.513260, 13.465059);
  console.log("{ lat: ", l.lat(), ", long: ", l.lng(), "}");
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    },
    draggable: true,
    map: map
  });
  console.log("successfully set marker. ", marker);
}
