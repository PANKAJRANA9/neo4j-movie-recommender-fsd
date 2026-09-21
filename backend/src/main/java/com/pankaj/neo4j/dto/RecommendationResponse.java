package com.pankaj.neo4j.dto;

public record RecommendationResponse(
        Long    id,
        String  title,
        String  genre,
        Integer year,
        String  rating,
        Double  score
) {}