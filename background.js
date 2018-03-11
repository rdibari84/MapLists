
//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("heard browser action");
    send_message( "browser_action_clicked");
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
    //send_message("history_on_visited");
});

function send_message(value){
    // Send a message to the active tab                                                                                                                                                                                                  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": value});
	console.log("sent message: ", value, "!");
    });
}

