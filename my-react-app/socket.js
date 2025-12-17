//Placeholder, currently is not triggered by anything

import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
// import {createServer} from 'http';
// import app from 'express';


const ioServer = (httpServer) => {
    const io = new Server(httpServer, {cors: {
        origin: [process.env.FRONTEND_CLIENT],
        methods: ["GET", "POST"],
        credentials: true
    }});
    return io
}
console.log("Allowed socket origin:", process.env.FRONTEND_CLIENT);
export default ioServer