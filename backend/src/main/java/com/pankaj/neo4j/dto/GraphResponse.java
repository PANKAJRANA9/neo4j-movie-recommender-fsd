package com.pankaj.neo4j.dto;

import java.util.List;

public record GraphResponse(
        List<Node> nodes,
        List<Edge> edges,
        int        count
) {
    public record Node(String id, String label, String group) {}
    public record Edge(String from, String to, String label) {}
}