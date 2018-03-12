
// called when Chrome starts
chrome.runtime.onStartup.addListener(function () {
    get_apikey().then( function(value) {
	send_message(value);
    });
});

//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("heard browser action");
    send_message( "browser_action_clicked");
    get_apikey().then( function(value) {
        send_message(value);
    });
});

// needed to display color when navigation to/from the web page occurs after first navigation has occured.
chrome.history.onVisited.addListener(function onVisited(tab) {
    console.log("onVisited!");
    send_message("history_on_visited");
});

// needed to load the color on first naviagtion to the page
// TODO: understand why just sending a message doesn't work
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"content.js"});
});

function send_message(value){
    // Send a message to the active tab                                                                                                                                                                                                  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": value});
	console.log("sent message: ", value, "!");
    });
}

function get(url) {
  return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.onload = function() {
	  if (req.status == 200) {
              console.log("loaded the file");
              resolve(req.response);
	  }
	  else {
              reject(Error(req.statusText));
	  }
      };
      req.onerror = function() {
	  reject(Error("Network Error"));
      };
      req.send();
  }); // close return promise;
}

function getJSON(file) {
  return get(file).then(JSON.parse);
}

function get_apikey(){
    return getJSON("config.json").then( function(config) {
	return config["API_KEY"];
    }, function(err) {
    	console.log("error: ", err);
	reject(err);
    })
}
