
var colorkey = "cafeColor";
var apikey = "apikey";
var colorToSet = "red";
var map;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    // if this is the first time the extension has been loaded
    if (request.message["message"] == "firstTime") {
      console.log("firstTime!");
      var mylist = accessListElements();
      setListColor(mylist, colorToSet);
      saveInfo(colorkey, colorToSet);
      loadGoogleMapsAPI();
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

function loadGoogleMapsAPI(){
  getStorage(apikey).then( function(value) {
    if (value != null) {
      addScriptTag(null,function initMap() {
        var latlng = new google.maps.LatLng(52.5208941,13.3338992);
        map = new google.maps.Map(document.querySelector('canvas'), {
            center: latlng,
            zoom: 10
        });
        console.log("map (inside): ", map);
        return map;
        }
      );
      addScriptTag("https://maps.googleapis.com/maps/api/js?key="+value+"&callback=initMap",null);
    }
  });
}

function addScriptTag(url, code){
  var script = document.createElement("script");
  if (url != null) {
    script.src = url;
    script.defer = true;
    document.body.appendChild(script);
  } else if (code != null) {
    console.log(code);
    script.type = 'text/javascript';
    var code = code;
    try {
        script.appendChild(document.createTextNode(code));
        document.body.appendChild(script);
    } catch (e) {
      script.text = code;
      document.body.appendChild(script);
    }
  }
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
