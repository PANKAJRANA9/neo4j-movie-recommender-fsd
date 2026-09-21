import { useState, useEffect } from 'react'
import axios from 'axios'
import MovieForm from './components/MovieForm'
import MovieGraph from './components/MovieGraph'
import MovieList from './components/MovieList'
import RecommendationPanel from './components/RecommendationPanel'
import StatsBar from './components/StatsBar'

export default function App() {
  const [movies, setMovies] = useState([])
  const [userId, setUserId] = useState('user123')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ movies: 0, users: 0, genres: 0, ratings: 0 })
  const [backendOk, setBackendOk] = useState(null)

  useEffect(() => {
    fetchMovies()
    fetchStats()
  }, [])

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/movies')
      setMovies(res.data)
      setBackendOk(true)
    } catch (e) {
      setBackendOk(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/stats')
      setStats(res.data)
    } catch (e) { /* silent */ }
  }

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
          <span className={`pill ${backendOk === true ? 'pill-ok' : backendOk === false ? 'pill-bad' : 'pill-warn'}`}>
            {backendOk === true ? '● Backend Online' : backendOk === false ? '● Backend Offline' : '● Connecting…'}
          </span>
          <span className="pill pill-brand">by Pankaj Rana FSD</span>
        </div>
      </header>

      <StatsBar stats={stats} />

      <main className="dash-grid">
        <section className="card">
          <div className="card-head">
            <h2>📥 Movie Manager</h2>
            <span className="badge">{movies.length} nodes</span>
          </div>
          <MovieForm onCreated={() => { fetchMovies(); fetchStats() }} />
          <input
            className="search-input"
            placeholder="🔍 Search movies…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <MovieList
            movies={movies.filter(m =>
              (m.title || '').toLowerCase().includes(search.toLowerCase())
            )}
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
        <span>🎓 Built with ❤️ · Neo4j Cypher · Spring Boot 3 · React 18</span>
      </footer>
    </div>
  )
}