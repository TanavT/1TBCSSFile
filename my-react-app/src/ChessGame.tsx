import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { IRefPhaserGame, PhaserGame } from './chess/PhaserGame';
import ChatBox from './components/ChatBox.jsx';

function ChessGame(){
    const [user, setUser] = useState(null);
    
     const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

     const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    return (
        <div>
            <h2>CHESS</h2>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="queue" />
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
            <ChatBox />
        </div>
        
    )
}

export default ChessGame;