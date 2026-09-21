import { useState } from 'react'

export default function StarRating({
  value = 0,
  onRate,
  disabled = false,
  size = 20,
  movieId,
}) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div
      style={{
        display: 'inline-flex', gap: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onMouseEnter={() => !disabled && setHover(n)}
          onClick={() => !disabled && onRate?.(movieId, n)}
          style={{
            fontSize: size,
            color: n <= display ? '#f59e0b' : '#cbd5e1',
            transition: 'transform .12s, color .12s',
            transform: n <= display ? 'scale(1.15)' : 'scale(1)',
            lineHeight: 1, userSelect: 'none',
            textShadow: n <= display ? '0 0 6px rgba(245,158,11,.4)' : 'none',
          }}
          title={`Rate ${n}★`}
        >
          ★
        </span>
      ))}
    </div>
  )
}