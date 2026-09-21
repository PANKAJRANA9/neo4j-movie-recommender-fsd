// ═══════════════════════════════════════════════════════════
//  02-seed.cypher  —  Movies, Users, Genres, Ratings, People
// ═══════════════════════════════════════════════════════════

// ─── Clean slate (comment out if you don't want to wipe) ────
MATCH (n) DETACH DELETE n;

// ─── GENRES ─────────────────────────────────────────────────
UNWIND [
  'Action','Sci-Fi','Drama','Thriller','Crime','Romance',
  'Comedy','Animation','Fantasy','Adventure','Mystery','War'
] AS g
MERGE (:Genre {name: g});

// ─── MOVIES ─────────────────────────────────────────────────
UNWIND [
  {id:1,  title:'The Matrix',                   year:1999, runtime:136, rating:8.7, genres:['Action','Sci-Fi']},
  {id:2,  title:'Inception',                    year:2010, runtime:148, rating:8.8, genres:['Action','Sci-Fi','Thriller']},
  {id:3,  title:'Interstellar',                 year:2014, runtime:169, rating:8.6, genres:['Sci-Fi','Drama','Adventure']},
  {id:4,  title:'The Dark Knight',              year:2008, runtime:152, rating:9.0, genres:['Action','Crime','Drama']},
  {id:5,  title:'Pulp Fiction',                 year:1994, runtime:154, rating:8.9, genres:['Crime','Drama']},
  {id:6,  title:'Fight Club',                   year:1999, runtime:139, rating:8.8, genres:['Drama','Thriller']},
  {id:7,  title:'Forrest Gump',                 year:1994, runtime:142, rating:8.8, genres:['Drama','Romance']},
  {id:8,  title:'The Godfather',                year:1972, runtime:175, rating:9.2, genres:['Crime','Drama']},
  {id:9,  title:'The Shawshank Redemption',     year:1994, runtime:142, rating:9.3, genres:['Drama']},
  {id:10, title:'Gladiator',                    year:2000, runtime:155, rating:8.5, genres:['Action','Adventure','Drama']},
  {id:11, title:'Titanic',                      year:1997, runtime:195, rating:7.9, genres:['Drama','Romance']},
  {id:12, title:'Avengers: Endgame',            year:2019, runtime:181, rating:8.4, genres:['Action','Adventure','Sci-Fi']},
  {id:13, title:'Iron Man',                     year:2008, runtime:126, rating:7.9, genres:['Action','Adventure','Sci-Fi']},
  {id:14, title:'Spider-Man: No Way Home',      year:2021, runtime:148, rating:8.2, genres:['Action','Adventure','Fantasy']},
  {id:15, title:'Parasite',                     year:2019, runtime:132, rating:8.5, genres:['Drama','Thriller']},
  {id:16, title:'Joker',                        year:2019, runtime:122, rating:8.4, genres:['Crime','Drama','Thriller']},
  {id:17, title:'Whiplash',                     year:2014, runtime:106, rating:8.5, genres:['Drama']},
  {id:18, title:'La La Land',                   year:2016, runtime:128, rating:8.0, genres:['Drama','Romance','Comedy']},
  {id:19, title:'Toy Story',                    year:1995, runtime:81,  rating:8.3, genres:['Animation','Adventure','Comedy']},
  {id:20, title:'Spirited Away',                year:2001, runtime:125, rating:8.6, genres:['Animation','Fantasy','Adventure']},
  {id:21, title:'Your Name',                    year:2016, runtime:106, rating:8.4, genres:['Animation','Romance','Fantasy']},
  {id:22, title:'The Silence of the Lambs',     year:1991, runtime:118, rating:8.6, genres:['Crime','Thriller','Mystery']},
  {id:23, title:'Se7en',                        year:1995, runtime:127, rating:8.6, genres:['Crime','Thriller','Mystery']},
  {id:24, title:'Gone Girl',                    year:2014, runtime:149, rating:8.1, genres:['Drama','Thriller','Mystery']},
  {id:25, title:'Saving Private Ryan',          year:1998, runtime:169, rating:8.6, genres:['War','Drama']},
  {id:26, title:'Dunkirk',                      year:2017, runtime:106, rating:7.8, genres:['War','Action','Drama']},
  {id:27, title:'1917',                         year:2019, runtime:119, rating:8.2, genres:['War','Drama']},
  {id:28, title:'Mad Max: Fury Road',           year:2015, runtime:120, rating:8.1, genres:['Action','Adventure','Sci-Fi']},
  {id:29, title:'Blade Runner 2049',            year:2017, runtime:164, rating:8.0, genres:['Sci-Fi','Drama','Mystery']},
  {id:30, title:'The Prestige',                 year:2006, runtime:130, rating:8.5, genres:['Drama','Mystery','Thriller']}
] AS row
MERGE (m:Movie {movieId: row.id})
SET m.title   = row.title,
    m.year    = row.year,
    m.runtime = row.runtime,
    m.imdb    = row.rating
