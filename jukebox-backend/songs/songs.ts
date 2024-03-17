type Song = {
    title: string;
    artist: string;
    length: number;
};

const Songs: Song[] = [
    {
        title: "Song1",
        artist: "Artist1",
        length: 100,
    },
    {
        title: "Song2",
        artist: "Artist2",
        length: 200,
    },
    {
        title: "Song3",
        artist: "Artist3",
        length: 300,
    },
    {
        title: "Song4",
        artist: "Artist4",
        length: 400,
    },
    {
        title: "Song5",
        artist: "Artist5",
        length: 500,
    },
];

async function GetSongLength(title: string, artist: string) {
    if (title && artist) {
        const length = Songs.find((song) => song.title === title && song.artist === artist)?.length;
        return length? length : 0;
    } else {
        return 0;
    }
}

module.exports = {
    GetSongLength,
};