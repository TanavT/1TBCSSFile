import axios from 'axios';
import {accounts} from './mongo/MongoCollections.js';

const exportedMethods = {
    async login(username, password){
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({ username });
        if (!user) throw "User not found";

        //password check;
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


        //const passwordHash = await bcrypt.hash(password, 12);
        const newUser = { 
            username, 
            password, 
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
            signupDate: todayString

        };
        console.log(newUser);
        const insertInfo = await accountsCollection.insertOne(newUser);

        return { id: insertInfo.insertedId, username };
    }
}

export default exportedMethods;