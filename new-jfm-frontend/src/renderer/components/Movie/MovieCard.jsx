import { Heart } from 'lucide-react';
import { t } from '../../i18n/index.js';
import './MovieCard.css';
import { useCover } from '../../hooks/useCover.js';

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

function MovieCard({ movie }) {
    const tags = normalizeTags(movie);
    const artists = normalizeArtists(movie);
    const { coverUrl, isLoadingCover } = useCover(movie);

    async function handleDoubleClick() {
        if (!movie.path) {
            return;
        }

        await window.fileSystemAPI.openFile(movie.path);
    }

    return (
        <article className="movie-card" onDoubleClick={handleDoubleClick}>
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

                    <span
                        className={`movie-like-indicator ${movie.like ? 'liked' : ''}`}
                        title={movie.like ? t('common.yes') : t('common.no')}
                    >
                        <Heart size={20} />
                    </span>
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
        </article>
    );
}

export default MovieCard;