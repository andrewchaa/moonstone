import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import fs from 'fs/promises';

export const configureMenus = (mainWindow: BrowserWindow) => {
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

        }
      },
      {
        label: 'Open document',
        accelerator: 'CmdOrCtrl+p',
        click: () => {
          mainWindow.webContents.send('open-document')
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
