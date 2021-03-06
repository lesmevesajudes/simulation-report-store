simulation-store
=====================

An api to store and retrieve simulations made with lesmevesajudes-ui.
Created from a bootstrap to create RESTful APIs with [Node.js](https://nodejs.org/), [Express](http://expressjs.com/) and [Postgres](https://www.postgresql.org/).

NOTE: Now only supports one user. See env variables.

## Installation

```
yarn install
```

## Database setup

```
psql -f data/reset_simulation_store.sql
```

You can configure your database connection setting `DATABASE_URL` environment variable.

## Usage

```
yarn start
```

## Setting up your queries

- `**/**Requests.js`: functions and exports.
- `**/routes.js`: endpoints.

## Configuration
This app is configured using the following environment variables:
- `AUTH_TOKEN`: A token used to query simulation reports. (mandatory to query data)
- `AUTH_USER`: Client user
- `AUTH_PASSWORD`: Client password
- `DATABASE_URL`: Where to find postgres database. (mandatory)
- `NODE_ENV`: To force node environment.  (`development` by default)
- `HOST`: Listen address (`0.0.0.0` by default)
- `PORT`: Listen port (`3000` by default)

Names can be tuned in `src/config.js`.     
