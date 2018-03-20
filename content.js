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
      // getStorage(apikey).then( function(value) {
      //   googleMapsAPI(value);
      // });
      sendResponse("recieved message");
    } // firstTime

    addSetColorButton();
    addDisplayMapButton();
    addClickingFunctionality();

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

  // get size of current canvase
  var canvas = document.querySelector('canvas');
  console.log("canvas size. ", canvas.width, canvas.height)

  var elem = document.createElement('div');
  elem.id="map_canvas";
  elem.style.cssText = 'position:absolute;width:'+canvas.width+'px;height:'+canvas.height+'px;opacity:100;z-index:100;background:#000';
  document.body.appendChild(elem);
  console.log("appended map_canvas div");

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

//////////////////////// html additions ////////////////////

function addSetColorButton() {
  var parent = document.getElementById("context-menu");
  var existingElement = document.getElementById("newOutterDiv");
  if (parent != null && existingElement == null) {
    var d = document.createElement('div');
    d.id = "newOutterDiv";
    d.className = "context-menu-entry kd-menulistitem";
    parent.appendChild(d);
    var justMadeDiv = document.getElementById("newOutterDiv");
    // var innerDiv = document.createElement('div');
    // innerDiv.id = "newInnerDiv";
    // innerDiv.className = "context-menu-entry-text dropdown";
    // innerDiv.innerText = "HelloWorld";
    // justMadeDiv.appendChild(innerDiv);
    var innerDiv = document.createElement('button');
    innerDiv.id = "selectColor";
    innerDiv.className = "context-menu-entry-text btn btn-secondary dropdown-toggle";
    innerDiv.innerText = "HelloWorld";
    justMadeDiv.appendChild(innerDiv);

    var innerDiv = document.createElement('div');
    innerDiv.className = "dropdown-menu";
    innerDiv.innerHtml = `<a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>`;
    justMadeDiv.appendChild(innerDiv);
  }
}

function addClickingFunctionality(){
  // on click of custom button,
  // remove the selection from all other buttons and add selction to this one
  var list= document.getElementsByClassName("section-tab-bar-tab");
  $('#CustomMapButton').click(function() {
      for (var i = 0; i < list.length; i++) {
          var myelem = list[i];
          $(myelem).removeClass('section-tab-bar-tab-selected');
          $(myelem).addClass('section-tab-bar-tab-unselected');
      }
      $(this).removeClass('section-tab-bar-tab-unselected');
      $(this).addClass('section-tab-bar-tab-selected');
  });
  // on click of the other buttons,
  // remove the selection from custom button
  for (var i = 0; i < list.length; i++) {
      var myelem = list[i];
      if (myelem.id != "CustomMapButton") {
        $(myelem).click(function() {
          $('#CustomMapButton').removeClass('section-tab-bar-tab-selected');
          $('#CustomMapButton').addClass('section-tab-bar-tab-unselected');
        });
      }
    }
  }

function addDisplayMapButton(){
  var existingElement = document.getElementById("CustomMapButton");
  var allButtons = document.querySelector('div.section-tab-bar');
  if ( allButtons!=null & existingElement==null) {
    var z = document.createElement('button');
    z.id = "CustomMapButton";
    z.className = "section-tab-bar-tab ripple-container section-tab-bar-tab-unselected";
    z.innerText = "Display Map";
    allButtons.appendChild(z);
  }
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
