var colorkey = "cafeColor";
var apikey = "apikey";
var colorToSet = "red";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // if this is the first time the extension has been loaded
    if (request.message["message"] == "firstTime") {
      console.log("firstTime!");
      saveStorage(apikey, request.message[apikey]); // saving the apikey
      // getStorage(apikey).then( function(value) {
      //   googleMapsAPI(value);
      // });
      sendResponse("recieved message");
    } // firstTime

    addSelectColorButton();
    addSelectColorButtonFunctionality();

    addDisplayMapButton();
    addDisplayMapButtonFunctionality();

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

  // add the actual google map code- sourcing googlemapscode.js and inserting the contents into a script tag
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

////// select color button

function addSelectColorButton() {
  var parent = document.getElementById("context-menu");
  var existingElement = document.getElementById("newOutterDiv");
  if (parent != null && existingElement == null) {
    // outter most div
    console.log("adding select color button");
    var d = document.createElement('div');
    d.id = "newOutterDiv";
    d.className = "context-menu-entry kd-menulistitem dropright show";
    parent.appendChild(d);

    // Select Color Button
    var justMadeDiv = document.getElementById("newOutterDiv");
    var b = document.createElement('button');
    b.id = "selectColorButton";
    b.className = "context-menu-entry-text dropdown-toggle";
    b.setAttribute("data-toggle", "dropdown");
    b.innerText = "Select Color";
    justMadeDiv.appendChild(b);

    // the dropdown content
    var dropdownDiv = document.createElement('div');
    dropdownDiv.className="dropdown-menu";
    dropdownDiv.setAttribute("aria-labelledby","dropdownMenuLink");
    justMadeDiv.appendChild(dropdownDiv);

    var item1 = document.createElement('a');
    item1.className = "dropdown-item";
    item1.id = "redColor";
    item1.href = "#";
    item1.innerText = "Red";
    dropdownDiv.appendChild(item1);

    var item2 = document.createElement('a');
    item2.className = "dropdown-item";
    item2.id = "blueColor";
    item2.href = "#";
    item2.innerText = "Blue";
    dropdownDiv.appendChild(item2);

    var item2 = document.createElement('a');
    item2.className = "dropdown-item";
    item2.id = "yellowColor";
    item2.href = "#";
    item2.innerText = "Yellow";
    dropdownDiv.appendChild(item2);
  }
}

function addSelectColorButtonFunctionality(){
  $('#blueColor').click( function() {
    console.log("clicked the color blue!");
    var mylist = accessListElements();
    setListColor(mylist, "blue");
    saveStorage(colorkey, "blue"); // saving the new
  });

  $('#redColor').click( function() {
    console.log("clicked the color red!");
    var mylist = accessListElements();
    setListColor(mylist, "red");
    saveStorage(colorkey, "red"); // saving the new
  });

  $('#yellowColor').click( function() {
    console.log("clicked the color yellow!");
    var mylist = accessListElements();
    setListColor(mylist, "yellow");
    saveStorage(colorkey, "yellow"); // saving the new
  });
}

////// DisplayMap Button

function addDisplayMapButtonFunctionality(){
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