WITH m, row
UNWIND row.genres AS gname
MATCH (g:Genre {name: gname})
MERGE (m)-[:IN_GENRE]->(g);

// ─── PEOPLE (Directors) ─────────────────────────────────────
UNWIND [
  {movie:1,  director:'Lana Wachowski'},
  {movie:2,  director:'Christopher Nolan'},
  {movie:3,  director:'Christopher Nolan'},
  {movie:4,  director:'Christopher Nolan'},
  {movie:5,  director:'Quentin Tarantino'},
  {movie:6,  director:'David Fincher'},
  {movie:7,  director:'Robert Zemeckis'},
  {movie:8,  director:'Francis Ford Coppola'},
  {movie:9,  director:'Frank Darabont'},
  {movie:10, director:'Ridley Scott'},
  {movie:11, director:'James Cameron'},
  {movie:12, director:'Anthony Russo'},
  {movie:13, director:'Jon Favreau'},
  {movie:14, director:'Jon Watts'},
  {movie:15, director:'Bong Joon-ho'},
  {movie:16, director:'Todd Phillips'},
  {movie:17, director:'Damien Chazelle'},
  {movie:18, director:'Damien Chazelle'},
  {movie:19, director:'John Lasseter'},
  {movie:20, director:'Hayao Miyazaki'},
  {movie:21, director:'Makoto Shinkai'},
  {movie:22, director:'Jonathan Demme'},
  {movie:23, director:'David Fincher'},
  {movie:24, director:'David Fincher'},
  {movie:25, director:'Steven Spielberg'},
  {movie:26, director:'Christopher Nolan'},
  {movie:27, director:'Sam Mendes'},
  {movie:28, director:'George Miller'},
  {movie:29, director:'Denis Villeneuve'},
  {movie:30, director:'Christopher Nolan'}
] AS row
MATCH (m:Movie {movieId: row.movie})
MERGE (p:Person {name: row.director})
MERGE (p)-[:DIRECTED]->(m);

// ─── PEOPLE (Lead actors) ───────────────────────────────────
UNWIND [
  {movie:1,  actor:'Keanu Reeves'},
  {movie:2,  actor:'Leonardo DiCaprio'},
  {movie:3,  actor:'Matthew McConaughey'},
  {movie:4,  actor:'Christian Bale'},
  {movie:5,  actor:'John Travolta'},
  {movie:6,  actor:'Brad Pitt'},
  {movie:7,  actor:'Tom Hanks'},
  {movie:8,  actor:'Marlon Brando'},
  {movie:9,  actor:'Tim Robbins'},
  {movie:10, actor:'Russell Crowe'},
  {movie:11, actor:'Leonardo DiCaprio'},
  {movie:12, actor:'Robert Downey Jr.'},
  {movie:13, actor:'Robert Downey Jr.'},
  {movie:14, actor:'Tom Holland'},
  {movie:15, actor:'Song Kang-ho'},
  {movie:16, actor:'Joaquin Phoenix'},
  {movie:17, actor:'Miles Teller'},
  {movie:18, actor:'Ryan Gosling'},
  {movie:19, actor:'Tom Hanks'},
  {movie:20, actor:'Rumi Hiiragi'},
  {movie:21, actor:'Ryunosuke Kamiki'},
  {movie:22, actor:'Jodie Foster'},
  {movie:23, actor:'Brad Pitt'},
  {movie:24, actor:'Ben Affleck'},
  {movie:25, actor:'Tom Hanks'},
  {movie:26, actor:'Fionn Whitehead'},
  {movie:27, actor:'George MacKay'},
  {movie:28, actor:'Tom Hardy'},
  {movie:29, actor:'Ryan Gosling'},
  {movie:30, actor:'Christian Bale'}
] AS row
MATCH (m:Movie {movieId: row.movie})
MERGE (p:Person {name: row.actor})
MERGE (p)-[:ACTED_IN]->(m);

