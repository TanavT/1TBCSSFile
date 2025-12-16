import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';

function CheckersGame(){
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

    return (
        <div>
            <h2>CHECKERS</h2>
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
        </div>
        
    )
}

export default CheckersGame;