import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom';
import React from 'react'

import Navbar from './components/Navbar.jsx'; //purple bar at top of every 
import ChatBox from './components/ChatBox.jsx';

import ChessGame from './ChessGame.jsx';
import CheckersGame from './CheckersGame.tsx';
import CheckersCustomGame from './CheckersCustomGame.tsx';
import ChessCustomGame from './ChessCustom.tsx';
import ConnectCustom from './ConnectCustom.tsx';
import ConnectGame from './ConnectGame.tsx';
import ManiaGame from './ManiaGame.jsx';
import ChessHomePage from './ChessHome.jsx'; //page that lets us queue for chess
import CheckersHomePage from './CheckersHome.jsx';
import ConnectHomePage from './ConnectHome.jsx';
import ManiaHomePage from './ManiaHome.jsx';
import AccountPage from './AccountPage.jsx'; //page that lets us sign in
import AccountInfo from './AccountInfo.jsx';
import ConnectLeaderboard from './ConnectLeaderboard.jsx';
import ChessLeaderboard from './ChessLeaderboard.jsx';
import CheckersLeaderboard from './CheckersLeaderboard.jsx';
import ManiaLeaderboard from './ManiaLeaderboard.jsx';


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
        <Route path='/checkersCustom/:enemyId' element ={<CheckersCustomGame/>}/>
        <Route path='/chessCustom/:enemyId' element ={<ChessCustomGame/>}/>
        <Route path='/connectCustom/:enemyId' element={<ConnectCustom/>}/>
        <Route path='/connect' element={<ConnectHomePage/>} />
        <Route path='/connectMatch' element ={<ConnectGame/>}/> 
         <Route path='/mania' element={<ManiaHomePage/>} />
        <Route path='/maniaMatch' element ={<ManiaGame/>}/>

        <Route path='/search' element={<SearchUsers/>}/>

        <Route path='/connectLeaderboard' element={<ConnectLeaderboard/>}/>
        <Route path='/chessLeaderboard' element={<ChessLeaderboard/>}/>
        <Route path='/checkersLeaderboard' element={<CheckersLeaderboard/>}/>
        <Route path='/maniaLeaderboard' element={<ManiaLeaderboard/>}/>

        <Route path='/login' element={<AccountPage/>} />
        <Route path='/account' element={<AccountInfo/>}/> 
      </Routes>
   </div>
  )
}

export default App
