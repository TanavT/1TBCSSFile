import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react'

function AccountPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_SERVER}/account/login`,
                { username, password },
                { withCredentials: true }
            );
            console.log(res);
            navigate("/chess");
            setMessage(`Logged in as ${res.data.username}`);
        } catch (e) {
            console.log(e);
            setMessage('Login failed');
        }
    }

    const handleSignup = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_SERVER}/account/signup`,
                { username, password },
                { withCredentials: true } // include session cookie
            );
            navigate('/chess');
            setMessage(`Signed up as ${res.data.username}`);
        } catch (e) {
            setMessage('Signup failed');
        }
    }

    return (
        <div>
            <div>
                <input type="text" placeholders="Username" value={username} onChange={e =>setUsername(e.target.value)} />
                <input type="text" placeholders="Password" value={password} onChange={e =>setPassword(e.target.value)} />
            </div>

            <div>
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleSignup}>Signup</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AccountPage;