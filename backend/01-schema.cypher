// ═══════════════════════════════════════════════════════════
//  01-schema.cypher  —  Constraints & Indexes
//  Run once. Safe to re-run (IF NOT EXISTS).
// ═══════════════════════════════════════════════════════════

// Unique keys
CREATE CONSTRAINT movie_id_unique IF NOT EXISTS
FOR (m:Movie) REQUIRE m.movieId IS UNIQUE;

CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:User) REQUIRE u.userId IS UNIQUE;

CREATE CONSTRAINT genre_name_unique IF NOT EXISTS
FOR (g:Genre) REQUIRE g.name IS UNIQUE;

CREATE CONSTRAINT person_name_unique IF NOT EXISTS
FOR (p:Person) REQUIRE p.name IS UNIQUE;

// Secondary indexes for fast filters
CREATE INDEX movie_title_idx IF NOT EXISTS
FOR (m:Movie) ON (m.title);

CREATE INDEX movie_year_idx IF NOT EXISTS
FOR (m:Movie) ON (m.year);

CREATE INDEX rating_value_idx IF NOT EXISTS
FOR ()-[r:RATED]-() ON (r.rating);

// Show what we built
SHOW CONSTRAINTS;
SHOW INDEXES;