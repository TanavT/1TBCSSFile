import { accounts }from './src/routes/mongo/MongoCollections.js';
import {closeConnection} from './src/routes/mongo/mongoConnections.js';
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, saltRounds);
const saltRounds = 10;

const saltPassword = await bcrypt.hash("IAmMad12345!", saltRounds);
const gorlockPassword = await bcrypt.hash("aoUvd1$ka*k", saltRounds);
const sheldonPassword = await bcrypt.hash("Baz1nga!", saltRounds);
const hillPassword = await bcrypt.hash("$$PatrickH1LL$$", saltRounds);

async function seed() {
    try {
        const accountsCollection = await accounts();
        const accountSeed = [
            {
                username: "theSaltyOne",
                password: saltPassword,
                winrates: {
                    chessWins: 2,
                    chessTies: 7,
                    chessLosses: 15,
                    checkersWins: 6,
                    checkersTies: 3,
                    checkersLosses: 30,
                    connectWins: 10,
                    connectTies: 2,
                    connectLosses: 3,
                    maniaWins: 0,
                    maniaTies: 0,
                    maniaLosses: 10
                },
                elo: {
                    chess: 500,
                    connect: 900,
                    checkers: 355,
                    mania: 200
                },
                signupDate: "12/14/2025",
                friendList: ["Gorlock", "PHillTheGreat"],
                challenges: []
            },
            {
                username: "Gorlock",
                password: gorlockPassword,
                winrates: {
                    chessWins: 8,
                    chessTies: 2,
                    chessLosses: 6,
                    checkersWins: 8,
                    checkersTies: 1,
                    checkersLosses: 3,
                    connectWins: 7,
                    connectTies: 2,
                    connectLosses: 3,
                    maniaWins: 3,
                    maniaTies: 0,
                    maniaLosses: 8
                },
                elo: {
                    chess: 767,
                    connect: 679,
                    checkers: 575,
                    mania: 456
                },
                signupDate: "12/09/2025",
                friendList: ["theSaltyOne", "PHillTheGreat"],
                challenges: []
            },
            {
                username: "Sheldon Cooper",
                password: sheldonPassword,
                winrates: {
                    chessWins: 99,
                    chessTies: 0,
                    chessLosses: 1,
                    checkersWins: 50,
                    checkersTies: 5,
                    checkersLosses: 50,
                    connectWins: 12,
                    connectTies: 3,
                    connectLosses: 10,
                    maniaWins: 0,
                    maniaTies: 0,
                    maniaLosses: 0
                },
                elo: {
                    chess: 1500,
                    connect: 1300,
                    checkers: 1300,
                    mania: 800
                },
                signupDate: "3/14/2021",
                friendList: [],
                challenges: []
            },
            {
                username: "PHillTheGreat",
                password: hillPassword,
                winrates: {
                    chessWins: 10,
                    chessTies: 0,
                    chessLosses: 3,
                    checkersWins: 2,
                    checkersTies: 3,
                    checkersLosses: 6,
                    connectWins: 7,
                    connectTies: 19,
                    connectLosses: 0,
                    maniaWins: 5,
                    maniaTies: 5,
                    maniaLosses: 5
                },
                elo: {
                    chess: 1100,
                    connect: 1300,
                    checkers: 600,
                    mania: 800
                },
                signupDate: "5/19/2017",
                friendList: ["theSaltyOne", "Gorlock"],
                challenges: []
            },
        ];
        const result = await accountsCollection.insertMany(accountSeed);
        console.log("seed planted");
        await closeConnection();
    } catch (e) {
        console.log("seed failure. booo");
        await closeConnection();
    }
}

seed();