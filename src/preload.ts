// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (name: string, content: string) => ipcRenderer.invoke('write-file', name, content),
  deleteFile: (name: string) => ipcRenderer.invoke('delete-file', name),
  serializeKeyValue: (key: string, value: string) => ipcRenderer.invoke('serialize-key-value', key, value),
  deserializeKeyValue: (key: string) => ipcRenderer.invoke('deserialize-key-value', key),
  loadActiveDocument: () => ipcRenderer.invoke('load-active-document'),

  onOpenDocumentDialog: (callback: any) => ipcRenderer.on('open-document-dialog', (_event, files) => callback(files)),
  onNewDocument: (callback: any) => ipcRenderer.on('new-document', (_event, file) => callback(file)),
  onCloseDocument: (callback: any) => ipcRenderer.on('close-document', (_event) => callback()),
  onOpenVault: (callback: any) => ipcRenderer.on('open-vault', (_event) => callback()),
  onLoadVault: (callback: any) => ipcRenderer.on('load-vault', (_event, files) => callback(files)),
  onSwitchDocument: (callback: any) => ipcRenderer.on('switch-document', (_event) => callback()),
  onReverseSwitchDocument: (callback: any) => ipcRenderer.on('reverse-switch-document', (_event) => callback()),
});
