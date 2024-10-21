import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { EditorDocument } from './editor/types';
import TurndownService from 'turndown';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const turndownService = new TurndownService()
const createWindow = () => {
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

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  ipcMain.handle('open-directory-selector', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const directoryPath = result.filePaths[0]
      return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            reject('Error reading directory:', err)
          } else {
            const documents: EditorDocument[] = files
              .filter((file) => !file.startsWith('.'))
              .map((file: string) => ({
                id: file,
                name: file,
                content: fs.readFileSync(`${directoryPath}/${file}`, 'utf-8'),
                filePath: `${directoryPath}/${file}`
              }));
            resolve(documents)
          }
        })
      })
    } else {
      return []
    }
  })

  ipcMain.handle('read-file-content', async (event, filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          reject('Error reading file:', err)
        } else {
          resolve(data)
        }
      })
    })
  })

  ipcMain.handle('write-file-content', async (event, filePath, content) => {
    const markdownContent = turndownService.turndown(content)
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, markdownContent, 'utf-8', (err) => {
        if (err) {
          reject('Error writing file:', err)
        } else {
          resolve()
        }
      })
    })
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
