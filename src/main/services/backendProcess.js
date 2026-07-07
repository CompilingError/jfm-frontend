import { app } from 'electron';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { getConfigFolderPath } from './settingsStore.js';

const BACKEND_PORT = 8080;
const BACKEND_HOST = '127.0.0.1';
const BACKEND_JAR_NAME = 'jfm-backend.jar';

let backendProcess = null;

function getInstallFolderPath() {
  if (!app.isPackaged) {
    return process.cwd();
  }

  return path.dirname(app.getPath('exe'));
}

function getBundledResourcesFolderPath() {
  if (!app.isPackaged) {
    return path.join(process.cwd(), 'resources');
  }

  return path.join(process.resourcesPath, 'resources');
}

function getBackendJarPath() {
  return path.join(getBundledResourcesFolderPath(), 'backend', BACKEND_JAR_NAME);
}

function getBundledJavaPath() {
  const executableName = process.platform === 'win32' ? 'java.exe' : 'java';
  return path.join(getBundledResourcesFolderPath(), 'runtime', 'bin', executableName);
}

function getJavaCommand() {
  const bundledJavaPath = getBundledJavaPath();

  if (fs.existsSync(bundledJavaPath)) {
    return bundledJavaPath;
  }

  if (!app.isPackaged) {
    return 'java';
  }

  throw new Error(`Bundled Java runtime was not found: ${bundledJavaPath}`);
}

function normalizeSqlitePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isPortOpen(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(500);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function waitForBackendReady(timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isPortOpen(BACKEND_PORT, BACKEND_HOST)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Backend did not start within ${timeoutMs}ms`);
}

export async function startBackend() {
  if (process.env.JFM_SKIP_BACKEND === 'true') {
    return null;
  }

  if (backendProcess) {
    return backendProcess;
  }

  if (await isPortOpen(BACKEND_PORT, BACKEND_HOST)) {
    return null;
  }

  const backendJarPath = getBackendJarPath();

  if (!fs.existsSync(backendJarPath)) {
    throw new Error(`Backend jar was not found: ${backendJarPath}`);
  }

  const configFolderPath = getConfigFolderPath();
  const databaseFolderPath = path.join(configFolderPath, 'database');
  const databaseFilePath = path.join(databaseFolderPath, 'jfm.db');

  fs.mkdirSync(databaseFolderPath, {
    recursive: true,
  });

  const jdbcUrl = `jdbc:sqlite:${normalizeSqlitePath(databaseFilePath)}`;
  const javaCommand = getJavaCommand();

  backendProcess = spawn(
    javaCommand,
    [
      '-Dfile.encoding=UTF-8',
      '-jar',
      backendJarPath,
      `--server.address=${BACKEND_HOST}`,
      `--server.port=${BACKEND_PORT}`,
      `--spring.datasource.url=${jdbcUrl}`,
    ],
    {
      cwd: getInstallFolderPath(),
      env: {
        ...process.env,
        JFM_DB_URL: jdbcUrl,
        JFM_SERVER_ADDRESS: BACKEND_HOST,
        JFM_SERVER_PORT: String(BACKEND_PORT),
      },
      stdio: 'ignore',
      windowsHide: true,
    }
  );

  backendProcess.once('exit', () => {
    backendProcess = null;
  });

  await waitForBackendReady();

  return backendProcess;
}

export function stopBackend() {
  if (!backendProcess) {
    return;
  }

  backendProcess.kill();
  backendProcess = null;
}
