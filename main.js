const path = require("path");
const electron = require("electron");
const { ipcMain, shell, dialog, ipcRenderer } = require("electron");
const { app, BrowserWindow } = require("electron");
const serverUrl = "https://launcher.ezfps.store";
const Logger = require("./logs");
const ScriptManager = require("./ScriptManager");
global.logs = new Logger(
  path.resolve(app.getPath("userData"), "session.txt"),
  true
);
script_mngr = new ScriptManager(process.cwd(), true, "config.json", "clearSystem");
global.logs.startSession();

const createWindow = () => {
  var loadingWindow = new BrowserWindow({
    width: 576,
    icon: path.join(__dirname, "icon.png"),
    height: 480,
    alwaysOnTop: true,
    titleBarStyle: "hidden",
    resizable: true,
    show: true,
    title: "Loading...",
  });
  loadingWindow.loadFile(path.join(__dirname, "loading.html"));
  const win = new BrowserWindow({
    icon: path.join(__dirname, "icon.png"),
    width: 576,
    resizable: true,
    show: false,
    height: 480,
    titleBarStyle: "hidden",
    title: "ezfps app",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadURL(serverUrl, { userAgent: "Chrome" });
  win.webContents.once("did-finish-load", function () {
    win.show();
    loadingWindow.close();
    global.logs.info("App did finish load");
  });
  win.webContents.session.setUserAgent("Chrome");

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  electron.ipcMain.on("minimize", (event) => {
    win.minimize();
  });
  electron.ipcMain.on("quit", (event) => {
    win.close();
  });
  electron.ipcMain.on("show_config", (event) => {
    shell.showItemInFolder(app.getAppPath());
    global.logs.info(app.getAppPath(), " - showed in explorer");
  });
  ipcMain.on("version", (event) => {
    var appVersion = app.getVersion();
    event.returnValue = appVersion;
  });
  electron.ipcMain.on("form_submit", async (_, obj) => {
    await script_mngr.saveConfig(_, obj);
  });
  electron.ipcMain.on("start", async (event) => {
    await script_mngr.downloadExec(true);
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("ready", () => {});
