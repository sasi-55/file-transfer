const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { createTransfer, getTransfer, deleteTransfer } = require("./transfers");

const app = express();

app.use(cors({ origin: "*" }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const code = uuidv4().slice(0, 6).toUpperCase();

    createTransfer(code, {
        buffer: req.file.buffer,
        name: req.file.originalname
    });

    res.json({ code });
});

io.on("connection", (socket) => {

    socket.on("request-file", (code) => {
        const transfer = getTransfer(code);

        if (!transfer) {
            socket.emit("error", "Invalid code");
            return;
        }

        const buffer = transfer.fileInfo.buffer;
        const chunkSize = 64 * 1024;

        socket.emit("file-meta", {
            name: transfer.fileInfo.name,
            size: buffer.length
        });

        for (let i = 0; i < buffer.length; i += chunkSize) {
            socket.emit("file-data", buffer.slice(i, i + chunkSize));
        }

        socket.emit("file-end");

        deleteTransfer(code);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});