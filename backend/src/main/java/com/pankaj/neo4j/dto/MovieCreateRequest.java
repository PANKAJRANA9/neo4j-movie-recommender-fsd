package com.pankaj.neo4j.dto;

import jakarta.validation.constraints.NotBlank;

public record MovieCreateRequest(
        @NotBlank String title,
        String genre,
        Integer year,
        String rating,
        String description
) {}