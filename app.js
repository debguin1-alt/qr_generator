const urlInput = document.getElementById("urlInput");
const btn = document.getElementById("btn");
const qrImage = document.getElementById("qrImage");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");

btn.addEventListener("click", () => {
    if (!urlInput.value) return;

    const url = encodeURIComponent(urlInput.value);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}`;
    qrImage.classList.add("show");
});

// Copy link
copyBtn.addEventListener("click", () => {
    if (!urlInput.value) return;
    navigator.clipboard.writeText(urlInput.value);
    copyBtn.innerText = "Copied!";
    setTimeout(() => copyBtn.innerText = "Copy Link", 1500);
});

// Share
shareBtn.addEventListener("click", async () => {
    if (!urlInput.value) return;

    if (navigator.share) {
        await navigator.share({
            title: "QR Code",
            text: "Check this link",
            url: urlInput.value
        });
    } else {
        alert("Sharing not supported on this device");
    }
});

// Download QR
downloadBtn.addEventListener("click", () => {
    if (!qrImage.src) return;

    const a = document.createElement("a");
    a.href = qrImage.src;
    a.download = "qr-code.png";
    a.click();
});
