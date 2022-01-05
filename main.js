// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

function handleSettings() {
  // Check if settings file exists
  const isSettingsFile = fs
    .readdirSync(`${__dirname}`)
    .includes("settings.json");

  // if its there return and open main window
  if (isSettingsFile) {
    return;
  }

  // Else Open Settings Window
  const settings = {
    profileId: null,
    hotkeys: {
      refresh: "Alt+CommandOrControl+R",
      hide: "Alt+CommandOrControl+H",
    },
  };

  // Create the browser window.
  const settingsWindow = new BrowserWindow({
    width: 1030,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  settingsWindow.loadFile(`${__dirname}/public/index.html`);

  settingsWindow.webContents.openDevTools();

  // check for settings file
  if (!settings) {
    // open settings window
    // create settings file
    // fs.writeFileSync(`${dirname}/settings.json`, JSON.stringify(settings));
  } else {
    // load settings
  }
}

function createWindow() {
  // We cannot require the screen module until the app is ready.
  const { screen } = require("electron");

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1030,
    height: 80,
    x: width * 0.5 - 1030 * 0.5,
    y: 0,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  mainWindow.loadFile(`${__dirname}/public/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Get new data
  globalShortcut.register("Alt+CommandOrControl+R", () => {
    mainWindow.webContents.send("refresh");
  });

  // Reload on shortcut press (dev)
  globalShortcut.register("Alt+CommandOrControl+W", () => {
    mainWindow.reload();
  });

  globalShortcut.register("Alt+CommandOrControl+H", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      console.log("hide window");
    } else {
      mainWindow.showInactive();
      console.log("show window");
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // handle Settings
  // handleSettings();

  createWindow();

  mainWindow.app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
