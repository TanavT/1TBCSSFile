import express from 'express';
//import redis from 'redis';
import { createClient } from 'redis';
const app = express();
import session from 'express-session';
import configRoutesFunction from './routes/index.js';
import cors from 'cors';
import { Server } from "socket.io"
import { createServer } from "http"
//import * as flat from 'flat';


//const client = createClient();
//client.connect().then(() => {});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow us to send requests from react to here
app.use(cors({
  origin: "http://localhost:8080", // frontend URL
  credentials: true                // allow cookies/session
}));


app.use(
  session({
    name: 'AwesomeWebApp',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60} //one second * 60 seconds * 60 minutes. 1 hour cookies
  })
);

configRoutesFunction(app);

//create an http server instead of app.listen so socketio can live on the same server as express
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "null"],
    credentials: true,
  },
})

io.on("connection", (socket) => {
  console.log("New socket connected: ", socket.id);

  socket.on("chatMessage", (msg) => {
    console.log("Received char: ", msg);
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
})

httpServer.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes + websocket will be running on http://localhost:3000');
});