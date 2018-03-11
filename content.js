//alert("Hello FooBar from your Chrome extension!")
//console.log("Hello World!");

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
	console.log("onMessage! request: ", request.message);

	if (request.message == "browser_action_clicked") {
	    console.log("browser_action_clicked");
	    var mylist = accessListElements();
	    mylist.forEach( function(currentValue, currentIndex, listObj) { 
		element = currentValue;
		textElement = element.querySelector("div.section-list-item-text");
		//console.log('text: ', textElement.textContent);
		icon = element.querySelector("div.section-common-icon");
		//console.log('icon color: ', icon.style.backgroundColor);
		
		if (textElement.textContent.includes('cafe')) {
		    save_options(icon, "cafeColor", "red");
		}
	    });
	} // close browser action

	if (request.message == "history_on_visited") {
	    console.log("history_on_visited");
	    console.log("checking if there is a saved color");
	    get_data("cafeColor", function (value) {
		console.log(value);
		if (value != 'undefined') {
		    var list = accessListElements();
		    list.forEach(
			function(currentValue, currentIndex, listObj) {
			    element = currentValue;
			    textElement = element.querySelector("div.section-list-item-text");
			    //console.log('text: ', textElement.textContent);
			    icon = element.querySelector("div.section-common-icon");
			    if (textElement.textContent.includes('cafe')) {
				icon.style.backgroundColor = 'red';
				console.log("setting icon background to ", value);
			    }
			}
		    );
		}
	    });
	} // close history
    } // close function
); // close chrome extension

function accessListElements() {
    var singleElement = document.querySelectorAll("div.section-common-icon");
    console.log(singleElement);

    var savedPlacesList = document.querySelectorAll("button.section-list-item-content.section-list-item-button");
    console.log(savedPlacesList);
    
    return savedPlacesList;
}

function save_options(html, key, value) {
    html.style.backgroundColor = value;
    chrome.storage.sync.set({ key: value }, function(){
        console.log("saving data. {", key, ":", value, "}");
    });
}

function get_data(value, callback) {
    var items = chrome.storage.sync.get(value, callback);
    return items;
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
