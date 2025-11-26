import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom';

import Navbar from './components/Navbar.jsx'; //purple bar at top of every page

import ChessGame from './ChessGame.jsx';
import CheckersGame from './CheckersGame.jsx';
import ConnectGame from './ConnectGame.jsx';
import ChessHomePage from './ChessHome.jsx'; //page that lets us queue for chess
import CheckersHomePage from './CheckersHome.jsx';
import ConnectHomePage from './ConnectHome.jsx';
import AccountPage from './AccountPage.jsx'; //page that lets us sign in
import AccountInfo from './AccountInfo.jsx';


function App() {

  return (
    <>
      <Navbar/> 
      <Routes>
        <Route path='/chess' element={<ChessHomePage/>} />
        <Route path='/chessMatch' element ={<ChessGame/>}/>
        <Route path='/checkers' element={<CheckersHomePage/>} />
        <Route path='/checkersMatch' element ={<CheckersGame/>}/>
        <Route path='/connect' element={<ConnectHomePage/>} />
        <Route path='/connectMatch' element ={<ConnectGame/>}/>

        <Route path='/login' element={<AccountPage/>} />
        <Route path='/account' element={<AccountInfo/>}/>
      </Routes>
    </>
  )
}

export default App
