# SCROM Data Pipeline service



#### How to run

To run this project you need at minimum docker.

1. Update secrets located in docker-compose.yml file
2. Execute `docker-compose up --build` from the root of the project
3. Wait around 1 min for database to populate the schema
4. Trigger data pipeline by executing this command: `curl -X POST http://localhost:3000/process-data`
5. Check the data in the database
6. To stop the service execute `docker-compose down -v`