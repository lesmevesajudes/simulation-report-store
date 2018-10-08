import config from '../config.js';

export function authenticate (username, password)
{
  return username === config.AUTH_USER && password === config.AUTH_PASSWORD
}
