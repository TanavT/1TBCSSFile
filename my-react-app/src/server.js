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


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow us to send requests from react to here
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
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


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});