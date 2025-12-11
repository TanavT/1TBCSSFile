import { Link } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
//import "./NavBar.css";
import axios from 'axios';

function AccountInfo() {
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    console.log(user);
    console.log(user ? user.friendList : "");
  return (
    <div>
        {user ? (
            <div>
                <p>your name is {user.username} </p>
                <p>Signed up: {user.signupDate}</p>
                <p>Chess: {user.winrates.chessWins}-{user.winrates.chessLosses}</p>
                <p>Checkers: {user.winrates.checkersWins}-{user.winrates.checkersLosses}</p>
                <p>Connect4: {user.winrates.connectWins}-{user.winrates.connectLosses}</p>
                <p>Mania: {user.winrates.maniaWins}-{user.winrates.maniaLosses}</p>
                <p>Friends: </p>
                {user.friendList.map((username) => (
                    <li key={username}>{username}</li>
                ))}
            </div>
        ) : 
            (<p> not signed in</p>)}
    </div>
    
  )
}

export default AccountInfo;