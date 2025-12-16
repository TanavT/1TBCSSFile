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
                <p>your name is {user.username ? user.username : 'unknown'}</p>

                <p>Signed up: {user.signupDate ? user.signupDate : 'unknown'}</p>

                <p>
                    Chess: 
                    {(user.winrates && user.winrates.chessWins !== undefined ? user.winrates.chessWins : 0)}
                    -
                    {(user.winrates && user.winrates.chessLosses !== undefined ? user.winrates.chessLosses : 0)}
                </p>

                <p>
                    Checkers: 
                    {(user.winrates && user.winrates.checkersWins !== undefined ? user.winrates.checkersWins : 0)}
                    -
                    {(user.winrates && user.winrates.checkersLosses !== undefined ? user.winrates.checkersLosses : 0)}
                </p>

                <p>
                    Connect4: 
                    {(user.winrates && user.winrates.connectWins !== undefined ? user.winrates.connectWins : 0)}
                    -
                    {(user.winrates && user.winrates.connectLosses !== undefined ? user.winrates.connectLosses : 0)}
                </p>

                <p>
                    Mania: 
                    {(user.winrates && user.winrates.maniaWins !== undefined ? user.winrates.maniaWins : 0)}
                    -
                    {(user.winrates && user.winrates.maniaLosses !== undefined ? user.winrates.maniaLosses : 0)}
                </p>

                <p>Friends:</p>
                {user.friendList && user.friendList.length > 0
                    ? user.friendList.map((username) => <li key={username}>{username}</li>)
                    : <p>No friends yet</p>
                }
            </div>
        ) : (
            <p>not signed in</p>
        )}
    </div>


    
  )
}

export default AccountInfo;