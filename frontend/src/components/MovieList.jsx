import { useState } from 'react'
import { ratingApi } from '../api/endpoints'
import StarRating from './StarRating'

export default function MovieList({ movies, userId = 'user123', onRated }) {
  const [busyId, setBusyId]   = useState(null)
  const [ratings, setRatings] = useState({})   // { movieId: rating }
  const [toast, setToast]     = useState({ msg: '', ok: true })

  const handleRate = async (movieId, rating) => {
    if (!movieId) {
      setToast({ msg: '❌ Movie ID missing', ok: false })
      setTimeout(() => setToast({ msg: '', ok: true }), 2500)
      return
    }
    setBusyId(movieId)
    try {
      await ratingApi.rate(userId, movieId, rating)
      setRatings(prev => ({ ...prev, [movieId]: rating }))
      setToast({ msg: `✅ Rated "${movieId}" ${rating}★ for ${userId}`, ok: true })
      onRated?.()
      setTimeout(() => setToast({ msg: '', ok: true }), 2200)
    } catch (e) {
      setToast({ msg: '❌ ' + (e.friendlyMessage || e.message), ok: false })
      setTimeout(() => setToast({ msg: '', ok: true }), 3200)
    } finally {
      setBusyId(null)
    }
  }

  if (!movies.length) {
    return <div className="empty">No movies found. Add one above 👆</div>
  }

  return (
    <>
      {toast.msg && (
        <div style={{
          padding: '8px 12px', marginBottom: 8, borderRadius: 8,
          background: toast.ok ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${toast.ok ? '#86efac' : '#fca5a5'}`,
          color: toast.ok ? '#15803d' : '#b91c1c',
          fontSize: 12, fontWeight: 700, textAlign: 'center',
        }}>
          {toast.msg}
        </div>
      )}

      <div className="movie-list">
        {movies.map(m => {
          const id = m.id ?? m.movieId
          const isBusy = busyId === id
          const myRating = ratings[id] || 0
          return (
            <div
              key={id ?? m.title}
              className="movie-item"
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 8,
                paddingBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="movie-title">{m.title}</div>
                  <div className="movie-meta">
                    {m.genre || 'Movie'} · {m.year || '—'}
                  </div>
                </div>
                {myRating > 0 && (
                  <span className="tag" style={{ background: '#fef3c7', color: '#92400e', whiteSpace: 'nowrap' }}>
                    You: {myRating}★
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                paddingTop: 6, borderTop: '1px dashed rgba(148,163,184,.25)',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', minWidth: 46 }}>
                  {isBusy ? '⏳ …' : 'Rate:'}
                </span>
                <StarRating
                  value={myRating}
                  onRate={handleRate}
                  disabled={isBusy}
                  movieId={id}
                  size={20}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}