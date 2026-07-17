
import { askAI } from "../Services/AIService";
import Message from "./Message";
import { useState, useEffect } from "react";

function ChatBox({ selectedQuestion }) {


    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() => {

    if (selectedQuestion) {

        setQuestion(selectedQuestion);

        askSuggestedQuestion(selectedQuestion);

    }

}, [selectedQuestion]);

const askSuggestedQuestion = async (text) => {

    setMessages(prev => [
        ...prev,
        {
            sender: "user",
            text: text
        }
    ]);

    try {

        const response = await askAI(text);

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: response.data
            }
        ]);

    } catch {

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "Unable to connect to AI."
            }
        ]);

    }

};

    const sendQuestion = async () => {

        if (!question.trim()) return;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: question
            }
        ]);

        try {

            const response = await askAI(question);

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data
                }
            ]);

        } catch {

            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "Unable to connect to AI."
                }
            ]);

        }

        setQuestion("");

    };

    return (

        <div>

            <div
                className="border rounded p-3 mb-3"
                style={{
                    height: "400px",
                    overflowY: "auto"
                }}
            >

                {messages.map((msg, index) => (

                    <Message
                        key={index}
                        sender={msg.sender}
                        text={msg.text}
                    />

                ))}

            </div>

            <div className="input-group">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Ask AI..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <button
                    className="btn btn-success"
                    onClick={sendQuestion}
                >
                    Ask AI
                </button>

            </div>

        </div>

    );
}

export default ChatBox;