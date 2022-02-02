import { USE_SSL_FOR_DATABASE } from './config';

const pgPromise = require('pg-promise')(/*initialization options*/);
const cache = new Map();

const database = (databaseURL) => {
  if (cache.has(databaseURL)) {
    return cache.get(databaseURL);
  }
  const connectionString = `${databaseURL}?ssl=${USE_SSL_FOR_DATABASE}`;
  console.log('Database connection string: ', connectionString);
  const instance = pgPromise(connectionString);
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
