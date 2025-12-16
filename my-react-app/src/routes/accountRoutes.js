import {Router} from 'express';
import accountData from './accountData.js';
const router = Router();

router
    .route('/login')
    .post(async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await accountData.login(username, password);
            req.session.user = user;
            return res.json(user);
        } catch (e){
            console.log(e);
            return res.status(500).send(e);
        }
    })

router
    .route('/signup')
    .post(async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await accountData.signup(username, password);
            req.session.user = user;
            return res.json(user);
        } catch (e){
            console.log(e);
            return res.status(500).send(e);
        }
    })

router
    .route('/logout')
    .post(async (req, res) => {
        try {
            req.session.destroy();
            return res.json({logout: true});
        } catch (e){
            console.log(e);
            return res.status(500).send(e);
        }
    })

router
    .route('/me')
    .get(async (req, res) => {
        if(req.session.user) {
            const updatedUser = await accountData.getUser(req.session.user._id)
            req.session.user = updatedUser
            return res.json(req.session.user)
        } else {
            return res.status(401).json({error: 'Not logged in'});
        }
    })

export default router;