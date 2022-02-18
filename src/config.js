const config = {
  AUTH_TOKEN: process.env.AUTH_TOKEN || '121331313113',
  AUTH_USER: process.env.AUTH_USER || 'admin',
  AUTH_PASSWORD: process.env.AUTH_PASSWORD || '1111',
  DATABASE_CONNECTION_STRING: process.env.DATABASE_URL || 'postgres://postgres:j4mg0@localhost:5432/les_meves_ajudes',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  LISTEN_HOST: process.env.HOST || '0.0.0.0',
  LISTEN_PORT: process.env.PORT || 3001,
  USE_SSL_FOR_DATABASE: process.env.USE_SSL_FOR_DATABASE || false,
  DASHBOARD_SECRET: process.env.DASHBOARD_SECRET || '4c3ss',
};

console.log('application configuration: ', config);

module.exports = config;
