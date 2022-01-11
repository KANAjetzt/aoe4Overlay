// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const asyncWriteFile = promisify(fs.writeFile);
const asyncReadFile = promisify(fs.readFile);

let settings = {
  profileId: null,
  hotkeys: {
    refresh: "Alt+CommandOrControl+R",
    hide: "Alt+CommandOrControl+H",
  },
};

// auto reload reloads the page when I invoke something from render?!
// try {
//   require("electron-reloader")(module);
// } catch (_) {}

async function createSettingsWindow() {
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

  ipcMain.handle("settings", async (e, args) => {
    const settings = JSON.stringify(args);

    try {
      await asyncWriteFile(
        `${app.getPath("userData")}/settings.json`,
        settings
      );

      setTimeout(async () => {
        settingsWindow.hide();
        createWindow();
      }, 500);

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

async function createWindow() {
  // Load settings
  const settingsFile = await asyncReadFile(
    `${app.getPath("userData")}/settings.json`
  );
  settings = JSON.parse(settingsFile);

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
  // Make sure its visible
  mainWindow.showInactive();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // ### Hotkeys ###
  // Get new data
  globalShortcut.register(settings.hotkeys.refresh, () => {
    mainWindow.webContents.send("refresh");
  });

  // Reload on shortcut press (dev)
  globalShortcut.register("Alt+CommandOrControl+W", () => {
    mainWindow.reload();
  });

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

  mainWindow.on("ready-to-show", () => {
    // Send settings
    mainWindow.webContents.send("sendSettings", settings);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Check if settings file exists
  const isSettingsFile = fs
    .readdirSync(app.getPath("userData"))
    .includes("settings.json");

  // if its there
  if (isSettingsFile) {
    // Open main window
    createWindow();
    // Else open settings window
  } else {
    createSettingsWindow();
  }

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
