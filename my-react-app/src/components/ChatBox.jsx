import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./ChatBox.css";


function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);
    const location = useLocation();
    const room = location.pathname.replace("/", "");

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io(
            `${import.meta.env.VITE_BACKEND_SERVER}/chat`,
            { withCredentials: true }
        )

        socketRef.current.on("userJoined", (msg) => {
            let message = {username: msg.username, text: msg.message};
            setMessages((prev) => [...prev, message]);
        }, [])
        
        socketRef.current.on("chatMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        
        socketRef.current.emit("joinRoom", room, user.username);

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);
    
    function sendMessage(e) {
        e.preventDefault();

        if (input.trim() === "" || !user) return;
        setMessages((prev) => [...prev, {username: user.username, text: input}]); // save current client's messages
        socketRef.current.emit("chatMessage", {
            room,
            username: user.username,
            text: input
        });

        setInput("");
    }

    async function handleAddFriend(friendUsername) {
        if (window.confirm(`Are you sure you want to add ${friendUsername} as a friend?`)) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_SERVER}/account/addFriend`,
                    {
                        userUsername: currentUser.username,
                        friendUsername: friendUsername
                    },
                    { withCredentials: true }
                );

                alert(`${friendUsername} added as friend!`);
                
                // Refresh current user data to get updated friend list
                const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true });
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
                    `${import.meta.env.VITE_BACKEND_SERVER}/account/deleteFriend`,
                    {
                        userUsername: currentUser.username,
                        friendUsername: friendUsername
                    },
                    { withCredentials: true }
                );

                alert(`${friendUsername} removed as a friend!`);
                
                // refresh current user data to get updated friend list
                const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, { withCredentials: true });
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

    // don't render until we know if user is logged in
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to chat</div>;
    }

    return (
        <div className="chatBox">
            <h3>Chat</h3>
            <div className="messageBox">
                {messages.map((m, i) => (
                    <div key={i}>
                        {typeof m === 'string' ? m : `${m.username}: ${m.text}`}
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="messageForm">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    className="inputBox"
                />
                <button type="submit" className="sendButton">{'>'}</button>
            </form>
        </div>
    );
}

export default ChatBox;