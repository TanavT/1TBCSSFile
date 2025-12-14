import axios from 'axios';
import {accounts} from './mongo/MongoCollections.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const exportedMethods = {
    async login(username, password){
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({ username });
        if (!user) throw "Either the username or password is invalid";
        
        //password check;
        let passwordCompare = false;
        passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) throw "Either the username or password is invalid"
        console.log(user);
        return user;
        return { id: user._id, username: user.username };
    },

    async signup(username, password){
        const accountsCollection = await accounts();
        const existing = await accountsCollection.findOne({ username });
        if (existing) throw "User already exists";

        const today = new Date();
        //const year = today.getFullYear();
        //const month = today.getMonth() + 1;
        //const day = today.getDate();
        const todayString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        console.log(todayString); 

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //const passwordHash = await bcrypt.hash(password, 12);
        const newUser = { 
            username, 
            hashedPassword, 
            winrates: {
                chessWins: 0,
                chessLosses: 0,
                checkersWins: 0,
                checkersLosses: 0,
                connectWins: 0,
                connectLosses: 0,
                maniaWins: 0,
                maniaLosses: 0
            },
            elo: {
                chess: 800,
                checkers: 800,
                connect: 800,
                mania: 800
            },
            signupDate: todayString

        };
        console.log(newUser);
        const insertInfo = await accountsCollection.insertOne(newUser);

        return { id: insertInfo.insertedId, username };
    }
}

export default exportedMethods;