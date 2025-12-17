import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import { IRefPhaserGame, PhaserGame } from './checkers/PhaserGame';
import ChatBox from './components/ChatBox.jsx';

function CheckersCustom(){
    const [user, setUser] = useState(null);

    const params = useParams();

    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    const currentScene = (_scene: any) => { //I don't know what this does but colby did it and it works so im keeping it.
        //todo?
    }
    console.log(user);

    if(user){
        return ( //USER IN PHASER 1: include user as a prop to PhaserGame. next step in PhaserGame.tsx
                <div>
                    <h2>CHECKERS</h2>
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="queue" opp={params.enemyId} /> 
                    {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
                    <ChatBox />
                </div>
                
            )
    } else {
        return <p>loading...</p>
    }
}

export default CheckersCustom;