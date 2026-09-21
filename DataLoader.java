
package com.pankaj.config;
import com.pankaj.model.Movie;
import com.pankaj.repo.MovieRepository;
import org.springframework.boot.CommandLineRunner; import org.springframework.stereotype.Component;
@Component
public class DataLoader implements CommandLineRunner {
 private final MovieRepository repo; public DataLoader(MovieRepository repo){this.repo=repo;}
 public void run(String... args){
  if(repo.count()==0){
   repo.save(new Movie("Mad Max: Fury Road","Action",2015,"R","Post-apocalyptic action"));
   repo.save(new Movie("John Wick","Action",2014,"R","Stylish hitman"));
   repo.save(new Movie("Dune","Sci-Fi",2021,"PG-13","Epic space opera"));
   repo.save(new Movie("The Grand Budapest Hotel","Comedy",2014,"R","Whimsical comedy"));
   repo.save(new Movie("Parasite","Drama",2019,"R","Class thriller"));
   repo.save(new Movie("Get Out","Horror",2017,"R","Social horror"));
  }
 }
}
