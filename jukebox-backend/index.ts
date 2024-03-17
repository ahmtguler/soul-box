const anchor = require("@coral-xyz/anchor");
const mongoose = require("mongoose");
const Message = require("./models/message");
const Song = require("./models/song");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const idl = require("../jukebox-contract/target/idl/anchor_jukebox.json");
const { GetSongLength } = require("./songs/songs");
const { VerifySignature, CreateSignInData } = require("./utils/siws");

import { Request, Response } from "express";

dotenv.config();

app.use(express.json());
app.use(cors());

const getQueue = async () => {
    try {
        const songData = await Song.find().filter({
            ends: { $gt: Date.now() / 1000 },
        });
        return songData;
    } catch (err: any) {
        console.log(err);
        return [];
    }
};

app.get("/chat", async (req: Request, res: Response) => {
    try {
        const chatData = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(chatData);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/queue", async (req: Request, res: Response) => {
    try {
        const queue = await getQueue();
        res.status(200).json(queue);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }

});

app.get("/createSignInData", async (req: Request, res: Response) => {
    try {
        const signInData = await CreateSignInData();
        res.status(200).json(signInData);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/verifySIWS", async (req: Request, res: Response) => {
    const input = req.body.input;
    const output = req.body.output;
    try {
        const verified = VerifySignature(input, output);
        res.status(200).json({ verified });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/sendMsg", async (req: Request, res: Response) => {
    const singature = req.body.signature;
    const sig_message = req.body.sig_message;
    //todo verify signature with SIWS
    // if (!verified) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }
    const message = new Message({
        user: req.body.user,
        message: req.body.message,
    });

    try {
        await message.save();
        res.status(201).json({ message: "Message saved" });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

async function main() {
    try {
        const connection = new anchor.web3.Connection(
            "https://api.devnet.solana.com"
        );
        const provider = new anchor.AnchorProvider(connection, null, {});
        const prog = new anchor.Program(
            idl,
            "FmgeN87iJJX4ZQi9rE7PPehA1TJr1xAQCWoHt5oKCPSz",
            provider
        );

        prog.addEventListener(
            "SongAdded",
            async (ev: any, slot: any, sign: any) => {
                const title = ev.title;
                const artist = ev.artist;
                const length = GetSongLength(title, artist);
                const queue = await getQueue();
                const starts =
                    queue[queue.length - 1]?.ends + 1 || Date.now() / 1000;
                const ends = starts + length;
                const song = new Song({
                    title,
                    artist,
                    starts,
                    ends,
                });
                try {
                    await song.save();
                } catch (err: any) {
                    console.log(err);
                }
            }
        );
    } catch (err: any) {
        console.log(err);
    }
}

main();

const dbConnection = async () => {
    await mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "soul-box",
        })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err: Error) => {
            console.log("Error: ", err);
            process.exit(1);
        });
};

app.listen(process.env.PORT, async () => {
    await dbConnection();
    console.log(`Server is running on port ${process.env.PORT}`);
});
