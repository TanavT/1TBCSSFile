import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CheckersLeaderboard() {

    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchLeaderboard = async () => {
        const res = await axios.get(
            "http://localhost:3000/leaderboard/checkers",{withCredentials: true}
        );
        setLeaderboard(res.data);
        setLoading(false)
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    if (loading) return <p>Loading...</p>;
    console.log(leaderboard)
   return (
    <div>
        {leaderboard ? (<button onClick={fetchLeaderboard}>Refresh</button>) : <></>}

        {leaderboard ? (
            <div className="leaderboard">
            <h2>Checkers</h2>

            <table className="leaderboard-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Elo</th>
                </tr>
                </thead>

                <tbody>
                {leaderboard.length === 0 ? (
                    <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                        No players rated
                    </td>
                    </tr>
                ) : (
                    leaderboard.map((player, index) => (
                    <tr key={player.username}>
                        <td>{index + 1}</td>
                        <td>{player.username}</td>
                        <td>{Math.floor(player.elo)}</td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>

            ): <></>}
    </div>
    
  )
}

export default CheckersLeaderboard;