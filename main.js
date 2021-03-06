// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const { promisify } = require("util");

const asyncWriteFile = promisify(fs.writeFile);
const asyncReadFile = promisify(fs.readFile);

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

async function saveSettings() {
  ipcMain.handle("settings", async (e, args) => {
    const settings = JSON.stringify(args);

    try {
      // Save settings to json file
      await asyncWriteFile(
        `${app.getPath("userData")}/settings.json`,
        settings
      );

      myEmitter.emit("savedsettings", {
        status: "success",
        message: "Settings file saved!",
        data: args,
      });

      return {
        status: "success",
        message: "Settings file saved!",
      };
    } catch (error) {
      return {
        status: "error",
        message: `${error}`,
      };
    }
  });
}

async function loadSettings() {
  let settings = {
    playerId: null,
    hotkeys: {
      refresh: "Alt+Control+R",
      hide: "Alt+Control+H",
    },
  };

  // Check if settings file exists
  const isSettingsFile = fs
    .readdirSync(app.getPath("userData"))
    .includes("settings.json");

  // if its there
  if (isSettingsFile) {
    // Load settings
    const settingsFile = await asyncReadFile(
      `${app.getPath("userData")}/settings.json`
    );
    settings = JSON.parse(settingsFile);
  }
  return settings;
}

async function handleHotkeys(mainWindow, settings) {
  let timeStamp60sec = null;

  // ### Hotkeys ###
  // Get new data
  globalShortcut.register(settings.hotkeys.refresh, () => {
    // Only allow every 60 sec.
    // TODO: Save interval settings here and send them to render
    const currentTime = Math.floor(Date.now() / 1000);
    if (timeStamp60sec && currentTime <= timeStamp60sec) return;

    timeStamp60sec = Math.floor(Date.now() / 1000) + 60;
    mainWindow.webContents.send("refresh");
  });

  // Reload on shortcut press (dev)
  // globalShortcut.register("Alt+CommandOrControl+W", () => {
  //   mainWindow.reload();
  // });

  globalShortcut.register(settings.hotkeys.hide, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.showInactive();
      // If the user hits win + d to go to desktop
      // and then hits the hide / show key 2 times
      // the app is not sizes correctly.
      // So we fix this by setting the size again
      mainWindow.setSize(1030, 80);
    }
  });
}

async function createSettingsWindow(settings) {
  // Create the browser window.
  const settingsWindow = new BrowserWindow({
    width: 1030,
    height: 800,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  settingsWindow.loadFile(`${__dirname}/public/index.html`);

  // settingsWindow.webContents.openDevTools();

  settingsWindow.on("ready-to-show", () => {
    // Send settings
    settingsWindow.webContents.send("sendSettings", settings);
  });

  return settingsWindow;
}

async function createWindow(settings) {
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
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setAlwaysOnTop(true, "normal");
  mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  mainWindow.loadFile(`${__dirname}/public/index.html`);

  // Open the DevTools.
  // TODO: If I keep working on this - add .env file
  // mainWindow.webContents.openDevTools();

  mainWindow.on("ready-to-show", () => {
    // Send settings
    mainWindow.webContents.send("sendSettings", settings);
    // Make sure its visible
    mainWindow.show();
  });

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Load Settings
  const settings = await loadSettings();

  // Check if settings where configured before
  if (settings.playerId) {
    // Open main window
    const mainWindow = await createWindow(settings);
    handleHotkeys(mainWindow, settings);
  } else {
    const settingsWindow = await createSettingsWindow(settings);
    saveSettings();

    // If settings are saved
    myEmitter.on("savedsettings", (e) => {
      const settings = e.data;
      setTimeout(async () => {
        // Hide settings window
        settingsWindow.hide();
        // and open main window
        const mainWindow = await createWindow(settings);
        handleHotkeys(mainWindow, settings);
      }, 500);
    });
  }

  // close gets send when the X button is clicked on the settings window
  ipcMain.handle("close", () => {
    app.quit();
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
