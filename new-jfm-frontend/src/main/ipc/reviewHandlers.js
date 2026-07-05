import { ipcMain } from 'electron';

import { scanPendingFiles } from '../services/folderScanner.js';

export function registerReviewHandlers() {
  ipcMain.handle('review:scan-pending-files', async () => {
    return scanPendingFiles();
  });
}