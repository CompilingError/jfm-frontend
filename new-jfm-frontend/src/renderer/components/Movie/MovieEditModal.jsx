import { useEffect, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './MovieEditModal.css';

function getItemIds(items = []) {
  return items
    .filter((item) => item.id !== undefined && item.id !== null)
    .map((item) => String(item.id));
}

function MovieEditModal({ movie, onClose, onSave }) {
  const [name, setName] = useState(movie.name ?? '');
  const [path, setPath] = useState(movie.path ?? '');
  const [description, setDescription] = useState(movie.description ?? '');
  const [like, setLike] = useState(Boolean(movie.like));
  const [freshVal, setFreshVal] = useState(movie.freshVal ?? 0);

  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);

  const [selectedTagIds, setSelectedTagIds] = useState(getItemIds(movie.tags));
  const [selectedArtistIds, setSelectedArtistIds] = useState(
    getItemIds(movie.artists)
  );

  const [newTagName, setNewTagName] = useState('');
  const [newArtistName, setNewArtistName] = useState('');

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
    const trimmedPath = path.trim();

    if (!trimmedName) {
      setErrorMessage(t('movieEditModal.errors.nameRequired'));
      return;
    }

    if (!trimmedPath) {
      setErrorMessage(t('movieEditModal.errors.pathRequired'));
      return;
    }

    const selectedTags = tags.filter((tag) =>
      selectedTagIds.includes(String(tag.id))
    );

    const selectedArtists = artists.filter((artist) =>
      selectedArtistIds.includes(String(artist.id))
    );

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
            <h3>{t('movieEditModal.fields.tags')}</h3>

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
                placeholder={t('movieEditModal.placeholders.newTag')}
              />

              <button className="secondary-button" onClick={handleCreateTag}>
                {t('common.add')}
              </button>
            </div>
          </section>

          <section className="edit-options-section">
            <h3>{t('movieEditModal.fields.artists')}</h3>

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
                placeholder={t('movieEditModal.placeholders.newArtist')}
              />

              <button className="secondary-button" onClick={handleCreateArtist}>
                {t('common.add')}
              </button>
            </div>
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