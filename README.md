
# Bank Thing

## Description

Simple bank application that uses Yapily (open banking provider) to fetch bank accounts, transactions, and balances. The application is with React frontend, NestJS backend, Postgres database and Redis with BullMQ for job queueing.

## Links

- [Live Demo](https://bank-thing.gowtham.io)
- [API Documentation](https://api.bank-thing.gowtham.io/docs)

## Running the Application

Run locally using docker compose (localhost:80)
```sh
make docker-local-up
```

## Required Environment Variables
- `YAPILY_APP_ID`: The application ID for Yapily. This is required for the application to connect to the Yapily API.
- `YAPILY_APP_SECRET`: The application secret for Yapily. This is required for the application to connect to the Yapily API.
- `DATABASE_URL`: The URL for the database. This is required for the application to connect to the database.
- `REDIS_HOST`: The host for the Redis server. This is required for the application to connect to the Redis server.
- `REDIS_PORT`: The port for the Redis server. This is required for the application to connect to the Redis server.

