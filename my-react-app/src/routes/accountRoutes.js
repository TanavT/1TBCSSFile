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
    .route('/challenge')
    .post(async (req, res) => {
        //console.log("challenging");
        try {
            const { from, to } = req.body;
            
            if (!to || !from) {
                return res.status(400).json({ error: 'Both usernames are required' });
            }
            
            const result = await accountData.challengeUser(from, to);
            
            // Update the session with fresh user data
            const updatedUser = await accountData.searchUser(from);
            req.session.user = updatedUser;
            //console.log("really done challenging");
            return res.status(200).json({ 
                success: true, 
                message: `${from} challenged`,
                user: updatedUser  // Send back the updated user
            });
        } catch (error) {
            return res.status(400).json({ error: error.toString() });
        }
    }
)

router
    .route('/challengeConnect')
    .post(async (req, res) => {
        //console.log("challenging");
        try {
            const { from, to } = req.body;
            
            if (!to || !from) {
                return res.status(400).json({ error: 'Both usernames are required' });
            }
            
            const result = await accountData.challengeUserConnect(from, to);
            
            // Update the session with fresh user data
            const updatedUser = await accountData.searchUser(from);
            req.session.user = updatedUser;
            //console.log("really done challenging");
            return res.status(200).json({ 
                success: true, 
                message: `${from} challenged`,
                user: updatedUser  // Send back the updated user
            });
        } catch (error) {
            return res.status(400).json({ error: error.toString() });
        }
    }
)

router
    .route('/challengeChess')
    .post(async (req, res) => {
        //console.log("challenging");
        try {
            const { from, to } = req.body;
            
            if (!to || !from) {
                return res.status(400).json({ error: 'Both usernames are required' });
            }
            
            const result = await accountData.challengeUserChess(from, to);
            
            // Update the session with fresh user data
            const updatedUser = await accountData.searchUser(from);
            req.session.user = updatedUser;
            //console.log("really done challenging");
            return res.status(200).json({ 
                success: true, 
                message: `${from} challenged`,
                user: updatedUser  // Send back the updated user
            });
        } catch (error) {
            return res.status(400).json({ error: error.toString() });
        }
    }
)


router
    .route('/unchallenge')
    .post(async (req, res) => {
        //console.log("unchallenging");
        try {
        const { from, to } = req.body;
        
        if (!to || !from) {
            return res.status(400).json({ error: 'Both usernames are required' });
        }
        
        const result = await accountData.unchallengeFriend(from, to);
        
        // Update the session with fresh user data
        const updatedUser = await accountData.searchUser(to);
        req.session.user = updatedUser;
        //console.log("really done unchallenging");
        return res.status(200).json({ 
            success: true, 
            message: `${from} unchallenged`,
            user: updatedUser  // Send back the updated user
        });
    } catch (error) {
        return res.status(400).json({ error: error.toString() });
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

router
    .route('/search')
    .get(async (req, res) => {
        try {
            const cleanUsername = xss(req.query.username);
            if (!cleanUsername || cleanUsername.trim() === '') {
                return res.status(400).json({ error: 'Username required' });
            }
            
            const user = await accountData.searchUser(cleanUsername.trim());
            return res.json(user);
        } catch (e) {
            console.log(e);
            return res.status(404).json({ error: e });
        }
    })

router.post('/addFriend', async (req, res) => {
    try {
        let userUsername = xss(req.body.userUsername);
        let friendUsername = xss(req.body.friendUsername);
        
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
        let userUsername = xss(req.body.userUsername);
        let friendUsername = xss(req.body.friendUsername);
        
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