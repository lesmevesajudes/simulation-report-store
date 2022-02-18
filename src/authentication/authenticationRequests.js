import config from '../config.js';
import {authenticate, isValidDashboardAccessCode}  from './authService';
import Responses from '../shared/responses';

export function login(req, res, next) {
  // TODO Add proper auth store
  if (authenticate(req.body.username, req.body.password)) {
    return res.status(200).json({
      token: config.AUTH_TOKEN
    });
  } else {
    return next(Responses.unauthorized());
  }
}

export function validateDashboardAccess(req, res, next) {
  if (isValidDashboardAccessCode(req.body.code)) {
    return res.status(200).send();
  } else {
    return next(Responses.unauthorized());
  }
}
