// import { useState } from "react";
import "./App.css";
import NowPlaying from "./components/now-playing";
import Queue from "./components/queue";
import ChatBox from "./components/chat/chatbox";

function App() {
    return (
        <>
            <div className="App">
                <div className="Chat">
                    <ChatBox />
                </div>
                <div className="Player">
                        <div className="CurrentlyPlaying">
                            <NowPlaying song={{
                                title: "Song Title",
                                artist: "Artist Name",
                                duration: "3:00",
                                cover: "https://via.placeholder.com/150",
                            }} />
                        </div>
                        <Queue />
                    </div>
            </div>
        </>
    );
}

export default App;
