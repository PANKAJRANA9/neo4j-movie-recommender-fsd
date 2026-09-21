package com.pankaj.neo4j.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RateRequest(
        @NotBlank String userId,
        @NotNull  Long   movieId,
        @Min(1) @Max(5) Integer rating
) {}