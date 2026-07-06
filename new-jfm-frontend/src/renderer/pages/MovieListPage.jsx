import { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi.js';
import MovieCard from '../components/movie/MovieCard.jsx';
import { t } from '../i18n/index.js';
import './MovieListPage.css';
import MovieEditModal from '../components/movie/MovieEditModal.jsx';

const PAGE_SIZE = 12;

function normalizeMoviePage(response) {
  if (!response) {
    return {
      movies: [],
      pageNumber: 0,
      totalPages: 0,
      totalElements: 0,
      isFirst: true,
      isLast: true,
    };
  }

  return {
    movies: response.content ?? [],
    pageNumber: response.number ?? 0,
    totalPages: response.totalPages ?? 0,
    totalElements: response.totalElements ?? 0,
    isFirst: response.first ?? true,
    isLast: response.last ?? true,
  };
}

function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadMovies(nextPageNumber = pageNumber) {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await movieApi.list({
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
    } finally {
      setIsLoading(false);
    }
  }

  function handleRefresh() {
    loadMovies(pageNumber);
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
    } catch {
      setErrorMessage(t('pages.movies.updateFailed'));
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
    } catch {
      setErrorMessage(t('pages.movies.updateFailed'));
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
    } catch {
      setErrorMessage(t('pages.movies.deleteFailed'));
    } finally {
      setIsLoading(false);
    }
  }

  function handlePreviousPage() {
    if (pageNumber <= 0) {
      return;
    }

    loadMovies(pageNumber - 1);
  }

  function handleNextPage() {
    if (totalPages === 0) {
      return;
    }

    if (pageNumber >= totalPages - 1) {
      return;
    }

    loadMovies(pageNumber + 1);
  }

  useEffect(() => {
    loadMovies(0);
  }, []);

  const isFirstPage = pageNumber <= 0;
  const isLastPage = totalPages === 0 || pageNumber >= totalPages - 1;

  return (
    <div
      className="movie-list-page"
      onClick={() => setExpandedMovieId(null)}
    >
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
            />
          ))}
        </div>
      )}

      <footer className="movie-list-pagination">
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