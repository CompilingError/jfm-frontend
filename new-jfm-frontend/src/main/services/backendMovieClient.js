const API_BASE_URL = 'http://localhost:8080';

export async function findMoviesByName(name) {
  const encodedName = encodeURIComponent(name);
  const url = `${API_BASE_URL}/movies/name/${encodedName}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to find movie by name: ${response.status}`);
  }

  const movies = await response.json();

  if (!Array.isArray(movies)) {
    return [];
  }

  return movies;
}