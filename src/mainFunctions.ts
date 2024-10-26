import { BrowserWindow, Menu, MenuItem } from 'electron';

export const configureMenus = (mainWindow: BrowserWindow) => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'Open document',
        role: 'help',
        accelerator: 'CmdOrCtrl+p',
        click: () => {
          mainWindow.webContents.send('open-document')
        }
      },
      {
        label: 'Open vault',
        role: 'help',
        accelerator: 'CmdOrCtrl+o',
        click: () => {
          mainWindow.webContents.send('open-vault')
        }
      },
      {
        label: 'Reload',
        role: 'help',
        accelerator: 'CmdOrCtrl+r',
        click: async () => {
          mainWindow.reload()
        }
      },
    ]
  }))
  Menu.setApplicationMenu(menu)
}
