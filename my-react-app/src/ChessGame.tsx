import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { IRefPhaserGame, PhaserGame } from './chess/PhaserGame';
import { useNavigate } from 'react-router-dom';
import ChatBox from './components/ChatBox.jsx';

function ChessGame(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => {
            setUser(res.data);
            setLoading(false);
        })
        .catch(() => {
            setUser(null);
            setLoading(false);
            navigate('/login'); // redirect to home page if not logged in
        });
    }, [navigate])

     const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    if(loading){
        return <p>loading...</p>
    }

    return (
        <div>
            <h2>CHESS</h2>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="queue" userID={user? user._id: "testing"}/>
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
            <ChatBox />
        </div>
        
    )
}

export default ChessGame;