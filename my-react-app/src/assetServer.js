import express from 'express';
//import redis from 'redis';
import { createClient } from 'redis';
const app = express();
import session from 'express-session';
import configRoutesFunction from './routes/index.js';
import cors from 'cors';
//import * as flat from 'flat';


//const client = createClient();
//client.connect().then(() => {});


app.use(express.static('path/to/your/assets'));

// Allow us to send requests from react to here
app.use(cors());


app.use(
  session({
    name: 'assets',
    secret: "please work for the love of god",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60} //one second * 60 seconds * 60 minutes. 1 hour cookies
  })
);

configRoutesFunction(app);


app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});