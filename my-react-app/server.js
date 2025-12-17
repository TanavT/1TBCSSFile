import express from 'express';
//import redis from 'redis';
import app from 'express';
// import { createClient } from 'redis';
import ioServer from './socket.js';
import session from 'express-session';
import configRoutesFunction from './src/routes/index.js';
import cors from 'cors';
import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
import {createServer} from 'http';
import { accounts } from './src/routes/mongo/MongoCollections.js';
//import * as flat from 'flat';
import { v4 as uuid } from 'uuid';
import gameData from './src/routes/gameData.js'
import axios from 'axios';
//import client from './redis.js'

const app2 = express();

app2.set('trust proxy', 1);

app2.use(cors({
  origin: process.env.FRONTEND_CLIENT,
  credentials: true
}));

app2.use(express.json());
app2.use(express.urlencoded({ extended: true }));

app2.use(session({
  name: 'AwesomeWebapp2',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60
  }
}));



const httpServer = createServer(app2);

const io = ioServer(httpServer);


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('Server listening on', PORT);
});

if (process.env){
  console.log(process.title)
} else {
  console.log(".env not detected! The server will not run properly") 
}




//crteating an api to grab users from
app2.get('/api/users/search', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }
        console.log("before accounts collection");
        const accountsCollection = await accounts();
        console.log("after grabbing accounts");
        const result = await accountsCollection.findOne({ username: username });
        console.log("after grabbing results");
        
        res.json(result ? [result] : []);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});


app2.get('/api/users/search', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }
        console.log("before accounts collection");
        const accountsCollection = await accounts();
        console.log("after grabbing accounts");
        const result = await accountsCollection.findOne({ username: username });
        console.log("after grabbing results");
        
        res.json(result ? [result] : []);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

configRoutesFunction(app2);



// const client = createClient();
// client.connect().then(() => {});


//chat message socket
const chat = io.of("/chat");
let chatNumClients = 0;
let chatClientList = [];


