import { useState, useEffect } from 'react'
import { recApi, ratingApi } from '../api/endpoints'

export default function RecommendationPanel({ userId }) {
  const [recs, setRecs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [fetched, setFetched] = useState(false)

  const fetchRecs = async () => {
    if (!userId?.trim()) {
      setError('Please enter a User ID first')
      return
    }
    setLoading(true); setError('')
    try {
      const { data } = await recApi.forUser(userId)
      setRecs(Array.isArray(data) ? data : [])
      setFetched(true)
    } catch (e) {
      setError(e.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (userId) fetchRecs() }, [userId])

  return (
    <>
      <button className="rec-btn" onClick={fetchRecs} disabled={loading}>
        {loading ? '⏳ Querying Cypher…' : '🎯 Get Recommendations'}
      </button>

      {error && (
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: '#fee2e2', border: '1px solid #fca5a5',
          color: '#b91c1c', fontSize: 12, fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      {fetched && !recs.length && !error && (
        <div className="empty">No recommendations yet. Add ratings for more users.</div>
      )}

      <div className="rec-list">
        {recs.map((r, i) => (
          <div key={r.id ?? i} className="rec-item">
            <div className="rec-rank">{i + 1}</div>
            <div>
              <div className="rec-title">{r.title}</div>
              <div className="rec-sub">
                {r.genre || 'Movie'} · {r.year || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}