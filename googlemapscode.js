function initMap() {
  console.log("initMap!");
  var latlng = new google.maps.LatLng(52.5208941,13.3338992);

  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: latlng,
    zoom: 10
  });

  var l = new google.maps.LatLng(52.513260, 13.465059);
  console.log("{ lat: ", l.lat(), ", long: ", l.lng(), "}");
  var marker = new google.maps.Marker({
    position: l,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    },
    draggable: true,
    map: map
  });
  console.log("successfully set marker. ", marker);
}
//   var existingButtons = document.querySelector("div.gm-style-mtc");
//   console.log(existingButtons);
//   if (existingButtons != null) {
//     var d = document.createElement('div');
//     d.className="gm-style-mtc"
//     d.style="float: left";
//     d.position= "relative";
//     d.setAttribute("z-index", 0);
//     existingButtons.parentNode.appendChild(d);
//
//     var z = document.createElement('button');
//     z.id = "CustomMapButton";
//     z.type = "button";
//     z.className = "btn";
//     z.innerText = "Close Map";
//     z.position= "relative";
//     d.appendChild(z);
//   }
//
//   // $('#CustomMapButton').click( function(){
//   //     console.log("closing map");
//   // });
// }
