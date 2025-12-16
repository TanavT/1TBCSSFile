//Placeholder, currently is not triggered by anything

import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
import {createServer} from 'http';
import app from 'express';

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: '*'}});

export default io