import { Heart } from 'lucide-react';
import { t } from '../../i18n/index.js';
import './FileCard.css';

function normalizeTags(file) {
  if (Array.isArray(file.tags)) {
    return file.tags;
  }

  if (Array.isArray(file.defaultTagNames)) {
    return file.defaultTagNames.map((tagName) => ({
      id: tagName,
      name: tagName,
    }));
  }

  return [];
}

function normalizeArtists(file) {
  if (Array.isArray(file.artists)) {
    return file.artists;
  }

  return [];
}

function FileCard({ file, isExpanded, onToggle, onLikeChange }) {
  const tags = normalizeTags(file);
  const artists = normalizeArtists(file);

  async function handleDoubleClick(event) {
    event.stopPropagation();

    if (!file.path) {
      return;
    }

    await window.fileSystemAPI.openFile(file.path);
  }

  function handleClick(event) {
    event.stopPropagation();
    onToggle();
  }

  function handleLikeButtonClick(event) {
    event.stopPropagation();
    onLikeChange(!file.like);
  }

  return (
    <article
      className={`file-card ${isExpanded ? 'file-card-expanded' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="file-cover-placeholder">
        <span>{t('fileCard.coverPlaceholder')}</span>
      </div>

      <div className="file-card-body">
        <div className="file-card-title-row">
          <h3 className="file-card-title">{file.name}</h3>

          <button
            className={`file-like-button ${file.like ? 'liked' : ''}`}
            onClick={handleLikeButtonClick}
            aria-label={
              file.like
                ? t('fileCard.actions.unlike')
                : t('fileCard.actions.like')
            }
          >
            <Heart size={20} />
          </button>
        </div>

        <p className="file-card-artists">
          {artists.length > 0
            ? artists.map((artist) => artist.name).join(', ')
            : t('fileCard.noArtists')}
        </p>

        <div className="file-card-tags-one-line">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span className="file-tag" key={tag.id ?? tag.name}>
                {tag.name}
              </span>
            ))
          ) : (
            <span className="file-card-muted">{t('fileCard.noTags')}</span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="file-card-details">
          <div className="file-card-detail-row">
            <span className="file-card-detail-label">
              {t('fileCard.fields.path')}
            </span>
            <span className="file-card-detail-value">{file.path}</span>
          </div>

          <div className="file-card-detail-row">
            <span className="file-card-detail-label">
              {t('fileCard.fields.description')}
            </span>
            <span className="file-card-detail-value">
              {file.description || t('common.none')}
            </span>
          </div>

          <div className="file-card-detail-row">
            <span className="file-card-detail-label">
              {t('fileCard.fields.like')}
            </span>
            <span className="file-card-detail-value">
              {file.like ? t('common.yes') : t('common.no')}
            </span>
          </div>

          <div className="file-card-detail-row">
            <span className="file-card-detail-label">
              {t('fileCard.fields.freshVal')}
            </span>
            <span className="file-card-detail-value">
              {file.freshVal ?? t('common.none')}
            </span>
          </div>

          <div className="file-card-detail-row">
            <span className="file-card-detail-label">
              {t('fileCard.fields.lastWatchedTime')}
            </span>
            <span className="file-card-detail-value">
              {file.lastWatchedTime ?? t('common.none')}
            </span>
          </div>

          <div className="file-card-all-tags">
            {tags.map((tag) => (
              <span className="file-tag" key={tag.id ?? tag.name}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default FileCard;