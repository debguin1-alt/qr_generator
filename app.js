const urlInput = document.getElementById("urlInput");
const btn = document.getElementById("btn");
const qrImage = document.getElementById("qrImage");

const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentURL = "";

/* ================= GENERATE QR ================= */
btn.addEventListener("click", () => {
    if (!urlInput.value.trim()) {
        alert("Please enter a valid URL");
        return;
    }

    currentURL = urlInput.value.trim();
    const encoded = encodeURIComponent(currentURL);

    const qrURL =
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;

    qrImage.src = qrURL;

    qrImage.onload = () => {
        qrImage.classList.add("show");

        // 🔥 Save to localStorage
        localStorage.setItem("lastQRUrl", qrURL);
        localStorage.setItem("lastQRText", currentURL);
    };
});

/* ================= RESTORE LAST QR ================= */
window.addEventListener("load", () => {
    const savedQR = localStorage.getItem("lastQRUrl");
    const savedText = localStorage.getItem("lastQRText");

    if (savedQR) {
        qrImage.src = savedQR;
        qrImage.classList.add("show");
    }
    if (savedText) {
        urlInput.value = savedText;
        currentURL = savedText;
    }
});

/* ================= COPY LINK ================= */
copyBtn.addEventListener("click", () => {
    if (!currentURL) return;

    navigator.clipboard.writeText(currentURL);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1500);
});

/* ================= SHARE LINK ================= */
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

/* ================= DOWNLOAD TO DEVICE ================= */
downloadBtn.addEventListener("click", () => {
    if (!qrImage.src) return;

    const a = document.createElement("a");
    a.href = qrImage.src;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
