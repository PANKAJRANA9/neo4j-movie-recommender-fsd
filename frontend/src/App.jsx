import { useState, useEffect, useCallback } from 'react'
import { movieApi } from './api/endpoints'
import MovieForm from './components/MovieForm'
import MovieGraph from './components/MovieGraph'
import MovieList from './components/MovieList'
import RecommendationPanel from './components/RecommendationPanel'
import StatsBar from './components/StatsBar'

export default function App() {
  const [movies, setMovies]     = useState([])
  const [userId, setUserId]     = useState('user123')
  const [search, setSearch]     = useState('')
  const [stats, setStats]       = useState({ movies: 0, users: 0, genres: 0, ratings: 0 })
  const [backendOk, setBackendOk] = useState(null)
  const [error, setError]       = useState('')

  const refreshMovies = useCallback(async () => {
    try {
      const { data } = await movieApi.list()
      setMovies(Array.isArray(data) ? data : [])
      setBackendOk(true)
      setError('')
    } catch (e) {
      setBackendOk(false)
      setError(e.friendlyMessage)
    }
  }, [])

  const refreshStats = useCallback(async () => {
    try {
      const { data } = await movieApi.stats()
      setStats(data)
    } catch (e) { /* stats are optional */ }
  }, [])

  useEffect(() => {
    refreshMovies()
    refreshStats()
  }, [refreshMovies, refreshStats])

  const refreshAll = () => {
    refreshMovies()
    refreshStats()
  }

  const filtered = movies.filter(m =>
    (m.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dash-root">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <header className="dash-header">
        <div className="brand">
          <span className="brand-icon">🎬</span>
          <div>
            <h1>Neo4j Movie Recommender</h1>
            <p>Java · Spring Boot · Neo4j · React 18</p>
          </div>
        </div>
        <div className="header-right">
          <span className={`pill ${
            backendOk === true  ? 'pill-ok'  :
            backendOk === false ? 'pill-bad' : 'pill-warn'
          }`}>
            {backendOk === true  ? '● Backend Online'  :
             backendOk === false ? '● Backend Offline' :
                                   '● Connecting…'}
          </span>
          <span className="pill pill-brand">by Pankaj Rana FSD</span>
        </div>
      </header>

      {error && (
        <div style={{
          padding: '10px 16px', marginBottom: 16, borderRadius: 10,
          background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c',
          fontSize: 13, fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      <StatsBar stats={stats} />

      <main className="dash-grid">
        <section className="card">
          <div className="card-head">
            <h2>📥 Movie Manager</h2>
            <span className="badge">{movies.length} nodes</span>
          </div>
          <MovieForm onCreated={refreshAll} />
          <input
            className="search-input"
            placeholder="🔍 Search movies…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <MovieList movies={filtered}   
              userId={userId}   
              onRated={refreshStats}
            // refresh stats counts after a rating 
          />
        </section>

        <section className="card card-accent">
          <div className="card-head">
            <h2>🎯 Recommendations</h2>
            <span className="badge badge-pink">Cypher Engine</span>
          </div>
          <div className="user-input-row">
            <label>User ID</label>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="user123"
            />
          </div>
          <RecommendationPanel userId={userId} />
        </section>

        <section className="card card-graph">
          <div className="card-head">
            <h2>🕸️ Live Graph</h2>
            <span className="badge badge-cyan">Neo4j Vis</span>
          </div>
          <MovieGraph movies={movies} />
        </section>
      </main>

      <footer className="dash-footer">
        🎓 Built with ❤️ · Neo4j Cypher · Spring Boot 3 · React 18
      </footer>
    </div>
  )
}