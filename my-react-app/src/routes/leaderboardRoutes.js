import {Router} from 'express';
import gameData from './gameData.js';
const router = Router();

const leaderboardFunc = (gameType) => {
    return (async (req, res) => {
        let leaderboard
        try {
            leaderboard = await gameData.getLeaderboard(gameType)
        } catch (e) {
            console.log(e)
            return res.status(500).json({error: e})
        }
        if (!leaderboard) return res.status(500).json({error: "leaderboard error"})
        return res.json(leaderboard)
    })
}

router.route("/connect").get(leaderboardFunc("connect"))

router.route("/chess").get(leaderboardFunc("chess"))

router.route("/checkers").get(leaderboardFunc("checkers"))

router.route("/mania").get(leaderboardFunc("mania"))

export default router