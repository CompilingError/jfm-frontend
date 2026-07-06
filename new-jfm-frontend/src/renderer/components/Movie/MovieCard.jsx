import { Heart } from 'lucide-react';
import { useCover } from '../../hooks/useCover.js';
import { t } from '../../i18n/index.js';
import './MovieCard.css';

function normalizeTags(movie) {
    if (Array.isArray(movie.tags)) {
        return movie.tags;
    }

    return [];
}

function normalizeArtists(movie) {
    if (Array.isArray(movie.artists)) {
        return movie.artists;
    }

    return [];
}

function MovieCard({
    movie,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onLikeChange,
}) {
    const tags = normalizeTags(movie);
    const artists = normalizeArtists(movie);
    const { coverUrl, isLoadingCover } = useCover(movie);

    async function handleDoubleClick(event) {
        event.stopPropagation();

        if (!movie.path) {
            return;
        }

        await window.fileSystemAPI.openFile(movie.path);
    }

    function handleClick(event) {
        event.stopPropagation();
        onToggle(movie.id);
    }

    function handleEditClick(event) {
        event.stopPropagation();
        onEdit(movie);
    }

    function handleDeleteClick(event) {
        event.stopPropagation();
        onDelete(movie);
    }

    function handleLikeClick(event) {
        event.stopPropagation();
        onLikeChange(movie, !movie.like);
    }

    return (
        <article
            className={`movie-card ${isExpanded ? 'movie-card-expanded' : ''}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="movie-cover-frame">
                {coverUrl ? (
                    <img className="movie-cover-image" src={coverUrl} alt="" />
                ) : (
                    <span>
                        {isLoadingCover
                            ? t('movieCard.generatingCover')
                            : t('movieCard.coverPlaceholder')}
                    </span>
                )}
            </div>

            <div className="movie-card-body">
                <div className="movie-card-title-row">
                    <h3 className="movie-card-title">{movie.name}</h3>

                    <button
                        className={`movie-like-button ${movie.like ? 'liked' : ''}`}
                        onClick={handleLikeClick}
                        title={movie.like ? t('movieCard.actions.unlike') : t('movieCard.actions.like')}
                        aria-label={
                            movie.like ? t('movieCard.actions.unlike') : t('movieCard.actions.like')
                        }
                    >
                        <Heart size={20} />
                    </button>
                </div>

                <p className="movie-card-artists">
                    {artists.length > 0
                        ? artists.map((artist) => artist.name).join(', ')
                        : t('movieCard.noArtists')}
                </p>

                <div className="movie-card-tags">
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <span className="movie-tag" key={tag.id ?? tag.name}>
                                {tag.name}
                            </span>
                        ))
                    ) : (
                        <span className="movie-card-muted">{t('movieCard.noTags')}</span>
                    )}
                </div>

                <div className="movie-card-meta">
                    <span>
                        {t('movieCard.fields.freshVal')}：
                        {movie.freshVal ?? t('common.none')}
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="movie-card-details">
                    <div className="movie-card-details-header">
                        <strong>{t('movieCard.detailsTitle')}</strong>

                        <div className="movie-card-detail-actions">
                            <button className="movie-card-edit-button" onClick={handleEditClick}>
                                {t('movieCard.actions.edit')}
                            </button>

                            <button
                                className="movie-card-delete-button"
                                onClick={handleDeleteClick}
                            >
                                {t('movieCard.actions.delete')}
                            </button>
                        </div>
                    </div>

                    <div className="movie-card-detail-row">
                        <span className="movie-card-detail-label">
                            {t('movieCard.fields.path')}
                        </span>
                        <span className="movie-card-detail-value">{movie.path}</span>
                    </div>

                    <div className="movie-card-detail-row">
                        <span className="movie-card-detail-label">
                            {t('movieCard.fields.description')}
                        </span>
                        <span className="movie-card-detail-value">
                            {movie.description || t('common.none')}
                        </span>
                    </div>

                    <div className="movie-card-detail-row">
                        <span className="movie-card-detail-label">
                            {t('movieCard.fields.like')}
                        </span>
                        <span className="movie-card-detail-value">
                            {movie.like ? t('common.yes') : t('common.no')}
                        </span>
                    </div>

                    <div className="movie-card-detail-row">
                        <span className="movie-card-detail-label">
                            {t('movieCard.fields.freshVal')}
                        </span>
                        <span className="movie-card-detail-value">
                            {movie.freshVal ?? t('common.none')}
                        </span>
                    </div>

                    <div className="movie-card-all-tags">
                        {tags.map((tag) => (
                            <span className="movie-tag" key={tag.id ?? tag.name}>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}

export default MovieCard;