const socket = io("https://YOUR-RENDER-URL.onrender.com");

let received = [];
let fileSize = 0;
let receivedSize = 0;
let fileName = "file";

function receiveFile() {
    const code = document.getElementById("codeInput").value;
    socket.emit("request-file", code);

    received = [];
    receivedSize = 0;
}

socket.on("file-meta", (meta) => {
    fileSize = meta.size;
    fileName = meta.name;
});

socket.on("file-data", (chunk) => {
    received.push(chunk);
    receivedSize += chunk.byteLength;

    let percent = (receivedSize / fileSize) * 100;
    document.getElementById("progress").style.width = percent + "%";
});

socket.on("file-end", () => {
    const blob = new Blob(received);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
});
