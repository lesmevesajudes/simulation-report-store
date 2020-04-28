import * as config from './config';

const initOptions = {
    schema: 'ajuts_barcelona_simulations' /* can also be an array of strings or a callback */
};


const pgPromise = require('pg-promise')(initOptions);
const cache = new Map();

const database = (databaseURL) => {
  const dbKey = databaseURL;
  if (cache.has(dbKey)) {
    return cache.get(dbKey);
  }
  const instance = pgPromise(databaseURL+'?ssl='+config.USE_SSL_FOR_DATABASE);
  cache.set(dbKey, instance);
  return instance;
};

export default database;
