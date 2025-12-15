import  {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { PhaserGame } from './PhaserGame';
import type { IRefPhaserGame } from './PhaserGame';


function ConnectGame(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

     const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        async function fetchUser() {
            let data
            try {
                const request = await axios.get("http://localhost:3000/account/me", { withCredentials: true })
                data = request.data
            } catch (e){
                console.log(e)
            }
            try {
                setUser(data)
            } catch {
                setUser(null)
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    const currentScene = (_scene: any) => { //I don't know what this does but it's from the Phaser starter code and it works so I'm gonna keep it as is
        //todo?
    }

    if (loading) return <p>Loading...</p>;
    return (
        <div>
            <h2>Connect4</h2>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} userID={user? user._id: "testing"}/>
            {user ?<> <h2>Username: {user.username}</h2>  </>: <h2>Please log in to play</h2>}
        </div>
        
    )
}

export default ConnectGame;