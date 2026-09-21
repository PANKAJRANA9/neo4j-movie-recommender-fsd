package com.pankaj.neo4j.dto;

public record MovieResponse(
        Long    id,
        String  title,
        String  genre,
        Integer year,
        String  rating,
        String  description
) {}