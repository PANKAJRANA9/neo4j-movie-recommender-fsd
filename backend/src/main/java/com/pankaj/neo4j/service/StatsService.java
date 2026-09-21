package com.pankaj.neo4j.service;

import com.pankaj.neo4j.dto.StatsResponse;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    private final Neo4jClient neo4jClient;

    public StatsService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public StatsResponse getStats() {
        long movies  = count("MATCH (m:Movie) RETURN count(m) AS c");
        long users   = count("MATCH (u:User) RETURN count(u) AS c");
        long genres  = count("MATCH (g:Genre) RETURN count(g) AS c");
        long ratings = count("MATCH ()-[r:RATED]->() RETURN count(r) AS c");
        return new StatsResponse(movies, users, genres, ratings);
    }

    private long count(String cypher) {
        return neo4jClient.query(cypher)
                .fetchAs(Long.class)
                .mappedBy((t, r) -> r.get("c").asLong())
                .one()
                .orElse(0L);
    }
}