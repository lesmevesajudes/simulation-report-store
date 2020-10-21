import * as config from './config';
const mongoose = require('mongoose');


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
  return instance;
};

export default database;


export const connect = (databaseURL) => {
	const dbKey = databaseURL;
	if (cache.has(dbKey)) {
		return cache.get(dbKey);
	}
	const instance = mongoose.connect(databaseURL, {useNewUrlParser: true}, error => {
		if (!error) {
			console.log('Connected');
		} else {
			console.log('Error connecting to db')
			console.log(error);
		}
	});
	cache.set(dbKey, instance);
}

//export default dbDisconnect = () => mongoose.connection.close();
