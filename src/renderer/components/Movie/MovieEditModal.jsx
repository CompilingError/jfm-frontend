import { useEffect, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './MovieEditModal.css';
import SearchableChipInput from '../common/SearchableChipInput.jsx';

function MovieEditModal({ movie, onClose, onSave }) {
  const [name, setName] = useState(movie.name ?? '');
  const [path, setPath] = useState(movie.path ?? '');
  const [description, setDescription] = useState(movie.description ?? '');
  const [like, setLike] = useState(Boolean(movie.like));
  const [freshVal, setFreshVal] = useState(movie.freshVal ?? 0);

  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);

  const [selectedTags, setSelectedTags] = useState(movie.tags ?? []);
  const [selectedArtists, setSelectedArtists] = useState(movie.artists ?? []);

  const [errorMessage, setErrorMessage] = useState('');

  async function loadOptions() {
    const [loadedTags, loadedArtists] = await Promise.all([
      tagApi.list(),
      artistApi.list(),
    ]);

    setTags(loadedTags);
    setArtists(loadedArtists);
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
    const trimmedPath = path.trim();

    if (!trimmedName) {
      setErrorMessage(t('movieEditModal.errors.nameRequired'));
      return;
    }

    if (!trimmedPath) {
      setErrorMessage(t('movieEditModal.errors.pathRequired'));
      return;
    }

    onSave(movie.id, {
      name: trimmedName,
      path: trimmedPath,
      description,
      like,
      freshVal: Number(freshVal),
      tagIds: selectedTags.map((tag) => tag.id),
      artistIds: selectedArtists.map((artist) => artist.id),
    });
  }

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <div className="movie-edit-modal-backdrop" onClick={onClose}>
      <section
        className="movie-edit-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="movie-edit-modal-header">
          <div>
            <h2>{t('movieEditModal.title')}</h2>
            <p>{movie.path}</p>
          </div>

          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="movie-edit-modal-body">
          <label className="form-field">
            <span>{t('movieEditModal.fields.name')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>{t('movieEditModal.fields.path')}</span>
            <input
              value={path}
              onChange={(event) => setPath(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>{t('movieEditModal.fields.description')}</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </label>

          <div className="movie-edit-inline-fields">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={like}
                onChange={(event) => setLike(event.target.checked)}
              />

              <span>{t('movieEditModal.fields.like')}</span>
            </label>

            <label className="form-field compact">
              <span>{t('movieEditModal.fields.freshVal')}</span>
              <input
                type="number"
                value={freshVal}
                onChange={(event) => setFreshVal(event.target.value)}
              />
            </label>
          </div>

          <section className="edit-options-section">
            <SearchableChipInput
              label={t('movieEditModal.fields.tags')}
              placeholder={t('movieEditModal.placeholders.newTag')}
              options={tags}
              selectedItems={selectedTags}
              onChange={setSelectedTags}
              onCreate={handleCreateTag}
            />
          </section>

          <section className="edit-options-section">
            <SearchableChipInput
              label={t('movieEditModal.fields.artists')}
              placeholder={t('movieEditModal.placeholders.newArtist')}
              options={artists}
              selectedItems={selectedArtists}
              onChange={setSelectedArtists}
              onCreate={handleCreateArtist}
            />
          </section>

          {errorMessage && <p className="modal-error">{errorMessage}</p>}
        </div>

        <footer className="movie-edit-modal-footer">
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

export default MovieEditModal;