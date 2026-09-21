package com.pankaj.neo4j;

import com.pankaj.neo4j.domain.Movie;
import com.pankaj.neo4j.domain.User;
import com.pankaj.neo4j.repository.MovieRepository;
import com.pankaj.neo4j.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final UserRepository  userRepository;
    private final Neo4jClient     neo4jClient;

    public DataLoader(MovieRepository movieRepository,
                      UserRepository userRepository,
                      Neo4jClient neo4jClient) {
        this.movieRepository = movieRepository;
        this.userRepository  = userRepository;
        this.neo4jClient     = neo4jClient;
    }

    @Override
    public void run(String... args) {
        if (movieRepository.count() == 0) {
            System.out.println("▶ Seeding Neo4j with starter movies...");
            seedMovies();
        } else {
            System.out.println("▶ Movies already present, skipping seed.");
        }

        // Always backfill missing properties (safe, idempotent)
        backfillMissingProps();

        // Ensure demo user exists
        ensureDemoUser();
    }

    private void seedMovies() {
        movieRepository.save(new Movie("Mad Max: Fury Road",             "Action",  2015, "R",     "Post-apocalyptic action film"));
        movieRepository.save(new Movie("John Wick",                      "Action",  2014, "R",     "Stylish hitman"));
        movieRepository.save(new Movie("Top Gun: Maverick",              "Action",  2022, "PG-13", "High-flying sequel"));
        movieRepository.save(new Movie("The Grand Budapest Hotel",       "Comedy",  2014, "R",     "Whimsical comedy"));
        movieRepository.save(new Movie("Knives Out",                     "Comedy",  2019, "PG-13", "Murder-mystery comedy"));
        movieRepository.save(new Movie("Dune",                           "Sci-Fi",  2021, "PG-13", "Epic space opera"));
        movieRepository.save(new Movie("Blade Runner 2049",              "Sci-Fi",  2017, "R",     "Visually spectacular sequel"));
        movieRepository.save(new Movie("Parasite",                       "Drama",   2019, "R",     "Class thriller"));
        movieRepository.save(new Movie("Get Out",                        "Horror",  2017, "R",     "Social horror"));
        movieRepository.save(new Movie("A Quiet Place",                  "Horror",  2018, "PG-13", "Innovative horror"));

        System.out.println("✔ Seeded " + movieRepository.count() + " movies");
    }

    /**
     * Backfill any missing properties on Movie / User nodes.
     * Uses elementId() instead of the deprecated id() function.
     */
    private void backfillMissingProps() {
        neo4jClient.query("""
            MATCH (m:Movie)
            SET m.id          = coalesce(m.id, m.movieId),
                m.genre       = coalesce(m.genre, 'Drama'),
                m.rating      = coalesce(m.rating, 'PG-13'),
                m.description = coalesce(m.description, '')
        """).run();

        // Build SIMILAR relationships (uses elementId, not deprecated id())
        neo4jClient.query("""
            MATCH (a:Movie), (b:Movie)
            WHERE a.genre = b.genre AND elementId(a) < elementId(b)
            MERGE (a)-[:SIMILAR {score: 0.8}]->(b)
        """).run();
    }

    private void ensureDemoUser() {
        userRepository.findById("user123").orElseGet(() ->
                userRepository.save(new User("user123", "Pankaj Rana", "Action"))
        );

        neo4jClient.query("""
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie) WHERE m.title IN ['Dune', 'Mad Max: Fury Road']
            MERGE (u)-[r:RATED]->(m)
            SET r.rating = 5, r.timestamp = datetime()
        """).bindAll(Map.of("userId", "user123")).run();

        System.out.println("✔ Demo user 'user123' ready");
    }
}