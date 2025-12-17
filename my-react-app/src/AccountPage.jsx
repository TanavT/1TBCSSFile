import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react'
import { useAuth } from "./AuthContext.tsx";


function AccountPage() {
    const {setUser} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_SERVER}/account/login`,
                { username, password },
                { withCredentials: true }
            );
            setUser(res.data)
            console.log(res);
            window.location.replace('/')
            setMessage(`Logged in as ${res.data.username}`);
        } catch (e) {
            console.log(e);
            setMessage(JSON.stringify(e.response?.data.error) || e);
            // setMessage('Login failed');
        }
    }

    const handleSignup = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_SERVER}/account/signup`,
                { username, password },
                { withCredentials: true }
            );
            setUser(res.data)
            navigate('/account');
            setMessage(`Signed up as ${res.data.username}`);
        } catch (e) {
            setMessage(JSON.stringify(e.response?.data.error) || e.message);
            console.log('Full error:', e.response);
        }
    }

    return (
        <div className="centerBox">
            <h2>Account</h2>
            
            <div className="account-form-group">
                <label>Username:</label>
                <input 
                    type="text" 
                    placeholder="Username" 
                    // value={username} 
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <div className="account-form-group">
                <label>Password:</label>
                <input 
                    type="password" 
                    placeholder="Password" 
                    // value={password} 
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <div className="account-buttons">
                <button onClick={handleLogin} className="button">Login</button>
                <button onClick={handleSignup} className="button">Signup</button>
            </div>
            
            {message && <p className="account-message">{message}</p>}
        </div>
    );
}

export default AccountPage;