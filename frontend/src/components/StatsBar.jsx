export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Movies',  value: stats.movies  ?? '—', icon: '🎬', cls: 'pink'   },
    { label: 'Users',   value: stats.users   ?? '—', icon: '👥', cls: 'violet' },
    { label: 'Genres',  value: stats.genres  ?? '—', icon: '🎭', cls: 'cyan'   },
    { label: 'Ratings', value: stats.ratings ?? '—', icon: '⭐', cls: 'green'  },
  ]
  return (
    <div className="stats-bar">
      {cards.map(c => (
        <div key={c.label} className={`stat-card ${c.cls}`}>
          <span className="stat-icon">{c.icon}</span>
          <div className="stat-label">{c.label}</div>
          <div className="stat-value">{c.value}</div>
        </div>
      ))}
    </div>
  )
}