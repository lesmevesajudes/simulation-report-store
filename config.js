module.exports = {
  AUTH_TOKEN: process.env.AUTH_TOKEN,
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  LISTEN_HOST: process.env.HOST || '0.0.0.0',
  LISTEN_PORT: process.env.PORT || 3000
};
