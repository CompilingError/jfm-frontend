import { ipcMain } from 'electron';
import { getCoverForFile } from '../services/coverService.js';

export function registerCoverHandlers() {
  ipcMain.handle('cover:get-cover', async (_event, payload) => {
    return getCoverForFile(payload);
  });
}