package com.pankaj.neo4j.mapper;

import com.pankaj.neo4j.domain.Movie;
import com.pankaj.neo4j.dto.MovieCreateRequest;
import com.pankaj.neo4j.dto.MovieResponse;
import com.pankaj.neo4j.dto.RecommendationResponse;

public final class MovieMapper {

    private MovieMapper() {}

    public static MovieResponse toResponse(Movie m) {
        if (m == null) return null;
        return new MovieResponse(
                m.getId(),
                m.getTitle(),
                m.getGenre(),
                m.getYear(),
                m.getRating(),
                m.getDescription()
        );
    }

    public static Movie toEntity(MovieCreateRequest r) {
        Movie m = new Movie();
        m.setTitle(r.title());
        m.setGenre(r.genre() == null ? "Drama" : r.genre());
        m.setYear(r.year() == null ? 2024 : r.year());
        m.setRating(r.rating() == null ? "PG-13" : r.rating());
        m.setDescription(r.description() == null ? "" : r.description());
        return m;
    }

    public static RecommendationResponse toRec(Movie m, Double score) {
        if (m == null) return null;
        return new RecommendationResponse(
                m.getId(),
                m.getTitle(),
                m.getGenre(),
                m.getYear(),
                m.getRating(),
                score == null ? 0.0 : score
        );
    }
}