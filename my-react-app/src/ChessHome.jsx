import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ChessLeaderboard from './ChessLeaderboard';
import { useAuth } from './AuthContext';

function ChessHomePage(){
    const {user} = useAuth();
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
    //     .then(res => setUser(res.data))
    //     .catch(() => setUser(null));
    // }, [])

    const handleRandomQueue = async () => {
        if(user){
            navigate("/chessMatch");
        } else {
            navigate("/login")
        };
    }

    const handlePrivateMatch = async () => {
        if(user){
            navigate("/chessMatch");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className='centerBox'>
            <h2>CHESS</h2>
            <button onClick={handleRandomQueue} className='button'>Random Match</button>
            <br />
            <br />
            <ChessLeaderboard />
        </div>
        
    )
}

export default ChessHomePage;