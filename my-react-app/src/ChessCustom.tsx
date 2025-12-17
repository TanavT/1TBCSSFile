import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import { IRefPhaserGame, PhaserGame } from './chess/PhaserGame.js';
import ChatBox from './components/ChatBox.jsx';
import { useAuth } from './AuthContext';

function ChessCustomGame(){
    // const [user, setUser] = useState(null);
    const {user} = useAuth();
    const params = useParams();
    
     const phaserRef = useRef<IRefPhaserGame | null>(null);

    // useEffect(() => {
    //     axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
    //     .then(res => setUser(res.data))
    //     .catch(() => setUser(null));
    // }, [])

     const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    if(user){
        return (
        <div>
            <h2>CHESS</h2>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="custom" opp={params.enemyId} />
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
            <ChatBox />
        </div>  
        )
    } else {
        return <p>loading...</p>
    }

    
}

export default ChessCustomGame;