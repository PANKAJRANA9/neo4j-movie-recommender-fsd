
package com.pankaj.neo4j.domain;

import org.springframework.data.neo4j.core.schema.*;

@Node("User")
public class User {
    @Id
    private String id;
    private String name;
    private String prefGenre;

    public User() {}
    public User(String id, String name, String prefGenre) {
        this.id = id;
        this.name = name;
        this.prefGenre = prefGenre;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPrefGenre() { return prefGenre; }
    public void setPrefGenre(String prefGenre) { this.prefGenre = prefGenre; }
}
