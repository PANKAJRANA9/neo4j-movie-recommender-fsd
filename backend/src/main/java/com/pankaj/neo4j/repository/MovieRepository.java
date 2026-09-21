
package com.pankaj.neo4j.repository;

import com.pankaj.neo4j.domain.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.List;

public interface MovieRepository extends Neo4jRepository<Movie, Long> {

    List<Movie> findByTitleContaining(String title);

    List<Movie> findByGenre(String genre);

    // Collaborative + Content based recommendation via Cypher
    // User who rated 4+ stars on a movie -> recommend similar movies not yet rated
    @Query("MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie) WHERE r.rating >= 4 " +
           "MATCH (m)-[:SIMILAR]->(rec:Movie) WHERE NOT (u)-[:RATED]->(rec) " +
           "RETURN rec LIMIT 10")
    List<Movie> recommendForUser(String userId);

    @Query("MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie) RETURN m")
    List<Movie> findRatedByUser(String userId);

    @Query("MATCH (m:Movie) RETURN m LIMIT 100")
    List<Movie> findAllMoviesForGraph();
}
