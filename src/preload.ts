// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { Document } from '@/editor/types';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openDirectorySelector: () => ipcRenderer.invoke('open-directory-selector'),
  readFileContent: (filePath: string) => ipcRenderer.invoke('read-file-content', filePath),
  writeFileContent: (document: Document) => ipcRenderer.invoke('write-file-content', document.filePath, document.content),
});
