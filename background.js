
//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log("heard browser action");
    send_message(tab, "browser_action_clicked");
});

function send_message(tab, value){
    // Send a message to the active tab                                                                                                                                                                                                  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": value});
    });
}

chrome.history.onVisited.addListener(function onVisited(tab) {
    console.log("onVisited!");
    send_message(tab, "history_on_visited");
});

// captures pushNotifications
//chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
window.history.onPushState(function(details) {
    console.log("pushstate");
    chrome.tabs.executeScript(null,{file:"content.js"});
    //send_message(deatils, "browser_action_clicked");
});
