import fs from 'node:fs/promises';
import path from 'node:path';

import { loadSettingsConfig } from './settingsStore.js';
import { parseFileName } from './fileNameParser.js';
import { findMoviesByName } from './backendMovieClient.js';

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectFilesFromFolder(folderPath, allowedExtensions) {
  const files = [];

  const exists = await pathExists(folderPath);

  if (!exists) {
    return files;
  }

  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await collectFilesFromFolder(
        fullPath,
        allowedExtensions
      );

      files.push(...childFiles);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      continue;
    }

    const stat = await fs.stat(fullPath);

    files.push({
      fileName: entry.name,
      path: fullPath,
      extension,
      size: stat.size,
      modifiedTime: stat.mtime.toISOString(),
    });
  }

  return files;
}

function createPendingFileId(filePath, size, modifiedTime) {
  return `${filePath}-${size}-${modifiedTime}`;
}

async function isMovieAlreadyInDatabase(name) {
  const movies = await findMoviesByName(name);

  return movies.length > 0;
}

export async function scanPendingFiles() {
  const config = await loadSettingsConfig();

  const allowedExtensions = config.allowedExtensions.map((extension) =>
    extension.toLowerCase()
  );

  const allFiles = [];

  for (const folderPath of config.watchedFolders) {
    const files = await collectFilesFromFolder(folderPath, allowedExtensions);
    allFiles.push(...files);
  }

  const pendingFiles = [];

  for (const file of allFiles) {
    const parsedResult = parseFileName(file.fileName);
    const alreadyExists = await isMovieAlreadyInDatabase(
      parsedResult.parsedName
    );

    if (alreadyExists) {
      continue;
    }

    pendingFiles.push({
      id: createPendingFileId(file.path, file.size, file.modifiedTime),
      name: parsedResult.parsedName,
      originalName: parsedResult.originalName,
      path: file.path,
      extension: file.extension,
      size: file.size,
      modifiedTime: file.modifiedTime,
      matchedRuleKey: parsedResult.matchedRuleKey,
      defaultTagNames: parsedResult.defaultTagNames,
      matched: parsedResult.matched,
    });
  }

  return pendingFiles;
}