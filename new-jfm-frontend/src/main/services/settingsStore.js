import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';

const CONFIG_FOLDER_NAME = 'user-config';
const CONFIG_FILE_NAME = 'config.json';

const DEFAULT_CONFIG = {
  watchedFolders: [],
  allowedExtensions: ['.mp4', '.pdf'],
  pendingReviewOnNewFile: true,
};

function getConfigFolderPath() {
  if (!app.isPackaged) {
    return path.join(process.cwd(), CONFIG_FOLDER_NAME);
  }

  return path.join(path.dirname(app.getPath('exe')), CONFIG_FOLDER_NAME);
}

function getConfigFilePath() {
  return path.join(getConfigFolderPath(), CONFIG_FILE_NAME);
}

function normalizeConfig(config) {
  return {
    watchedFolders: Array.isArray(config.watchedFolders)
      ? config.watchedFolders
      : DEFAULT_CONFIG.watchedFolders,

    allowedExtensions: Array.isArray(config.allowedExtensions)
      ? config.allowedExtensions
      : DEFAULT_CONFIG.allowedExtensions,

    pendingReviewOnNewFile:
      typeof config.pendingReviewOnNewFile === 'boolean'
        ? config.pendingReviewOnNewFile
        : DEFAULT_CONFIG.pendingReviewOnNewFile,
  };
}

export async function ensureSettingsConfig() {
  const configFolderPath = getConfigFolderPath();
  const configFilePath = getConfigFilePath();

  await fs.mkdir(configFolderPath, {
    recursive: true,
  });

  try {
    await fs.access(configFilePath);
  } catch {
    await saveSettingsConfig(DEFAULT_CONFIG);
  }
}

export async function loadSettingsConfig() {
  await ensureSettingsConfig();

  const configFilePath = getConfigFilePath();

  try {
    const content = await fs.readFile(configFilePath, 'utf-8');
    const parsedConfig = JSON.parse(content);

    return normalizeConfig(parsedConfig);
  } catch {
    await saveSettingsConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export async function saveSettingsConfig(config) {
  const configFolderPath = getConfigFolderPath();
  const configFilePath = getConfigFilePath();

  await fs.mkdir(configFolderPath, {
    recursive: true,
  });

  const normalizedConfig = normalizeConfig(config);
  const jsonText = JSON.stringify(normalizedConfig, null, 2);

  await fs.writeFile(configFilePath, jsonText, 'utf-8');

  return normalizedConfig;
}

export async function addWatchedFolder(folderPath) {
  const config = await loadSettingsConfig();
  const normalizedFolderPath = path.resolve(folderPath);

  if (!config.watchedFolders.includes(normalizedFolderPath)) {
    config.watchedFolders.push(normalizedFolderPath);
  }

  return saveSettingsConfig(config);
}

export async function removeWatchedFolder(folderPath) {
  const config = await loadSettingsConfig();

  config.watchedFolders = config.watchedFolders.filter(
    (item) => item !== folderPath
  );

  return saveSettingsConfig(config);
}

export async function addAllowedExtension(extension) {
  const config = await loadSettingsConfig();

  const normalizedExtension = extension.trim().toLowerCase();

  if (!normalizedExtension.startsWith('.')) {
    throw new Error('Extension must start with "."');
  }

  if (!config.allowedExtensions.includes(normalizedExtension)) {
    config.allowedExtensions.push(normalizedExtension);
  }

  return saveSettingsConfig(config);
}

export async function removeAllowedExtension(extension) {
  const config = await loadSettingsConfig();

  config.allowedExtensions = config.allowedExtensions.filter(
    (item) => item !== extension
  );

  return saveSettingsConfig(config);
}

export async function updatePendingReviewOnNewFile(value) {
  const config = await loadSettingsConfig();

  config.pendingReviewOnNewFile = Boolean(value);

  return saveSettingsConfig(config);
}