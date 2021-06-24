/* eslint-disable no-fallthrough */
import http from 'http';
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import app from './config/app';

interface HttpException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

const normalizePort = (val: string): number | boolean | string => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

const onError = (error: HttpException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port.toString()}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

const onListening = (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`✔ Listening on ${bind}`);
};

MongoHelper.connect('mongodb://mongo:senha@localhost:27017')
  .then(async () => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch(console.error);
