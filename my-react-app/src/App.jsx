import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom';
import React from 'react'

import Navbar from './components/Navbar.jsx'; //purple bar at top of every 
import ChatBox from './components/ChatBox.jsx';

import HomePage from './HomePage.jsx';
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
import ProtectedRoute from "./ProtectedRoutes";
import SearchUsers from './SearchUsers.jsx'; //lets the user search for otehr users by username
function App() {

  return (
     <div id="app">
      <Navbar/> 
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/chess' element={ <ProtectedRoute><ChessHomePage/></ProtectedRoute>} />
        <Route path='/chessMatch' element ={ <ProtectedRoute><ChessGame/></ProtectedRoute>}/>
        <Route path='/checkers' element={ <ProtectedRoute><CheckersHomePage/></ProtectedRoute>} />
        <Route path='/checkersMatch' element ={ <ProtectedRoute><CheckersGame/></ProtectedRoute>}/>
        <Route path='/checkersCustom/:enemyId' element ={ <ProtectedRoute><CheckersCustomGame/></ProtectedRoute>}/>
        <Route path='/chessCustom/:enemyId' element ={ <ProtectedRoute><ChessCustomGame/></ProtectedRoute>}/>
        <Route path='/connectCustom/:enemyId' element={ <ProtectedRoute><ConnectCustom/></ProtectedRoute>}/>
        <Route path='/connect' element={ <ProtectedRoute><ConnectHomePage/></ProtectedRoute>} />
        <Route path='/connectMatch' element ={ <ProtectedRoute><ConnectGame/></ProtectedRoute>}/> 
         <Route path='/mania' element={ <ProtectedRoute><ManiaHomePage/></ProtectedRoute>} />
        <Route path='/maniaMatch' element ={ <ProtectedRoute><ManiaGame/></ProtectedRoute>}/>

        <Route path='/search' element={<SearchUsers/>}/>

        <Route path='/login' element={<AccountPage/>} />
        <Route path='/account' element={<AccountInfo/>}/> 
      </Routes>
   </div>
  )
}

export default App
