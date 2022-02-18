import config from '../config.js';

export function authenticate (username, password) {
  return username === config.AUTH_USER && password === config.AUTH_PASSWORD
}

export function isValidToken(clientToken) {
  return clientToken === config.AUTH_TOKEN;
}

export function isValidDashboardAccessCode (code) {
  return code === config.DASHBOARD_SECRET;
}
