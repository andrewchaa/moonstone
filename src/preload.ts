// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),

  onOpenDocumentDialog: (callback: any) => ipcRenderer.on('open-document-dialog', (_event, files) => callback(files)),
  onOpenDocument: (callback: any) => ipcRenderer.on('open-document', (_event, file) => callback(file)),
  onCloseDocument: (callback: any) => ipcRenderer.on('close-document', (_event, name) => callback(name)),
  onOpenVault: (callback: any) => ipcRenderer.on('open-vault', (_event) => callback()),
  onLoadVault: (callback: any) => ipcRenderer.on('load-vault', (_event, files) => callback(files)),
});
