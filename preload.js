const { contextBridge, ipcRenderer } = require("electron");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// ipcRenderer.on("ping", (event, message) => {
//   console.log(message); // Prints 'whoooooooh!'
// });

contextBridge.exposeInMainWorld("electron", {
  on: (message, cb) => ipcRenderer.on(message, cb),
  send: (channel, args) => ipcRenderer.send(channel, args),
  invoke: (channel, args) => ipcRenderer.invoke(channel, args),
});
