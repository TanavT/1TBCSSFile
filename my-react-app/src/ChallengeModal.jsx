import React from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function ChallengeModal({friendUsername, user, onClose}) {
    const navigate = useNavigate();

    const handleChallenge = async(game) => {
        if (game == "checkers") {
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
        } else if (game=="chess") {
            const response = await axios.post(
                'http://localhost:3000/account/challengeChess',
                {
                    from: user.username, 
                    to: friendUsername
                },
                    { withCredentials: true}
            );
            alert(`${friendUsername} challenged!`);

            navigate(`/chessCustom/${friendUsername}`);
        } else if (game=="connect") {
            const response = await axios.post(
                'http://localhost:3000/account/challengeConnect',
                {
                    from: user.username, 
                    to: friendUsername
                },
                    { withCredentials: true}
            );
            alert(`${friendUsername} challenged!`);

            navigate(`/connectCustom/${friendUsername}`);
        } else {
            console.log("something else");
        }
    };
    return (
        <div>
            <button onClick={() =>handleChallenge("checkers")}>Checkers</button>
            <button onClick={() =>handleChallenge("chess")}>Chess</button>
            <button onClick={() =>handleChallenge("connect")}>Connect 4</button>
            <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
    )
}

export default ChallengeModal;