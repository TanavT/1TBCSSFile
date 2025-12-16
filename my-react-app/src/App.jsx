import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom';
import React from 'react'

import Navbar from './components/Navbar.jsx'; //purple bar at top of every page

import ChessGame from './ChessGame.jsx';
import CheckersGame from './CheckersGame.tsx';
import ConnectGame from './ConnectGame.jsx';
import ManiaGame from './ManiaGame.jsx';
import ChessHomePage from './ChessHome.jsx'; //page that lets us queue for chess
import CheckersHomePage from './CheckersHome.jsx';
import ConnectHomePage from './ConnectHome.jsx';
import ManiaHomePage from './ManiaHome.jsx';
import AccountPage from './AccountPage.jsx'; //page that lets us sign in
import AccountInfo from './AccountInfo.jsx';


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
         <Route path='/mania' element={<ManiaHomePage/>} />
        <Route path='/maniaMatch' element ={<ManiaGame/>}/>

        <Route path='/login' element={<AccountPage/>} />
        <Route path='/account' element={<AccountInfo/>}/>
      </Routes>
   </div>
  )
}

export default App
