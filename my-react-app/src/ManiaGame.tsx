import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { IRefPhaserGame, PhaserGame } from './mania/PhaserGame';
import { PhaserGameCheckers } from './mania/PhaserGameCheckers';
import { PhaserGameConnect } from './mania/PhaserGameConnect';

function ManiaGame(){
    const [user, setUser] = useState(null);
    
     const phaserRef = useRef<IRefPhaserGame | null>(null);
     const phaserRef2 = useRef<IRefPhaserGame | null>(null);
     const phaserRef3 = useRef<IRefPhaserGame | null>(null);


    const [game2, setGame2] = useState(false);
     const [game3, setGame3] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGame2(true);
    }, 500);
  }, []); // Empty dependency array ensures this effect runs once after initial render

    useEffect(() => {
    const timer = setTimeout(() => {
      setGame3(true);
    }, 1000);
  }, [game2]);

    useEffect(() => {
        axios.get(`${process.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(() => setUser(null));
    }, [])

     const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }
    const currentScene2 = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }
    const currentScene3 = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    return (
        <div>
            <h2>Mania</h2>
            <div>
            <PhaserGameConnect ref={phaserRef2} currentActiveScene={currentScene2} />

            {game2 ? <PhaserGame ref={phaserRef} currentActiveScene={currentScene} /> : <></>}

            {game3 ? <PhaserGameCheckers ref={phaserRef3} currentActiveScene={currentScene3} user={user} gametype="queue"/> : <></>}


            </div>
            {user ? <h2>Username: {user.username}</h2> : <h2>Please log in to play</h2>}
        </div>
        
    )
}

export default ManiaGame;