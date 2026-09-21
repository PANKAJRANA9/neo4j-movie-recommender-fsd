package com.pankaj.neo4j.service;

import com.pankaj.neo4j.domain.Movie;
import com.pankaj.neo4j.dto.MovieResponse;
import com.pankaj.neo4j.mapper.MovieMapper;
import org.neo4j.driver.types.Node;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    private final Neo4jClient neo4jClient;

    public RecommendationService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<MovieResponse> recommendForUser(String userId) {
        String primary = """
            MATCH (target:User)
            WHERE toString(target.userId) = $userId
            MATCH (target)-[r1:RATED]->(liked:Movie)
            WHERE r1.rating >= 4
            WITH target, collect(DISTINCT liked) AS likedMovies
            MATCH (other:User)-[r2:RATED]->(m:Movie)
            WHERE other <> target AND r2.rating >= 4 AND m IN likedMovies
            WITH target, other, count(DISTINCT m) AS sharedTaste
            WHERE sharedTaste >= 1
            MATCH (other)-[r3:RATED]->(rec:Movie)
            WHERE r3.rating >= 4 AND NOT (target)-[:RATED]->(rec)
            WITH rec, sum(sharedTaste * r3.rating) AS score
            ORDER BY score DESC
            LIMIT 12
            RETURN rec AS movie
        """;

        List<MovieResponse> personalized = run(primary, userId);
        if (!personalized.isEmpty()) return personalized;

        String fallback = """
            MATCH (u:User)
            WHERE toString(u.userId) = $userId
            MATCH (rec:Movie)
            WHERE NOT (u)-[:RATED]->(rec)
            OPTIONAL MATCH (other:User)-[r:RATED]->(rec)
            WITH rec, COALESCE(avg(r.rating), 0) AS avgRating, count(r) AS votes
            ORDER BY avgRating DESC, votes DESC, rec.year DESC
            LIMIT 12
            RETURN rec AS movie
        """;

        return run(fallback, userId);
    }

    private List<MovieResponse> run(String cypher, String userId) {
        List<MovieResponse> out = new ArrayList<>();
        neo4jClient.query(cypher)
                .bind(userId).to("userId")
                .fetchAs(Movie.class)
                .mappedBy((typeSystem, record) -> {
                    Node n = record.get("movie").asNode();
                    Movie m = new Movie();
                    m.setId(n.get("id").isNull() ? null : n.get("id").asLong());
                    m.setTitle(n.get("title").isNull() ? "" : n.get("title").asString());
                    m.setGenre(n.get("genre").isNull() ? "" : n.get("genre").asString());
                    m.setYear(n.get("year").isNull() ? 0 : n.get("year").asInt());
                    m.setRating(n.get("rating").isNull() ? "" : n.get("rating").asString());
                    m.setDescription(n.get("description").isNull() ? "" : n.get("description").asString());
                    return m;
                })
                .all()
                .forEach(m -> out.add(MovieMapper.toResponse(m)));
        return out;
    }
}