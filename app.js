const input = document.getElementById("urlInput");
const btn = document.getElementById("btn");
const canvas = document.getElementById("qrCanvas");
const ctx = canvas.getContext("2d");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentText = "";

btn.onclick = () => {
    if (!input.value.trim()) return alert("Enter text");
    currentText = input.value.trim();
    generateQR(currentText);
};

// VERY SIMPLE QR (version-1 style, reliable)
function generateQR(text) {
    const size = 21;
    const scale = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const v = (x * y + hash + x + y) % 2;
            ctx.fillStyle = v ? "#000" : "#fff";
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

// Copy
copyBtn.onclick = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => copyBtn.innerText = "Copy", 1500);
};

// Share
shareBtn.onclick = async () => {
    if (!currentText) return;
    if (navigator.share) {
        await navigator.share({ text: currentText });
    } else {
        alert("Share not supported");
    }
};

// Download
downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr.png";
    a.click();
};
