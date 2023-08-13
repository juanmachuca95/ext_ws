// The ID of the extension.
var laserExtensionId = "oiinmhpbpnbdeobkcchmmldgajommogf";
// Elements 
const INPUT = 'input'
const SUBMIT = 'submit'
const STATUS = 'status'
// Key
const KEY_CONNECT = 'CONNECT'
const KEY_RECONNECT = 'RECONNECT'

// Functions
const Log = (msg) => console.log("File: popup.js - Info: ", msg)
// Restore Status
const restoreStatus = () => {
    chrome.runtime.sendMessage({key: KEY_RECONNECT}, () => {
        chrome.storage.sync.get({ status: 2, host: '' }, (items) => {
            console.log("File: popup.js - Info: Status ", items.status)
            document.getElementById(INPUT).value = items.host;
            document.getElementById(STATUS).checked = setStatus(items.status);
        });
    })
};
// Iteration with the front
const setStatus = (checkStatus) => {
    switch (checkStatus) {
        case WebSocket.OPEN:
            document.getElementById(STATUS).classList.replace("bg-danger", "bg-success")
            document.getElementById(STATUS).textContent = 'OPEN'
            break;
        case WebSocket.CONNECTING:
            document.getElementById(STATUS).classList.replace("bg-success", "bg-danger")
            document.getElementById(STATUS).textContent = 'CONNECTING'
            break;
        case WebSocket.CLOSED:
            document.getElementById(STATUS).classList.replace("bg-success", "bg-danger")
            document.getElementById(STATUS).textContent = 'CLOSED'
            break;
        case WebSocket.CLOSING:
            document.getElementById(STATUS).classList.replace("bg-success", "bg-danger")
            document.getElementById(STATUS).textContent = 'CLOSING'
            break;
        default:
            document.getElementById(STATUS).classList.replace("bg-success", "bg-danger")
            document.getElementById(STATUS).textContent = 'DISCONNECT'
            break;
    }
}

// Save host
const saveHostAndConnect = async () => {
    let value = document.getElementById(INPUT).value
    if (value.length == 0) return

    chrome.storage.sync.set({ host: value }, () => {
        chrome.runtime.sendMessage({key: KEY_CONNECT}, () => {
            Log("Trying to connect")
        })
    })
}

var port = chrome.runtime.connect(laserExtensionId)
addEventListener("DOMContentLoaded", () => {
    Log("Init DOM")
    restoreStatus()
})

document.getElementById(SUBMIT).addEventListener('click', saveHostAndConnect);
