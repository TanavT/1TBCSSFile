import {accounts} from './mongo/MongoCollections.js';
import { ObjectId } from 'mongodb';
const probabilityOfWinning = (elo1, elo2) => {
    return 1 / (1 + Math.pow(10, (elo1 - elo2) / 400)) //general formula for calculating elo probability of winning
}

const exportedMethods = {
    async connectGameOver(player, opponent, gameState) { //gamestate, 1 = player won, 0.5 = tie, 0 = opponent won
        //https://www.geeksforgeeks.org/dsa/elo-rating-algorithm/
        const kElo = 50
        const accountsCollection = await accounts();
        let playerObj = await accountsCollection.findOne({ _id: new ObjectId(player) });
        let opponentObj = await accountsCollection.findOne({ _id: new ObjectId(opponent) });
        console.log(playerObj)
        if (!playerObj) throw "Player not found";
        if (!opponentObj) throw "Opponent not found";
        if (gameState !== 1 && gameState !== 0 && gameState !== 0.5) throw "Invalid gamestate"

        let playerElo = playerObj.elo.connect
        let opponentElo = opponentObj.elo.connect

        const Pp = probabilityOfWinning(playerElo, opponentElo)
        const Po = probabilityOfWinning(opponentElo, playerElo)

        playerElo = playerElo + kElo * (gameState - Pp);
        opponentElo = opponentElo + kElo * ((1 - gameState) - Po);

        playerObj.elo.connect = playerElo
        opponentObj.elo.connect = opponentElo

        const newPlayerObj = await accountsCollection.findOneAndUpdate({_id: new ObjectId(player)}, {$set: {elo: playerObj.elo}}, {returnDocument: 'after'})
        const newOpponentObj = await accountsCollection.findOneAndUpdate({_id: new ObjectId(opponent)}, {$set: {elo: opponentObj.elo}}, {returnDocument: 'after'})

        return {newPlayerObj, newOpponentObj}
    }

}

export default exportedMethods