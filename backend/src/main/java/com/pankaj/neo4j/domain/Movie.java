package com.pankaj.neo4j.domain;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("Movie")
public class Movie {

    /** Custom application ID — matches your seed's `movieId`.
     *  NO @GeneratedValue, otherwise Spring Data Neo4j uses the
     *  internal node id and breaks the seed data mapping. */
    @Id
    private Long id;

    private String  title;
    private String  genre;
    private Integer year;
    private String  rating;
    private String  description;

    public Movie() {}

    public Movie(String title, String genre, Integer year, String rating, String description) {
        this.title       = title;
        this.genre       = genre;
        this.year        = year;
        this.rating      = rating;
        this.description = description;
    }

    // Getters & Setters
    public Long getId()                           { return id; }
    public void setId(Long id)                    { this.id = id; }
    public String getTitle()                      { return title; }
    public void setTitle(String title)            { this.title = title; }
    public String getGenre()                      { return genre; }
    public void setGenre(String genre)            { this.genre = genre; }
    public Integer getYear()                      { return year; }
    public void setYear(Integer year)             { this.year = year; }
    public String getRating()                     { return rating; }
    public void setRating(String rating)          { this.rating = rating; }
    public String getDescription()                { return description; }
    public void setDescription(String d)          { this.description = d; }
}