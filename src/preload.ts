// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
  readFileContent: (filePath: string) => ipcRenderer.invoke('read-file-content', filePath),
  writeFileContent: (filePath: string, content: string) => ipcRenderer.invoke('write-file-content', filePath, content),

  onOpenDocument: (callback: any) => ipcRenderer.on('open-document', (_event) => callback()),
  onOpenVault: (callback: any) => ipcRenderer.on('open-vault', (_event) => callback()),
  onLoadVault: (callback: any) => ipcRenderer.on('load-vault', (_event, files) => callback(files)),
});
