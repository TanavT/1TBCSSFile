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