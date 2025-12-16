import {Router} from 'express';
import accountData from './accountData.js';
import xss from 'xss';
const router = Router();

router
    .route('/login')
    .post(async (req, res) => {
        try {
            let cleanUsername = xss(req.body.username);
            let cleanPassword = xss(req.body.password);
            const user = await accountData.login(cleanUsername, cleanPassword);

            if(!user) {
                throw `Error: Could not find user!`;
            }

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
            let cleanUsername = xss(req.body.username);
            let cleanPassword = xss(req.body.password);
            const user = await accountData.signup(cleanUsername, cleanPassword);
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
            return res.json(req.session.user);
        } else {
            return res.status(401).json({error: 'Not logged in'});
        }
    })

router
    .route('/search')
    .get(async (req, res) => {
        try {
            const username = req.query.username;
            if (!username || username.trim() === '') {
                return res.status(400).json({ error: 'Username required' });
            }
            
            const user = await accountData.searchUser(username.trim());
            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e });
        }
    })

router.post('/addFriend', async (req, res) => {
    try {
        const { userUsername, friendUsername } = req.body;
        
        if (!userUsername || !friendUsername) {
            return res.status(400).json({ error: 'Both usernames are required' });
        }
        
        const result = await accountData.addFriend(userUsername, friendUsername);
        
        // update the session with fresh user data
        const updatedUser = await accountData.searchUser(userUsername);
        req.session.user = updatedUser;
        
        return res.status(200).json({ 
            success: true, 
            message: `${friendUsername} added as friend`,
            user: updatedUser
        });
    } catch (error) {
        return res.status(400).json({ error: error.toString() });
    }
});

router.post('/deleteFriend', async (req, res) => {
    try {
        const { userUsername, friendUsername } = req.body;
        
        if (!userUsername || !friendUsername) {
            return res.status(400).json({ error: 'Both usernames are required' });
        }
        
        const result = await accountData.deleteFriend(userUsername, friendUsername);
        
        // update the session with updated user data
        const updatedUser = await accountData.searchUser(userUsername);
        req.session.user = updatedUser;
        
        return res.status(200).json({ 
            success: true, 
            message: `${friendUsername} removed as a friend`,
            user: updatedUser
        });
    } catch (error) {
        return res.status(400).json({ error: error.toString() });
    }
});

export default router;