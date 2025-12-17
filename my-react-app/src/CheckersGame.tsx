import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from "react-router-dom";
import { IRefPhaserGame, PhaserGame } from './checkers/PhaserGame';
import ChatBox from './components/ChatBox.jsx';
import { useAuth } from './AuthContext';

function CheckersCustom(){
    const {user} = useAuth();
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);


    const params = useParams();
    // const navigate = useNavigate();

    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // useEffect(() => {
    //     axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
    //     .then(res => {
    //         setUser(res.data);
    //         setLoading(false);
    //     })
    //     .catch(() => {
    //         setUser(null);
    //         setLoading(false);
    //         navigate('/login'); // redirect to home page if not logged in
    //     });
    // }, [navigate])

    const currentScene = (_scene: any) => { //I don't know what this does but colby did it and it works so im keeping it.
        //todo?
    }
    console.log(user);

    // if(loading){
    //     return <p>loading...</p>
    // }
    // // console.log(`other user: ${params.enemyId}`)
    // if (loading) return <p>Loading...</p>;

    if(user){
        return ( //USER IN PHASER 1: include user as a prop to PhaserGame. next step in PhaserGame.tsx
                <div>
                    <h2>CHECKERS</h2>
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="queue" opp={params.enemyId} userID={user? user._id: "testing"} /> 
                    {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
                    <ChatBox />
                </div>
                
            )
    } else {
        return <p>loading...</p>
    }
}

export default CheckersCustom;