import "./index.css";
import { IoSend } from "react-icons/io5";
// import { useEffect, useState } from "react";

// const [messages, setMessages] = useState([]);

let messages = [
    {
        user: "user1",
        message: "Hello",
    },
    {
        user: "user2",
        message: "Hi",
    },
    {
        user: "user1",
        message: "How are you?",
    },
];

// function fetchMessages() {
//     fetch("http://localhost:3001/messages")
//         .then((response) => response.json())
//         .then((data) => console.log(data));
// }

function ChatBox() {
    return (
        <>
            <div className="Chatbox">
                {messages.map((message, index) => {
                    if (message.user === "user1") {
                        return (
                            <div key={index} className="message user">
                                <p>{message.user}</p>
                                <p>{message.message}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="message other">
                                <p>{message.message}</p>
                                <p>{message.user}</p>
                            </div>
                        );
                    }
                })}
            </div>
            <div className="Bottom">
                <input placeholder="Type your message"></input>
                <button>
                    <IoSend />
                </button>
            </div>
        </>
    );
}

export default ChatBox;
