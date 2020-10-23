import {isValidToken} from '../authentication/authService';
import config from '../config';
import {connect} from '../database';
import Aid from '../model/AidCollection';
import Responses from '../shared/responses';
import {getTokenFromRequest} from '../shared/common';

//const db = database(config.DATABASE_CONNECTION_STRING);
connect('mongodb://jamgo:jamgo@localhost:27017/les-meves-ajudes');

export function getAll(req, res, next) {
	console.log('get all aids');
	if (isValidToken(getTokenFromRequest(req))) {
		Aid.find()
			.lean(true)
			.sort({'codi':1, 'data_fi': -1})
			.then(function (data) {
				res.status(200).json({
					'aids': data,
				});
			}).catch(function (err) {
		        console.log('get all aids error');
		        return next(err);
			});
  } else {
    return next(Responses.unauthorized());
  }
}