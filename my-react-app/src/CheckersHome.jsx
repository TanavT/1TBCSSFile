import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function CheckersHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
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
        <div>
            <h2>CHECKERS</h2>
            <button onClick={handleRandomQueue}>Queue Random Match</button>
        </div>
        
    )
}

export default CheckersHomePage;