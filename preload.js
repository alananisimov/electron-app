const { ipcMain, ipcRenderer, webContents, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit'),
  minimize: () => ipcRenderer.send('minimize'),
  form_submit: (obj)=> ipcRenderer.send('form_submit', obj),
  start: ()=> ipcRenderer.send('start'),
  show_config: ()=> ipcRenderer.send('show_config'),
  get_version: () => ipcRenderer.sendSync('version')
});

window.addEventListener('DOMContentLoaded', () => {
  

    
})





