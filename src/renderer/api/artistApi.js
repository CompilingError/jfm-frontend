import { request } from './httpClient.js';

export const artistApi = {
  list() {
    return request('/artists');
  },

  getById(id) {
    return request(`/artists/id/${id}`);
  },

  getByName(name) {
    return request(`/artists/name/${encodeURIComponent(name)}`);
  },

  create(name) {
    return request('/artists', {
      method: 'POST',
      body: {
        name,
      },
    });
  },

  update(id, data) {
    return request(`/artists/id/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteMany(ids) {
    return request('/artists', {
      method: 'DELETE',
      query: {
        ids,
      },
    });
  },
};