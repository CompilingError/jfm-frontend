import { useEffect, useMemo, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './ReviewEditModal.css';
import SearchableChipInput from '../common/SearchableChipInput.jsx';

function ReviewEditModal({ file, onClose, onSave }) {
  const [name, setName] = useState(file.name ?? '');
  const [description, setDescription] = useState(file.description ?? '');
  const [like, setLike] = useState(Boolean(file.like));

  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);

  const [selectedTags, setSelectedTags] = useState(file.tags ?? []);
  const [selectedArtists, setSelectedArtists] = useState(file.artists ?? []);

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
      const matchedDefaultTags = loadedTags.filter((tag) =>
        file.defaultTagNames.includes(tag.name)
      );

      setSelectedTags((currentTags) => {
        const existingIds = new Set(currentTags.map((tag) => String(tag.id)));

        const newTags = matchedDefaultTags.filter(
          (tag) => !existingIds.has(String(tag.id))
        );

        return [...currentTags, ...newTags];
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

  async function handleCreateTag(name) {
    const createdTag = await tagApi.create(name);

    setTags((currentTags) => [...currentTags, createdTag]);

    return createdTag;
  }

  async function handleCreateArtist(name) {
    const createdArtist = await artistApi.create(name);

    setArtists((currentArtists) => [...currentArtists, createdArtist]);

    return createdArtist;
  }

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(t('reviewEditModal.errors.nameRequired'));
      return;
    }

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
            <SearchableChipInput
              label={t('reviewEditModal.fields.tags')}
              placeholder={t('reviewEditModal.placeholders.newTag')}
              options={tags}
              selectedItems={selectedTags}
              onChange={setSelectedTags}
              onCreate={handleCreateTag}
            />
          </section>

          <section className="edit-options-section">
            <SearchableChipInput
              label={t('reviewEditModal.fields.artists')}
              placeholder={t('reviewEditModal.placeholders.newArtist')}
              options={artists}
              selectedItems={selectedArtists}
              onChange={setSelectedArtists}
              onCreate={handleCreateArtist}
            />
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