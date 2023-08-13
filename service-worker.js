console.log("Running: service-worker.js")
var laserExtensionId = "oiinmhpbpnbdeobkcchmmldgajommogf";
const Log = (msg) => console.log("File: service-worker.js - Info: ", msg)

const CONNECT = 'CONNECT'
const RECONNECT = 'RECONNECT'

chrome.runtime.onMessage.addListener((
  request,
  _,
  sendResponse,
) => {
  switch (request.key) {
    case CONNECT:
      Log(CONNECT)
      upWebsocket()
      sendResponse(true)
      break;
    case RECONNECT:
        Log(RECONNECT)
        upWebsocket()
        sendResponse(true)
        break;
    default:
      Log(undefined)
      break;
  }
  return true
})

const upWebsocket = () => {
  chrome.tabs.query({active: true}, (tabs) => {
    let tab = tabs[0]
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: websocket
    })
  })
}

const websocket = () => {
  chrome.storage.sync.get(["host"], (items) => {
    try {
      let host = items.host 
      if (host === undefined) return 
      socket = new WebSocket("ws://localhost:8080")

      socket.onopen = () => {
        chrome.storage.sync.set({status: socket.readyState})
        console.log("OPEN")
      }

      socket.onerror = (error) => {
        chrome.storage.sync.set({status: socket.readyState})
        console.log(error)
      }

      socket.onmessage = (event) => {
        chrome.storage.sync.set({status: socket.readyState})
        let texto = event.data
        console.log("MESSAGE "+ texto)
        let textarea = document.getElementById('prompt-textarea');
        let buttons = document.getElementsByTagName('button');
        let buttonSend = buttons[buttons.length - 2];
        var eventoInput = new Event('input', { bubbles: true });
        var eventoKeyboard = new KeyboardEvent('keydown', { bubbles: true });
        textarea.focus();
        for (var i = 0; i < texto.length; i++) {
          var caracter = texto.charAt(i);
          textarea.value += caracter;
          eventoKeyboard.key = caracter;
          eventoInput.inputType = 'insertText';
          textarea.dispatchEvent(eventoKeyboard);
          textarea.dispatchEvent(eventoInput);
        }
        buttonSend.click()
        sendMessage()
      }

      function sendMessage() {
        setTimeout(() => {
          let responses = document.querySelectorAll('.markdown');
          let message = responses[responses.length - 1].textContent
          console.log("RESPONSE ", message)
          socket.send(message)
        }, 15000)
      }

    } catch (error) {
      chrome.storage.sync.set({status: socket.readyState})
      console.log(error)
    }
  })
}