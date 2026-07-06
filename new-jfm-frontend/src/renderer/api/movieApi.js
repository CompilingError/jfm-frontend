import { request } from './httpClient.js';

export const movieApi = {
  list({ page = 0, size = 12, sort } = {}) {
    return request('/movies', {
      query: {
        page,
        size,
        sort,
      },
    });
  },

  getById(id) {
    return request(`/movies/id/${id}`);
  },

  getByName(name) {
    return request(`/movies/name/${encodeURIComponent(name)}`);
  },

  findByTags({ tagIds, mode = 'ALL', page = 0, size = 20 }) {
    return request('/movies/by-tags', {
      query: {
        tagIds,
        mode,
        page,
        size,
      },
    });
  },

  findByArtists({ artistIds, mode = 'ANY', page = 0, size = 20 }) {
    return request('/movies/by-artists', {
      query: {
        artistIds,
        mode,
        page,
        size,
      },
    });
  },

  create(data) {
    return request('/movies', {
      method: 'POST',
      body: data,
    });
  },

  update(id, data) {
    return request(`/movies/id/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteByIds(ids) {
    return request('/movies', {
      method: 'DELETE',
      query: {
        ids: Array.isArray(ids) ? ids : [ids],
      },
    });
  },

  markWatched(id) {
    return request(`/movies/watched/${id}`, {
      method: 'POST',
    });
  },

  updateFreshVal() {
    return request('/movies/update-freshval', {
      method: 'POST',
    });
  },

  search({
    name,
    tagIds = [],
    tagMode = 'ALL',
    artistIds = [],
    artistMode = 'ANY',
    like,
    minFreshVal,
    maxFreshVal,
    sort,
    page = 0,
    size = 20,
  } = {}) {
    return request('/movies/search', {
      query: {
        name,
        tagIds,
        tagMode,
        artistIds,
        artistMode,
        like,
        minFreshVal,
        maxFreshVal,
        sort,
        page,
        size,
      },
    });
  },
};