// ─── USERS ──────────────────────────────────────────────────
UNWIND [
  {id:101, name:'Aarav'},
  {id:102, name:'Priya'},
  {id:103, name:'Rohit'},
  {id:104, name:'Neha'},
  {id:105, name:'Vikram'},
  {id:106, name:'Ananya'},
  {id:107, name:'Karan'},
  {id:108, name:'Sneha'},
  {id:109, name:'Rahul'},
  {id:110, name:'Isha'}
] AS row
MERGE (u:User {userId: row.id})
SET u.name = row.name;

// ─── RATINGS (userId, movieId, rating 1–5) ──────────────────
// Pattern: users who like sci-fi thrillers, users who like drama,
// users who like action, etc. — gives the recommender signal to learn from.
UNWIND [
  // Aarav — Sci-Fi / Thriller fan
  {u:101, m:1,  r:5}, {u:101, m:2,  r:5}, {u:101, m:3,  r:5},
  {u:101, m:29, r:5}, {u:101, m:30, r:4}, {u:101, m:4,  r:4},

  // Priya — Drama / Romance fan
  {u:102, m:7,  r:5}, {u:102, m:9,  r:5}, {u:102, m:11, r:5},
  {u:102, m:18, r:4}, {u:102, m:17, r:4}, {u:102, m:15, r:5},

  // Rohit — Action / Adventure fan
  {u:103, m:4,  r:5}, {u:103, m:10, r:5}, {u:103, m:12, r:5},
  {u:103, m:13, r:4}, {u:103, m:14, r:4}, {u:103, m:28, r:5},

  // Neha — Crime / Thriller fan
  {u:104, m:5,  r:5}, {u:104, m:16, r:5}, {u:104, m:22, r:5},
  {u:104, m:23, r:5}, {u:104, m:24, r:4}, {u:104, m:6,  r:4},

  // Vikram — Animation / Fantasy fan
  {u:105, m:19, r:5}, {u:105, m:20, r:5}, {u:105, m:21, r:5},
  {u:105, m:14, r:4}, {u:105, m:3,  r:4},

  // Ananya — Nolan fan
  {u:106, m:2,  r:5}, {u:106, m:3,  r:5}, {u:106, m:4,  r:5},
  {u:106, m:26, r:4}, {u:106, m:30, r:5},

  // Karan — War / Drama fan
  {u:107, m:25, r:5}, {u:107, m:26, r:4}, {u:107, m:27, r:5},
  {u:107, m:9,  r:4}, {u:107, m:10, r:4},

  // Sneha — Mixed taste
  {u:108, m:1,  r:4}, {u:108, m:7,  r:5}, {u:108, m:15, r:5},
  {u:108, m:17, r:5}, {u:108, m:22, r:4}, {u:108, m:19, r:4},

  // Rahul — Action fan
  {u:109, m:4,  r:4}, {u:109, m:12, r:5}, {u:109, m:28, r:5},
  {u:109, m:13, r:5}, {u:109, m:2,  r:4},

  // Isha — Thriller / Mystery fan
  {u:110, m:22, r:5}, {u:110, m:23, r:5}, {u:110, m:24, r:5},
  {u:110, m:30, r:5}, {u:110, m:6,  r:4}, {u:110, m:16, r:4}
] AS row
MATCH (u:User {userId: row.u})
MATCH (m:Movie {movieId: row.m})
MERGE (u)-[r:RATED]->(m)
SET r.rating = row.r,
    r.timestamp = datetime();

// ─── SUMMARY ────────────────────────────────────────────────
MATCH (m:Movie)   WITH count(m) AS movies
MATCH (u:User)    WITH movies, count(u) AS users
MATCH (g:Genre)   WITH movies, users, count(g) AS genres
MATCH (p:Person)  WITH movies, users, genres, count(p) AS people
MATCH ()-[r:RATED]->() WITH movies, users, genres, people, count(r) AS ratings
RETURN
  movies  AS Movies,
  users   AS Users,
  genres  AS Genres,
  people  AS People,
  ratings AS Ratings;