import { useState, useEffect } from "react";
import axios from "axios";

function SearchUsers() {
    const [userResults, setUserResults] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Get the current logged-in user
    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data);
                setUserLoading(false);
            })
            .catch(() => {
                setCurrentUser(null);
                setUserLoading(false);
            });
    }, []);

    async function handleSearch(e) {
        e.preventDefault();
        if (input.trim() === "") return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(
                "http://localhost:3000/api/users/search",
                {
                    params: { username: input },
                    withCredentials: true
                }
            );

            setUserResults(response.data);
        } catch (err) {
            console.error("Error searching users:", err);
            setError("Failed to search users");
            setUserResults([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddFriend(friendUsername) {
        if (window.confirm(`Are you sure you want to add ${friendUsername} as a friend?`)) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/account/addFriend',
                    {
                        userUsername: currentUser.username,
                        friendUsername: friendUsername
                    },
                    { withCredentials: true }
                );

                alert(`${friendUsername} added as friend!`);
                
                // Refresh current user data to get updated friend list
                const userRes = await axios.get("http://localhost:3000/account/me", { withCredentials: true });
                console.log("REFRESHING USER FROM SEARCH PAGE");
                console.log(userRes);
                setCurrentUser(userRes.data);
            } catch (err) {
                console.error("Error adding friend:", err);
                alert(err.response?.data?.error || "Failed to add friend");
            }
        }
    }

    async function handleDeleteFriend(friendUsername) {
        if (window.confirm(`Are you sure you want to delete ${friendUsername} as a friend?`)) {
            try {
                const response = await axios.post(
                    'http://localhost:3000/account/deleteFriend',
                    {
                        userUsername: currentUser.username,
                        friendUsername: friendUsername
                    },
                    { withCredentials: true }
                );

                alert(`${friendUsername} removed as a friend!`);
                
                // refresh current user data to get updated friend list
                const userRes = await axios.get("http://localhost:3000/account/me", { withCredentials: true });
                setCurrentUser(userRes.data);
            } catch (err) {
                console.error("Error deleting friend:", err);
                alert(err.response?.data?.error || "Failed to delete friend");
            }
        }
    }

    function canAddFriend(user) {
        if (!currentUser) return false;
        
        if (user.username === currentUser.username) {
            return false;
        }
        
        if (currentUser.friendList && currentUser.friendList.includes(user.username)) {
            return false;
        }
        
        return true;
    }

    function canDeleteFriend(user) {
        if (!currentUser) return false;
        
        if (user.username === currentUser.username) {
            return false;
        }
        
        if (currentUser.friendList && !currentUser.friendList.includes(user.username)) {
            return false;
        }
        
        return true;
    }

    if (userLoading) return <div><p>Loading user data...</p></div>;
    if (!currentUser) return <div><p>Please log in to search for users.</p></div>;

    return (
        <div>
            <h1>Search Users</h1>
            
            <form onSubmit={handleSearch}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search for a user..."
                    />
                </label>
                <button type="submit">Search</button>
            </form>

            {loading && <div><p>Loading...</p></div>}
            {error && <div><p style={{color: 'red'}}>{error}</p></div>}

            <div>
                {userResults.length > 0 ? (
                    userResults.map((user) => (
                        <div key={user.id || user.username}>
                            <h3>{user.username}</h3>
                            <p>Signup Date: {user.signupDate}</p>
                            
                            {canAddFriend(user) ? (
                                <button onClick={() => handleAddFriend(user.username)}>
                                    Add Friend
                                </button>
                            ) : user.username === currentUser.username ? (
                                <p><em>This is you</em></p>
                            ) : (
                                <p><em>Already friends</em></p>
                            )}

                            {canDeleteFriend(user) ? (
                                <button onClick={() => handleDeleteFriend(user.username)}>
                                    Delete Friend
                                </button>
                            ) : user.username === currentUser.username ? (
                                <br />
                            ) : (
                                <br />
                            )}
                            <hr />
                        </div>
                    ))
                ) : (
                    !loading && <p>No users found</p>
                )}
            </div>
        </div>
    );
}

export default SearchUsers;