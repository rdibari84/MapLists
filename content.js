/**
Important Note!!
- The name of the list is set as the id of the dropdown div.
- This id will be used as the storageKey when a color is selected (This links the button back to the icon)
- When looking to see which color to display for which list, the app will loop through all saved keys
and if it finds a list with that name, will color it
**/
var apikey = "apikey";

chrome.storage.sync.clear();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // if this is the first time the extension has been loaded
    if (request.message["message"] == "firstTime") {
      console.log("firstTime!");
      saveStorage(apikey, request.message[apikey]); // saving the apikey
      addDisplayMapButton();
      addDisplayMapButtonFunctionality();
      sendResponse("recieved message");
    } // firstTime

    getAllStorageKeys();
    addSelectColorButton();
    addSelectColorButtonFunctionality();

    if (request.message["message"] == "updated") {
      console.log("updated!");
      getAllStorageKeys();
      sendResponse("recieved message");
    }
  }// close function
); // close chrome extension

//////////////////////////////////////////////////////
///////////////// Helper Methods ///////////////////////////
//////////////////////////////////////////////////////

/*
chrome storage
*/
function getStorage(key){
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(key, function(result) {
      resolve(result[key]);
    }); // close chrome.storage.sync.get
  }); // new Promise
}

function getAllStorageKeys(){
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(null, function(result) {
      for (key in result) {
        //console.log("stored key: ", key);
        setColor(key, result[key])
      }
    }); // close chrome.storage.sync.get
  }); // new Promise
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

function setColor(listName, color){
  var mylist = accessListElements();
  mylist.forEach( function(currentValue) {
    element = currentValue;
    textElement = element.querySelector("div.section-list-item-text");
    icon = element.querySelector("div.section-common-icon");
    if (textElement.textContent.includes(listName)) {
      icon.style.backgroundColor = color;
      console.log("successfully set ", icon, " to color ", color);
    }
  });
}

function setColorOfElement(fullElement, color){
  console.log("fullElement ", fullElement);
  icon = element.querySelector("div.section-common-icon");
  icon.style.backgroundColor = color;
}


function accessListElements() {
  var savedPlacesList = document.querySelectorAll("button.section-list-item-content.section-list-item-button");
  return savedPlacesList;
}

//////////////////////// html additions ////////////////////

function createCallback(nameOfList){
  return function() {
    // check if the specific color button is already there.
    var existingElement = document.getElementById(nameOfList);
    console.log("existing color button: ", existingElement);
    if (existingElement == null) {
      var contextMenu = document.getElementById("context-menu");
      // check if there are other color buttons
      var otherElements = document.getElementsByClassName("dropright")
      if (otherElements.length > 0) {
        console.log("we found dups! removing");
        for(var i = 0; i < otherElements.length; i++){
          contextMenu.removeChild(otherElements[i])
        }
      }

      // outter most div
      console.log("adding select color button with id ", nameOfList);
      var d = document.createElement('div');
      d.id = nameOfList;
      d.className = "context-menu-entry kd-menulistitem dropright show";
      contextMenu.appendChild(d);

      // Select Color Button
      var b = document.createElement('button');
      b.id = nameOfList + "Button";
      b.className = "context-menu-entry-text dropdown-toggle";
      b.setAttribute("data-toggle", "dropdown");
      b.innerText = "Select Color";
      d.appendChild(b);

      // the dropdown content
      var dropdownDiv = document.createElement('div');
      dropdownDiv.className="dropdown-menu";
      dropdownDiv.setAttribute("aria-labelledby","dropdownMenuLink");
      d.appendChild(dropdownDiv);

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

      var item3 = document.createElement('a');
      item3.className = "dropdown-item";
      item3.id = "yellowColor";
      item3.href = "#";
      item3.innerText = "Yellow";
      dropdownDiv.appendChild(item3);

      var item4 = document.createElement('a');
      item4.className = "dropdown-item";
      item4.id = "greenColor";
      item4.href = "#";
      item4.innerText = "Green";
      dropdownDiv.appendChild(item4);

    }
  }
}

/*
Select Color Button
Important!! set the Name of the list as the dropdown id. this is the glue links the button back to the icon
*/
function addSelectColorButton(){
  var threeColons = document.querySelectorAll('div.maps-sprite-common-more.section-list-item-secondary-content');
  var elem;
  for (var i = 0; i < threeColons.length; i++) {
    var myelem = threeColons[i];
    var nameOfList = myelem.parentNode.parentNode.querySelector("div.section-list-item-text").textContent.trim().split(" ")[0];
    myelem.id = "helloworld" + i;
    $(myelem).click( createCallback(nameOfList));
  }
}

function addSelectColorButtonFunctionality(){
  $('#blueColor').click( function() {
    console.log("clicked the color blue for the id", this.parentNode.parentNode.id);
    setColor("blue");
    saveStorage(this.parentNode.parentNode.id, "blue"); // saving the new color
  });

  $('#redColor').click( function() {
    console.log("clicked the color red for the id", this.parentNode.parentNode.id);
    setColor("red");
    saveStorage(this.parentNode.parentNode.id, "red"); // saving the new
  });

  $('#yellowColor').click( function() {
    console.log("clicked the color yellow for the id", this.parentNode.parentNode.id);
    setColor("yellow");
    saveStorage(this.parentNode.parentNode.id, "yellow"); // saving the new
  });

  $('#greenColor').click( function() {
    console.log("clicked the color green for the id", this.parentNode.parentNode.id);
    setColor("green");
    saveStorage(this.parentNode.parentNode.id, "green"); // saving the new
  });
}

/*
Display Map Button
*/
function addDisplayMapButtonFunctionality(){
  // on click of custom button, remove the selection from all other buttons and add selction to this one
  var list= document.getElementsByClassName("section-tab-bar-tab");
  $('#CustomMapButton').click(function() {
    for (var i = 0; i < list.length; i++) {
      var myelem = list[i];
      $(myelem).removeClass('section-tab-bar-tab-selected');
      $(myelem).addClass('section-tab-bar-tab-unselected');
    }
    $(this).removeClass('section-tab-bar-tab-unselected');
    $(this).addClass('section-tab-bar-tab-selected');

    getStorage(apikey).then(function(value) {
      googleMapsAPI(value);
    });
  });
  // on click of the other buttons, remove the selection from custom button
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

/*
google maps
*/
function googleMapsAPI(apikey){
  console.log("loading api");

  // get size of current canvase
  var canvas = document.querySelector('canvas');
  console.log("canvas size. ", canvas.width, canvas.height)

  var container = document.createElement('div');
  container.className="canvas-container";
  container.style.position= "relative";
  container.style.width= canvas.width;
  container.style.height = canvas.height;
  document.body.appendChild(container);

  var elem = document.createElement('div');
  elem.id="map_canvas";
  elem.style.cssText = 'position:absolute;width:'+canvas.width+'px;height:'+canvas.height+'px;opacity:100;z-index:100;background:#000';
  //elem.style.cssText = 'opacity:100;z-index:100;background:#000';
  //document.body.appendChild(elem);
  container.appendChild(elem);
  console.log("appended map_canvas div");

  var z = document.createElement('button');
  z.id = "CustomMapButton";
  z.type = "button";
  z.className = "btn";
  z.innerText = "Close Map";
  z.style.position= "absolute";
  z.style.top= "30%";
  z.style.left= "40%";
  container.appendChild(z);


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
