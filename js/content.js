const readStorageData = (storageKey, callback) => {
    chrome.storage.local.get([storageKey], function(result) {
        const value = result[storageKey]
        callback(value)
    })
}

const SETTINGS_COMMENTS_KEY = "settings:comments"
const SETTINGS_HOMEPAGE_KEY = "settings:homepage"
const SETTINGS_WATCHPAGESUGGESTIONS_KEY = "settings:watchPageSuggestions"


function injectStyles() {
    const styleOverrides = document.createElement("link")
    styleOverrides.rel = "stylesheet"
    styleOverrides.type = "text/css"
    styleOverrides.href = chrome.runtime.getURL("css/style-overrides.css")
    document.head.appendChild(styleOverrides)
}

let currentUrl = window.location.href

let cleanUpFYClasses = () => {
    document.body.classList.forEach(className => {
        if (className.startsWith("fy-")) {
            document.body.classList.remove(className)
        }
    })
}

const initFY = () => {
    document.body.style.display = "block"
    cleanUpFYClasses()
    if (window.location.pathname === "/") {
        initHomePage()
    } else if (window.location.pathname === "/results") {
        initResultsPage()
    } else if (window.location.pathname === "/watch") {
        initWatchPage()
    } else if (window.location.pathname.startsWith("/@") || window.location.pathname.startsWith("/channel")) {  // channel begins with /@ or /channel
        initChannelPage()
    }
}

const initWatchPage = () => {
    readStorageData(SETTINGS_WATCHPAGESUGGESTIONS_KEY, (value) => {
        if (value) {
            document.body.classList.add("fy-watch-page")
        } else {
            document.body.classList.remove("fy-watch-page")
        }
    })
    readStorageData(SETTINGS_COMMENTS_KEY, (value) => {
        const $body = document.querySelector("body")
        if (value) {
            $body.classList.remove("fy-watch-page--comments-visible")
        } else {
            $body.classList.add("fy-watch-page--comments-visible")
        }
    })
}

const initResultsPage = () => {
    document.body.classList.add("fy-results-page")
}

const initChannelPage = () => {
    document.body.classList.add("fy-channel-page")
}

const initHomePage = () => {
    readStorageData(SETTINGS_HOMEPAGE_KEY, (value) => {
        if (value) {
            const search = (event) => {
                event.preventDefault()
                const query = anchor.querySelector(".fy-search-form__text-input").value
                window.location.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query)
            }
            document.body.classList.add("fy-home-page")
            const body = document.querySelector("body")
            const anchor = document.createElement("div")
            anchor.id = "mega-app"
            body.innerHTML = ""
            document.body.appendChild(anchor)
            anchor.innerHTML = `
                <div class="fy-home-page">
                  <div class="fy-home-page__logo">
                  </div>
                  <div class="fy-home-page__body">
                    <form class="fy-home-page__form fy-search-form" action="#">
                      <input class="fy-search-form__text-input" type="text" placeholder="Search" />
                      <button class="fy-search-form__submit"></button>
                    </form>
                  </div>
                </div>
              `
            anchor.querySelector(".fy-search-form").onsubmit = search
        } else {
            document.body.classList.remove("fy-home-page")
            // if mega-app exists, remove it
            const anchor = document.querySelector("#mega-app")
            if (anchor) {
                anchor.remove()
            }
        }
    })
}

const observeDOM = (function () {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver
    const eventListenerSupported = window.addEventListener
    return function (obj, callback) {
        if (MutationObserver) {
            let obs = new MutationObserver(function (mutations) {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                    callback()
                }
            })
            obs.observe(obj, {
                childList: true,
                subtree: true
            })
        } else if (eventListenerSupported) {
            obj.addEventListener("DOMNodeInserted", callback, false)
            obj.addEventListener("DOMNodeRemoved", callback, false)
        }
    }
})()




chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { newValue }] of Object.entries(changes)) {
        if(key === SETTINGS_COMMENTS_KEY) {
            initFY()
            /*const $body = document.querySelector("body")
            if(newValue) {
                $body.classList.add("fy-watch-page--comments-visible")
            } else {
                $body.classList.remove("fy-watch-page--comments-visible")
            }*/
        }
        if(key === SETTINGS_HOMEPAGE_KEY) {
            initFY()
        }
        if(key === SETTINGS_WATCHPAGESUGGESTIONS_KEY) {
            initFY()
        }
    }
})



injectStyles()
initFY()
observeDOM(document.body, function () {
    if (currentUrl !== window.location.href) {
        currentUrl = window.location.href
        initFY()
    }
})