# Product Catalog Management

a product catalog management app

## Prerequisites

- NodeJS
- Docker

## Instalation

Clone the repo:

```
git clone https://github.com/tiagoaalves/product-catalog-management.git
```

Install dependencies:

```
npm install
```

## Launch

Run the Postgres container:

```
docker-compose up db
```

Run the node app:

```
npm start
```

Alternativelly, everything can be launched with docker-compose.

Build the services:

```
docker-compose build
```

Run the app:

```
docker-compose up app
```

## Tests

Tests can be run both via npm or docker-compose.

npm:

```
npm test
```

docker-compose:

```
docker-compose up tests
```

### API Endpoints

Endpoint documentation is available on swagger, it is accessible via `/doc`

There is also a json with the postman collection `/product-catalog.postman_collection.json`

![API Endpoints](https://i.imgur.com/mb0nSxA.png)
