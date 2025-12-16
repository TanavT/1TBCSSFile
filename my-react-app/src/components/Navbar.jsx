import { Link } from "react-router-dom";
import React, {useContext, useState, useEffect} from 'react';
import "./NavBar.css";
import axios from 'axios';

function NavBar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">MyChessApp</h1>
        <Link to="/chess" className="nav-link">Chess</Link>
        <Link to="/checkers" className="nav-link">Checkers</Link>
        <Link to="/connect" className="nav-link">Connect</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <Link to="/account" className="nav-button">Account</Link>
          //<p>Signed in as {user.username}</p>
        ) : (
          <Link to="/login" className="nav-button">Sign In</Link>
          //<p>Not signed in</p>
        )}
      </div>
    </nav>
  );
}

export default NavBar;