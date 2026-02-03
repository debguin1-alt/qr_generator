const urlInput = document.getElementById("urlInput");
const btn = document.getElementById("btn");
const qrImage = document.getElementById("qrImage");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentURL = "";

// Generate QR
btn.addEventListener("click", () => {
    if (!urlInput.value.trim()) {
        alert("Please enter a valid URL");
        return;
    }

    currentURL = urlInput.value.trim();
    const encoded = encodeURIComponent(currentURL);

    qrImage.src =
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;

    qrImage.onload = () => qrImage.classList.add("show");
});

// Copy link
copyBtn.addEventListener("click", () => {
    if (!currentURL) return;

    navigator.clipboard.writeText(currentURL);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1500);
});

// Share link
shareBtn.addEventListener("click", async () => {
    if (!currentURL) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "QR Code",
                text: "Scan this QR or open the link",
                url: currentURL
            });
        } catch (e) {}
    } else {
        alert("Sharing not supported on this device");
    }
});

// Download QR
downloadBtn.addEventListener("click", () => {
    if (!qrImage.src) return;

    const link = document.createElement("a");
    link.href = qrImage.src;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
