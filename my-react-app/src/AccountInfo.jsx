import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import ChallengeModal from './ChallengeModal.jsx';

function AccountInfo() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        const res = await axios.get(
            "http://localhost:3000/account/me",{withCredentials: true}
        );
        setUser(res.data);
    };
    const [challengedFriend, setChallengedFriend] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);



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
                alert(`${friendUsername} challenged!`);
                navigate(`/checkersCustom/${friendUsername}`);
            } catch (err) {
                console.error("Error challenging friend:", err);
                alert(err.response?.data?.error || "Failed to challenge friend");
            }
        }
    }

    async function handleChallengeAccept(friendUsername, game){
        if( window.confirm(`Are you sure you want to accept the challenge from ${friendUsername}?`)){
            try {
                if(game == "checkers"){
                    const response2 = await axios.post(
                    'http://localhost:3000/account/unchallenge',
                    {
                        from: friendUsername, 
                        to: user.username
                    },
                    { withCredentials: true}
                    );
                    alert(`${friendUsername}'s challenge accepted!`);

                navigate(`/checkersCustom/${friendUsername}`);

                } else if (game == "chess"){
                    //console.log("got your ass");
                    const response2 = await axios.post(
                    'http://localhost:3000/account/unchallengeChess',
                    {
                        from: friendUsername, 
                        to: user.username
                    },
                    { withCredentials: true}
                    );
                    alert(`${friendUsername}'s challenge accepted!`);

                    navigate(`/chessCustom/${friendUsername}`);
                } else if (game == "connect"){
                    const response2 = await axios.post(
                    'http://localhost:3000/account/unchallengeConnect',
                    {
                        from: friendUsername, 
                        to: user.username
                    },
                    { withCredentials: true}
                    );
                    alert(`${friendUsername}'s challenge accepted!`);

                    navigate(`/connectCustom/${friendUsername}`);
                }



                } catch (err) {
                    console.error("Error challenging friend:", err);
                    alert(err.response?.data?.error || "Failed to challenge friend");
            }
        }
    }

    const getGameStats = (wins, losses, ties) => {
        const w = wins || 0;
        const l = losses || 0;
        const t = ties || 0;
        const total = w + l + t;
        const winRate = total > 0 ? ((w / total) * 100).toFixed(1) : 0;
        return { w, l, t, total, winRate };
    };
    
    return (
        <div className="account-container">
            {user ? (
                <div>
                    <div className="account-header">
                        <h2>Account Information</h2>
                        <p><strong>Username:</strong> {user.username || 'unknown'}</p>
                        <p><strong>Signed up:</strong> {user.signupDate || 'unknown'}</p>
                    </div>

                    <div className="stats-section">
                        <h3>Game Statistics</h3>
                        
                        <div className="stats-grid">
                            <div className="game-stat-card">
                                <h4>Chess</h4>
                                {(() => {
                                    const stats = getGameStats(
                                        user.winrates?.chessWins,
                                        user.winrates?.chessLosses,
                                        user.winrates?.chessTies
                                    );
                                    return (
                                        <>
                                            <p>Wins: {stats.w} | Losses: {stats.l} | Ties: {stats.t}</p>
                                            <p>Total Games: {stats.total}</p>
                                            <p>Win Rate: {stats.winRate}%</p>
                                            <p>Elo: {user.elo?.chess ? Math.floor(user.elo.chess) : 800}</p>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="game-stat-card">
                                <h4>Checkers</h4>
                                {(() => {
                                    const stats = getGameStats(
                                        user.winrates?.checkersWins,
                                        user.winrates?.checkersLosses,
                                        user.winrates?.checkersTies
                                    );
                                    return (
                                        <>
                                            <p>Wins: {stats.w} | Losses: {stats.l} | Ties: {stats.t}</p>
                                            <p>Total Games: {stats.total}</p>
                                            <p>Win Rate: {stats.winRate}%</p>
                                            <p>Elo: {user.elo?.checkers ? Math.floor(user.elo.checkers) : 800}</p>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="game-stat-card">
                                <h4>Connect 4</h4>
                                {(() => {
                                    const stats = getGameStats(
                                        user.winrates?.connectWins,
                                        user.winrates?.connectLosses,
                                        user.winrates?.connectTies
                                    );
                                    return (
                                        <>
                                            <p>Wins: {stats.w} | Losses: {stats.l} | Ties: {stats.t}</p>
                                            <p>Total Games: {stats.total}</p>
                                            <p>Win Rate: {stats.winRate}%</p>
                                            <p>Elo: {user.elo?.connect ? Math.floor(user.elo.connect) : 800}</p>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="game-stat-card">
                                <h4>Mania</h4>
                                {(() => {
                                    const stats = getGameStats(
                                        user.winrates?.maniaWins,
                                        user.winrates?.maniaLosses,
                                        user.winrates?.maniaTies
                                    );
                                    return (
                                        <>
                                            <p>Wins: {stats.w} | Losses: {stats.l} | Ties: {stats.t}</p>
                                            <p>Total Games: {stats.total}</p>
                                            <p>Win Rate: {stats.winRate}%</p>
                                            <p>Elo: {user.elo?.mania ? Math.floor(user.elo.mania) : 800}</p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="friends-section">
                        <h3>Friends</h3>
                        {user.friendList && user.friendList.length > 0 ? (
                            <ul>
                                {user.friendList.map((username) => (
                                    <li key={username}>
                                        <span>{username}</span>
                                        <button 
                                            onClick={() => handleChallengeFriend(username)}
                                            className="challenge-button"
                                        >
                                            Challenge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No friends yet</p>
                        )}
                    </div>

                    <div className="challenges-section">
                        <h3>Pending Challenges</h3>
                        {user.challenges && user.challenges.length > 0 ? (
                            <ul>
                                {user.challenges.map((challenger) => (
                                    <li key={challenger.from}>
                                        <span>{challenger.from}</span>
                                        <button 
                                            onClick={() => handleChallengeAccept(challenger.from)}
                                            className="accept-button"
                                        >
                                            Accept Challenge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No pending challenges</p>
                        )}
                    </div>

                    {challengedFriend && (
                        <ChallengeModal 
                            friendUsername={challengedFriend} 
                            user={user} 
                            onClose={() => setChallengedFriend(null)}
                        />
                    )}
                </div>
            ) : (
                <p className="not-signed-in">Not signed in</p>
            )}
            {user && <button onClick={fetchUser} className="refresh-button">Refresh</button>}
        </div>
    );
}

export default AccountInfo;