import axios from 'axios';
import {accounts} from './mongo/MongoCollections.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
const saltRounds = 10;
import { validationMethods } from './helpers.js';

const exportedMethods = {
    async getUser(id){
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({_id: new ObjectId(id) });
        if (!user) throw "user not found";
        
        // console.log(user);
        return user;
    },

    async login(username, password){
        if(typeof username !== "string" || username.trim().length <= 0) {
            throw `Error: Please enter a valid non-empty username`;
        }

        if(typeof password !== "string" || password.trim().length <= 0) {
            throw `Error: Please enter a valid non-empty password`;
        }

        username = validationMethods.checkUsername(username)
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({ username });

        // console.log(user)
        if (!user) throw "Either the username or password is invalid";
        
        //password check;
        let passwordCompare = false;
        passwordCompare = await bcrypt.compare(password, user.password)
        // console.log(passwordCompare)
        if (!passwordCompare) throw "Either the username or password is invalid"
        console.log(user);
        return {
            _id: user._id,
            username: user.username,
            signupDate: user.signupDate,
            winrates: user.winrates,
            friendList: user.friendList,
            challenges: user.challenges
        };
        // return { id: user._id, username: user.username };
    },


    async signup(username, password){
        username = validationMethods.checkUsername(username);
        password = validationMethods.checkPassword(password);

        const accountsCollection = await accounts();
        const existing = await accountsCollection.findOne({ username });
        if (existing) throw "Username already taken";

        const today = new Date();
        //const year = today.getFullYear();
        //const month = today.getMonth() + 1;
        //const day = today.getDate();
        const todayString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        //console.log(todayString); 

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //const passwordHash = await bcrypt.hash(password, 12);
        const newUser = { 
            username, 
            password: hashedPassword, 
            winrates: {
                chessWins: 0,
                chessTies: 0,
                chessLosses: 0,
                checkersWins: 0,
                checkersTies: 0,
                checkersLosses: 0,
                connectWins: 0,
                connectTies: 0,
                connectLosses: 0,
                maniaWins: 0,
                maniaTies: 0,
                maniaLosses: 0
            },
            elo: {
                chess: 800,
                checkers: 800,
                connect: 800,
                mania: 800
            },
            signupDate: todayString,
            friendList: [],
            challenges:[]

        };
        //console.log(newUser);
        const insertInfo = await accountsCollection.insertOne(newUser);

        return {
            _id: insertInfo.insertedId,
            username: newUser.username,
            signupDate: newUser.signupDate,
            winrates: newUser.winrates,
            friendList: newUser.friendList,
            challenges: newUser.challenges
        };

        return { id: insertInfo.insertedId, username };

    },

    async challengeUser(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(victim.challenges.some(c => c.from === from)) {
            throw `Error: User is already challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $push: { challenges: {from: from, game:"checkers" } } }
        );
        console.log("done challenging");
        return updateResult;
    },

    async challengeUserChess(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(victim.challenges.some(c => c.from === from)) {
            throw `Error: User is already challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $push: { challenges: {from: from, game:"chess"} } }
        );
        console.log("done challenging");
        return updateResult;
    },

    async challengeUserConnect(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(victim.challenges.some(c => c.from === from)) {
            throw `Error: User is already challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $push: { challenges: {from: from, game:"connect" } } }
        );
        console.log("done challenging");
        return updateResult;
    },

    async unchallengeFriendChess(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(!victim.challenges.some(c => c.from === from)) {
            throw `Error: User is not challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $pull: { challenges: {from: from, game: "chess" } } }
        );

        return updateResult;
    },

    async unchallengeFriendConnect(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(!victim.challenges.some(c => c.from === from)) {
            throw `Error: User is not challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $pull: { challenges: {from: from, game: "connect" } } }
        );

        return updateResult;
    },

    async unchallengeFriend(from, to){
        from = validationMethods.checkUsername(from)
        to = validationMethods.checkUsername(to)
        const accountsCollection = await accounts();
        const victim = await accountsCollection.findOne({ username: to } );

        const challenger = await accountsCollection.findOne({ username: from });


        if(victim === null) {
            throw `Error: No opponent with that ID exists within the database!`;
        }

        if(challenger === null) {
            throw `Error: No account with that ID exists within the database!`;
        }

        if(!victim.challenges.some(c => c.from === from)) {
            throw `Error: User is not challenging  ${victim.username}`;
        }

        if(from === to) {
            throw `Error: Cannot challenge yourself`
        }


        const updateResult = await accountsCollection.updateOne(
                { username: to },
                { $pull: { challenges: {from: from, game: "checkers" } } }
        );

        return updateResult;
    },

    //returns the user after searching
    async searchUser(username) {
        if(typeof username !== "string" || username.trim().length <= 0) {
            throw `Error: Please enter a valid non-empty username`;
        }
        console.log(username)
        username = validationMethods.checkUsername(username)
        console.log(username)


        //console.log("searching");
        //console.log(username);
        const accountsCollection = await accounts();
        const user = await accountsCollection.findOne({ username });
        
        if (!user) {
            throw `Error: User not found`;
        }
        
        return {
            _id: user._id,
            username: user.username,
            signupDate: user.signupDate,
            winrates: user.winrates,
            friendList: user.friendList,
            challenges: user.challenges
        };
    },

    async addFriend(userUsername, friendUsername) {
        userUsername = userUsername.trim();
        friendUsername = friendUsername.trim();
        if(typeof userUsername !== 'string' || typeof friendUsername !== 'string' || userUsername.length < 1 || friendUsername.length < 1) {
            throw `Error: Please enter a valid username!`;
        }
        userUsername = validationMethods.checkUsername(userUsername)
        friendUsername = validationMethods.checkUsername(friendUsername)

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
        //more like snakeUsername ... I'm going insane
        userUsername = validationMethods.checkUsername(userUsername)
        friendUsername = validationMethods.checkUsername(friendUsername)

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