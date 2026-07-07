import { app } from 'electron';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');

const VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.mkv',
  '.avi',
  '.mov',
  '.wmv',
  '.webm',
  '.m4v',
]);

const runningTasks = new Map();

let coverQueue = Promise.resolve();

function getCoverDirectory() {
  const baseDirectory = app.isPackaged
    ? path.dirname(app.getPath('exe'))
    : process.cwd();

  return path.join(baseDirectory, 'user-config', 'covers');
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

function normalizeExtension(extension, filePath) {
  if (extension) {
    return extension.toLowerCase();
  }

  return path.extname(filePath).toLowerCase();
}

async function getFileStatInfo(filePath, size, modifiedTime) {
  if (size && modifiedTime) {
    return {
      size,
      modifiedTime,
    };
  }

  const stat = await fs.stat(filePath);

  return {
    size: stat.size,
    modifiedTime: stat.mtime.toISOString(),
  };
}

function createCoverKey({ filePath, size, modifiedTime }) {
  return crypto
    .createHash('sha1')
    .update(`${filePath}|${size}|${modifiedTime}`)
    .digest('hex');
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readImageAsDataUrl(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
}

function runFfmpeg(inputPath, outputPath, seekTime) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error('ffmpeg-static path is empty'));
      return;
    }

    const args = [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-ss',
      seekTime,
      '-i',
      inputPath,
      '-frames:v',
      '1',
      '-vf',
      'scale=320:-1',
      '-q:v',
      '5',
      outputPath,
    ];

    const childProcess = spawn(ffmpegPath, args, {
      windowsHide: true,
    });

    let errorText = '';

    childProcess.stderr.on('data', (data) => {
      errorText += data.toString();
    });

    childProcess.on('error', reject);

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(errorText || `ffmpeg exited with code ${code}`));
    });
  });
}

async function generateCover(inputPath, outputPath) {
  try {
    await runFfmpeg(inputPath, outputPath, '00:00:03');
    return;
  } catch {
    await runFfmpeg(inputPath, outputPath, '00:00:00.500');
  }
}

function enqueueCoverGeneration(task) {
  const queuedTask = coverQueue.then(task, task);

  coverQueue = queuedTask.catch(() => {});

  return queuedTask;
}

export async function getCoverForFile(payload) {
  try {
    const filePath = payload.filePath;

    if (!filePath) {
      return {
        coverUrl: null,
        status: 'missing-path',
      };
    }

    const extension = normalizeExtension(payload.extension, filePath);

    if (!VIDEO_EXTENSIONS.has(extension)) {
      return {
        coverUrl: null,
        status: 'unsupported',
      };
    }

    const fileExists = await pathExists(filePath);

    if (!fileExists) {
      return {
        coverUrl: null,
        status: 'missing-file',
      };
    }

    const statInfo = await getFileStatInfo(
      filePath,
      payload.size,
      payload.modifiedTime
    );

    const coverDirectory = getCoverDirectory();
    await ensureDirectory(coverDirectory);

    const coverKey = createCoverKey({
      filePath,
      size: statInfo.size,
      modifiedTime: statInfo.modifiedTime,
    });

    const coverPath = path.join(coverDirectory, `${coverKey}.jpg`);
    const coverExists = await pathExists(coverPath);

    if (coverExists) {
      return {
        coverUrl: await readImageAsDataUrl(coverPath),
        coverPath,
        status: 'cached',
      };
    }

    if (runningTasks.has(coverKey)) {
      await runningTasks.get(coverKey);

      return {
        coverUrl: await readImageAsDataUrl(coverPath),
        coverPath,
        status: 'generated',
      };
    }

    const task = enqueueCoverGeneration(async () => {
      await generateCover(filePath, coverPath);
    });

    runningTasks.set(coverKey, task);

    try {
      await task;

      return {
        coverUrl: await readImageAsDataUrl(coverPath),
        coverPath,
        status: 'generated',
      };
    } finally {
      runningTasks.delete(coverKey);
    }
  } catch {
    return {
      coverUrl: null,
      status: 'failed',
    };
  }
}