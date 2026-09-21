package com.pankaj.neo4j.controller;

import com.pankaj.neo4j.dto.*;
import com.pankaj.neo4j.exception.BadRequestException;
import com.pankaj.neo4j.exception.NotFoundException;
import com.pankaj.neo4j.service.MovieService;
import com.pankaj.neo4j.service.RecommendationService;
import com.pankaj.neo4j.service.RatingService;
import com.pankaj.neo4j.service.StatsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MovieController {

    private final MovieService          movieService;
    private final RecommendationService recommendationService;
    private final RatingService         ratingService;
    private final StatsService          statsService;

    public MovieController(MovieService movieService,
                           RecommendationService recommendationService,
                           RatingService ratingService,
                           StatsService statsService) {
        this.movieService          = movieService;
        this.recommendationService = recommendationService;
        this.ratingService         = ratingService;
        this.statsService          = statsService;
    }

    /* ───────────────────────── MOVIES ───────────────────────── */

    @GetMapping("/movies")
    public List<MovieResponse> allMovies() {
        return movieService.getAllMovies();
    }

    @PostMapping("/movies")
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieCreateRequest req) {
        MovieResponse created = movieService.createMovie(req);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/movies/{id}")
    public MovieResponse getMovie(@PathVariable Long id) {
        return movieService.getMovie(id)
                .orElseThrow(() -> new NotFoundException("Movie not found: " + id));
    }

    @GetMapping("/movies/search")
    public List<MovieResponse> search(@RequestParam("q") String q) {
        if (q == null || q.isBlank()) {
            throw new BadRequestException("Query parameter 'q' is required");
        }
        return movieService.searchByTitle(q);
    }

    @GetMapping("/movies/genre/{genre}")
    public List<MovieResponse> byGenre(@PathVariable String genre) {
        return movieService.getByGenre(genre);
    }

    /* ──────────────────── RECOMMENDATIONS ───────────────────── */

    @GetMapping("/recommend/{userId}")
    public List<MovieResponse> recommend(@PathVariable String userId) {
        if (userId == null || userId.isBlank()) {
            throw new BadRequestException("userId is required");
        }
        return recommendationService.recommendForUser(userId);
    }

    /* ─────────────────────── RATINGS ────────────────────────── */

    @PostMapping("/rate")
    public RateResponse rate(@Valid @RequestBody RateRequest req) {
        ratingService.rateMovie(req.userId(), req.movieId(), req.rating());
        return new RateResponse("Rated successfully",
                req.userId(), req.movieId(), req.rating());
    }

    /* ──────────────────────── STATS ─────────────────────────── */

    @GetMapping("/stats")
    public StatsResponse stats() {
        return statsService.getStats();
    }

    /* ──────────────────────── GRAPH ─────────────────────────── */

    @GetMapping("/graph")
    public GraphResponse graph() {
        return movieService.getGraph();
    }
}