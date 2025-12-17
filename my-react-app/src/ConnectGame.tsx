import  {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { PhaserGame } from './PhaserGame';
import type { IRefPhaserGame } from './PhaserGame';
import { useNavigate } from 'react-router-dom';
import ChatBox from './components/ChatBox.jsx';
import { useAuth } from './AuthContext';


function ConnectGame(){
    const {user} = useAuth();
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

     const phaserRef = useRef<IRefPhaserGame | null>(null);

    // const navigate = useNavigate();

    // useEffect(() => {
    //     async function fetchUser() {
    //         let data
    //         try {
    //             const request = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
    //             data = request.data
    //         } catch (e){
    //             console.log(e)
    //         }
    //         try {
    //             setUser(data)
    //         } catch {
    //             setUser(null)
    //         }
    //         setLoading(false)
    //     }
    //     fetchUser()
    // }, [])

    const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    if(loading) {
        <p>Loading...</p>
    }

    if(user){
        return (
            <div>
                <h2>Connect4</h2>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} user={user} gametype="queue" userID={user? user._id: "testing"}/>
                {user ?<> <h2>Username: {user.username}</h2>  </>: <h2>Please log in to play</h2>}
                <ChatBox />
            </div>
            
        )
    } else {
        return <p>loading...</p>
    }
}

export default ConnectGame;