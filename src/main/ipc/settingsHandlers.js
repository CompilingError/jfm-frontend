import { dialog, ipcMain } from 'electron';

import {
  addAllowedExtension,
  addWatchedFolder,
  loadSettingsConfig,
  removeAllowedExtension,
  removeWatchedFolder,
  updatePendingReviewOnNewFile,
} from '../services/settingsStore.js';

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get-config', async () => {
    return loadSettingsConfig();
  });

  ipcMain.handle('settings:add-watched-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      return loadSettingsConfig();
    }

    const selectedFolder = result.filePaths[0];

    return addWatchedFolder(selectedFolder);
  });

  ipcMain.handle('settings:remove-watched-folder', async (_event, folderPath) => {
    return removeWatchedFolder(folderPath);
  });

  ipcMain.handle('settings:add-allowed-extension', async (_event, extension) => {
    return addAllowedExtension(extension);
  });

  ipcMain.handle(
    'settings:remove-allowed-extension',
    async (_event, extension) => {
      return removeAllowedExtension(extension);
    }
  );

  ipcMain.handle(
    'settings:update-pending-review-on-new-file',
    async (_event, value) => {
      return updatePendingReviewOnNewFile(value);
    }
  );
}