
package com.pankaj.repo;
import com.pankaj.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import java.util.*;
public interface MovieRepository extends Neo4jRepository<Movie, Long> {
 List<Movie> findByTitleContaining(String title);
 @Query("MATCH (u:User {id:$userId})-[r:RATED]->(m:Movie) WHERE r.rating >=4 MATCH (m)-[:SIMILAR]->(rec:Movie) WHERE NOT (u)-[:RATED]->(rec) RETURN rec LIMIT 10")
 List<Movie> recommendForUser(String userId);
 @Query("MATCH (m:Movie) RETURN m LIMIT 100")
 List<Movie> getGraphDataRaw();
 default Map<String,Object> getGraphData(){ Map<String,Object> map=new HashMap<>(); map.put("nodes", getGraphDataRaw()); return map; }
}
