import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ConnectLeaderboard from './ConnectLeaderboard';


function ConnectHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    const handleRandomQueue = async () => {
        navigate("/connectMatch"); //just making this here for now so its easier
        if(user){
            navigate("/connectMatch");
        } else {
            navigate("/login")
        };
    }

    const handlePrivateMatch = async () => {
        if(user){
            navigate("/connectMatch");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className='centerBox'>
            <h2>CONNECT 4</h2>
            <button onClick={handleRandomQueue} className='button'>Random Match</button>
           
           <br />
            <br />
            <ConnectLeaderboard />
        </div>
        
    )
}

export default ConnectHomePage;