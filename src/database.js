import * as config from './config';

//const initOptions = {
//    schema: 'ajuts_barcelona_simulations' /* can also be an array of strings or a callback */
//};


//const pgPromise = require('pg-promise')(initOptions);
const pgPromise = require('pg-promise')(/*initialization options*/);
const cache = new Map();

const database = (databaseURL) => {
  console.log(databaseURL);
  const dbKey = databaseURL;
  if (cache.has(dbKey)) {
    return cache.get(dbKey);
  }
  const instance = pgPromise(databaseURL+'?ssl='+config.USE_SSL_FOR_DATABASE);
  cache.set(dbKey, instance);
  console.log("Counting simulations");
  instance.one("select count(*) from simulations").then(
    (count) => console.log('Num rows in simulations: ', count)  
  ).catch(
    (error) => console.log('Error counting simulations: ', error)
  );
  return instance;
};

export default database;
