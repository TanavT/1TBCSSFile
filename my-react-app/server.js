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
console.log("CORS origin:", process.env.FRONTEND_CLIENT);
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
const PORT = process.env.PORT || 3000;
const httpServer = app2.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on ${process.env.VITE_BACKEND_SERVER}`);
});

const client = createClient({
  socket: {
    host: process.env.REDIS_URL,
    port: Number(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PASSWORD
});

client.connect().catch(console.error);
const io = new Server(httpServer, {cors: {
    origin: process.env.FRONTEND_CLIENT,
    methods: ["GET", "POST"],
    credentials: true
  }});

let checkersCustomClients = {}


let switcher = 1
let numClients = 0


let numClientsConnect = 0
let clientList = []

let numClientsChess = 0
let clientListChess = []

let numClientsCheckers = 0;
let clientListCheckers = [];

let numClientsMania = 0;
let clientListMania = []; //array of objects with sockets
let dataListMania = []; //holds important data for mania matches

let chessTimers = []
let connectTimers = []
let checkersTimers = []
let maniaTimers = []

io.on('connection', (socket) => {
  // switcher = 1-switcher
  let thisClient

  socket.on("gameDone", ({game, winner}) => {
    if(game == "chess")
      if(dataListMania[Math.floor(thisClient / 2)].chessWin == null){
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
         dataListMania[Math.floor(thisClient / 2)].chessWin = winner
         if(winner == "white"){
          dataListMania[Math.floor(thisClient / 2)].score += 1
          if(dataListMania[Math.floor(thisClient / 2)].score >= 2){
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
          if(dataListMania[Math.floor(thisClient / 2)].score <= -2){
            clientListMania[thisClient].chess.emit("allOver", "second")
            clientListMania[thisClient].checkers.emit("allOver", "second")
            clientListMania[thisClient].connect.emit("allOver", "second")
            let other = (thisClient - 1) + (((thisClient + 1)%2) * 2)
            clientListMania[other].chess.emit("allOver", "second")
            clientListMania[other].checkers.emit("allOver", "second")
            clientListMania[other].connect.emit("allOver", "second")
          }
          if(dataListMania[Math.floor(thisClient / 2)].moveOfThree == 0){//if all 3 games played
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
    if(game == "checkers")
      if(dataListMania[Math.floor(thisClient / 2)].checkersWin == null){
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
         dataListMania[Math.floor(thisClient / 2)].checkersWin = winner
      }
    if(game == "connect")
      if(dataListMania[Math.floor(thisClient / 2)].connectWin == null){
        dataListMania[Math.floor(thisClient / 2)].maxMove -= 1
        dataListMania[Math.floor(thisClient / 2)].moveOfThree -= 1
         dataListMania[Math.floor(thisClient / 2)].connectWin = winner
      }
  });

  let fun = true;

  socket.on('checkersCustomConnect', ({me, opp}) => {
    checkersCustomClients[me] = socket;

    if(checkersCustomClients[opp]) {
      const roomName = `${me}-${opp}`; 
      socket.join(roomName);
      checkersCustomClients[opp].join(roomName);

      let red = Math.floor(Math.random() * 2)
      //checkersTimers.push({redTimer: 300, blackTimer: 300, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
      if (red == 0){
        checkersCustomClients[me].emit('checkersColor', {id:checkersCustomClients[me].id, color:"red" });
        checkersCustomClients[opp].emit('checkersColor', {id:checkersCustomClients[opp].id, color:"black"})
      } else {
        checkersCustomClients[opp].emit('checkersColor', {id:checkersCustomClients[me].id, color:"black" });
        checkersCustomClients[me].emit('checkersColor', {id: checkersCustomClients[opp].id, color:"red"})
      }
    }
  })

  socket.on('realSocketCheckers', (teststr) => {
    console.log('someone real connected to checkers')
    thisClient = numClientsCheckers
    clientListCheckers.push(socket)
    if(thisClient%2 == 1){
      let red = Math.floor(Math.random() * 2)
      checkersTimers.push({redTimer: 300, blackTimer: 300, turn: "red", whoRed: red == 0 ? thisClient : thisClient - 1})
      if (red == 0){
        socket.emit('checkersColor', {id:socket.id, color:"red" });
        clientListCheckers[thisClient-1].emit('checkersColor', {id:socket.id, color:"black"})
      } else {
        socket.emit('checkersColor', {id:socket.id, color:"black" });
        clientListCheckers[thisClient-1].emit('checkersColor', {id: socket.id, color:"red"})
      }
    }
    numClientsCheckers++;
  })

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

  socket.on('realSocketConnectMania', (testStr) => {
    console.log(socket.id)
    console.log('someone real joined mania')
    thisClient = numClientsMania
    clientListMania.push({connect: socket, chess: null, checkers: null})
    numClientsMania++
  })
  socket.on('realSocketChessMania', (testStr) => {
    console.log(socket.id)
    console.log('someone real joined mania 2')
    for(let i = 0; i < clientListMania.length; i++){ //basically trying to solve concurrency issues
      if(clientListMania[i].chess == null){
        clientListMania[i].chess = socket
        thisClient = i
        console.log("client client " + thisClient)
        console.log("length length " + clientListMania.length)
        break
      }
    }
  })
  socket.on('realSocketCheckersMania', (testStr) => {
    console.log(socket.id)
    console.log('someone real joined mania 3')
    for(let i = 0; i < clientListMania.length; i++){ //basically trying to solve concurrency issues
      if(clientListMania[i].checkers == null){
        clientListMania[i].checkers = socket
        thisClient = i
       console.log("client client " + thisClient)
        console.log("length length " + clientListMania.length)
        break
      }
    }
    console.log("client client " + thisClient)
    console.log("length length " + clientListMania.length)

    if(thisClient%2 == 1){
      let first = Math.floor(Math.random() * 2)
      maniaTimers.push({firstTimer: 600, secondTimer: 600, turn: "first", whoFirst: first == 0 ? thisClient : thisClient - 1})
      dataListMania.push({moveOfThree: 0, maxMove: 3, connectWin: null, chessWin: null, checkersWin: null, score: 0})
      //socket.emit('error', {id: socket.id, message:"you are two"});
      if(first == 0){
        clientListMania[thisClient].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"white"});
        clientListMania[thisClient].checkers.emit('checkersColor', {id: socket.id, color:"black"});
        clientListMania[thisClient].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"red"});
        clientListMania[thisClient-1].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"white"});
        clientListMania[thisClient-1].checkers.emit('checkersColor', {id: socket.id, color:"red"});
        clientListMania[thisClient-1].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"red"});
      }
      else{
       clientListMania[thisClient].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"black"});
        clientListMania[thisClient].checkers.emit('checkersColor', {id: socket.id, color:"red"});
        clientListMania[thisClient].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"yellow"});
        clientListMania[thisClient-1].chess.emit('color', {id: clientListMania[thisClient].chess.id, color:"black"});
        clientListMania[thisClient-1].checkers.emit('checkersColor', {id: socket.id, color:"black"});
        clientListMania[thisClient-1].connect.emit('color', {id: clientListMania[thisClient].connect.id, color:"yellow"});
      }
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
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
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
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
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
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
         console.log("it da second")
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
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
        clientListMania[firstClientNum].chess.emit('yourTurn', null)
        clientListMania[firstClientNum].checkers.emit('yourTurn', null)
        clientListMania[firstClientNum].connect.emit('yourTurn', null)
      }
      else{
        console.log('it da second')
        let firstClientNum = maniaTimers[Math.floor(thisClient / 2)].whoFirst
        let other = (firstClientNum - 1) + (((firstClientNum + 1)%2) * 2)
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

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
    //numClientsConnect--;
  });
});

// httpServer.listen(3000, () => { //we've got 2 servers here this is chaos idk whats goin on
//   console.log(`listening on *:${4000}`);
// });






app2.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
httpServer.listen(4000, () => { //we've got 2 servers here this is chaos idk whats goin on
  console.log(`listening on *:${4000}`);
});
