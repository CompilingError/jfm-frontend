import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('settingsAPI', {
  getConfig: () => ipcRenderer.invoke('settings:get-config'),

  addWatchedFolder: () => ipcRenderer.invoke('settings:add-watched-folder'),

  removeWatchedFolder: (folderPath) =>
    ipcRenderer.invoke('settings:remove-watched-folder', folderPath),

  addAllowedExtension: (extension) =>
    ipcRenderer.invoke('settings:add-allowed-extension', extension),

  removeAllowedExtension: (extension) =>
    ipcRenderer.invoke('settings:remove-allowed-extension', extension),

  updatePendingReviewOnNewFile: (value) =>
    ipcRenderer.invoke('settings:update-pending-review-on-new-file', value),
});

contextBridge.exposeInMainWorld('reviewAPI', {
  scanPendingFiles: () => ipcRenderer.invoke('review:scan-pending-files'),
});

contextBridge.exposeInMainWorld('fileSystemAPI', {
  openFile: (filePath) => ipcRenderer.invoke('file:open', filePath),
});

contextBridge.exposeInMainWorld('coverAPI', {
  getCover: (payload) => ipcRenderer.invoke('cover:get-cover', payload),
});
