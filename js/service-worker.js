const SETTINGS_COMMENTS_KEY = "settings:comments"
const SETTINGS_HOMEPAGE_KEY = "settings:homepage"
const SETTINGS_WATCHPAGESUGGESTIONS_KEY = "settings:watchPageSuggestions"

const writeStorageData = (storageKey, value, callback) => {
    chrome.storage.local.set({[storageKey]: value}, function() {
        callback(value)
    })
}
chrome.runtime.onInstalled.addListener(function (details) {
    if(details.reason === "install"){ // call a function to handle a first install
        // by default, set all to true
        writeStorageData(SETTINGS_COMMENTS_KEY, true, (value) => {})
        writeStorageData(SETTINGS_HOMEPAGE_KEY, true, (value) => {})
        writeStorageData(SETTINGS_WATCHPAGESUGGESTIONS_KEY, true, (value) => {})
    } else if(details.reason === "update") { /*call a function to handle an update */ }
})