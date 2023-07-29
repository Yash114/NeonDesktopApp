// Modules to control application life and create native browser window
const { app, BrowserWindow, shell, ipcMain  } = require('electron')
const path = require('path')

const { execFile } = require('child_process');


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#2bff00',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }

  
  })

  // mainWindow.setResizable(false);
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // Prevent the default navigation action
    shell.openExternal(url); // Open the link in the user's default web browser
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


app.on('certificate-error', (event, webContents, url, error, ccertificate, callback) => {
  event.preventDefault();
  callback(true);
})

ipcMain.on('execute-exe', (event, exePath) => {
  execFile(exePath, (error, stdout, stderr) => {
    if (error) {
      // Send the error back to the renderer process
      event.reply('execute-exe-response', { error: error.message });
      return;
    }
    // Send the result back to the renderer process
    event.reply('execute-exe-response', { stdout, stderr });
  });
});

