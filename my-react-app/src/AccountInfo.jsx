import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
//import "./NavBar.css";
import axios from 'axios';
import ChallengeModal from './ChallengeModal.jsx';

function AccountInfo() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        const res = await axios.get(
            `${process.env.VITE_BACKEND_SERVER}/account/me`,{withCredentials: true}
        );
        setUser(res.data);
    };
    //const [showModal, setShowModal] = useState(false);
    const [challengedFriend, setChallengedFriend] = useState(null);
    console.log(user);

    useEffect(() => {
        fetchUser();

        // socket.on("eloUpdated", fetchUser);

        // return () => {
        //     socket.off("eloUpdated", fetchUser);
        // };
    }, []);


    async function handleChallengeFriend(friendUsername){
        if( window.confirm(`Are you sure you want to challenge ${friendUsername}?`)){
            try {
                const response = await axios.post(
                    `${process.env.VITE_BACKEND_SERVER}/account/challenge`,
                    {
                        from: user.username, 
                        to: friendUsername
                    },
                    { withCredentials: true}
                );
                console.log("did this finish?");
                alert(`${friendUsername} challenged!`);

                /*const response2 = await axios.post(
                    `${process.env.VITE_BACKEND_SERVER}/account/unchallenge`,
                    {
                        from: user.username, 
                        to: friendUsername
                    },
                    { withCredentials: true}
                );
                alert(`${friendUsername} unchallenged too!`);*/

                navigate(`/checkersCustom/${friendUsername}`);

            } catch (err) {
                console.error("Error challenging friend:", err);
                alert(err.response?.data?.error || "Failed to challenge friend");
            }
        }
    }

    async function handleChallengeAccept(friendUsername){
        if( window.confirm(`Are you sure you want to accept the challenge from ${friendUsername}?`)){
            try {


                const response2 = await axios.post(
                    `${process.env.VITE_BACKEND_SERVER}/account/unchallenge`,
                    {
                        from: friendUsername, 
                        to: user.username
                    },
                    { withCredentials: true}
                );
                alert(`${friendUsername} unchallenged too!`);

                navigate(`/checkersCustom/${friendUsername}`);

            } catch (err) {
                console.error("Error challenging friend:", err);
                alert(err.response?.data?.error || "Failed to challenge friend");
            }
        }
    }


    console.log(user);
    console.log(user ? user.friendList : "");
  return (
    <div>
        {user ? (<button onClick={fetchUser}>Refresh</button>) : <></>}

        {user ? (
            <div>
                <p>your name is {user.username ? user.username : 'unknown'}</p>

                <p>Signed up: {user.signupDate ? user.signupDate : 'unknown'}</p>

                <p>
                    Chess: 
                    {(user.winrates && user.winrates.chessWins !== undefined && user.winrates.chessLosses !== undefined ?  "W/L = " + user.winrates.chessWins/user.winrates.chessLosses : "W/L = " + 0)}
                    -
                    {(user.elo && user.elo.chess !== undefined ? "Elo = " + Math.floor(user.elo.chess) : "Elo = " + 0)}
                </p>

                <p>
                    Checkers: 
                    {(user.winrates && user.winrates.checkersWins !== undefined && user.winrates.checkersLosses !== undefined ?  "W/L =" + user.winrates.checkersWins/user.winrates.checkersLosses : "W/L = " + 0)}
                    -
                    {(user.elo && user.elo.checkers !== undefined ? "Elo = " + Math.floor(user.elo.checkers) :"Elo = " + 0)}
                </p>

                <p>
                    Connect4: 
                    {(user.winrates && user.winrates.connectWins !== undefined && user.winrates.connectLosses !== undefined ?  "W/L = " + user.winrates.connectWins/user.winrates.connectLosses : "W/L = " + 0)}
                    -
                    {(user.elo && user.elo.connect !== undefined ? "Elo = " + Math.floor(user.elo.connect) :"Elo = " + 0)}
                </p>

                <p>
                    Mania: 
                  {(user.winrates && user.winrates.maniaWins !== undefined && user.winrates.maniaLosses !== undefined ?  "W/L = " + user.winrates.maniaWins/user.winrates.maniaLosses : "W/L = " + 0)}
                    -
                    {(user.elo && user.elo.mania !== undefined ? "Elo = " + Math.floor(user.elo.mania) :"Elo = " + 0)}
                </p>

                <p>Friends:</p>
                {user.friendList && user.friendList.length > 0
                    ? user.friendList.map((username) => <li key={username}>{username}<button onClick={()=> handleChallengeAccept(challenger.from)}>Accept Challenge</button></li>)
                    : <p>No friends yet</p>
                }
                {user.challenges.map((challenger) => (
                    <li key={challenger}>
                        {challenger.from}
                        <button onClick={()=> handleChallengeAccept(challenger.from)}>Accept Challenge</button>
                    </li>
                ))}

                {challengedFriend && (
                    <ChallengeModal friendUsername={challengedFriend} user={user} onClose={()=>setChallengedFriend(null)}/>
                )}

            </div>
        ) : (
            <p>not signed in</p>
        )}
    </div>


    
  )
}

export default AccountInfo;