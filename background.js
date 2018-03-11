
//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("heard browser action");
    send_message( "browser_action_clicked");
});

chrome.history.onVisited.addListener(function onVisited(tab) {
    console.log("onVisited!");
    send_message("history_on_visited");
});

function send_message(value){
    // Send a message to the active tab                                                                                                                                                                                                  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": value});
	console.log("sent message: ", value, "!");
    });
}

