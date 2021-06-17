docker stop REDDIT-DB
docker rm REDDIT-DB
docker run --rm --name REDDIT-DB -p 5432:5432 -e POSTGRES_PASSWORD=tajne -e POSTGRES_DB=reddit-db -d postgres