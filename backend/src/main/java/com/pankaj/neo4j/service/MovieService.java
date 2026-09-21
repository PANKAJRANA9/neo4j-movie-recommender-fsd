package com.pankaj.neo4j.service;

import com.pankaj.neo4j.domain.Movie;
import com.pankaj.neo4j.dto.GraphResponse;
import com.pankaj.neo4j.dto.MovieCreateRequest;
import com.pankaj.neo4j.dto.MovieResponse;
import com.pankaj.neo4j.mapper.MovieMapper;
import com.pankaj.neo4j.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieResponse> getAllMovies() {
        List<MovieResponse> out = new ArrayList<>();
        movieRepository.findAll().forEach(m -> out.add(MovieMapper.toResponse(m)));
        return out;
    }

    public Optional<MovieResponse> getMovie(Long id) {
        return movieRepository.findById(id).map(MovieMapper::toResponse);
    }

    @Transactional
    public MovieResponse createMovie(MovieCreateRequest req) {
        Movie entity = MovieMapper.toEntity(req);
        // Ensure id assigned (fallback)
        if (entity.getId() == null) {
            entity.setId(System.currentTimeMillis());
        }
        Movie saved = movieRepository.save(entity);
        return MovieMapper.toResponse(saved);
    }

    public List<MovieResponse> searchByTitle(String q) {
        return movieRepository.findByTitleContaining(q).stream()
                .map(MovieMapper::toResponse)
                .toList();
    }

    public List<MovieResponse> getByGenre(String genre) {
        return movieRepository.findByGenre(genre).stream()
                .map(MovieMapper::toResponse)
                .toList();
    }

    public GraphResponse getGraph() {
        List<MovieResponse> movies = getAllMovies();
        List<GraphResponse.Node> nodes = new ArrayList<>();
        List<GraphResponse.Edge> edges = new ArrayList<>();

        for (int i = 0; i < movies.size(); i++) {
            MovieResponse m = movies.get(i);
            nodes.add(new GraphResponse.Node(
                    String.valueOf(m.id()),
                    m.title(),
                    m.genre() == null ? "Unknown" : m.genre()
            ));
        }
        // Build simple edges: consecutive movies of same genre
        for (int i = 0; i < movies.size(); i++) {
            for (int j = i + 1; j < movies.size(); j++) {
                if (Objects.equals(movies.get(i).genre(), movies.get(j).genre())) {
                    edges.add(new GraphResponse.Edge(
                            String.valueOf(movies.get(i).id()),
                            String.valueOf(movies.get(j).id()),
                            "SIMILAR"
                    ));
                }
            }
        }
        return new GraphResponse(nodes, edges, movies.size());
    }
}