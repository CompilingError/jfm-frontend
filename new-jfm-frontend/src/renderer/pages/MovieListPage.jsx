import { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi.js';
import MovieCard from '../components/movie/MovieCard.jsx';
import MovieEditModal from '../components/movie/MovieEditModal.jsx';
import MovieFilterBar from '../components/movie/MovieFilterBar.jsx';
import { t } from '../i18n/index.js';
import './MovieListPage.css';
import { useToast } from '../components/common/toast/ToastProvider.jsx';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS = {
  name: undefined,
  tagIds: [],
  tagMode: 'ALL',
  artistIds: [],
  artistMode: 'ANY',
  like: undefined,
  minFreshVal: undefined,
  maxFreshVal: undefined,
  sort: 'id,desc',
};

function normalizeMoviePage(response) {
  if (!response) {
    return {
      movies: [],
      pageNumber: 0,
      totalPages: 0,
      totalElements: 0,
    };
  }

  return {
    movies: response.content ?? [],
    pageNumber: response.number ?? 0,
    totalPages: response.totalPages ?? 0,
    totalElements: response.totalElements ?? 0,
  };
}

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toast = useToast();

  async function loadMovies(nextPageNumber = pageNumber, nextFilters = filters) {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await movieApi.search({
        ...nextFilters,
        page: nextPageNumber,
        size: PAGE_SIZE,
      });

      const normalizedPage = normalizeMoviePage(response);

      setMovies(normalizedPage.movies);
      setPageNumber(normalizedPage.pageNumber);
      setTotalPages(normalizedPage.totalPages);
      setTotalElements(normalizedPage.totalElements);
    } catch {
      setErrorMessage(t('pages.movies.loadFailed'));
      toast.error(t('pages.movies.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageClick() {
    setExpandedMovieId(null);
  }

  function handleRefresh(event) {
    event.stopPropagation();
    loadMovies(pageNumber, filters);
  }

  function handleApplyFilters(nextFilters) {
    setFilters(nextFilters);
    setExpandedMovieId(null);
    loadMovies(0, nextFilters);
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS);
    setExpandedMovieId(null);
    loadMovies(0, DEFAULT_FILTERS);
  }

  function handleToggleMovie(movieId) {
    setExpandedMovieId((currentId) => {
      if (currentId === movieId) {
        return null;
      }

      return movieId;
    });
  }

  async function handleSaveEditedMovie(movieId, payload) {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const updatedMovie = await movieApi.update(movieId, payload);

      setMovies((currentMovies) =>
        currentMovies.map((movie) => {
          if (movie.id !== movieId) {
            return movie;
          }

          return updatedMovie;
        })
      );

      setEditingMovie(null);
      toast.success(t('pages.movies.updateSuccess'));
    } catch {
      setErrorMessage(t('pages.movies.updateFailed'));
      toast.error(t('pages.movies.updateFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteMovie(movie) {
    const shouldDelete = window.confirm(
      t('pages.movies.deleteConfirm', {
        name: movie.name,
      })
    );

    if (!shouldDelete) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await movieApi.deleteByIds([movie.id]);

      setMovies((currentMovies) =>
        currentMovies.filter((currentMovie) => currentMovie.id !== movie.id)
      );

      setExpandedMovieId(null);
      toast.success(t('pages.movies.deleteSuccess'));
    } catch (error) {
      console.error('[movie delete failed]', error);
      setErrorMessage(t('pages.movies.deleteFailed'));
      toast.error(t('pages.movies.deleteFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLikeChange(movie, nextLikeValue) {
    setErrorMessage('');

    const payload = {
      name: movie.name,
      path: movie.path,
      description: movie.description ?? '',
      like: nextLikeValue,
      freshVal: movie.freshVal ?? 0,
      tagIds: Array.isArray(movie.tags)
        ? movie.tags.map((tag) => tag.id)
        : [],
      artistIds: Array.isArray(movie.artists)
        ? movie.artists.map((artist) => artist.id)
        : [],
    };

    try {
      const updatedMovie = await movieApi.update(movie.id, payload);

      setMovies((currentMovies) =>
        currentMovies.map((currentMovie) => {
          if (currentMovie.id !== movie.id) {
            return currentMovie;
          }

          return updatedMovie;
        })
      );

      toast.success(
        nextLikeValue
          ? t('pages.movies.likeSuccess')
          : t('pages.movies.unlikeSuccess')
      );
    } catch {
      setErrorMessage(t('pages.movies.updateFailed'));
      toast.error(t('pages.movies.updateFailed'));
    }
  }

  async function handleOpenMovie(movie) {
    setErrorMessage('');

    try {
      await window.fileSystemAPI.openFile(movie.path);

      await movieApi.markWatched(movie.id);

      setMovies((currentMovies) =>
        currentMovies.map((currentMovie) => {
          if (currentMovie.id !== movie.id) {
            return currentMovie;
          }

          return {
            ...currentMovie,
            freshVal: Math.max(0, (currentMovie.freshVal ?? 0) - 30),
          };
        })
      );

      toast.success(t('pages.movies.watchedSuccess'));
    } catch (error) {
      console.error('[movie open or watched failed]', error);
      setErrorMessage(t('pages.movies.openFailed'));
      toast.error(t('pages.movies.openFailed'));
    }
  }

  function handlePreviousPage(event) {
    event.stopPropagation();

    if (pageNumber <= 0) {
      return;
    }

    setExpandedMovieId(null);
    loadMovies(pageNumber - 1, filters);
  }

  function handleNextPage(event) {
    event.stopPropagation();

    if (totalPages === 0) {
      return;
    }

    if (pageNumber >= totalPages - 1) {
      return;
    }

    setExpandedMovieId(null);
    loadMovies(pageNumber + 1, filters);
  }

  useEffect(() => {
    loadMovies(0, DEFAULT_FILTERS);
  }, []);

  const isFirstPage = pageNumber <= 0;
  const isLastPage = totalPages === 0 || pageNumber >= totalPages - 1;

  return (
    <div className="movie-list-page" onClick={handlePageClick}>
      <header className="movie-list-header">
        <div>
          <h1>{t('pages.movies.title')}</h1>
          <p>{t('pages.movies.description')}</p>
        </div>

        <button
          className="primary-button"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? t('pages.movies.loading') : t('pages.movies.refresh')}
        </button>
      </header>

      <MovieFilterBar
        isLoading={isLoading}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <section className="movie-list-summary">
        <span>
          {t('pages.movies.totalCount', {
            count: totalElements,
          })}
        </span>

        <span>
          {t('pages.movies.pageInfo', {
            current: totalPages === 0 ? 0 : pageNumber + 1,
            total: totalPages,
          })}
        </span>
      </section>

      {errorMessage && <p className="movie-list-error">{errorMessage}</p>}

      {movies.length === 0 && !isLoading ? (
        <div className="movie-list-empty">{t('pages.movies.empty')}</div>
      ) : (
        <div className="movie-card-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isExpanded={expandedMovieId === movie.id}
              onToggle={handleToggleMovie}
              onEdit={setEditingMovie}
              onDelete={handleDeleteMovie}
              onLikeChange={handleLikeChange}
              onOpen={handleOpenMovie}
            />
          ))}
        </div>
      )}

      <footer
        className="movie-list-pagination"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="secondary-button"
          onClick={handlePreviousPage}
          disabled={isLoading || isFirstPage}
        >
          {t('pages.movies.previousPage')}
        </button>

        <button
          className="secondary-button"
          onClick={handleNextPage}
          disabled={isLoading || isLastPage}
        >
          {t('pages.movies.nextPage')}
        </button>
      </footer>

      {editingMovie && (
        <MovieEditModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSave={handleSaveEditedMovie}
        />
      )}
    </div>
  );
}

export default MovieListPage;