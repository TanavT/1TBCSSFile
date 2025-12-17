import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ManiaLeaderboard from './ManiaLeaderboard';


function ManiaHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    const handleRandomQueue = async () => {
        if(user){
            navigate("/maniaMatch");
        } else {
            navigate("/login")
        };
    }

    const handlePrivateMatch = async () => {
        if(user){
            navigate("/maniaMatch");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className='centerBox'>
            <h2>MANIA</h2>
            <button onClick={handleRandomQueue} className='button'>Random Match</button>
            <button onClick={handlePrivateMatch} className='button'>Challenge a friend</button>
            <ManiaLeaderboard />
        </div>
        
    )
}

export default ManiaHomePage;