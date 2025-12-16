import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function ChessHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

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
        <div className="centerBox">
            <h2>CHESS</h2>
            <button onClick={handleRandomQueue} className='matchButton'>Random Match</button>
            <button onClick={handlePrivateMatch} className='matchButton'>Challenge a friend</button>
        </div>
        
    )
}

export default ChessHomePage;