package com.pankaj.neo4j.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private List<String> allowedOrigins;
    private List<String> allowedMethods;
    private List<String> allowedHeaders;
    private List<String> exposedHeaders;
    private boolean allowCredentials = true;
    private long maxAgeSeconds = 3600;

    // Getters & setters
    public List<String> getAllowedOrigins()   { return allowedOrigins; }
    public void setAllowedOrigins(List<String> v) { this.allowedOrigins = v; }

    public List<String> getAllowedMethods()   { return allowedMethods; }
    public void setAllowedMethods(List<String> v) { this.allowedMethods = v; }

    public List<String> getAllowedHeaders()   { return allowedHeaders; }
    public void setAllowedHeaders(List<String> v) { this.allowedHeaders = v; }

    public List<String> getExposedHeaders()   { return exposedHeaders; }
    public void setExposedHeaders(List<String> v) { this.exposedHeaders = v; }

    public boolean isAllowCredentials()       { return allowCredentials; }
    public void setAllowCredentials(boolean v){ this.allowCredentials = v; }

    public long getMaxAgeSeconds()            { return maxAgeSeconds; }
    public void setMaxAgeSeconds(long v)      { this.maxAgeSeconds = v; }
}