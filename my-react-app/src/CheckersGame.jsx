import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { PhaserGame } from './PhaserGame';
import ChatBox from './components/ChatBox.jsx';

function CheckersGame(){
    const [user, setUser] = useState(null);

    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    //const currentScene = (_scene: any) => { //I don't know what this does but colby did it and it works so im keeping it.
        //todo?
    //}

    return (
        <div>
            <h2>CHECKERS</h2>
             <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} type="queue" />
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
            <ChatBox />
        </div>
        
    )
}

export default CheckersGame;