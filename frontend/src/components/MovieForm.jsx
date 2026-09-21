import { useState } from 'react'
import { movieApi } from '../api/endpoints'

export default function MovieForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '', genre: 'Action', year: 2024, rating: 'PG-13', description: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await movieApi.create(form)
      setForm({ title: '', genre: 'Action', year: 2024, rating: 'PG-13', description: '' })
      onCreated?.()
    } catch (err) {
      setError(err.friendlyMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="movie-form">
      <input
        placeholder="Movie title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />
      <select
        value={form.genre}
        onChange={e => setForm({ ...form, genre: e.target.value })}
      >
        {['Action','Comedy','Drama','Sci-Fi','Horror','Thriller','Romance','Animation','Fantasy','Mystery']
          .map(g => <option key={g}>{g}</option>)}
      </select>
      <input
        type="number"
        value={form.year}
        onChange={e => setForm({ ...form, year: +e.target.value })}
        placeholder="Year"
      />
      <button type="submit" disabled={saving}>
        {saving ? '⏳ Saving…' : '💾 Save to Neo4j'}
      </button>
      {error && (
        <div style={{ color: '#b91c1c', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
          ⚠️ {error}
        </div>
      )}
    </form>
  )
}