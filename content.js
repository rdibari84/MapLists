
var key = "cafeColor";
var apikey;

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {

	if (request.message.startsWith("A")) {
	    apikey = request.message;
	}

	if (request.message == "browser_action_clicked") {
	    console.log("browser_action_clicked");
	    var mylist = accessListElements();
	    setListColor(mylist, "red", true);
	} // close browser action

	if (request.message == "history_on_visited") { 
	    console.log("checking if there is a saved color");
	    chrome.storage.sync.get("cafeColor", function(result) {
		console.log("color: ", result[key]);
		if (result.key != 'undefined') {
		    var mylist = accessListElements();
		    setListColor(mylist, result[key], false);
		} else {
		    console.log("color is undefined");
		}
	    });
	} // close history
    } // close function
); // close chrome extension

function setListColor(mylist, color, saveObject){
    mylist.forEach( function(currentValue) { 
	element = currentValue;
	textElement = element.querySelector("div.section-list-item-text");
	icon = element.querySelector("div.section-common-icon");
	
	if (textElement.textContent.includes('cafe')) {
	    icon.style.backgroundColor = color;
	    if (saveObject) {
		save_options("cafeColor", color);
	    }
	}
    });
}

function accessListElements() {
    var singleElement = document.querySelectorAll("div.section-common-icon");
    var savedPlacesList = document.querySelectorAll("button.section-list-item-content.section-list-item-button");
    return savedPlacesList;
}

function save_options(key, value) {
    var obj = {}
    obj[key]=value;
    chrome.storage.sync.set(obj, function(){
        console.log("saving data: ", obj);
    });

    // make sure its saved
    chrome.storage.sync.get(key, function(result) {
	var color = result[key];
	if (color == 'undefined') {
	    // throw error
	}
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
