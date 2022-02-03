import { USE_SSL_FOR_DATABASE } from './config';

const pgPromise = require('pg-promise')({
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  }
});
const cache = new Map();

const database = (databaseURL) => {
  if (cache.has(databaseURL)) {
    return cache.get(databaseURL);
  }
  const dbConfig = {
    connectionString: databaseURL,
    ssl: USE_SSL_FOR_DATABASE ? {
      rejectUnauthorized: false,
    } : false,
  };
  console.log('Database connection config: ', dbConfig);
  
  const instance = pgPromise(dbConfig);
  cache.set(databaseURL, instance);
  console.log("Counting simulations");
  instance.one("select count(*) from simulations").then(
    (count) => console.log('Num rows in simulations: ', count)  
  ).catch(
    (error) => console.log('Error counting simulations: ', error)
  );
  return instance;
};

export default database;
