import { useEffect, useRef, useState, useCallback } from 'react'

export default function MovieGraph({ movies }) {
  const canvasRef = useRef()
  const stateRef  = useRef({
    nodes: [], edges: [], nodesByPos: [],
    hovered: null, selected: null,
    view: { zoom: 1, panX: 0, panY: 0 },
    dragging: false, dragStart: null,
    mouse: { x: 0, y: 0 },
  })

  const [genreFilter, setGenreFilter] = useState('All')
  const [limit, setLimit]             = useState(15)
  const [selectedInfo, setSelectedInfo] = useState(null)
  const [mode, setMode]               = useState('force') // 'force' | 'radial'

  // Unique genres
  const allGenres = ['All', ...Array.from(new Set(
    movies.map(m => m.genre || 'Unknown').filter(Boolean)
  ))]

  // Filter + limit
  const visible = (genreFilter === 'All'
    ? movies
    : movies.filter(m => (m.genre || 'Unknown') === genreFilter)
  ).slice(0, limit)

  // Hit-test nodes near a point
  const hitTest = (x, y) => {
    const { nodes, view } = stateRef.current
    // Convert screen space to world space
    const wx = (x - view.panX) / view.zoom
    const wy = (y - view.panY) / view.zoom
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i]
      const dx = n.x - wx, dy = n.y - wy
      if (dx * dx + dy * dy <= n.r * n.r) return n
    }
    return null
  }

  // ── Main render loop ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const r = parent.getBoundingClientRect()
      canvas.width  = Math.max(200, r.width  * dpr)
      canvas.height = Math.max(200, r.height * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const ctx = canvas.getContext('2d')

    // Build nodes and edges
    const genreMap = new Map()
    const movieNodes = visible.map((m, i) => {
      const g = m.genre || 'Unknown'
      if (!genreMap.has(g)) genreMap.set(g, { id: 'g' + genreMap.size, label: g, type: 'genre', r: 18 })
      return {
        id: 'm' + (m.id ?? i),
        label: (m.title || '').length > 12 ? m.title.slice(0, 11) + '…' : m.title,
        type: 'movie', genre: g, r: 22,
        year: m.year, movieId: m.id,
      }
    })
    const genres = [...genreMap.values()]
    const allNodes = [...movieNodes, ...genres]
    const edges = []
    movieNodes.forEach(m => {
      const g = genres.find(gg => gg.label === m.genre)
      if (g) edges.push({ from: m, to: g })
    })

    // Initial layout
    allNodes.forEach((n, i) => {
      if (mode === 'radial') {
        const ang = (i / allNodes.length) * Math.PI * 2
        const R = Math.min(canvas.width, canvas.height) * 0.35
        n.x = canvas.width / 2 + Math.cos(ang) * R
        n.y = canvas.height / 2 + Math.sin(ang) * R
      } else {
        n.x = canvas.width / 2 + (Math.random() - 0.5) * 400 * dpr
        n.y = canvas.height / 2 + (Math.random() - 0.5) * 300 * dpr
      }
      n.vx = 0; n.vy = 0
    })

    stateRef.current.nodes = allNodes
    stateRef.current.edges = edges

    let raf
    const step = () => {
      const W = canvas.width, H = canvas.height
      const st = stateRef.current
      const { zoom, panX, panY } = st.view

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Background glow
      const grd = ctx.createRadialGradient(W/2, H/2, 20, W/2, H/2, Math.max(W, H)/1.4)
      grd.addColorStop(0, 'rgba(139,92,246,.06)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      // Apply pan+zoom
      ctx.translate(panX, panY)
      ctx.scale(zoom, zoom)

      // Physics (only in force mode)
      if (mode === 'force') {
        allNodes.forEach(a => {
          a.vx *= 0.85; a.vy *= 0.85
          allNodes.forEach(b => {
            if (a === b) return
            const dx = a.x - b.x, dy = a.y - b.y
            const d2 = dx*dx + dy*dy + 1
            const f = 2200 / d2
            a.vx += dx * f * 0.001
            a.vy += dy * f * 0.001
          })
          a.vx += (W/2 - a.x) * 0.0006
          a.vy += (H/2 - a.y) * 0.0006
        })
        edges.forEach(e => {
          const dx = e.to.x - e.from.x, dy = e.to.y - e.from.y
          const d  = Math.sqrt(dx*dx + dy*dy) + 1
          const target = 140 * dpr
          const f = (d - target) / d * 0.05
          e.from.vx += dx * f; e.from.vy += dy * f
          e.to.vx   -= dx * f; e.to.vy   -= dy * f
        })
        allNodes.forEach(n => { n.x += n.vx; n.y += n.vy })
      }

      // Draw edges
      edges.forEach(e => {
        const isActive = st.selected === e.from || st.selected === e.to
        ctx.strokeStyle = isActive
          ? 'rgba(236,72,153,.9)'
          : 'rgba(148,163,184,.25)'
        ctx.lineWidth = isActive ? 2.2 : 1
        ctx.beginPath()
        ctx.moveTo(e.from.x, e.from.y)
        ctx.lineTo(e.to.x, e.to.y)
        ctx.stroke()
      })

      // Draw nodes
      allNodes.forEach(n => {
        const isMovie   = n.type === 'movie'
        const isHover   = st.hovered  === n
        const isSelect  = st.selected === n
        const r = n.r * (isHover || isSelect ? 1.15 : 1)

        ctx.shadowColor = isMovie ? 'rgba(236,72,153,.6)' : 'rgba(6,182,212,.6)'
        ctx.shadowBlur  = (isHover || isSelect ? 20 : 10) * dpr

        const grd = ctx.createRadialGradient(n.x - r/3, n.y - r/3, r/6, n.x, n.y, r)
        if (isMovie) { grd.addColorStop(0, '#f472b6'); grd.addColorStop(1, '#ec4899') }
        else         { grd.addColorStop(0, '#67e8f9'); grd.addColorStop(1, '#06b6d4') }
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()

        // Selection ring
        if (isSelect) {
          ctx.shadowBlur = 0
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.shadowBlur = 0

        // Label
        ctx.fillStyle = '#fff'
        ctx.font = `800 ${10 * dpr}px Inter`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const txt = n.label.length > 10 ? n.label.slice(0, 9) + '…' : n.label
        ctx.fillText(txt, n.x, n.y)
      })

      // Crosshair cursor
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // ── Mouse events ─────────────────────────────────
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * dpr
      const y = (e.clientY - r.top)  * dpr
      stateRef.current.mouse = { x, y }
      const h = hitTest(x, y)
      stateRef.current.hovered = h
      canvas.style.cursor = h ? 'pointer' : (stateRef.current.dragging ? 'grabbing' : 'grab')
    }
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) * dpr
      const y = (e.clientY - r.top)  * dpr
      const hit = hitTest(x, y)
      if (hit) {
        stateRef.current.selected = hit
        setSelectedInfo({
          type: hit.type,
          label: hit.label,
          genre: hit.genre,
          year: hit.year,
          movieId: hit.movieId,
        })
      } else {
        stateRef.current.selected = null
        setSelectedInfo(null)
      }
    }
    const onWheel = (e) => {
      e.preventDefault()
      const st = stateRef.current
      const factor = e.deltaY < 0 ? 1.12 : 0.89
      const newZoom = Math.max(0.3, Math.min(4, st.view.zoom * factor))
      // Zoom toward cursor
      const r = canvas.getBoundingClientRect()
      const cx = (e.clientX - r.left) * dpr
      const cy = (e.clientY - r.top)  * dpr
      st.view.panX -= cx * (newZoom / st.view.zoom - 1)
      st.view.panY -= cy * (newZoom / st.view.zoom - 1)
      st.view.zoom = newZoom
    }
    const onDown = (e) => {
      const st = stateRef.current
      st.dragging = true
      st.dragStart = {
        x: e.clientX, y: e.clientY,
        panX: st.view.panX, panY: st.view.panY,
      }
      canvas.style.cursor = 'grabbing'
    }
    const onUp = () => {
      stateRef.current.dragging = false
      canvas.style.cursor = 'grab'
    }
    const onDragMove = (e) => {
      const st = stateRef.current
      if (!st.dragging) return
      st.view.panX = st.dragStart.panX + (e.clientX - st.dragStart.x) * dpr
      st.view.panY = st.dragStart.panY + (e.clientY - st.dragStart.y) * dpr
    }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mousemove', onDragMove)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mousemove', onDragMove)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
    }
  }, [visible, genreFilter, limit, mode])

  // Reset view
  const resetView = () => {
    stateRef.current.view = { zoom: 1, panX: 0, panY: 0 }
    stateRef.current.selected = null
    setSelectedInfo(null)
  }

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid var(--stroke-strong)',
            background: '#f8fafc', color: 'var(--ink)', flex: 1, minWidth: 120,
          }}
        >
          {allGenres.map(g => (
            <option key={g} value={g}>
              {g === 'All' ? '🎭 All genres' : `🎬 ${g}`}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid var(--stroke-strong)',
            background: '#f8fafc', color: 'var(--ink)', minWidth: 90,
          }}
        >
          <option value={10}>10 nodes</option>
          <option value={15}>15 nodes</option>
          <option value={25}>25 nodes</option>
          <option value={50}>50 nodes</option>
        </select>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid var(--stroke-strong)',
            background: '#f8fafc', color: 'var(--ink)', minWidth: 110,
          }}
        >
          <option value="force">⚡ Force layout</option>
          <option value="radial">🎯 Radial</option>
        </select>
        <button
          onClick={resetView}
          style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            border: '1px solid #cbd5e1', background: '#fff',
            color: '#0f172a', cursor: 'pointer',
          }}
        >
          ⟲ Reset
        </button>
      </div>

      {/* Graph canvas */}
      <div className="graph-box" style={{ position: 'relative' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Selected node info overlay */}
        {selectedInfo && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#fff', border: '1px solid var(--stroke-strong)',
            borderRadius: 10, padding: '10px 14px', minWidth: 180,
            boxShadow: '0 6px 20px rgba(0,0,0,.08)',
            fontSize: 12, fontWeight: 600,
          }}>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {selectedInfo.type === 'movie' ? '🎬 Movie' : '🎭 Genre'}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 3 }}>
              {selectedInfo.label}
            </div>
            {selectedInfo.type === 'movie' && (
              <div style={{ marginTop: 4, color: '#64748b', fontSize: 11 }}>
                {selectedInfo.genre} · {selectedInfo.year}
              </div>
            )}
            <button
              onClick={() => { stateRef.current.selected = null; setSelectedInfo(null); }}
              style={{
                marginTop: 8, padding: '4px 10px', borderRadius: 6,
                background: '#fce7f3', border: '1px solid #f9a8d4',
                color: '#be185d', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Hint overlay */}
        <div style={{
          position: 'absolute', bottom: 10, right: 12,
          fontSize: 10.5, color: '#94a3b8', fontWeight: 600,
          background: 'rgba(255,255,255,.85)',
          padding: '4px 10px', borderRadius: 6,
          border: '1px solid var(--stroke)',
        }}>
          🖱 Drag to pan · Scroll to zoom · Click node
        </div>
      </div>

      {/* Legend */}
      <div className="graph-legend">
        <span><span className="legend-dot" style={{ background: '#ec4899', boxShadow: '0 0 8px #ec4899' }}></span>Movie</span>
        <span><span className="legend-dot" style={{ background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }}></span>Genre</span>
        <span style={{ marginLeft: 'auto', opacity: .7 }}>
          {visible.length} / {movies.length} movies
        </span>
      </div>
    </>
  )
}