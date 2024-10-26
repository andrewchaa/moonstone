// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { EditorDocument } from '@/editor/types';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
  readFileContent: (filePath: string) => ipcRenderer.invoke('read-file-content', filePath),
  writeFileContent: (document: EditorDocument) =>
    ipcRenderer.invoke('write-file-content', document.filePath, document.content),

  onOpenDocument: (callback: any) => ipcRenderer.on('open-document', (_event) => callback()),
  onOpenVault: (callback: any) => ipcRenderer.on('open-vault', (_event) => callback()),
});
