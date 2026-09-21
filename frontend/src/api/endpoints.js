import api from './client'

export const movieApi = {
  list:      ()        => api.get('/api/movies'),
  get:       (id)      => api.get(`/api/movies/${id}`),
  create:    (data)    => api.post('/api/movies', data),
  search:    (q)       => api.get('/api/movies/search', { params: { q } }),
  byGenre:   (genre)   => api.get(`/api/movies/genre/${genre}`),
  stats:     ()        => api.get('/api/stats'),
  graph:     ()        => api.get('/api/graph'),
}

export const recApi = {
  forUser: (userId) => api.get(`/api/recommend/${userId}`),
}

export const ratingApi = {
  rate: (userId, movieId, rating) =>
    api.post('/api/rate', { userId, movieId, rating }),
}