import app from './server.js';
import config from './config';

app.run(config.LISTEN_HOST, config.LISTEN_PORT, config.ENVIRONMENT);
