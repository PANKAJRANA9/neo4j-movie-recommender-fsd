package com.pankaj.neo4j;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.neo4j.Neo4jReactiveRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.data.neo4j.Neo4jReactiveDataAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication(exclude = {
        Neo4jReactiveRepositoriesAutoConfiguration.class,
        Neo4jReactiveDataAutoConfiguration.class
})
@ConfigurationPropertiesScan
public class Neo4jMovieBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(Neo4jMovieBackendApplication.class, args);
    }
}