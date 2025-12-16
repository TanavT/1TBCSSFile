import express from 'express';
//import redis from 'redis';
import app from 'express';
// import { createClient } from 'redis';
const app2 = express();
import session from 'express-session';
import configRoutesFunction from './src/routes/index.js';
import cors from 'cors';
import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
import {createServer} from 'http';
//import * as flat from 'flat';
import { v4 as uuid } from 'uuid';
import gameData from './src/routes/gameData.js'
import client from './redis.js'




const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: '*'}});


let checkersSwitcher = 1;
let checkersClientList = [];
let checkersNumClients = 0;
const checkers = io.of("/checkers"); //seperate namespace for checkers to keep logic seperate from Colby's connect4
checkers.on("connection", (socket) => {
  let thisClient;

  numClients++
  thisClient = numClients;
  console.log(thisClient);
  clientList.push(socket);
  if(thisClient == 2){ //2nd player connected, so assign colors
    socket.emit('checkersTest', {id: socket.id, message:"CHECKERS: you are two"});
    let red = Math.floor(Math.random() * 2);
    if(red == 0){
      socket.emit('checkersColor', {id: socket.id, color:"red"}); //to the 2nd connected player
      clientList[0].emit('checkersColor', {id: clientList[1].id, color: "black"}) //to the first connected player
    } else{
      socket.emit('checkersColor', {id: socket.id, color:"black"});
      clientList[0].emit('checkersColor', {id: clientList[1].id, color: "red"})
    }
  } else {
    socket.emit('checkersTest', {id: socket.id, message:"CHECKERS: you are one"});
  }

  socket.on("blackMove", ({row, col}) => { //black moves
    //console.log("black moved. Row: " + row + ", Col: " + col);
      clientList[0].emit("redRecieve", {row: row, col: col});
      clientList[1].emit("redRecieve", {row: row, col: col});
  });
  socket.on("redMove", ({row, col}) => { //black moves
    //console.log("red moved. Row: " + row + ", Col: " + col);
      clientList[0].emit("blackRecieve", {row: row, col: col});
      clientList[1].emit("blackRecieve", {row: row, col: col});
  });
})



let switcher = 1
let numClients = 0


let numClientsConnect = 0

let clientList = []
let clientIDs = []
let connectMatches = []
let connectMatchUpdated = []

let numClientsChess = 0
let clientListChess = []

let chessTimers = []
let connectTimers = []

io.on('connection', (socket) => {
  let thisColor = ""
  let thisClient
  socket.on('realSocketConnect', (userID) => {
    console.log('someone real joined')
    thisClient = numClientsConnect
    clientList.push(socket)
    clientIDs.push(userID)
    if(thisClient%2 == 1){
      let red = Math.floor(Math.random() * 2)
      connectTimers.push({redTimer: 30, yellowTimer: 30, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
      socket.emit('error', {id: socket.id, message:"you are two"});
      const matchID = uuid()
      connectMatches.push(matchID)
      connectMatchUpdated.push(false)
      if(red == 0){
        // console.log(`Client IDS: ${clientIDs[thisClient - 1]}, userID: ${userID}`)
        socket.emit('color', {id: socket.id, color:"red", opponentUserID: clientIDs[thisClient - 1], matchID: matchID});
        clientList[thisClient - 1].emit('color', {id: socket.id, color:"red", opponentUserID: userID, matchID: matchID});
        // console.log('first triggered')
      }
      else{
        // console.log(`Client IDS: ${clientIDs[thisClient - 1]}, userID: ${userID}`)
        socket.emit('color', {id: socket.id, color:"yellow", opponentUserID: clientIDs[thisClient - 1], matchID: matchID});
        clientList[thisClient - 1].emit('color', {id: socket.id, color:"yellow", opponentUserID: userID, matchID: matchID});
        // console.log('second triggered')
      }
    }
    numClientsConnect++
  })
  
  socket.on("gameOverConnect", async ({gameState, userID, opponentUserID, matchID}) => {
    console.log(`UserID: ${userID} Game ended`)
    // socket.emit('error', {id: socket.id, message:`UserID: ${userID}`});
    const index = connectMatches.indexOf(matchID)
    if (index === -1){
      socket.emit('error', {id: socket.id, message:`Match not found: ${matchID}`})
    }
    if (connectMatchUpdated[index] === false) {
      connectMatchUpdated[index] = true //only let one socket message in
      const updatedElos = await gameData.gameOver(userID, opponentUserID, gameState, "connect")
      console.log(updatedElos)
    }
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

app2.use(express.json());
app2.use(express.urlencoded({ extended: true }));

// Allow us to send requests from react to here
app2.use(cors({
  origin: "http://localhost:8080", // frontend URL
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


app2.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
httpServer.listen(4000, () => { //we've got 2 servers here this is chaos idk whats goin on
  console.log(`listening on *:${4000}`);
});