chat.on("connection", (socket) => {
  console.log("Chat socket connected:", socket.id);
  
  let thisChatClient;

  socket.on("joinRoom", (roomName, username) => {
    thisChatClient = chatNumClients;
    chatClientList.push(socket);
    
    // player 1 join message
    socket.emit("userJoined", {
      id: socket.id,
      username: username,
      message: thisChatClient % 2 === 0 ? "Waiting for partner..." : ` has joined!`,
      clientNumber: thisChatClient
    });
    
    // player 2 join message
    if (thisChatClient % 2 === 1) {
      chatClientList[thisChatClient - 1].emit("userJoined", {
        id: socket.id,
        username: username,
        message: ` has joined!!`,
        clientNumber: thisChatClient
      });
    }
    
    chatNumClients++;
    console.log(`${socket.id} joined room ${roomName}, client #${thisChatClient}`);
  });

  socket.on("chatMessage", ({ room, username, text }) => {
    // send message only to the paired partner
    if (thisChatClient % 2 === 0) {
      // even numbered client sends to odd numbered client (thisChatClient + 1)
      if (chatClientList[thisChatClient + 1]) {
        chatClientList[thisChatClient + 1].emit("chatMessage", {
          username,
          text
        });
      }
    } else {
      // odd numbered client sends to even numbered client (thisChatClient - 1)
      if (chatClientList[thisChatClient - 1]) {
        chatClientList[thisChatClient - 1].emit("chatMessage", {
          username,
          text
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Chat socket disconnected:", socket.id);
    // notify partner that user disconnected
    if (thisChatClient !== undefined) {
      if (thisChatClient % 2 === 0 && chatClientList[thisChatClient + 1]) {
        chatClientList[thisChatClient + 1].emit("partnerDisconnected", {
          message: "Your partner has disconnected"
        });
      } else if (thisChatClient % 2 === 1 && chatClientList[thisChatClient - 1]) {
        chatClientList[thisChatClient - 1].emit("partnerDisconnected", {
          message: "Your partner has disconnected"
        });
      }
    }
  });
});

let checkersCustomClients = {}
let checkersCustomTimers = {}

let chessCustomClients = {}
let chessCustomTimers = {}

let connectCustomClients = {}
let connectCustomTimers = {}


let switcher = 1
let numClients = 0


let numClientsConnect = 0
let clientList = []
let clientIDs = []
let connectMatches = []
let connectMatchUpdated = []

let numClientsChess = 0
let clientListChess = []

let numClientsCheckers = 0;
let clientListCheckers = [];
let checkersClientIDs = []
let checkersMatches = []
let checkersMatchUpdated = []

let numClientsMania = 0;
let clientListMania = []; //array of objects with sockets
let dataListMania = []; //holds important data for mania matches
let chessClientIDs = []
let chessMatches = []
let chessMatchUpdated = []

let chessTimers = []
let connectTimers = []
let checkersTimers = []
let maniaTimers = []

io.on('connection', (socket) => {
  let thisColor = ""
  let thisClient

  let oppName;
  let myName;

  socket.on("gameDone", ({game, winner}) => {
    if(game == "chess"){
      if(dataListMania[Math.floor(thisClient / 2)].chessWin == null && thisClient % 2 == 1){
        dataListMania[Math.floor(thisClient / 2)].chessWin = winner
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
         if(winner == "white"){
          dataListMania[Math.floor(thisClient / 2)].score += 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score >= 2){
            console.log("1111111111111111111111111")
            clientListMania[thisClient].chess.emit("allOver", "first")
            clientListMania[thisClient].checkers.emit("allOver", "first")
            clientListMania[thisClient].connect.emit("allOver", "first")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "first")
            clientListMania[other].checkers.emit("allOver", "first")
            clientListMania[other].connect.emit("allOver", "first")
          }
         }
          if(winner == "black"){
          dataListMania[Math.floor(thisClient / 2)].score -= 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score <= -2){
            console.log("2222222222222222222222222")
            clientListMania[thisClient].chess.emit("allOver", "second")
            clientListMania[thisClient].checkers.emit("allOver", "second")
            clientListMania[thisClient].connect.emit("allOver", "second")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "second")
            clientListMania[other].checkers.emit("allOver", "second")
            clientListMania[other].connect.emit("allOver", "second")
          }
          }
          if(dataListMania[Math.floor(thisClient / 2)].maxMove == 0){//if all 3 games played
          let tempString
          if(dataListMania[Math.floor(thisClient / 2)].score < 0) tempString = "second"
          if(dataListMania[Math.floor(thisClient / 2)].score > 0) tempString = "first"
          if(dataListMania[Math.floor(thisClient / 2)].score == 0) tempString = "tie"
           clientListMania[thisClient].chess.emit("allOver", tempString)
            clientListMania[thisClient].checkers.emit("allOver", tempString)
            clientListMania[thisClient].connect.emit("allOver", tempString)
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", tempString)
            clientListMania[other].checkers.emit("allOver", tempString)
            clientListMania[other].connect.emit("allOver", tempString)
          }
         
      }
    }

    if(game == "checkers" ){
      if(dataListMania[Math.floor(thisClient / 2)].checkersWin == null && thisClient % 2 == 1){
        dataListMania[Math.floor(thisClient / 2)].checkersWin = winner
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
         if(winner == "black"){
          dataListMania[Math.floor(thisClient / 2)].score += 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score >= 2){
            console.log("3333333333333333333333")
            clientListMania[thisClient].chess.emit("allOver", "first")
            clientListMania[thisClient].checkers.emit("allOver", "first")
            clientListMania[thisClient].connect.emit("allOver", "first")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "first")
            clientListMania[other].checkers.emit("allOver", "first")
            clientListMania[other].connect.emit("allOver", "first")
          }
         }
          if(winner == "red"){
          dataListMania[Math.floor(thisClient / 2)].score -= 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score <= -2){
            console.log("444444444444444444444444")
            clientListMania[thisClient].chess.emit("allOver", "second")
            clientListMania[thisClient].checkers.emit("allOver", "second")
            clientListMania[thisClient].connect.emit("allOver", "second")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "second")
            clientListMania[other].checkers.emit("allOver", "second")
            clientListMania[other].connect.emit("allOver", "second")
          }
          }
          if(dataListMania[Math.floor(thisClient / 2)].maxMove == 0){//if all 3 games played
          let tempString
          if(dataListMania[Math.floor(thisClient / 2)].score < 0) tempString = "second"
          if(dataListMania[Math.floor(thisClient / 2)].score > 0) tempString = "first"
          if(dataListMania[Math.floor(thisClient / 2)].score == 0) tempString = "tie"
           clientListMania[thisClient].chess.emit("allOver", tempString)
            clientListMania[thisClient].checkers.emit("allOver", tempString)
            clientListMania[thisClient].connect.emit("allOver", tempString)
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", tempString)
            clientListMania[other].checkers.emit("allOver", tempString)
            clientListMania[other].connect.emit("allOver", tempString)
          }
      }
    }
    if(game == "connect"){
      if(dataListMania[Math.floor(thisClient / 2)].connectWin == null && thisClient % 2 == 1){
        dataListMania[Math.floor(thisClient / 2)].connectWin = winner
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
        if(winner == "red"){
          dataListMania[Math.floor(thisClient / 2)].score += 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score >= 2){
            console.log("how tf am I here")
            clientListMania[thisClient].chess.emit("allOver", "first")
            clientListMania[thisClient].checkers.emit("allOver", "first")
            clientListMania[thisClient].connect.emit("allOver", "first")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "first")
            clientListMania[other].checkers.emit("allOver", "first")
            clientListMania[other].connect.emit("allOver", "first")
          }
         }
          if(winner == "yellow"){
          dataListMania[Math.floor(thisClient / 2)].score -= 1
          console.log("SCORE SCORE SCORE" + dataListMania[Math.floor(thisClient / 2)].score)
          if(dataListMania[Math.floor(thisClient / 2)].score <= -2){
            console.log("how tf am I here 2.0")
            clientListMania[thisClient].chess.emit("allOver", "second")
            clientListMania[thisClient].checkers.emit("allOver", "second")
            clientListMania[thisClient].connect.emit("allOver", "second")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "second")
            clientListMania[other].checkers.emit("allOver", "second")
            clientListMania[other].connect.emit("allOver", "second")
          }
          }
          if(dataListMania[Math.floor(thisClient / 2)].maxMove == 0){//if all 3 games played
          let tempString
          if(dataListMania[Math.floor(thisClient / 2)].score < 0) tempString = "second"
          if(dataListMania[Math.floor(thisClient / 2)].score > 0) tempString = "first"
          if(dataListMania[Math.floor(thisClient / 2)].score == 0) tempString = "tie"
           clientListMania[thisClient].chess.emit("allOver", tempString)
            clientListMania[thisClient].checkers.emit("allOver", tempString)
            clientListMania[thisClient].connect.emit("allOver", tempString)
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", tempString)
            clientListMania[other].checkers.emit("allOver", tempString)
            clientListMania[other].connect.emit("allOver", tempString)
          }
      }
    }
  });

  let fun = true;

   socket.on('chessCustomConnect', ({me, opp}) => {

    oppName = opp;
    myName = me;
    chessCustomClients[me] = socket;

    if(chessCustomClients[opp]) {
      const roomName = `${me}-${opp}`;
      socket.join(roomName);

      chessCustomClients[opp].join(roomName);

      let white = Math.floor(Math.random() * 2)
      chessCustomTimers[roomName] = ({whiteTimer: 600, blackTimer: 600, turn: "white", whoWhite: white == 0 ? opp : me})
      if(white == 0){
        chessCustomClients[me].emit('color', {id:chessCustomClients[me].id, color:"white" });
        chessCustomClients[opp].emit('color', {id:chessCustomClients[opp].id, color:"black"})
      }
      else{
        chessCustomClients[me].emit('color', {id:chessCustomClients[me].id, color:"white" });
        chessCustomClients[opp].emit('color', {id:chessCustomClients[opp].id, color:"black"})
      }
    }

  })

  socket.on('customJoinConnect', ({me, opp}) => {
    connectCustomClients[me] = socket;

    oppName = opp;
    myName = me;

    if(connectCustomClients[opp]) {
      const roomName = `${me}-${opp}`; 
      socket.join(roomName);
      connectCustomClients[opp].join(roomName);

      let red = Math.floor(Math.random() * 2)
      console.log("making custom timer");
      connectCustomTimers[roomName] = ({redTimer: 300, yellowTimer: 300, turn: "red", whoRed: red == 0 ? me : opp})
      if (red == 0){
        connectCustomClients[me].emit('color', {id:connectCustomClients[me].id, color:"red" });
        connectCustomClients[opp].emit('color', {id:connectCustomClients[opp].id, color:"yellow"})
      } else {
        connectCustomClients[me].emit('color', {id:connectCustomClients[me].id, color:"yellow" });
        connectCustomClients[opp].emit('color', {id: connectCustomClients[opp].id, color:"red"})
      }
      console.log(connectCustomTimers[roomName]);
    }
  })

  socket.on('checkersCustomConnect', ({me, opp}) => {
    checkersCustomClients[me] = socket;
    console.log("custom join. " + me + " vs " + opp);

    oppName = opp;
    myName = me;

    if(checkersCustomClients[opp]) {
      console.log("start the showdown");
      const roomName = `${me}-${opp}`; 
      socket.join(roomName);
      checkersCustomClients[opp].join(roomName);

      let red = Math.floor(Math.random() * 2)
      console.log("making custom timer");
      checkersCustomTimers[roomName] = ({redTimer: 300, blackTimer: 300, turn: "red", whoRed: red == 0 ? me : opp})
      if (red == 0){
        checkersCustomClients[me].emit('checkersColor', {id:checkersCustomClients[me].id, color:"red" });
        checkersCustomClients[opp].emit('checkersColor', {id:checkersCustomClients[opp].id, color:"black"})
      } else {
        checkersCustomClients[me].emit('checkersColor', {id:checkersCustomClients[me].id, color:"black" });
        checkersCustomClients[opp].emit('checkersColor', {id: checkersCustomClients[opp].id, color:"red"})
      }
      console.log(checkersCustomTimers[roomName]);
    }
  })

  
  socket.on('checkersCustomBlackMove', ({row,col, me, opp}) => {
    console.log("blackMove");
    let roomName = `${me}-${opp}`; 
    if(!checkersCustomTimers[roomName]){
      console.log("   no timer?");
      console.log("      " + roomName);
      console.log(checkersCustomTimers[roomName]);
      roomName = `${opp}-${me}`;
    }

    if(!checkersCustomTimers[roomName]){
      console.log("   STILL no timer?");
      console.log("      " + roomName);
      console.log(checkersCustomTimers[roomName]);
    }

    
    console.log("custom black move");

    if(i == 0){
      //console.log("whjat");
      i++
      //if (checkersTimers[Math.floor(thisClient / 2)].whoRed == thisClient){
        //console.log("MADE AN INTERVAL")
       checkersCustomTimers[roomName].interval = setInterval((() => {
        //console.log("timer");
        if(checkersCustomTimers[roomName].turn == "red"){
          checkersCustomTimers[roomName].redTimer -= 1
        }
        else{
          checkersCustomTimers[roomName].blackTimer -= 1
        }
        //let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        io.to(roomName).emit('timer', {timeRed: checkersCustomTimers[roomName].redTimer, timeBlack: checkersCustomTimers[roomName].blackTimer});
        //clientListCheckers[other].emit('timer',{timeRed: checkersTimers[Math.floor(thisClient / 2)].redTimer, timeBlack: checkersTimers[Math.floor(thisClient / 2)].blackTimer});
      }), 1000)
      console.log("why isn't it working")
      //}
    }


    
    if(!fun){
      console.log("flipping");
      if(checkersCustomTimers[roomName].turn == "red"){
        console.log("flipped to black");
        checkersCustomTimers[roomName].turn = "black"
      }
      else{
        console.log("flipped to red");
        checkersCustomTimers[roomName].turn = "red"
      }
      fun = !fun;
    } else {
      console.log("not flipping");
      fun = !fun;
    }
    
    //checkersCustomTimers[roomName].turn)


    io.to(roomName).emit("redRecieve", {row: row, col: col});
  
  })

  socket.on('checkersCustomRedMove', ({row,col, me, opp}) => {
    let roomName = `${me}-${opp}`; 
    if(!checkersCustomTimers[roomName]){
      console.log("no timer?");
      console.log(roomName);
      console.log(checkersCustomTimers[roomName]);
      roomName = `${opp}-${me}`;
    }
      
    if(!checkersCustomTimers[roomName]){
      console.log("STILL no timer?");
      console.log(roomName);
      console.log(checkersCustomTimers[roomName]);
    }

    

    if(checkersCustomTimers[roomName].turn == "red"){
      checkersCustomTimers[roomName].turn = "black"
    }
    else{
      checkersCustomTimers[roomName].turn = "red"
    }
    //checkersCustomTimers[roomName].turn)

    if(!fun){
      if(checkersCustomTimers[roomName].turn == "red"){
        console.log("flipped to black");
        checkersCustomTimers[roomName].turn = "black"
      }
      else{
        console.log("flipped to red");
        checkersCustomTimers[roomName].turn = "red"
      }
      fun = !fun
    } else {
      fun = !fun;
    }

    io.to(roomName).emit("blackRecieve", {row: row, col: col});
  })

  socket.on('customConnectPlacePiece', ({collumn, me, opp}) => {
    console.log("custom move");
    let roomName = `${me}-${opp}`; 
    if(!connectCustomTimers[roomName]){
      //console.log("   no timer?");
      //console.log("      " + roomName);
      //console.log(chessCustomTimers[roomName]);
      roomName = `${opp}-${me}`;
    }

    if(!connectCustomTimers[roomName]){
      //console.log("   STILL no timer?");
      //console.log("      " + roomName);
      //console.log(chessCustomTimers[roomName]);
    }

    if(i == 0){
      i++
      console.log("bazinga!");
      console.log(myName);
      if(connectCustomTimers[roomName].whoRed == myName){ 
         console.log("weird ass interval");
        connectCustomTimers[roomName].interval = setInterval((() => {
          if(connectCustomTimers[roomName].turn == "red"){
            //console.log("red");
            connectCustomTimers[roomName].redTimer -= 1
          } else{
            //console.log("yelloq");
            connectCustomTimers[roomName].yellowTimer -= 1
          }
          io.to(roomName).emit('timer', {timeRed: connectCustomTimers[roomName].redTimer, timeYellow: connectCustomTimers[roomName].yellowTimer});
        }), 1000)
      }
      //console.log("why isn't it working")
      //}
    }


    
      if(connectCustomTimers[roomName].turn == "red"){
        //console.log("flipped to black");
        connectCustomTimers[roomName].turn = "yellow"
      }
      else{
        //console.log("flipped to white");
        connectCustomTimers[roomName].turn = "red"
      }
    
    //checkersCustomTimers[roomName].turn)


    //io.to(roomName).emit("customOtherPlaced", (collumn));
    connectCustomClients[opp].emit("customOtherPlaced", (collumn));
  
  })

  socket.on('customPlacePieceChess', (data) => {
    //console.log("blackMove");
    let roomName = `${data.me}-${data.opp}`; 
    if(!chessCustomTimers[roomName]){
      //console.log("   no timer?");
      //console.log("      " + roomName);
      //console.log(chessCustomTimers[roomName]);
      roomName = `${data.opp}-${data.me}`;
    }

    if(!chessCustomTimers[roomName]){
      //console.log("   STILL no timer?");
      //console.log("      " + roomName);
      //console.log(chessCustomTimers[roomName]);
    }

    
    //console.log("custom black move");
    //console.log(i);
    if(i == 0){
      i++
      //console.log(chessCustomTimers[roomName])
      if(chessCustomTimers[roomName].whoWhite == myName){ 
        //console.log(i);
        //console.log("weird ass interval");
        chessCustomTimers[roomName].interval = setInterval((() => {
          if(chessCustomTimers[roomName].turn == "white"){
            chessCustomTimers[roomName].whiteTimer -= 1
          }
          else{
            chessCustomTimers[roomName].blackTimer -= 1
          }
          io.to(roomName).emit('timer', {timeWhite: chessCustomTimers[roomName].whiteTimer, timeBlack: chessCustomTimers[roomName].blackTimer});
        }), 1000)
        //console.log("why isn't it working")
        //}
      }
    }


    

    if(chessCustomTimers[roomName].turn == "white"){
      //console.log("flipped to black");
      chessCustomTimers[roomName].turn = "black"
    }
    else{
      //console.log("flipped to white");
      chessCustomTimers[roomName].turn = "white"
    }

    
    //console.log(chessCustomTimers[roomName]);

    chessCustomClients[oppName].emit("otherPlaced", (data));
    //io.to(roomName).emit("otherPlaced", (data));
  
  })

  

  socket.on('realSocketCheckers', (userID) => {
    console.log('someone real connected to checkers')
    thisClient = numClientsCheckers
    clientListCheckers.push(socket)
    checkersClientIDs.push(userID)
    if(thisClient%2 == 1){
      let red = Math.floor(Math.random() * 2)
      checkersTimers.push({redTimer: 300, blackTimer: 300, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
      const matchID = uuid()
      checkersMatches.push(matchID)
      checkersMatchUpdated.push(false)
      if (red == 0){
        socket.emit('checkersColor', {id:socket.id, color:"red", userID: userID, opponentUserID: checkersClientIDs[thisClient - 1], matchID: matchID});
        clientListCheckers[thisClient-1].emit('checkersColor', {id:socket.id, color:"black", userID: checkersClientIDs[thisClient - 1], opponentUserID: userID, matchID: matchID})
      } else {
        socket.emit('checkersColor', {id:socket.id, color:"black", userID: userID, opponentUserID: checkersClientIDs[thisClient - 1], matchID: matchID});
        clientListCheckers[thisClient-1].emit('checkersColor', {id: socket.id, color:"red", userID: checkersClientIDs[thisClient - 1], opponentUserID: userID, matchID: matchID})
      }
    }
    numClientsCheckers++;
  })
    socket.on("gameOverCheckers", async ({gameState, userID, opponentUserID, matchID}) => {
    console.log(`UserID: ${userID} Game ended`)
    // socket.emit('error', {id: socket.id, message:`UserID: ${userID}`});
    const index = checkersMatches.indexOf(matchID)
    if (index === -1){
      socket.emit('error', {id: socket.id, message:`Match not found: ${matchID}`})
      return
    }
    if (checkersMatchUpdated[index] === false) {
      checkersMatchUpdated[index] = true //only let one socket message in
      const updatedElos = await gameData.gameOver(userID, opponentUserID, gameState, "checkers")
      console.log(updatedElos)
    }
  })

  socket.on('realSocketConnect', (userID) => {
    console.log('someone real joined')
    thisClient = numClientsConnect
    clientList.push(socket)
    clientIDs.push(userID)
    if(thisClient%2 == 1){
      let red = Math.floor(Math.random() * 2)
      connectTimers.push({redTimer: 300, yellowTimer: 300, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
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

  socket.on('realSocketConnectMania', (testStr) => {
    console.log(socket.id)
    console.log('someone real joined mania')
    thisClient = numClientsMania
    clientListMania.push({connect: socket, chess: null, checkers: null, user: testStr})
    numClientsMania++
  })
  socket.on('realSocketChessMania', (testStr) => {
    console.log("user " + testStr.username)
    console.log(socket.id)
    console.log('someone real joined mania 2')
    for(let i = 0; i < clientListMania.length; i++){ //basically trying to solve concurrency issues
      if(clientListMania[i].chess == null && clientListMania[i].user.username == testStr.username){
        clientListMania[i].chess = socket
        thisClient = i
        console.log("client client " + thisClient)
        console.log("length length " + clientListMania.length)
        break
      }
    }
  })
  socket.on('realSocketCheckersMania',  (testStr) => {
    console.log("user " + testStr.username)
    console.log(socket.id)
    console.log('someone real joined mania 3')
    for(let i = 0; i < clientListMania.length; i++){ //basically trying to solve concurrency issues
      if(clientListMania[i].checkers == null && clientListMania[i].user.username == testStr.username){
        clientListMania[i].checkers = socket
        thisClient = i
       console.log("client client " + thisClient)
        console.log("length length " + clientListMania.length)
        break
      }
    }
    console.log("client client " + thisClient)
    console.log("length length " + clientListMania.length)

    let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
    if((thisClient%2 == 1 && clientListMania[thisClient - 1] && clientListMania[thisClient - 1].chess !== null && clientListMania[thisClient - 1].checkers !== null && clientListMania[thisClient - 1].connect !== null) || (thisClient % 2 == 0 && clientListMania[thisClient + 1] && clientListMania[thisClient + 1].chess !== null && clientListMania[thisClient + 1].checkers !== null && clientListMania[thisClient + 1].connect !== null)){
      let first = Math.floor(Math.random() * 2)
      maniaTimers.push({firstTimer: 600, secondTimer: 600, turn: "first", whoFirst: first == 0 ? thisClient : thisClient - 1})
      dataListMania.push({moveOfThree: 0, maxMove: 3, connectWin: null, chessWin: null, checkersWin: null, score: 0})
      //socket.emit('error', {id: socket.id, message:"you are two"});
      if(first == 0){
        clientListMania[thisClient].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"white"});
        clientListMania[thisClient].checkers.emit('checkersColor', {id: socket.id, color:"black"});
        clientListMania[thisClient].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"red"});
        clientListMania[other].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"white"});
        clientListMania[other].checkers.emit('checkersColor', {id: socket.id, color:"red"});
        clientListMania[other].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"red"});
      }
      else{
       clientListMania[thisClient].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"black"});
        clientListMania[thisClient].checkers.emit('checkersColor', {id: socket.id, color:"red"});
        clientListMania[thisClient].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"yellow"});
        clientListMania[other].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"black"});
        clientListMania[other].checkers.emit('checkersColor', {id: socket.id, color:"black"});
        clientListMania[other].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"yellow"});
      }
    }


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

  socket.on('realSocketChess', (userID) => {
    console.log('someone real joined chess')
    thisClient = numClientsChess
    clientListChess.push(socket)
    chessClientIDs.push(userID)
    if(thisClient%2 == 1){
      let white = Math.floor(Math.random() * 2)
      chessTimers.push({whiteTimer: 600, blackTimer: 600, turn: "white", whoWhite: white == 0 ? thisClient : thisClient - 1})
      socket.emit('error', {id: socket.id, message:"you are two"});
      const matchID = uuid()
      chessMatches.push(matchID)
      console.log(`MatchID ${matchID}`)
      chessMatchUpdated.push(false)
      if(white == 0){
        thisColor = "white"
        socket.emit('color', {id: socket.id, color:"white", userID: userID, opponentUserID: chessClientIDs[thisClient - 1], matchID: matchID});
        clientListChess[thisClient - 1].emit('color', {id: socket.id, color:"white", userID: chessClientIDs[thisClient - 1], opponentUserID: userID, matchID: matchID});
      }
      else{
        thisColor = "black"
        socket.emit('color', {id: socket.id, color:"black", opponentUserID: chessClientIDs[thisClient - 1], matchID: matchID});
        clientListChess[thisClient - 1].emit('color', {id: socket.id, color:"black", opponentUserID: userID, matchID: matchID});
      }
    }
    numClientsChess++
  })

  socket.on("gameOverChess", async ({gameState, userID, opponentUserID, matchID}) => {
    console.log(`UserID: ${userID} Game ended`)
    // socket.emit('error', {id: socket.id, message:`UserID: ${userID}`});
    const index = chessMatches.indexOf(matchID)
    if (index === -1){
      socket.emit('error', {id: socket.id, message:`Match not found: ${matchID}`})
      return
    }
    if (chessMatchUpdated[index] === false) {
      chessMatchUpdated[index] = true //only let one socket message in
      const updatedElos = await gameData.gameOver(userID, opponentUserID, gameState, "chess")
      console.log(updatedElos)
    }
  })

  
  let i = 0;

  socket.on('blackMoveMania', ({row, col}) => {
    console.log("HELL      AAAH");
    console.log(i);
    console.log("moveOfThree: " + dataListMania[Math.floor(thisClient / 2)].moveOfThree)
    if(i == 0){
      console.log("whjat");
      i++
      if (dataListMania[Math.floor(thisClient / 2)].moveOfThree == 2){
        console.log("MADE AN INTERVAL")
       setInterval((() => {
        //console.log("timer");
        if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
          maniaTimers[Math.floor(thisClient / 2)].secondTimer -= 1
        }
        else{
          maniaTimers[Math.floor(thisClient / 2)].firstTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        clientListMania[thisClient].chess.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].chess.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].connect.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].connect.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].checkers.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].checkers.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
      }), 1000)
      console.log("why isn't it working")
      }
    }
    

    if(!fun){
      dataListMania[Math.floor(thisClient / 2)].moveOfThree += 1
      console.log("flipping");
      if(dataListMania[Math.floor(thisClient / 2)].moveOfThree >= dataListMania[Math.floor(thisClient / 2)].maxMove){
        console.log("flippy floppy turn checkers")
        dataListMania[Math.floor(thisClient / 2)].moveOfThree = 0
      if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
        console.log("flipped to black");
        maniaTimers[Math.floor(thisClient / 2)].turn = "first"
      }
      else{
        console.log("flipped to red");
        maniaTimers[Math.floor(thisClient / 2)].turn = "second"
      }

      if(maniaTimers[Math.floor(thisClient / 2)].turn == "first"){
         console.log("it da first")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other2 = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
        clientListMania[other2].chess.emit('yourTurn', "notYourTurn")
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
         clientListMania[firstClientNum].chess.emit('yourTurn', "notYourTurn")
        clientListMania[other].chess.emit('yourTurn', null)
        clientListMania[other].checkers.emit('yourTurn', null)
        clientListMania[other].connect.emit('yourTurn', null)
      }
    }
      fun = !fun;
    } else {
      console.log("not flipping");
      fun = !fun;
    }
    
    //console.log(checkersTimers[Math.floor(thisClient / 2)].turn)

    if (thisClient%2 == 0){
      clientListMania[thisClient + 1].checkers.emit("redRecieve", {row: row, col: col});
    }
    else{
      clientListMania[thisClient - 1].checkers.emit("redRecieve", {row: row, col: col});
    }
  })

  socket.on('blackMove', ({row, col}) => {
    console.log("HELL      AAAH");
    console.log(i);
    if(i == 0){
      console.log("whjat");
      i++
      //if (checkersTimers[Math.floor(thisClient / 2)].whoRed == thisClient){
        console.log("MADE AN INTERVAL")
       setInterval((() => {
        //console.log("timer");
        if(checkersTimers[Math.floor(thisClient / 2)].turn == "red"){
          checkersTimers[Math.floor(thisClient / 2)].redTimer -= 1
        }
        else{
          checkersTimers[Math.floor(thisClient / 2)].blackTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        socket.emit('timer', {timeRed: checkersTimers[Math.floor(thisClient / 2)].redTimer, timeBlack: checkersTimers[Math.floor(thisClient / 2)].blackTimer});
        clientListCheckers[other].emit('timer',{timeRed: checkersTimers[Math.floor(thisClient / 2)].redTimer, timeBlack: checkersTimers[Math.floor(thisClient / 2)].blackTimer});
      }), 1000)
      console.log("why isn't it working")
      //}
    }


    if(!fun){
      console.log("flipping");
      if(checkersTimers[Math.floor(thisClient / 2)].turn == "red"){
        console.log("flipped to black");
        checkersTimers[Math.floor(thisClient / 2)].turn = "black"
      }
      else{
        console.log("flipped to red");
        checkersTimers[Math.floor(thisClient / 2)].turn = "red"
      }
      fun = !fun;
    } else {
      console.log("not flipping");
      fun = !fun;
    }
    
    console.log(checkersTimers[Math.floor(thisClient / 2)].turn)

    if (thisClient%2 == 0){
      clientListCheckers[thisClient + 1].emit("redRecieve", {row: row, col: col});
    }
    else{
      clientListCheckers[thisClient - 1].emit("redRecieve", {row: row, col: col});
    }
  })

  socket.on('redMove', ({row, col}) => {


    if(!fun){
      if(checkersTimers[Math.floor(thisClient / 2)].turn == "red"){
        console.log("flipped to black");
        checkersTimers[Math.floor(thisClient / 2)].turn = "black"
      }
      else{
        console.log("flipped to red");
        checkersTimers[Math.floor(thisClient / 2)].turn = "red"
      }
      fun = !fun
    } else {
      fun = !fun;
    }

    if (thisClient%2 == 0){
      clientListCheckers[thisClient + 1].emit("blackRecieve", {row: row, col: col});
    }
    else{
      clientListCheckers[thisClient - 1].emit("blackRecieve", {row: row, col: col});
    }
  })


  socket.on('redMoveMania', ({row, col}) => {

       console.log("moveOfThree: " + dataListMania[Math.floor(thisClient / 2)].moveOfThree)

    if(!fun){
      dataListMania[Math.floor(thisClient / 2)].moveOfThree += 1
      if(dataListMania[Math.floor(thisClient / 2)].moveOfThree >= dataListMania[Math.floor(thisClient / 2)].maxMove){
        dataListMania[Math.floor(thisClient / 2)].moveOfThree = 0
        console.log("flippy floppy turn checkers")
      if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
        console.log("flipped to black");
        maniaTimers[Math.floor(thisClient / 2)].turn = "first"
      }
      else{
        console.log("flipped to red");
        maniaTimers[Math.floor(thisClient / 2)].turn = "second"
      }

      if(maniaTimers[Math.floor(thisClient / 2)].turn == "first"){
         console.log("it da first")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
         let other2 = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
        clientListMania[other2].chess.emit('yourTurn', "notYourTurn")
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
          clientListMania[firstClientNum].chess.emit('yourTurn', "notYourTurn")
        clientListMania[other].chess.emit('yourTurn', null)
        clientListMania[other].checkers.emit('yourTurn', null)
        clientListMania[other].connect.emit('yourTurn', null)
      }
    }
      fun = !fun
    } else {
      fun = !fun;
    }

    if (thisClient%2 == 0){
      clientListMania[thisClient + 1].checkers.emit("blackRecieve", {row: row, col: col});
    }
    else{
      clientListMania[thisClient - 1].checkers.emit("blackRecieve", {row: row, col: col});
    }
  })


  socket.on('placePiece', (collumn) => {
    console.log("got a piece to place")
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
        clientList[other].emit('timer',{timeRed: connectTimers[Math.floor(thisClient / 2)].redTimer, timeYellow: connectTimers[Math.floor(thisClient / 2)].yellowTimer}); //logic for figuring out the other client in the room
        //check only if the other exists
        //comment logs on servers and where response is handled
        //something with checkers not working because clashing variables
        //dont run checkers at ALL after server starting
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

  socket.on('placePieceMania', (collumn) => {//this is for connect-4
     console.log("moveOfThree: " + dataListMania[Math.floor(thisClient / 2)].moveOfThree)
    dataListMania[Math.floor(thisClient / 2)].moveOfThree += 1
    if(i == 0){
      i++
      if (maniaTimers[Math.floor(thisClient / 2)].whoFirst == thisClient){
        if (dataListMania[Math.floor(thisClient / 2)].moveOfThree == 3){
        console.log("MADE AN INTERVAL")
       setInterval((() => {
        //console.log("timer");
        if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
          maniaTimers[Math.floor(thisClient / 2)].secondTimer -= 1
        }
        else{
          maniaTimers[Math.floor(thisClient / 2)].firstTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        clientListMania[thisClient].chess.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].chess.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].connect.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].connect.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].checkers.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].checkers.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
      }), 1000)
      console.log("why isn't it working")
      }
       }
    }

    if(dataListMania[Math.floor(thisClient / 2)].moveOfThree >= dataListMania[Math.floor(thisClient / 2)].maxMove){
        dataListMania[Math.floor(thisClient / 2)].moveOfThree = 0
        console.log("flippy floppy turn connect")
      if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
        console.log("flipped to black");
        maniaTimers[Math.floor(thisClient / 2)].turn = "first"
      }
      else{
        console.log("flipped to red");
        maniaTimers[Math.floor(thisClient / 2)].turn = "second"
      }

      if(maniaTimers[Math.floor(thisClient / 2)].turn == "first"){
        console.log("it da first")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
         let other2 = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
        clientListMania[other2].chess.emit('yourTurn', "notYourTurn")
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
          clientListMania[firstClientNum].chess.emit('yourTurn', "notYourTurn")
        clientListMania[other].chess.emit('yourTurn', null)
        clientListMania[other].checkers.emit('yourTurn', null)
        clientListMania[other].connect.emit('yourTurn', null)
      }
    }



    if (thisClient%2 == 0){
      clientListMania[thisClient + 1].connect.emit('otherPlaced', (collumn))
    }
    else{
      clientListMania[thisClient - 1].connect.emit('otherPlaced', (collumn))
    }
  })

  socket.on('placePieceChessMania', (data) => {
       console.log("moveOfThree: " + dataListMania[Math.floor(thisClient / 2)].moveOfThree)
    dataListMania[Math.floor(thisClient / 2)].moveOfThree += 1
    if(i == 0){
      i++
      if (maniaTimers[Math.floor(thisClient / 2)].whoFirst == thisClient){
         if (dataListMania[Math.floor(thisClient / 2)].moveOfThree >= 3){
        console.log("MADE AN INTERVAL")
       setInterval((() => {
        //console.log("timer");
        if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
          maniaTimers[Math.floor(thisClient / 2)].secondTimer -= 1
        }
        else{
          maniaTimers[Math.floor(thisClient / 2)].firstTimer -= 1
        }
        let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
        //console.log("OTHER OTHER OTHER " + other)
        clientListMania[thisClient].chess.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].chess.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].connect.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].connect.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
         clientListMania[thisClient].checkers.emit('timer', {timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
        clientListMania[other].checkers.emit('timer',{timeSecond: maniaTimers[Math.floor(thisClient / 2)].secondTimer, timeFirst: maniaTimers[Math.floor(thisClient / 2)].firstTimer});
      }), 1000)
      }
      console.log("why isn't it working")
      }
    }

   if(dataListMania[Math.floor(thisClient / 2)].moveOfThree == dataListMania[Math.floor(thisClient / 2)].maxMove){
      console.log("flippy floppy turn chess")
      dataListMania[Math.floor(thisClient / 2)].moveOfThree = 0
      if(maniaTimers[Math.floor(thisClient / 2)].turn == "second"){
        console.log("flipped to black");
        maniaTimers[Math.floor(thisClient / 2)].turn = "first"
      }
      else{
        console.log("flipped to red");
        maniaTimers[Math.floor(thisClient / 2)].turn = "second"
      }

      console.log("???chess")
      if(maniaTimers[Math.floor(thisClient / 2)].turn == "first"){
        console.log('it da first')
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
         let other2 = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
        clientListMania[other2].chess.emit('yourTurn', "notYourTurn")
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
        console.log('it da second')
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
          clientListMania[firstClientNum].chess.emit('yourTurn', "notYourTurn")
        clientListMania[other].chess.emit('yourTurn', null)
        clientListMania[other].checkers.emit('yourTurn', null)
        clientListMania[other].connect.emit('yourTurn', null)
      }
    }

    if (thisClient%2 == 0){
      clientListMania[thisClient + 1].chess.emit('otherPlaced', (data))
    }
    else{
      clientListMania[thisClient - 1].chess.emit('otherPlaced', (data))
    }
  })

  console.log('new client connected', socket.id);
  socket.emit('user_join', socket.id);

  // socket.on('user_join', (name) => {
  //   console.log('A user joined their name is ' + name);
  //   socket.broadcast.emit('user_join', name);
  // });



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


  socket.on('user_join', (name) => {
    console.log('A user joined their name is ' + name);
    socket.broadcast.emit('user_join', name);
  });

  socket.on('test', (a) => {
    console.log(socket.id);
    //io.emit('message', {name, message});
  });

 socket.on('disconnect', async() => {
    console.log('Disconnect Fired on ' + socket.id);
    for(const [username, userSocket] of Object.entries(checkersCustomClients)) {
      if(userSocket.id === socket.id){
        delete checkersCustomClients[username];
        console.log("removed from client list");
        console.log("opponent name was" + oppName);

        try {
          const response2 = await axios.post(
              'http://localhost:3000/account/unchallenge',
              {
                  from: myName, 
                  to: oppName
              },
              { withCredentials: true}
          ); 
        } catch (e) {
          console.log("oh that was already accepted");
        }
        
      }
    }

    for(const [roomName, timer] of Object.entries(checkersCustomTimers)) {
      console.log(roomName);
      console.log(timer);
      if (timer.whoRed === myName || timer.whoRed === oppName) {
        clearInterval(timer.interval);
        delete checkersCustomTimers[roomName];
        console.log("removed from timer")
      }
    }

    for(const [username, userSocket] of Object.entries(chessCustomClients)) {
      if(userSocket.id === socket.id){
        delete chessCustomClients[username];
        console.log("removed from client list")

        try {
          const response2 = await axios.post(
              'http://localhost:3000/account/unchallengeChess',
              {
                  from: myName, 
                  to: oppName
              },
              { withCredentials: true}
          ); 
        } catch (e) {
          console.log("oh that chess was already accepted");
        }
      }
    }

    for(const [roomName, timer] of Object.entries(chessCustomTimers)) {
      if (timer.whoWhite === myName || timer.whoWhite == oppName) {
        clearInterval(timer.interval);
        delete chessCustomTimers[roomName];
        console.log("removed chess from timer")
        console.log(chessCustomTimers);
      }
    }

    for(const [username, userSocket] of Object.entries(connectCustomClients)) {
      if(userSocket.id === socket.id){
        delete connectCustomClients[username];
        console.log("removed from client list")

        try {
          const response2 = await axios.post(
              'http://localhost:3000/account/unchallengeConnect',
              {
                  from: myName, 
                  to: oppName
              },
              { withCredentials: true}
          ); 
        } catch (e) {
          console.log("oh that connect was already accepted");
        }
      }
    }

    for(const [roomName, timer] of Object.entries(connectCustomTimers)) {
      if (timer.whoRed === myName || timer.whoRed == oppName) {
        clearInterval(timer.interval);
        delete connectCustomTimers[roomName];
        console.log("removed from timer")
      }
    }
    //numClientsConnect--;
  });
});







