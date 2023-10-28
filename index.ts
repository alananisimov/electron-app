import * as electron from 'electron';
import { ipcMain, shell, app, BrowserWindow, Notification, Menu, MenuItem, globalShortcut } from 'electron';
import * as path from 'path';
import Logger from './logs';
import ScriptManager from './ScriptManager';
const serverUrl = 'https://launcher.ezfps.store/signin';
const NOTIFICATION_TITLE = 'Буст запущен'
const NOTIFICATION_BODY = 'Проверьте результат в играх и наслаждайтесь'
const NOTIFICATION_ICON = "icon.png"
export const logs = new Logger(path.resolve(app.getPath('userData'), 'session.txt'), true);
const scriptManager = new ScriptManager(process.cwd(), true, 'config.json', 'clearSystem', app.getPath("appData"));
console.log(app.getPath("appData"))
logs.startSession();
function showNotification() {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, icon:  NOTIFICATION_ICON, }).show()
}
const createWindow = () => {
  const loadingWindow = new BrowserWindow({
    width: 576,
    icon: path.join(__dirname, 'icon.png'),
    height: 480,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    resizable: true,
    show: true,
    title: 'Loading...',
  });

  loadingWindow.loadFile(path.join(__dirname, '/loading.html'));

  const win = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: 1200,
    resizable: true,
    show: false,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    title: 'ezfps app',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegrationInWorker: true
    },
  });

  win.loadURL(serverUrl, { userAgent: 'Chrome' });

  win.webContents.once('did-finish-load', () => {
    win.show();
    loadingWindow.close();
    logs.info('App did finish load');
  });
  
  
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  ipcMain.on('minimize', (event) => {
    win.minimize();
  });

  ipcMain.on('quit', () => {
    win.close();
  });

  ipcMain.on('show_config', () => {
    shell.showItemInFolder(app.getAppPath());
    logs.info(`${app.getAppPath()} - showed in explorer`);
  });

  ipcMain.on('version', (event) => {
    const appVersion = app.getVersion();
    event.returnValue = appVersion;
  });

  ipcMain.on('form_submit', async (_, obj) => {
    scriptManager.saveConfig(_, obj);
  });

  ipcMain.on('start', async () => {
    await scriptManager.downloadExec().finally(() => {
      showNotification();
    });
  });
  ipcMain.on('open_devtools', () => {
    win.webContents.openDevTools()
  })
  ipcMain.handle('get_config', async (event, args) => {
    const config = await scriptManager.getConfig()
    return config
  })
  
};
app.whenReady().then(() => {
  createWindow();
});
