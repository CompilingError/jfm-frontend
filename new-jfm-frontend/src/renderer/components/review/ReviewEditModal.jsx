import { useEffect, useMemo, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './ReviewEditModal.css';

function getItemIds(items = []) {
  return items
    .filter((item) => item.id !== undefined && item.id !== null)
    .map((item) => String(item.id));
}

function ReviewEditModal({ file, onClose, onSave }) {
  const [name, setName] = useState(file.name ?? '');
  const [description, setDescription] = useState(file.description ?? '');
  const [like, setLike] = useState(Boolean(file.like));

  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);

  const [selectedTagIds, setSelectedTagIds] = useState(getItemIds(file.tags));
  const [selectedArtistIds, setSelectedArtistIds] = useState(
    getItemIds(file.artists)
  );

  const [newTagName, setNewTagName] = useState('');
  const [newArtistName, setNewArtistName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const unresolvedDefaultTagNames = useMemo(() => {
    if (!Array.isArray(file.defaultTagNames)) {
      return [];
    }

    return file.defaultTagNames.filter((tagName) => {
      return !tags.some((tag) => tag.name === tagName);
    });
  }, [file.defaultTagNames, tags]);

  async function loadOptions() {
    const [loadedTags, loadedArtists] = await Promise.all([
      tagApi.list(),
      artistApi.list(),
    ]);

    setTags(loadedTags);
    setArtists(loadedArtists);

    if (Array.isArray(file.defaultTagNames)) {
      const matchedDefaultTagIds = loadedTags
        .filter((tag) => file.defaultTagNames.includes(tag.name))
        .map((tag) => String(tag.id));

      setSelectedTagIds((currentIds) => {
        const mergedIds = new Set([...currentIds, ...matchedDefaultTagIds]);
        return Array.from(mergedIds);
      });
    }
  }

  function toggleSelectedId(id, setSelectedIds) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id);
      }

      return [...currentIds, id];
    });
  }

  async function handleCreateTag() {
    const trimmedName = newTagName.trim();

    if (!trimmedName) {
      return;
    }

    const createdTag = await tagApi.create(trimmedName);

    setTags((currentTags) => [...currentTags, createdTag]);
    setSelectedTagIds((currentIds) => [...currentIds, String(createdTag.id)]);
    setNewTagName('');
  }

  async function handleCreateArtist() {
    const trimmedName = newArtistName.trim();

    if (!trimmedName) {
      return;
    }

    const createdArtist = await artistApi.create(trimmedName);

    setArtists((currentArtists) => [...currentArtists, createdArtist]);
    setSelectedArtistIds((currentIds) => [
      ...currentIds,
      String(createdArtist.id),
    ]);
    setNewArtistName('');
  }

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(t('reviewEditModal.errors.nameRequired'));
      return;
    }

    const selectedTags = tags.filter((tag) =>
      selectedTagIds.includes(String(tag.id))
    );

    const selectedArtists = artists.filter((artist) =>
      selectedArtistIds.includes(String(artist.id))
    );

    onSave({
      ...file,
      name: trimmedName,
      description,
      like,
      tags: selectedTags,
      artists: selectedArtists,
      defaultTagNames: unresolvedDefaultTagNames,
    });
  }

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div className="review-edit-modal-backdrop" onClick={onClose}>
      <section
        className="review-edit-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="review-edit-modal-header">
          <div>
            <h2>{t('reviewEditModal.title')}</h2>
            <p>{file.path}</p>
          </div>

          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="review-edit-modal-body">
          <label className="form-field">
            <span>{t('reviewEditModal.fields.name')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>{t('reviewEditModal.fields.description')}</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={like}
              onChange={(event) => setLike(event.target.checked)}
            />

            <span>{t('reviewEditModal.fields.like')}</span>
          </label>

          <section className="edit-options-section">
            <h3>{t('reviewEditModal.fields.tags')}</h3>

            {unresolvedDefaultTagNames.length > 0 && (
              <p className="edit-hint">
                {t('reviewEditModal.unresolvedDefaultTags', {
                  names: unresolvedDefaultTagNames.join(', '),
                })}
              </p>
            )}

            <div className="option-chip-list">
              {tags.map((tag) => {
                const id = String(tag.id);
                const isSelected = selectedTagIds.includes(id);

                return (
                  <button
                    key={tag.id}
                    className={`option-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelectedId(id, setSelectedTagIds)}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>

            <div className="inline-create-row">
              <input
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
                placeholder={t('reviewEditModal.placeholders.newTag')}
              />

              <button className="secondary-button" onClick={handleCreateTag}>
                {t('common.add')}
              </button>
            </div>
          </section>

          <section className="edit-options-section">
            <h3>{t('reviewEditModal.fields.artists')}</h3>

            <div className="option-chip-list">
              {artists.map((artist) => {
                const id = String(artist.id);
                const isSelected = selectedArtistIds.includes(id);

                return (
                  <button
                    key={artist.id}
                    className={`option-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelectedId(id, setSelectedArtistIds)}
                  >
                    {artist.name}
                  </button>
                );
              })}
            </div>

            <div className="inline-create-row">
              <input
                value={newArtistName}
                onChange={(event) => setNewArtistName(event.target.value)}
                placeholder={t('reviewEditModal.placeholders.newArtist')}
              />

              <button className="secondary-button" onClick={handleCreateArtist}>
                {t('common.add')}
              </button>
            </div>
          </section>

          {errorMessage && <p className="modal-error">{errorMessage}</p>}
        </div>

        <footer className="review-edit-modal-footer">
          <button className="secondary-button" onClick={onClose}>
            {t('common.cancel')}
          </button>

          <button className="primary-button" onClick={handleSave}>
            {t('common.save')}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ReviewEditModal;