## Architecture Overview

- **Host-Client Service**: Front-end built with Next.js 14, handles server-side rendering and routes via API Gateway.
- **API Gateway**: Directs requests to `auth`, `order`, and `product` microservices.
- **Microservices**: Each (`auth`, `order`, `product`) runs in Docker containers for modularity and isolation.
- **Communication**: Microservices use RabbitMQ with AMQP for efficient messaging and reduced database calls.
- **Message Queues**: `Product` and `order` services communicate through dedicated queues for efficient task handling.

## Microservice Design

- Uses Clean Architecture for modularity and dependency management.

**Tech Stack**: Node.js, Express, MongoDB, Docker, RabbitMQ, Next.js 14, Mocha, Chai

## Steps to Run

### Docker Setup

1. Create `.env` files in all service directories.
2. Build images: `docker-compose build`
3. Start services: `docker-compose up` (APIs at `localhost:3003`)

### Local Setup

1. Create `.env` files in each directory.
2. Run `npm install` in each service.
3. Start services with `npm start`.

## How to Run with Docker

To start all services in detached mode and build images:

```bash
docker-compose up -d --build
```

To rebuild only 1 service

```bash
docker-compose up --build <service_name>
```

To stop all services:

```bash
docker-compose down
```

To stop services and delete volumes:

```bash
docker-compose down -v
```

## Accessing MongoDB Data

1. **Exec into MongoDB Container**:  
   `docker exec -it mongo-container bash`
2. **Open MongoDB Shell**:  
   `mongosh -u user -p password --authenticationDatabase admin`
3. **Database Commands**:  
   - Show all databases: `show dbs`
   - Use a database: `use mydatabase`
   - Show collections: `show collections`
   - View documents: `db.mycollection.find().pretty()`

## Future Improvements

- Implement Kubernetes for orchestration.
- Expand testing coverage and automation.
- Refactor for Clean Architecture compliance.
- Automate API tests with Bash and `curl`.
- Deploy databases across platforms for redundancy.
