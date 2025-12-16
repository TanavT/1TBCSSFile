import {accounts} from './mongo/MongoCollections.js';
import { ObjectId } from 'mongodb';
import redisClient from '../../redis.js'
import accountData from "./accountData.js"

const probabilityOfWinning = (elo1, elo2) => {
    return 1 / (1 + Math.pow(10, (elo1 - elo2) / 400)) //general formula for calculating elo probability of winning
}

const updateLeaderboard = async (player, opponent, gameType, playerElo, opponentElo) => {
    // console.log(`Player Elo: ${playerElo} player: ${player}, opponentElo: ${opponentElo} opponent: ${opponent}`)
    await redisClient.zAdd(`leaderboard:${gameType}`,[
        {score:playerElo, value:player},
        {score:opponentElo, value:opponent}
    ])
}

const exportedMethods = {
    async gameOver(player, opponent, gameState, gameType) { //gamestate, 1 = player won, 0.5 = tie, 0 = opponent won
        //https://www.geeksforgeeks.org/dsa/elo-rating-algorithm/
        const kElo = 50
        const accountsCollection = await accounts();
        let playerObj = await accountsCollection.findOne({ _id: new ObjectId(player) });
        let opponentObj = await accountsCollection.findOne({ _id: new ObjectId(opponent) });
        console.log(playerObj)
        if (!playerObj) throw "Player not found";
        if (!opponentObj) throw "Opponent not found";
        if (gameState !== 1 && gameState !== 0 && gameState !== 0.5) throw "Invalid gamestate"

        if (gameState === 1){
            playerObj.winrates[`${gameType}Wins`] += 1
            opponentObj.winrates[`${gameType}Losses`] += 1
        } else if (gameState === 0) {
            playerObj.winrates[`${gameType}Losses`] += 1
            opponentObj.winrates[`${gameType}Wins`] += 1
        } else {
            playerObj.winrates[`${gameType}Ties`] += 1
            opponentObj.winrates[`${gameType}Ties`] += 1
        }
        let playerElo = playerObj.elo[gameType]
        let opponentElo = opponentObj.elo[gameType]

        const Pp = probabilityOfWinning(playerElo, opponentElo)
        const Po = probabilityOfWinning(opponentElo, playerElo)

        playerElo = playerElo + kElo * (gameState - Pp);
        opponentElo = opponentElo + kElo * ((1 - gameState) - Po);

        playerObj.elo[gameType] = playerElo
        opponentObj.elo[gameType] = opponentElo

        await updateLeaderboard(player, opponent, gameType, playerElo, opponentElo)

        const newPlayerObj = await accountsCollection.findOneAndUpdate({_id: new ObjectId(player)}, {$set: {elo: playerObj.elo, winrates: playerObj.winrates}}, {returnDocument: 'after'})
        const newOpponentObj = await accountsCollection.findOneAndUpdate({_id: new ObjectId(opponent)}, {$set: {elo: opponentObj.elo, winrates: opponentObj.winrates}}, {returnDocument: 'after'})
        
        return {newPlayerObj, newOpponentObj}
    },

    async getLeaderboard(gameType, limit = 10) { //routes
        const leaderboard = `leaderboard:${gameType}`
        const current = await redisClient.zRangeWithScores(leaderboard, 0, limit - 1, {REV: true})
        let leaderboard_spots = current.map(async (x, index) => ({
            rank: index + 1,
            user: await accountData.getUser(x.value),
            elo: Math.floor(x.score)
        }))
        leaderboard_spots = await Promise.all(leaderboard_spots)
        leaderboard_spots = leaderboard_spots.map((x) => ({
                rank: x.rank,
                username: x.user.username,
                elo: x.elo
            }))
        
        console.log(leaderboard_spots)
        return leaderboard_spots
    }
}

export default exportedMethods