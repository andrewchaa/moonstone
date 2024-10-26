import { app, BrowserWindow, Menu, MenuItem } from 'electron';

export const configureMenus = (mainWindow: BrowserWindow) => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'Open document',
        accelerator: 'CmdOrCtrl+p',
        click: () => {
          mainWindow.webContents.send('open-document')
        }
      },
      {
        label: 'Open vault',
        accelerator: 'CmdOrCtrl+o',
        click: () => {
          mainWindow.webContents.send('open-vault')
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
