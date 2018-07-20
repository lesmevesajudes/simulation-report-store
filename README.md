node-postgres-restapi
=====================

A bootstrap to create RESTful APIs with [Node.js](https://nodejs.org/), [Express](http://expressjs.com/) and [Postgres](https://www.postgresql.org/).

## Installation

```
yarn install
```

## Database setup

```
psql -f data/reset_simulation_store.sql
```

You can configure your database connection in the `api/queries.js` file. The line:

```
var connectionString = 'postgres://localhost:5432/simulations';
```

## Usage

```
yarn start
```

## Setting up your queries

- `api/queries.js`: functions and exports.
- `api/index.js`: endpoints.