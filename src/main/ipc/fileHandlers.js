import { ipcMain, shell } from 'electron';

export function registerFileHandlers() {
  ipcMain.handle('file:open', async (_event, filePath) => {
    const errorMessage = await shell.openPath(filePath);

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    return true;
  });
}