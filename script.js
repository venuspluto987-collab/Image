const drawCanvas = document.getElementById("drawCanvas");
const drawCtx = drawCanvas.getContext("2d");

const preview = document.getElementById("preview");

let img = new Image();
let drawing = false;

// Upload image
document.getElementById("upload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            drawCanvas.width = img.width;
            drawCanvas.height = img.height;

            // ❌ Do NOT draw image (invisible drawing area)
            drawCtx.fillStyle = "black";
            drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Draw (invisible to user)
drawCanvas.addEventListener("mousedown", () => drawing = true);
drawCanvas.addEventListener("mouseup", () => drawing = false);

drawCanvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;

    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw mask (white = reveal)
    drawCtx.fillStyle = "white";
    drawCtx.beginPath();
    drawCtx.arc(x, y, 20, 0, Math.PI * 2);
    drawCtx.fill();
});

// 🔥 Generate final result
function generateResult() {
    const resultCanvas = document.createElement("canvas");
    const resultCtx = resultCanvas.getContext("2d");

    resultCanvas.width = img.width;
    resultCanvas.height = img.height;

    // Draw original image
    resultCtx.drawImage(img, 0, 0);

    // Apply mask
    resultCtx.globalCompositeOperation = "destination-in";
    resultCtx.drawImage(drawCanvas, 0, 0);

    preview.src = resultCanvas.toDataURL("image/png");

    // store for download
    window.finalImage = resultCanvas;
}

// Download
function downloadImage() {
    if (!window.finalImage) return;

    const link = document.createElement("a");
    link.download = "result.png";
    link.href = window.finalImage.toDataURL();
    link.click();
}
