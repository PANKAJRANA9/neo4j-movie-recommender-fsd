# 🎬 Neo4j Movie Recommender — Enterprise FSD Project

> Production-grade full-stack graph recommendation engine — **React 18 + Vite · Spring Boot 3.2 · Neo4j 5** — built with C4 architecture, DTO-driven clean architecture, and collaborative filtering via Cypher.

[Dark Hero Architecture](docs/architecture-dark.png)

## 🏗 Professional Architecture — C4 Container View
[C4 Container View — Light Professional](docs/architecture-c4.png)

[Screenshot of App](Screenshot_22-9-2026_02647_localhost.jpeg)

**Architecture Style:** 3-Tier, Layered, Graph-Native, 12-Factor Config

**Data Flow (6-Step):** `1. HTTP Request → 2. DTO Validation → 3. Service Logic → 4. Cypher Query → 5. Graph Result → 6. JSON Response`

---

### 🧠 As FSD Architect — Why This Design?

**Frontend (Client Layer - Port 5173):**
- React 18 + Vite for <100ms HMR — faster than Next.js for SPA dashboard
- Single axios instance with error interceptor → maps ApiError to toast, avoids scattered try/catch
- Custom Canvas + rAF for MovieGraph: No D3 (500KB), full control over force simulation, pan/zoom/hit-test, O(n) performance
- Glassmorphism UI but component logic stays pure — StatsBar, MovieForm, MovieList, RecommendationPanel, MovieGraph, StarRating all stateless via hooks

**Backend (Application Layer - Port 8080) — 5 Sub-Layers:**
1. **Controller:** Pure HTTP, no business logic, delegates to services, returns DTO records
2. **Service:** `RecommendationService` holds all Cypher — collaborative filtering with sharedTaste scoring `Σ(sharedTaste * rating)`, plus genre fallback and global top-rated
3. **Repository:** Spring Data Neo4j interfaces — no custom impl, Bolt driver does mapping
4. **Domain & DTO:** `@Id` without `@GeneratedValue` (Neo4j idempotent), Java `record` DTOs immutable + Jakarta validation
5. **Cross-Cutting:** `GlobalExceptionHandler` → uniform `ApiError {status, message, timestamp}`, `CorsProperties` externalized via `@ConfigurationProperties("app.cors")`, `SecurityConfig` permitAll with JWT insertion point

**Data Layer (Neo4j 5 - 7474/7687):**
- Graph Schema: `(:Movie)-[:RATED {rating, timestamp}]->(:User)`, `(:Movie)-[:IN_GENRE]->(:Genre)`, `(:Movie)-[:SIMILAR {score}]->(:Movie)`
- Bolt protocol for transactional Cypher, HTTP for Browser
- MERGE for idempotent ratings, multi-hop pattern matching for recommendations

---

## 🚀 Quick Start (Docker-First)

```bash
# 1. Neo4j
docker run -d --name neo4j-movie -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:5

# 2. Backend
cd backend && mvn clean install -DskipTests && mvn spring-boot:run
# → http://localhost:8080/api/movies

# 3. Frontend
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

Seed richer data: paste `docs/02-seed.cypher` (30 movies, 10 users 101-110, 12 genres, 55 ratings) into Neo4j Browser.

## 🔌 API Contract

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/movies | List all |
| GET | /api/movies/{id} | Single |
| POST | /api/movies | Create 201 |
| GET | /api/movies/search?q= | Search |
| GET | /api/movies/genre/{genre} | Filter |
| GET | /api/recommend/{userId} | Personalized (Cypher) |
| POST | /api/rate | {userId, movieId, rating 1-5} MERGE |
| GET | /api/stats | {movies, users, genres, ratings} |
| GET | /api/graph | nodes + edges |

## 🧪 Recommendation Validation

| User | Taste | Expected |
|------|-------|----------|
| 101 | Sci-Fi, Thriller | Inception, Blade Runner 2049 |
| 102 | Drama, Romance | Fight Club, Whiplash |
| 106 | Nolan fan | The Prestige, Interstellar |

If recommendations identical → seed users-ratings, check userId string vs int.

## 📁 Enterprise Structure
See `ARCHITECTURE.md` for full C4 Level 3 breakdown.

```
docs/
├── architecture-dark.png (hero for social preview)
├── architecture-c4.png (professional for README/portfolio)
├── 02-seed.cypher
├── ARCHITECTURE.md (this deep dive)
```

## 🎯 Skills Demonstrated (Recruiter-Ready)

- **Graph Modelling:** Nodes, Relationships with properties, MERGE idempotency
- **Cypher Design:** Multi-hop, aggregation, scoring, fallback chain
- **REST Design:** Resource naming, status codes, DTO vs Entity separation
- **Spring Boot Best Practices:** Layered arch, @ControllerAdvice, externalized config, @Transactional excluded reactive
- **Modern React:** Hooks, error boundary, controlled forms, Canvas engine
- **Clean Code:** Single responsibility, mappers, no logic in controllers
- **12-Factor:** YAML + @ConfigurationProperties + profiles dev/prod

## 🛣 Roadmap to Production

- [ ] JWT auth + User registration UI
- [ ] TMDB posters integration
- [ ] Pagination + Infinite scroll
- [ ] Redis cache for /recommend
- [ ] Bucket4j rate limiting
- [ ] Testcontainers integration tests
- [ ] docker-compose up + Neo4j Aura / Render / Vercel deploy
- [ ] springdoc-openapi Swagger
- [ ] Tailwind PostCSS build

MIT — Built by Pankaj Rana
