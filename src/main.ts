import { app, BrowserWindow, shell, powerMonitor } from 'electron';
import path from 'path';
import Store from 'electron-store'

import { configureMenus, loadFilesFromDirectory, registerIpcMainHandlers } from './helper-functions/mainFunctions';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const store = new Store()

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  configureMenus(mainWindow, store)

  await registerIpcMainHandlers(mainWindow, store)
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('did-finish-load', async () => {
    const vaultPath = store.get('vaultPath') as string
    if (vaultPath) {
      const files = await loadFilesFromDirectory(vaultPath)
      mainWindow.webContents.send('load-vault', files)
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' }
  })

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createWindow()

  powerMonitor.on('suspend', () => {
    console.log('The system is going to sleep')
  })

  powerMonitor.on('resume', () => {
    console.log('The system is resuming from sleep')
  })
} );

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
