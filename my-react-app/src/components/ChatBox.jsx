import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./ChatBox.css";

const socket = io("http://localhost:3000");

function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("chatMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chatMessage");
        };
    }, []); // IMPORTANT!!
    
    function sendMessage(e) {
        e.preventDefault();

        if (input.trim() === "") return;

        socket.emit("chatMessage", input);
        setInput("");
    }

    return (
        <div className="chatBox">
            <h3>Chat</h3>
            <div className="messageBox">
                {messages.map((m, i) => (
                    <div key={i}>{m}</div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="messageForm">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="type something..."
                    className="inputBox"
                />
                <button type="submit" className="sendButton">Send</button>
            </form>
        </div>
    );
}

export default ChatBox;
