
package com.pankaj.model;
import org.springframework.data.neo4j.core.schema.*;
import java.util.*;
@Node("Movie")
public class Movie {
 @Id @GeneratedValue private Long id;
 private String title; private String genre; private Integer year; private String rating; private String description;
 @Relationship(type="SIMILAR", direction=Relationship.Direction.OUTGOING)
 private List<Movie> similarMovies = new ArrayList<>();
 // getters setters
 public Movie(){}
 public Movie(String title,String genre,Integer year,String rating,String desc){this.title=title;this.genre=genre;this.year=year;this.rating=rating;this.description=desc;}
 // ... getters/setters omitted for brevity
 public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
 public String getGenre(){return genre;} public Integer getYear(){return year;}
}
