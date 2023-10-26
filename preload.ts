import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.send('quit'),
  minimize: () => ipcRenderer.send('minimize'),
  form_submit: (obj: any) => ipcRenderer.send('form_submit', obj),
  start: () => ipcRenderer.send('start'),
  get_version: () => ipcRenderer.sendSync('version'),
  get_config: () => ipcRenderer.invoke('get_config')
});

window.addEventListener('DOMContentLoaded', () => {
  console.log(`
  ███████╗ ███████╗ ███████╗ ██████╗  ███████╗ 
  ██╔════╝ ╚══███╔╝ ██╔════╝ ██╔══██╗ ██╔════╝ 
  █████╗     ███╔╝  █████╗   ██████╔╝ ███████╗
  ██╔══╝    ███╔╝   ██╔══╝   ██╔═══╝  ╚════██║
  ███████╗ ███████╗ ██║      ██║      ███████║
  ╚══════╝ ╚══════╝ ╚═╝      ╚═╝      ╚══════╝
  `);
});
