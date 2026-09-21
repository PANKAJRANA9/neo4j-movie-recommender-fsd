package com.pankaj.neo4j.service;

import com.pankaj.neo4j.domain.User;
import com.pankaj.neo4j.exception.BadRequestException;
import com.pankaj.neo4j.repository.MovieRepository;
import com.pankaj.neo4j.repository.UserRepository;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RatingService {

    private final Neo4jClient     neo4jClient;
    private final UserRepository  userRepository;
    private final MovieRepository movieRepository;

    public RatingService(Neo4jClient neo4jClient,
                         UserRepository userRepository,
                         MovieRepository movieRepository) {
        this.neo4jClient     = neo4jClient;
        this.userRepository  = userRepository;
        this.movieRepository = movieRepository;
    }

    @Transactional
    public void rateMovie(String userId, Long movieId, Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        // Ensure user exists
        userRepository.findById(userId).orElseGet(() ->
                userRepository.save(new User(userId, userId, "Drama"))
        );

        // Ensure movie exists
        if (!movieRepository.existsById(movieId)) {
            throw new BadRequestException("Movie not found: " + movieId);
        }

        // MERGE the rating relationship
        neo4jClient.query("""
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie {id: $movieId})
            MERGE (u)-[r:RATED]->(m)
            SET r.rating = $rating, r.timestamp = datetime()
        """)
                .bindAll(Map.of(
                        "userId",  userId,
                        "movieId", movieId,
                        "rating",  rating
                ))
                .run();
    }
}