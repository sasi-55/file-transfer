async function sendFile() {
    const file = document.getElementById("fileInput").files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://YOUR-RENDER-URL.onrender.com/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    document.getElementById("code").innerText = "Code: " + data.code;
}
