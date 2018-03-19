var colorkey = "cafeColor";
var apikey = "apikey";
var colorToSet = "red";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // if this is the first time the extension has been loaded
    if (request.message["message"] == "firstTime") {
      console.log("firstTime!");
      var mylist = accessListElements();
      setListColor(mylist, colorToSet);
      saveStorage(colorkey, colorToSet); // saving the new color
      saveStorage(apikey, request.message[apikey]); // saving the apikey
      getStorage(apikey).then( function(value) {
        googleMapsAPI(value);
      });

      sendResponse("recieved message");
    } // firstTime

    if (request.message["message"] == "updated") {
      console.log("updated!");
      getStorage(colorkey).then( function(value) {
        var mylist = accessListElements();
        setListColor(mylist, value);
      });
      sendResponse("recieved message");
    }
  }// close function
); // close chrome extension

///////////////// Helper Methods ///////////////////////////

function getStorage(key){
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(key, function(result) {
      resolve(result[key]);
    }); // close chrome.storage.sync.get
  }); // new Promise
}

function googleMapsAPI(apikey){
  console.log("loading api");

  var script = document.createElement("script");
  script.src = chrome.extension.getURL("googlemapscode.js");
  script.type = 'text/javascript';
  document.body.appendChild(script);
  console.log("appended script tag with api");

  // source the api
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key="+apikey+"&callback=initMap";
  script.defer = true;
  script.async = false;
  document.body.appendChild(script);
  console.log("appended script tag with api");
}

function setListColor(mylist, color){
  mylist.forEach( function(currentValue) {
    element = currentValue;
    textElement = element.querySelector("div.section-list-item-text");
    icon = element.querySelector("div.section-common-icon");

    if (textElement.textContent.includes('cafe')) {
      console.log("text contains 'cafe'");
      icon.style.backgroundColor = color;
    }
  });
}

function accessListElements() {
  var singleElement = document.querySelectorAll("div.section-common-icon");
  var savedPlacesList = document.querySelectorAll("button.section-list-item-content.section-list-item-button");
  return savedPlacesList;
}

function saveStorage(key, value) {
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
