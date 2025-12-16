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
            signupDate: todayString,
            friendList: []

        };
        console.log(newUser);
        const insertInfo = await accountsCollection.insertOne(newUser);

        return { id: insertInfo.insertedId, username };
    },

    //returns the user after searching
    async searchUser(username) {
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({ username });
        
        if (!user) {
            throw "User not found";
        }
        
        return {
            id: user._id,
            username: user.username,
            signupDate: user.signupDate,
            winrates: user.winrates,
            friendList: user.friendList
        };
    },

    async addFriend(userUsername, friendUsername) {
        userUsername = userUsername.trim();
        friendUsername = friendUsername.trim();
        if(typeof userUsername !== 'string' || typeof friendUsername !== 'string' || userUsername.length < 1 || friendUsername.length < 1) {
            throw `Error: Please enter a valid username!`;
        }

        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({username: userUsername});
        const friend = await accountsCollection.findOne({username: friendUsername});

        if(user === null) {
            throw `Error: No user with that ID exists within the database!`;
        }

        if(friend === null) {
            throw `Error: No friend with that ID exists within the database!`;
        }

        if(user.friendList && user.friendList.includes(friendUsername)) {
            throw `Error: User is already friends with ${friendUsername}`;
        }

        if(userUsername === friendUsername) {
            throw `Error: Cannot friend yourself`
        }

        const updateResult = await accountsCollection.updateOne(
                { username: userUsername },
                { $push: { friendList: friendUsername } }
        );

        return updateResult;
    },

    async deleteFriend(userUsername, friendUsername) {
        userUsername = userUsername.trim();
        friendUsername = friendUsername.trim();

        if (typeof userUsername !== 'string' || typeof friendUsername !== 'string' || userUsername.length < 1 || friendUsername.length < 1) {
            throw `Error: Please enter a valid username!`;
        }

        const accountsCollection = await accounts();

        const user = await accountsCollection.findOne({ username: userUsername });
        const friend = await accountsCollection.findOne({ username: friendUsername });

        if (!user) {
            throw `Error: No user with that username exists within the database!`;
        }

        if (!friend) {
            throw `Error: No friend with that username exists within the database!`;
        }

        if (userUsername === friendUsername) {
            throw `Error: Cannot unfriend yourself`;
        }

        // safeguard against missing friendList
        const friendList = user.friendList || [];

        if (!friendList.includes(friendUsername)) {
            throw `Error: User is not friends with ${friendUsername}`;
        }

        const updateResult = await accountsCollection.updateOne(
            { username: userUsername },
            { $pull: { friendList: friendUsername } }
        );

        return updateResult;
    }

}

export default exportedMethods;