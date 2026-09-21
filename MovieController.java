
package com.pankaj.controller;
import com.pankaj.model.Movie;
import com.pankaj.repo.MovieRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api")
@CrossOrigin(origins="http://localhost:5173")
public class MovieController {
 private final MovieRepository repo;
 public MovieController(MovieRepository repo){this.repo=repo;}
 @GetMapping("/movies") public List<Movie> all(){return repo.findAll();}
 @PostMapping("/movies") public Movie create(@RequestBody Movie m){return repo.save(m);}
 @GetMapping("/movies/search") public List<Movie> search(@RequestParam String q){return repo.findByTitleContaining(q);}
 @GetMapping("/recommend/{userId}")
 public List<Movie> recommend(@PathVariable String userId){
   // Collaborative + Content based via Cypher
   return repo.recommendForUser(userId);
 }
 @GetMapping("/graph") public Map<String,Object> graph(){ return repo.getGraphData(); }
}
