import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function ConnectHomePage(){
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    const handleRandomQueue = async () => {
        navigate("/connectMatch"); //just making this here for now so its easier
        // if(user){
        //     navigate("/connectMatch");
        // } else {
        //     navigate("/login")
        // };
    }

    const handlePrivateMatch = async () => {
        if(user){
            navigate("/connectMatch");
        } else {
            navigate("/login");
        }
    }

    return (
        <div>
            <h2>CONNECT 4</h2>
            <button onClick={handleRandomQueue}>Random Match</button>
            <button onClick={handlePrivateMatch}>Challenge a friend</button>
        </div>
        
    )
}

export default ConnectHomePage;