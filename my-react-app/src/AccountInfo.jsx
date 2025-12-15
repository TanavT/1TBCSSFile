import { Link } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
//import "./NavBar.css";
import axios from 'axios';

function AccountInfo() {
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(
                "http://localhost:3000/account/me",{withCredentials: true}
            );
            setUser(res.data);
        };

        fetchUser();

        socket.on("eloUpdated", fetchUser);

        return () => {
            socket.off("eloUpdated", fetchUser);
        };
    }, []);


    console.log(user);
  return (
    <div>
        {user ? (
            <div>
                <h2>{user.username} </h2>
                <p>Signed up: {user.signupDate}</p>
                <div className="GameRecords">
                    <h3>Game Records</h3>
                    <p>Chess: W/L = {user.winrates.chessWins}/{user.winrates.chessLosses}, Elo = {Math.floor(user.elo.chess)}</p>
                    <p>Checkers: W/L = {user.winrates.checkersWins}/{user.winrates.checkersLosses}, Elo = {Math.floor(user.elo.checkers)}</p>
                    <p>Connect4: W/L = {user.winrates.connectWins}/{user.winrates.connectLosses}, Elo = {Math.floor(user.elo.connect)}</p>
                    <p>Mania: W/L = {user.winrates.maniaWins}/{user.winrates.maniaLosses}, Elo = {Math.floor(user.elo.mania)}</p>
                </div>
                {/* <div className="Elo">
                    <h3>Elo</h3>
                    <p>Chess: {Math.floor(user.elo.chess)}</p>
                    <p>Checkers: {Math.floor(user.elo.checkers)}</p>
                    <p>Connect4: {Math.floor(user.elo.connect)}</p>
                    <p>Mania: {Math.floor(user.elo.mania)}</p>
                </div> */}
            </div>
        ) : 
            (<p> not signed in</p>)}
    </div>
    
  )
}

export default AccountInfo;