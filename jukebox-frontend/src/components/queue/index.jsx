import "./index.css";
// fa icons plus and skip
import { BsFillSkipEndFill } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
function fetchQueue() {
    return [
        {
            title: "Song Title",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title2",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title3",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title4",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
        {
            title: "Song Title",
            artist: "Artist Name",
            duration: "3:00",
            cover: "https://via.placeholder.com/150",
        },
    ];
}

function Queue() {
    return (
        <div className="Queue">
            <div className="header">
                <button className="button">
                    Skip Song
                    <BsFillSkipEndFill />
                </button>
                <>
                    <span className="text">Queue</span>
                    <span className="text">(8)</span>
                </>
                <button className="button">
                    <MdAdd />
                    Add Song
                </button>
            </div>
            {fetchQueue().map((song, index) => (
                <div className="song" key={index}>
                    {/* <img src={song.cover} alt={song.title} /> */}
                    {/* <div> */}
                    <span className="title">{song.title}</span>
                    <span className="artist">{song.artist}</span>
                    {/* </div> */}
                </div>
            ))}
        </div>
    );
}

export default Queue;
