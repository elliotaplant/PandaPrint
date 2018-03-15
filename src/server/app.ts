import * as bodyParser from 'body-parser';
import { ErrorActuator } from './error';
import { Server } from './server';

// Source maps for debugging
require('source-map-support').install();
process.on('unhandledRejection', console.error);

const server = new Server();

// Init the server, make sure to log errors
server.init().catch((error) => ErrorActuator.handleError(error, 'failed to start server'));
