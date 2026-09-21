
# Neo4j Movie Recommender - Full E2E FSD Project (React + Spring Boot + Neo4j)

## Architecture
React (Vite) -> Spring Boot REST -> Neo4j (Cypher recommendation)

## Run
1. docker-compose up neo4j
2. backend: mvn spring-boot:run
3. frontend: npm install && npm run dev

## Features
- Movie Form (Create)
- Movie List with search
- Recommendation Engine: MATCH (u:User)-[RATED]->(m)<-[:SIMILAR]-(rec)
- Graph Visualization with D3/vis-network: nodes = User, Movie, Genre
- JWT Auth

## Skills Showcased
Neo4j 1.3yr, React FSD, Spring Boot Microservice, Cypher
