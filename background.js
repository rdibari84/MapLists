//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("chrome.browserAction.onClicked");
  objToSend = {}
  objToSend["message"]="firstTime";
  get_apikey().then( function(value) {
    objToSend["apikey"]=value;
    send_message(objToSend);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId,info, tab) {
   if (info.status == "complete") {
     console.log("chrome.tabs.onUpdated!");
      objToSend = {}
      objToSend["message"]="updated";
      send_message(objToSend);
   }
});

///////////////// Helper Methods ///////////////////////////

function send_message(value){
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": value}, function(response){console.log("response: ", response)});
    console.log("sent message: ", value, "!");
  });
}

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() {
      if (req.status == 200) {
        console.log("sucessfully loaded the file: ", url);
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
