import express from 'express';
//import redis from 'redis';
import app from 'express';
import { createClient } from 'redis';
const app2 = express();
import session from 'express-session';
import configRoutesFunction from './src/routes/index.js';
import cors from 'cors';
import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
import {createServer} from 'http';
//import * as flat from 'flat';



app2.use(express.json());
app2.use(express.urlencoded({ extended: true }));

// Allow us to send requests from react to here
app2.use(cors({
  origin: "https://testing-game-1tbcss.web.app", // frontend URL
  credentials: true                // allow cookies/session
}));


app2.use(
  session({
    name: 'AwesomeWebapp2',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60} //one second * 60 seconds * 60 minutes. 1 hour cookies
  })
);

configRoutesFunction(app2);

// const httpServer = createServer(app);

const client = createClient({
  socket: {
    host: "redis-17307.c263.us-east-1-2.ec2.cloud.redislabs.com",
    port: 17307
  },
  password: "lbsJey9NCaW4awjcVroom52ybQMJbpL7"
});

client.connect().catch(console.error);
const io = new Server(httpServer, {cors: {
    origin: "https://testing-game-1tbcss.web.app",
    methods: ["GET", "POST"],
    credentials: true
  }});

let switcher = 1
let numClients = 0
let clientList = []
io.on('connection', (socket) => {
  // switcher = 1-switcher
  let thisClient
  if(switcher == 0){console.log (socket.id + " wrong one"); }
  else{
    numClients++
    thisClient = numClients
    clientList.push(socket)
    if(thisClient == 2){
      socket.emit('error', {id: socket.id, message:"you are two"});
      let red = Math.floor(Math.random() * 2)
      if(red == 0){
        socket.emit('color', {id: socket.id, color:"red"});
        clientList[0].emit('color', {id: socket.id, color:"red"});
      }
      else{
        socket.emit('color', {id: socket.id, color:"yellow"});
        clientList[0].emit('color', {id: socket.id, color:"yellow"});
      }
    }
  }
  socket.on('placePiece', (collumn) => {
    if (thisClient == 1){
      clientList[1].emit('otherPlaced', (collumn))
    }
    else{
      clientList[0].emit('otherPlaced', (collumn))
    }
  })
  console.log('new client connected', socket.id);
  socket.broadcast.emit('user_join', socket.id);

  socket.on('user_join', (name) => {
    console.log('A user joined their name is ' + name);
    socket.broadcast.emit('user_join', name);
  });

  socket.on('test', (a) => {
    console.log(socket.id);
    //io.emit('message', {name, message});
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
    numClients--;
  });
});

// httpServer.listen(3000, () => { //we've got 2 servers here this is chaos idk whats goin on
//   console.log(`listening on *:${4000}`);
// });
httpServer.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});





//I'm gonna make this super ugly so don't worry about anything below here
let gameState = [['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x']]

let turn = 0;
let countCollum = [0,0,0,0,0,0,0]

let checkGameOver = () => {
		for(let [i,x] of gameState.entries()){ //side to side
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j] && gameState[i+1][j] === gameState[i+2][j] && gameState[i+2][j] === gameState[i+3][j]){
						console.log(gameState[i][j] + ' WINS!!!')
						doGameOver(gameState[i][j])
					}
				}
			}
		}
		for(let [i,x] of gameState.entries()){ //Up and down
				for(let [j,y] of x.entries()){
					if(j < 3){
						if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i][j+1] && gameState[i][j+1] === gameState[i][j+2] && gameState[i][j+2] === gameState[i][j+3]){
							console.log(gameState[i][j] + ' WINS!!!')
						  doGameOver(gameState[i][j])
						}
					}

				}
		}

		for(let [i,x] of gameState.entries()){ //Left up to right down... or smth idk some sort of diagonal it's hard to keep track of which way its flipped
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(j < 3){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j+1] && gameState[i+1][j+1] === gameState[i+2][j+2] && gameState[i+2][j+2] === gameState[i+3][j+3]){
						console.log(gameState[i][j] + ' WINS!!!')
						doGameOver(gameState[i][j])
					}
					}
				}
			}
		}

		for(let [i,x] of gameState.entries()){ //Left down to right up... or smth idk some sort of diagonal it's hard to keep track of which way its flipped
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(j >= 3){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j-1] && gameState[i+1][j-1] === gameState[i+2][j-2] && gameState[i+2][j-2] === gameState[i+3][j-3]){
						console.log(gameState[i][j] + ' WINS!!!')
						doGameOver(gameState[i][j])
					}
					}
				}
			}
		}
		return
	}