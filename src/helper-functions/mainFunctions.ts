import { app, BrowserWindow, dialog, ipcMain, Menu, MenuItem } from 'electron';
import fs from 'fs/promises';
import Store from 'electron-store'

export const configureMenus = (
  mainWindow: BrowserWindow,
  store: Store
) => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'Moonstone',
    submenu: [
      {
        label: 'Open vault',
        accelerator: 'CmdOrCtrl+o',
        click: () => {
          mainWindow.webContents.send('open-vault')
        }
      },
    ]
  }))
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'New document',
        accelerator: 'CmdOrCtrl+n',
        click: () => {
          mainWindow.webContents.send('new-document')
        }
      },
      {
        label: 'Open document',
        accelerator: 'CmdOrCtrl+p',
        click: async () => {
          const vaultPath = store.get('vaultPath') as string
          const files = await loadFilesFromDirectory(vaultPath)
          mainWindow.webContents.send('open-document-dialog', files)
        }
      },
      {
        label: 'Close document',
        accelerator: 'CmdOrCtrl+w',
        click: () => {
          mainWindow.webContents.send('close-document')
        }
      },
      {
        label: 'Switch document',
        accelerator: 'Ctrl+Tab',
        click: () => {
          mainWindow.webContents.send('switch-document')
        }
      },
      {
        label: 'Reverse switch document',
        accelerator: 'Shift+Ctrl+Tab',
        click: () => {
          mainWindow.webContents.send('reverse-switch-document')
        }
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+q',
        click: () => {
          app.quit();
        }
      },
    ]
  }))
  menu.append(new MenuItem({
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startSpeaking' },
          { role: 'stopSpeaking' }
        ]
      }
    ]
  })),
  menu.append(new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }))

  menu.append(new MenuItem({
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' },
    ]
  })),

  Menu.setApplicationMenu(menu)
}

export const loadFilesFromDirectory = async (directoryPath: string) => {
  try {
    const files = await fs.readdir(directoryPath);
    const valutFiles = await Promise.all(files
      .filter((file) => !file.startsWith('.'))
      .map(async (file: string) => {
        const filePath = `${directoryPath}/${file}`;
        const name = file;
        const lastModified = (await fs.stat(filePath)).mtime.toISOString();
        return {
          name,
          filePath,
          lastModified
        }
      }));
    valutFiles.sort((a, b) => new Date(a.lastModified) > new Date(b.lastModified) ? -1 : 1);
    return valutFiles;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

export const registerIpcMainHandlers = async (
  mainWindow: BrowserWindow,
  store: Store
) => {
  ipcMain.handle('open-directory-selector', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const directoryPath = result.filePaths[0]
      store.set('vaultPath', directoryPath)

      try {
        const files = await fs.readdir(directoryPath)
        const documents = Promise.all(files
          .filter((file) => !file.startsWith('.'))
          .map(async (file: string) => ({
            id: file,
            name: file,
            content: await fs.readFile(`${directoryPath}/${file}`, 'utf-8'),
            filePath: `${directoryPath}/${file}`
          })));
        return documents
      } catch (error) {
        console.error('Error reading directory:', error)
        return []
      }
    } else {
      return []
    }
  })

  ipcMain.handle('read-file', async (_, filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return content
    } catch (error) {
      return ''
    }
  })

  ipcMain.handle('write-file', async (_, name, content) => {
    const vaultPath = store.get('vaultPath') as string
    const filename = `${vaultPath}/${name}`

    try {
      fs.writeFile(filename, content, 'utf-8')
      return filename;
    } catch (error) {
      console.error('Error writing file:', error)
      throw error
    }
  })

  ipcMain.handle('delete-file', async (_, name) => {
    const vaultPath = store.get('vaultPath') as string
    try {
      fs.unlink(`${vaultPath}/${name}`)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  })

  ipcMain.handle('serialize-key-value', async (_, key, value) => {
    store.set(key, value)
  })

  ipcMain.handle('deserialize-key-value', async (_, key) => {
    return store.get(key)
  })

  ipcMain.handle('load-active-document', async () => {
    try {
      const activeDocument = JSON.parse(store.get('active-document') as string)
      activeDocument.content = await fs.readFile(activeDocument.filePath, 'utf-8')
      return JSON.stringify(activeDocument)
    } catch (error) {
      return '{}'
    }
  })
}
