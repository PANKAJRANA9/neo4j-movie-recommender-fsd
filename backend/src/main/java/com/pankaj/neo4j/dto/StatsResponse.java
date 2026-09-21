package com.pankaj.neo4j.dto;

public record StatsResponse(
        long movies,
        long users,
        long genres,
        long ratings
) {}