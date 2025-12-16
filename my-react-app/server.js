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

if (process.env){
  console.log(process.title)
} else {
  console.log(".env not detected! The server will not run properly") 
}
app2.use(express.json());
app2.use(express.urlencoded({ extended: true }));

// Allow us to send requests from react to here
app2.use(cors({
  origin: process.env.FRONTEND_CLIENT, // frontend URL
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
const httpServer = app2.listen(3000, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on ${process.env.BACKEND_SERVER}`);
});

const client = createClient({
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
});

client.connect().catch(console.error);
const io = new Server(httpServer, {cors: {
    origin: process.env.FRONTEND_CLIENT,
    methods: ["GET", "POST"],
    credentials: true
  }});


let numClientsConnect = 0
let clientList = []

let numClientsChess = 0
let clientListChess = []

let chessTimers = []
let connectTimers = []

io.on('connection', (socket) => {
  // switcher = 1-switcher
  let thisClient
  socket.on('realSocketConnect', (testStr) => {
    console.log('someone real joined')
    thisClient = numClientsConnect
    clientList.push(socket)
    if(thisClient%2 == 1){
      let red = Math.floor(Math.random() * 2)
      connectTimers.push({redTimer: 30, yellowTimer: 30, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
      socket.emit('error', {id: socket.id, message:"you are two"});
      if(red == 0){
        socket.emit('color', {id: socket.id, color:"red"});
        clientList[thisClient - 1].emit('color', {id: socket.id, color:"red"});
      }
      else{
        socket.emit('color', {id: socket.id, color:"yellow"});
        clientList[thisClient - 1].emit('color', {id: socket.id, color:"yellow"});
      }
    }
    numClientsConnect++
  })
  

  socket.on('realSocketChess', (testStr) => {
    console.log('someone real joined chess')
    thisClient = numClientsChess
    clientListChess.push(socket)
    if(thisClient%2 == 1){
      let white = Math.floor(Math.random() * 2)
      chessTimers.push({whiteTimer: 600, blackTimer: 600, turn: "white", whoWhite: white == 0 ? thisClient : thisClient - 1})
      socket.emit('error', {id: socket.id, message:"you are two"});
      if(white == 0){
        thisColor = "white"
        socket.emit('color', {id: socket.id, color:"white"});
        clientListChess[thisClient - 1].emit('color', {id: socket.id, color:"white"});
      }
      else{
        thisColor = "black"
        socket.emit('color', {id: socket.id, color:"black"});
        clientListChess[thisClient - 1].emit('color', {id: socket.id, color:"black"});
      }
    }
    numClientsChess++
  })


  socket.on('placePiece', (collumn) => {
    if(i == 0){
      i++
      if (connectTimers[Math.floor(thisClient / 2)].whoRed == thisClient){
        console.log("MADE AN INTERVAL")
       setInterval((() => {
        if(connectTimers[Math.floor(thisClient / 2)].turn == "red"){
          connectTimers[Math.floor(thisClient / 2)].redTimer -= 1
        }
        else{
          connectTimers[Math.floor(thisClient / 2)].yellowTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        socket.emit('timer', {timeRed: connectTimers[Math.floor(thisClient / 2)].redTimer, timeYellow: connectTimers[Math.floor(thisClient / 2)].yellowTimer});
        clientList[other].emit('timer',{timeRed: connectTimers[Math.floor(thisClient / 2)].redTimer, timeYellow: connectTimers[Math.floor(thisClient / 2)].yellowTimer});
      }), 1000)
      console.log("why isn't it working")
      }
    }

    if(connectTimers[Math.floor(thisClient / 2)].turn == "red"){
      connectTimers[Math.floor(thisClient / 2)].turn = "yellow"
    }
    else{
      connectTimers[Math.floor(thisClient / 2)].turn = "red"
    }
    console.log(connectTimers[Math.floor(thisClient / 2)].turn)



    if (thisClient%2 == 0){
      clientList[thisClient + 1].emit('otherPlaced', (collumn))
    }
    else{
      clientList[thisClient - 1].emit('otherPlaced', (collumn))
    }
  })

  let i = 0;

  socket.on('placePieceChess', (data) => {
    if(i == 0){
      i++
      if (chessTimers[Math.floor(thisClient / 2)].whoWhite == thisClient){
         console.log("MADE AN INTERVAL")
       setInterval((() => {
        if(chessTimers[Math.floor(thisClient / 2)].turn == "white"){
          chessTimers[Math.floor(thisClient / 2)].whiteTimer -= 1
        }
        else{
          chessTimers[Math.floor(thisClient / 2)].blackTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        socket.emit('timer', {timeWhite: chessTimers[Math.floor(thisClient / 2)].whiteTimer, timeBlack: chessTimers[Math.floor(thisClient / 2)].blackTimer});
        clientListChess[other].emit('timer',{timeWhite: chessTimers[Math.floor(thisClient / 2)].whiteTimer, timeBlack: chessTimers[Math.floor(thisClient / 2)].blackTimer});
      }), 1000)
      console.log("why isn't it working")
      }
    }

    if(chessTimers[Math.floor(thisClient / 2)].turn == "white"){
      chessTimers[Math.floor(thisClient / 2)].turn = "black"
    }
    else{
      chessTimers[Math.floor(thisClient / 2)].turn = "white"
    }
    console.log(chessTimers[Math.floor(thisClient / 2)].turn)

    if (thisClient%2 == 0){
      clientListChess[thisClient + 1].emit('otherPlaced', (data))
    }
    else{
      clientListChess[thisClient - 1].emit('otherPlaced', (data))
    }
  })

  console.log('new client connected', socket.id);
  socket.emit('user_join', socket.id);

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
    //numClientsConnect--;
  });
});

// httpServer.listen(3000, () => { //we've got 2 servers here this is chaos idk whats goin on
//   console.log(`listening on *:${4000}`);
// });






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