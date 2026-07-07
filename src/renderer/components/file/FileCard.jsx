import { Heart } from 'lucide-react';
import { t } from '../../i18n/index.js';
import './FileCard.css';
import { useCover } from '../../hooks/useCover.js';

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

function FileCard({
    file,
    isExpanded,
    isSelectionMode,
    isSelected,
    onToggle,
    onSelectionChange,
    onLikeChange,
    onEdit,
    onApprove,
}) {
    const tags = normalizeTags(file);
    const artists = normalizeArtists(file);
    const { coverUrl, isLoadingCover } = useCover(file);

    async function handleDoubleClick(event) {
        event.stopPropagation();

        if (isSelectionMode) {
            return;
        }

        if (!file.path) {
            return;
        }

        await window.fileSystemAPI.openFile(file.path);
    }

    function handleClick(event) {
        event.stopPropagation();
        onToggle();
    }

    function handleCheckboxClick(event) {
        event.stopPropagation();
        onSelectionChange();
    }

    function handleLikeButtonClick(event) {
        event.stopPropagation();
        onLikeChange(!file.like);
    }

    function handleEditButtonClick(event) {
        event.stopPropagation();
        onEdit(file);
    }

    function handleApproveButtonClick(event) {
        event.stopPropagation();
        onApprove(file);
    }

    return (
        <article
            className={`file-card ${isExpanded ? 'file-card-expanded' : ''} ${isSelected ? 'file-card-selected' : ''
                }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            {isSelectionMode && (
                <button
                    className={`file-card-checkbox ${isSelected ? 'checked' : ''}`}
                    onClick={handleCheckboxClick}
                    aria-label={
                        isSelected
                            ? t('fileCard.actions.unselect')
                            : t('fileCard.actions.select')
                    }
                >
                    {isSelected ? '✓' : ''}
                </button>
            )}

            <div className="file-cover-frame">
                {coverUrl ? (
                    <img className="file-cover-image" src={coverUrl} alt="" />
                ) : (
                    <span>
                        {isLoadingCover
                            ? t('fileCard.generatingCover')
                            : t('fileCard.coverPlaceholder')}
                    </span>
                )}
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
                    <div className="file-card-details-header">
                        <strong>{t('fileCard.detailsTitle')}</strong>

                        <div className="file-card-detail-actions">
                            <button className="file-card-edit-button" onClick={handleEditButtonClick}>
                                {t('fileCard.actions.edit')}
                            </button>

                            <button
                                className="file-card-approve-button"
                                onClick={handleApproveButtonClick}
                            >
                                {t('fileCard.actions.approve')}
                            </button>
                        </div>
                    </div>
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