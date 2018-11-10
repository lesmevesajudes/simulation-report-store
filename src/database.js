const pgPromise = require('pg-promise')(/*initialization options*/);
const cache = new Map();

const database = (databaseConfig) => {
  const dbKey = JSON.stringify(databaseConfig, Object.keys(databaseConfig).sort());
  if (cache.has(dbKey)) {
    return cache.get(dbKey);
  }
  const instance = pgPromise(databaseConfig);
  cache.set(dbKey, instance);
  return instance;
};

export default database;
