const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");
const brush = document.getElementById("brushSize");

let img = new Image();
let drawing = false;
let showMask = false;

// Hidden mask canvas
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d");

// Upload
document.getElementById("upload").addEventListener("change", function(e) {
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            maskCanvas.width = img.width;
            maskCanvas.height = img.height;

            // Fill mask black (nothing revealed)
            maskCtx.fillStyle = "black";
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            drawMain();
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
});

// Draw visible canvas
function drawMain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Show original image
    ctx.drawImage(img, 0, 0);

    if (showMask) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalAlpha = 1;
    }
}

// Drawing
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 🔥 Soft brush
    const radius = brush.value;
    const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "transparent");

    maskCtx.fillStyle = gradient;
    maskCtx.beginPath();
    maskCtx.arc(x, y, radius, 0, Math.PI * 2);
    maskCtx.fill();

    drawMain();
});

// Toggle mask view
function toggleMask() {
    showMask = !showMask;
    drawMain();
}

// Generate result
function generateResult() {
    const resultCanvas = document.createElement("canvas");
    const resultCtx = resultCanvas.getContext("2d");

    resultCanvas.width = img.width;
    resultCanvas.height = img.height;

    resultCtx.drawImage(img, 0, 0);

    // Apply mask
    resultCtx.globalCompositeOperation = "destination-in";
    resultCtx.drawImage(maskCanvas, 0, 0);

    preview.src = resultCanvas.toDataURL("image/png");

    window.finalImage = resultCanvas;
}

// Download
function downloadImage() {
    if (!window.finalImage) return;

    const link = document.createElement("a");
    link.download = "final.png";
    link.href = window.finalImage.toDataURL();
    link.click();
}
