import express from 'express';
//import redis from 'redis';
import { createClient } from 'redis';
const app2 = express();
import session from 'express-session';
import configRoutesFunction from './src/routes/index.js';
import cors from 'cors';
import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')
import {createServer} from 'http';
import { accounts } from './src/routes/mongo/MongoCollections.js';
//import * as flat from 'flat';

const client = createClient();
client.connect().then(() => {});
const httpServer = createServer(app2);
const io = new Server(httpServer, {cors: {origin: '*'}});

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

let numClientsChess = 0
let clientListChess = []

let numClientsCheckers = 0;
let clientListCheckers = [];

let chessTimers = []
let connectTimers = []
let checkersTimers = []

io.on('connection', (socket) => {
  let thisColor = ""
  let thisClient

  let fun = true;

  socket.on('chessCustomConnect', ({me, opp}) => {
    chessCustomClients[me] = socket;

    if(chessCustomClients[opp]) {
      const roomName = `${me}-${opp}`;
      socket.join(roomName);

      chessCustomClients[opp].join(roomName);

      let white = Math.floor(Math.random() * 2)
      chessCustomTimers[roomName] = ({whiteTimer: 600, blackTimer: 600, turn: "white", whoWhite: white == 0 ? me : opp})
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

    if(connectCustomClients[opp]) {
      const roomName = `${me}-${opp}`; 
      socket.join(roomName);
      connectCustomClients[opp].join(roomName);

      let red = Math.floor(Math.random() * 2)
      console.log("making custom timer");
      connectCustomTimers[roomName] = ({redTimer: 30, yellowTimer: 30, turn: "red", whoRed: red == 0 ? me : opp})
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

  socket.on('redMove', ({row, col}) => {
    if(checkersTimers[Math.floor(thisClient / 2)].turn == "red"){
      checkersTimers[Math.floor(thisClient / 2)].turn = "black"
    }
    else{
      checkersTimers[Math.floor(thisClient / 2)].turn = "red"
    }
    console.log(checkersTimers[Math.floor(thisClient / 2)].turn)

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
      //console.log("weird ass interval");
       connectCustomTimers[roomName].interval = setInterval((() => {
        if(connectCustomTimers[roomName].turn == "red"){
          connectCustomTimers[roomName].redTimer -= 1
        }
        else{
          connectCustomTimers[roomName].blackTimer -= 1
        }
        io.to(roomName).emit('timer', {timeRed: connectCustomTimers[roomName].redTimer, timeYellow: connectCustomTimers[roomName].redTimer});
      }), 1000)
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
      clientList[thisClient + 1].emit('customOtherPlaced', (collumn))
    }
    else{
      clientList[thisClient - 1].emit('cusotmOtherPlaced', (collumn))
    }
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

    if(i == 0){
      i++
      //console.log("weird ass interval");
       chessCustomTimers[roomName].interval = setInterval((() => {
        if(chessCustomTimers[roomName].turn == "red"){
          chessCustomTimers[roomName].redTimer -= 1
        }
        else{
          chessCustomTimers[roomName].blackTimer -= 1
        }
        io.to(roomName).emit('timer', {timeWhite: chessCustomTimers[roomName].whiteTimer, timeBlack: chessCustomTimers[roomName].blackTimer});
      }), 1000)
      //console.log("why isn't it working")
      //}
    }


    
    if(!fun){
      if(chessCustomTimers[roomName].turn == "white"){
        //console.log("flipped to black");
        chessCustomTimers[roomName].turn = "black"
      }
      else{
        //console.log("flipped to white");
        chessCustomTimers[roomName].turn = "white"
      }
      fun = !fun;
    } else {
      //console.log("not flipping");
      fun = !fun;
    }
    
    //checkersCustomTimers[roomName].turn)


    io.to(roomName).emit("otherPlaced", (data));
  
  })


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
    console.log('Disconnect Fired on ' + socket.id);
    for(const [username, userSocket] of Object.entries(checkersCustomClients)) {
      if(userSocket.id === socket.id){
        delete checkersCustomClients[username];
        console.log("removed from client list")
      }
    }

    for(const [roomName, timer] of Object.entries(checkersCustomTimers)) {
      if (timer.whoRed === socket.id || timer.whoBlack) {
        clearInteval(timer.interval);
        delete checkersCustomTimers[roomName];
        console.log("removed from timer")
      }
    }

    for(const [username, userSocket] of Object.entries(chessCustomClients)) {
      if(userSocket.id === socket.id){
        delete chessCustomClients[username];
        console.log("removed from client list")
      }
    }

    for(const [roomName, timer] of Object.entries(chessCustomTimers)) {
      if (timer.whoRed === socket.id || timer.whoBlack) {
        clearInteval(timer.interval);
        delete chessCustomTimers[roomName];
        console.log("removed from timer")
      }
    }
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

configRoutesFunction(app2);


app2.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
httpServer.listen(4000, () => { //we've got 2 servers here this is chaos idk whats goin on
  console.log(`listening on *:${4000}`);
});
