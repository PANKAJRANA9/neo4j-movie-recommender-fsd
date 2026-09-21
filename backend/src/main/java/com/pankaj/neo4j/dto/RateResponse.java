package com.pankaj.neo4j.dto;

public record RateResponse(
        String message,
        String userId,
        Long   movieId,
        int    rating
) {}