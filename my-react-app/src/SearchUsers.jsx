import { useState, useEffect } from "react"
import { accounts } from "./routes/mongo/MongoCollections"

function SearchUsers() {
    const [userResults, setUserResults] = useState(null);
    const [input, setInput] = useState("");

    async function sendMessage(e) {
        e.preventDefault();
        if (input.trim() === "") return;
        
        try {
            const accountsCollection = await accounts();
            const result = await accountsCollection.findOne({username: input});
            setUserResults(result);
        } catch (error) {
            console.error("Error searching users:", error);
            setUserResults(null);
        }
    }

    useEffect(async () => {
        const accountsCollection = await accounts();
        setUserResults(await accountsCollection.findOne({username: input}));
    }, [])

    return (
        <div>
            <form onSubmit={sendMessage} className="messageForm">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="type something..."
                    className="inputBox"
                    />
                <button type="submit" className="sendButton">Send</button>
            </form>
            {userResults ? (
                <p>Result: {JSON.stringify(userResults)}</p>
            ) : (
                <p>Nothing</p>
            )}
        </div>
    )
}

export default SearchUsers