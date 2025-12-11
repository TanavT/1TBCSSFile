import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./ChatBox.css";

const socket = io("http://localhost:3000");

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.on("chatMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chatMessage");
        };
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/account/me", { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);
    
    function sendMessage(e) {
        e.preventDefault();

        if (input.trim() === "" || !user) return;

        // attaching username to the method
        const messageData = {
            username: user.username,
            text: input
        };
        
        socket.emit("chatMessage", messageData);
        setInput("");
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
                <button type="submit" className="sendButton">Send</button>
            </form>
        </div>
    );
}

export default ChatBox;