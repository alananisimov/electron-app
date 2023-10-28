"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    quit: function () { return electron_1.ipcRenderer.send('quit'); },
    minimize: function () { return electron_1.ipcRenderer.send('minimize'); },
    form_submit: function (obj) { return electron_1.ipcRenderer.send('form_submit', obj); },
    start: function () { return electron_1.ipcRenderer.send('start'); },
    get_version: function () { return electron_1.ipcRenderer.sendSync('version'); },
    get_config: function () { return electron_1.ipcRenderer.invoke('get_config'); },
    open_devtools: function () { return electron_1.ipcRenderer.send('open_devtools'); }
});
window.addEventListener('DOMContentLoaded', function () {
    console.log("\n  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \n  \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \n  \u2588\u2588\u2588\u2588\u2588\u2557     \u2588\u2588\u2588\u2554\u255D  \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\n  \u2588\u2588\u2554\u2550\u2550\u255D    \u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2554\u2550\u2550\u255D   \u2588\u2588\u2554\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\n  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551      \u2588\u2588\u2551      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\n  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D      \u255A\u2550\u255D      \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n  ");
});
//# sourceMappingURL=preload.js.map