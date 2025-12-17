import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CheckersLeaderboard from './CheckersLeaderboard';


function CheckersHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    const handleRandomQueue = async () => {
        if(user){
            navigate("/checkersMatch");
        } else {
            navigate("/login")
        };
    }

    const handlePrivateMatch = async () => {
        if(user){
            navigate("/checkersMatch");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className='centerBox'>
            <h2>CHECKERS</h2>
            <button onClick={handleRandomQueue} className='button'>Random Match</button>
            
            <br />
            <br />
            <CheckersLeaderboard />
        </div>
        
    )
}

export default CheckersHomePage;