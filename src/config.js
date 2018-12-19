module.exports = {
  AUTH_TOKEN: process.env.AUTH_TOKEN || '121331313113',
  AUTH_USER: process.env.AUTH_USER || 'admin',
  AUTH_PASSWORD: process.env.AUTH_PASSWORD || '1111',
  DATABASE_CONNECTION_STRING: process.env.DATABASE_URL+'sslmode=require' || 'postgres://localhost:5432/les_meves_ajudes',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  LISTEN_HOST: process.env.HOST || '0.0.0.0',
  LISTEN_PORT: process.env.PORT || 3000
};
