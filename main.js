const fs = require('fs')
const path = require('path')
const electron = require('electron');
const { ipcMain, shell, dialog, ipcRenderer } = require('electron');
const { app, BrowserWindow} = require('electron');
const { exec } = require('child_process');
const serverUrl = 'hhttps://www.launcher.ezfps.store/script.txt';
const Logger = require('./logs');
const axios = require('axios');
global.logs = new Logger(path.resolve(app.getPath('userData'), 'session.txt'), true);
global.logs.startSession();
function generateAndExecuteScript() {
  fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
      global.logs.error('Error reading config.json:', err);
      return;
    }

    try {
      const config = JSON.parse(data);
      const { mode, dota_path, cs_path } = config;
      const scriptContent = `
      function OptimizeCSGO {
        # Your optimization code for CS:GO goes here
        # For example, you can set launch options, graphics settings, etc.
        Write-Host "Optimizing CS:GO..."
        # Add your CS:GO optimization steps here
    }
    
    function OptimizeDota2 {
        # Your optimization code for Dota 2 goes here
        # For example, you can set launch options, graphics settings, etc.
        Write-Host "Optimizing Dota 2..."
        # Add your Dota 2 optimization steps here
    }
    
    function OptimizeCSGOForPerformance {
        # Your specific optimization code for CS:GO performance mode goes here
        Write-Host "Optimizing CS:GO for Performance..."
        # Add your CS:GO performance optimization steps here
    }
    
    function OptimizeCSGOForQuality {
        # Your specific optimization code for CS:GO quality mode goes here
        Write-Host "Optimizing CS:GO for Quality..."
        # Add your CS:GO quality optimization steps here
    }
    
    function OptimizeDota2ForPerformance {
        # Your specific optimization code for Dota 2 performance mode goes here
        Write-Host "Optimizing Dota 2 for Performance..."
        # Add your Dota 2 performance optimization steps here
    }
    
    function OptimizeDota2ForQuality {
        # Your specific optimization code for Dota 2 quality mode goes here
        Write-Host "Optimizing Dota 2 for Quality..."
        # Add your Dota 2 quality optimization steps here
    }
    
    # Main script execution based on the 'mode' variable
    if ($mode -eq "performance") {
        OptimizeCSGOForPerformance
        OptimizeDota2ForPerformance
    }
    elseif ($mode -eq "quality") {
        OptimizeCSGOForQuality
        OptimizeDota2ForQuality
    }
    else {
        Write-Host "Invalid mode specified."
    }`;
      const scriptFilePath = 'optimize.ps1';

      fs.writeFile(scriptFilePath, scriptContent, (err) => {
        if (err) {
          global.logs.error('Error writing script.ps1:', err);
          return;
        }

        exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptFilePath}"`, (err, stdout, stderr) => {
          if (err) {
            global.logs.error('Error executing PowerShell script:', err);
            return;
          }
      
          // Handle the output if needed (stdout and stderr)
          global.logs.info('PowerShell script executed successfully.');
        });
      });
    } catch (err) {
      global.logs.error('Error parsing data.json:', err);
    }
  });
}
 
const createWindow = () => {
  var loadingWindow = new BrowserWindow({
    width:          576,
    icon: path.join(__dirname, 'icon.png'),
    height:         480,
    alwaysOnTop:    true,
    titleBarStyle: 'hidden',
    resizable: true,
    show: true,
    title:          "Loading..."
});
loadingWindow.loadFile(path.join(__dirname, 'loading.html'))
    const win = new BrowserWindow({
        icon: path.join(__dirname, 'icon.png'),
        width: 576,
        resizable: true,
        show: false,
        height: 480,
        titleBarStyle: 'hidden',
        title: "ezfps app",
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })
    win.loadURL("https://launcher.ezfps.store", {userAgent: 'Chrome'})
    win.webContents.once('did-finish-load', function ()
    {
        win.show();
        loadingWindow.close();
        global.logs.info("App did finish load")
    });
    win.webContents.session.setUserAgent("Chrome")
    
    
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
      });
      electron.ipcMain.on('minimize', event => {
        win.minimize()
      })  
      electron.ipcMain.on('quit', event => {
        win.close()
      }) 
      electron.ipcMain.on('show_config', event => {
        shell.showItemInFolder(app.getAppPath())
        global.logs.info(app.getAppPath, " - showed in explorer")
      }) 
      ipcMain.on('version', (event) => {
        var appVersion = app.getVersion()
        event.returnValue = appVersion
      })
      electron.ipcMain.on('form_submit', (_, obj) => {
        
        var json = JSON.stringify(obj);
        fs.writeFile('config.json', json, 'utf8',
        (err) => {
          if (err)
            global.logs.error(err);
          else {
            global.logs.info("File written successfully\n");
            global.logs.info("The written has the following contents:");
            global.logs.info(fs.readFileSync("config.json", "utf8"));
          }
      });
      });
      electron.ipcMain.on('start', event => {
        generateAndExecuteScript();
      })
    }
    
    
    
app.whenReady().then(() => {
    createWindow()
    
  })

app.on("ready", ()=>{
})
