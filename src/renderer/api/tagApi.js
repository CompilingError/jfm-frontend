import { request } from './httpClient.js';

export const tagApi = {
  list() {
    return request('/tags');
  },

  getById(id) {
    return request(`/tags/id/${id}`);
  },

  getByName(name) {
    return request(`/tags/name/${encodeURIComponent(name)}`);
  },

  create(name) {
    return request('/tags', {
      method: 'POST',
      body: {
        name,
      },
    });
  },

  update(id, data) {
    return request(`/tags/id/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteMany(ids) {
    return request('/tags', {
      method: 'DELETE',
      query: {
        ids,
      },
    });
  },
};