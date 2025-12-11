import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom';
import React from 'react'

import Navbar from './components/Navbar.jsx'; //purple bar at top of every 
import ChatBox from './components/ChatBox.jsx';

import ChessGame from './ChessGame.jsx';
import CheckersGame from './CheckersGame.jsx';
import ConnectGame from './ConnectGame.jsx';
import ChessHomePage from './ChessHome.jsx'; //page that lets us queue for chess
import CheckersHomePage from './CheckersHome.jsx';
import ConnectHomePage from './ConnectHome.jsx';
import AccountPage from './AccountPage.jsx'; //page that lets us sign in
import AccountInfo from './AccountInfo.jsx';
import SearchUsers from './SearchUsers.jsx'; //lets the user search for otehr users by username

function App() {

  return (
     <div id="app">
      <Navbar/> 
      <Routes>
        <Route path='/chess' element={<ChessHomePage/>} />
        <Route path='/chessMatch' element ={<ChessGame/>}/>
        <Route path='/checkers' element={<CheckersHomePage/>} />
        <Route path='/checkersMatch' element ={<CheckersGame/>}/>
        <Route path='/connect' element={<ConnectHomePage/>} />
        <Route path='/connectMatch' element ={<ConnectGame/>}/>

        <Route path='/search' element={<SearchUsers/>}/>

        <Route path='/login' element={<AccountPage/>} />
        <Route path='/account' element={<AccountInfo/>}/>
      </Routes>
      {/* <ChatBox/> */}
   </div>
  )
}

export default App
