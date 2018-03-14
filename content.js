
var colorkey = "cafeColor";
var apikey = "apikey";
var colorToSet = "red";

chrome.runtime.onMessage.addListener(
  function(request) {

    // if this is the first time the extension has been loaded
    if (request.message["message"] == "firstTime") {
      console.log("firstTime!");
      var mylist = accessListElements();
      setListColor(mylist, colorToSet);
      saveInfo(colorkey, colorToSet);
      // see if apikey has been saved
      getStorage(apikey).then( function(value) {
        console.log(apikey, value);
        if (value == null) {
            value = request.message["apikey"];
            saveInfo(apikey, value);
            loadScript("https://maps.googleapis.com/maps/api/js?key="+value+"&callback=initMap");
        }
      });
    } // firstTime

  }// close function
); // close chrome extension

getStorage(colorkey).then( function(value) {
  var mylist = accessListElements();
  setListColor(mylist, value);
});


///////////////// Helper Methods ///////////////////////////

function getStorage(key){
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(key, function(result) {
      console.log(key, result[key]);
      resolve(result[key]);
    }); // close chrome.storage.sync.get
  }); // new Promise
}

function loadScript(url){
  console.log("loading script. url: ", url);
  var script = document.createElement("script");
  script.src = url;
  script.defer = true;
  document.body.appendChild(script);
}

function initMap() {
  bounds = new google.maps.Map.getBounds();
  console.log("map bounds: {}", bounds)
  // map = new google.maps.Map(document.getElementById('map'), {
  //     center: {
  //         lat: -34.397,
  //         lng: 150.644
  //     },
  //     zoom: 10
  // });
}

function setListColor(mylist, color){
  mylist.forEach( function(currentValue) {
    element = currentValue;
    textElement = element.querySelector("div.section-list-item-text");
    icon = element.querySelector("div.section-common-icon");

    if (textElement.textContent.includes('cafe')) {
      icon.style.backgroundColor = color;
    }
  });
}

function accessListElements() {
  var singleElement = document.querySelectorAll("div.section-common-icon");
  var savedPlacesList = document.querySelectorAll("button.section-list-item-content.section-list-item-button");
  return savedPlacesList;
}

function saveInfo(key, value) {
  var obj = {}
  obj[key]=value;
  chrome.storage.sync.set(obj, function(){
    console.log("saving ", key);
  });

  // make sure its saved
  chrome.storage.sync.get(key, function(result) {
    var value = result[key];
  });
}

// <div class="dropdown">
//   <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//     Dropdown button
//   </button>
//   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//     <a class="dropdown-item" href="#">Action</a>
//     <a class="dropdown-item" href="#">Another action</a>
//     <a class="dropdown-item" href="#">Something else here</a>
//   </div>
// </div>
