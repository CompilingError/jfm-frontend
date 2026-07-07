import { artistApi } from '../api/artistApi.js';
import { movieApi } from '../api/movieApi.js';
import { tagApi } from '../api/tagApi.js';

async function findOrCreateTagByName(name) {
  try {
    const existingTag = await tagApi.getByName(name);

    if (existingTag?.id) {
      return existingTag;
    }
  } catch {
    // Not found, create below.
  }

  return tagApi.create(name);
}

async function findOrCreateArtistByName(name) {
  try {
    const existingArtist = await artistApi.getByName(name);

    if (existingArtist?.id) {
      return existingArtist;
    }
  } catch {
    // Not found, create below.
  }

  return artistApi.create(name);
}

async function resolveTagIds(file) {
  const tagIds = new Set();
  const tagNamesToCreate = new Set();

  if (Array.isArray(file.tags)) {
    file.tags.forEach((tag) => {
      if (tag.id) {
        tagIds.add(tag.id);
        return;
      }

      if (tag.name) {
        tagNamesToCreate.add(tag.name);
      }
    });
  }

  if (Array.isArray(file.defaultTagNames)) {
    file.defaultTagNames.forEach((tagName) => {
      if (tagName) {
        tagNamesToCreate.add(tagName);
      }
    });
  }

  for (const tagName of tagNamesToCreate) {
    const tag = await findOrCreateTagByName(tagName);
    tagIds.add(tag.id);
  }

  return Array.from(tagIds);
}

async function resolveArtistIds(file) {
  const artistIds = new Set();
  const artistNamesToCreate = new Set();

  if (Array.isArray(file.artists)) {
    file.artists.forEach((artist) => {
      if (artist.id) {
        artistIds.add(artist.id);
        return;
      }

      if (artist.name) {
        artistNamesToCreate.add(artist.name);
      }
    });
  }

  for (const artistName of artistNamesToCreate) {
    const artist = await findOrCreateArtistByName(artistName);
    artistIds.add(artist.id);
  }

  return Array.from(artistIds);
}

export async function importPendingFileToBackend(file) {
  const tagIds = await resolveTagIds(file);
  const artistIds = await resolveArtistIds(file);

  const createPayload = {
    name: file.name,
    path: file.path,
    description: file.description ?? '',
    tagIds,
    artistIds,
  };

  const createdMovie = await movieApi.create(createPayload);

  const shouldUpdateAfterCreate =
    file.like !== undefined ||
    file.freshVal !== undefined;

  if (!shouldUpdateAfterCreate) {
    return createdMovie;
  }

  const updatePayload = {
    name: createdMovie.name ?? file.name,
    path: createdMovie.path ?? file.path,
    description: createdMovie.description ?? file.description ?? '',
    tagIds,
    artistIds,
    like: Boolean(file.like),
  };

  if (file.freshVal !== undefined && file.freshVal !== null) {
    updatePayload.freshVal = file.freshVal;
  }

  return movieApi.update(createdMovie.id, updatePayload);
}