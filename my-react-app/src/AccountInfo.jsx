import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
//import "./NavBar.css";
import axios from 'axios';
import ChallengeModal from './ChallengeModal.jsx';

function AccountInfo() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    //const [showModal, setShowModal] = useState(false);
    const [challengedFriend, setChallengedFriend] = useState(null);
    console.log(user);

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    async function handleChallengeFriend(friendUsername){
        if( window.confirm(`Are you sure you want to challenge ${friendUsername}?`)){
            try {
                const response = await axios.post(
                    'http://localhost:3000/account/challenge',
                    {
                        from: user.username, 
                        to: friendUsername
                    },
                    { withCredentials: true}
                );
                console.log("did this finish?");
                alert(`${friendUsername} challenged!`);

                /*const response2 = await axios.post(
                    'http://localhost:3000/account/unchallenge',
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
                    'http://localhost:3000/account/unchallenge',
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
                    <li key={username}>
                        {username}
                        <button onClick={()=> setChallengedFriend(username)}>Challenge</button>
                    </li>
                ))}
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
        ) : 
            (<p> not signed in</p>)}
    </div>
  )
}

export default AccountInfo;