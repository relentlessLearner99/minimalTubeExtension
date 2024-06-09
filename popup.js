document.getElementById('close-me-home').addEventListener(
    'click',
    function (){
        window.close();
    }
)

document.getElementById('btn-link-to-zecento').addEventListener(
    'click',
    function (){
        window.open('https://www.zecento.com/z-zecento/?src=minimalTube');
    })

const readStorageData = (storageKey, callback) => {
    chrome.storage.local.get([storageKey], function(result) {
        const value = result[storageKey]
        callback(value)
    })
}

const writeStorageData = (storageKey, value, callback) => {
    chrome.storage.local.set({[storageKey]: value}, function() {
        callback(value)
    })
}

function activateToggle(selector){
    document.querySelector(selector).style.justifyContent = 'flex-end'
    document.querySelector(selector).style.backgroundColor = '#33c85a'
}

function deactivateToggle(selector){
    document.querySelector(selector).style.justifyContent = 'flex-start'
    document.querySelector(selector).style.backgroundColor = '#e9e9e9'
}

const SETTINGS_COMMENTS_KEY = "settings:comments"
const SETTINGS_HOMEPAGE_KEY = "settings:homepage"
const SETTINGS_WATCHPAGESUGGESTIONS_KEY = "settings:watchPageSuggestions"

function hookUpHomePage(){
    readStorageData(SETTINGS_HOMEPAGE_KEY, (value) => {
        if(value){
            activateToggle("#bt_att_homepage")
        } else {
            deactivateToggle("#bt_att_homepage")
        }
    })
    // add onclick
    document.querySelector("#bt_att_homepage").onclick = function(){
        readStorageData(SETTINGS_HOMEPAGE_KEY, (value) => {
            writeStorageData(SETTINGS_HOMEPAGE_KEY, !value, (value) => {
                hookUpHomePage()
            })
        })
    }
}

// bt_att_suggestions

function hookUpWatchPage(){
    readStorageData(SETTINGS_WATCHPAGESUGGESTIONS_KEY, (value) => {
        if(value){
            activateToggle("#bt_att_suggestions")
        } else {
            deactivateToggle("#bt_att_suggestions")
        }
    })
    // add onclick
    document.querySelector("#bt_att_suggestions").onclick = function(){
        readStorageData(SETTINGS_WATCHPAGESUGGESTIONS_KEY, (value) => {
            writeStorageData(SETTINGS_WATCHPAGESUGGESTIONS_KEY, !value, (value) => {
                hookUpWatchPage()
            })
        })
    }
}

// bt_att_comments

function hookUpComments(){
    readStorageData(SETTINGS_COMMENTS_KEY, (value) => {
        if(value){
            activateToggle("#bt_att_comments")
        } else {
            deactivateToggle("#bt_att_comments")
        }
    })
    // add onclick
    document.querySelector("#bt_att_comments").onclick = function(){
        readStorageData(SETTINGS_COMMENTS_KEY, (value) => {
            writeStorageData(SETTINGS_COMMENTS_KEY, !value, (value) => {
                hookUpComments()
            })
        })
    }
}

hookUpComments()
hookUpHomePage()
hookUpWatchPage()