const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");
const brushSlider = document.getElementById("brushSize");

let drawing = false;
let img = new Image();
let history = []; // for undo

// Upload image
document.getElementById("upload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            // Overlay
            ctx.fillStyle = "gray";
            ctx.globalAlpha = 0.9;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            saveState();
            updatePreview();
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Mouse events
canvas.addEventListener("mousedown", () => {
    drawing = true;
    saveState(); // save before drawing
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    updatePreview();
});

canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, brushSlider.value, 0, Math.PI * 2);
    ctx.fill();
});

// Save state for undo
function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 20) history.shift();
}

// Undo
function undo() {
    if (history.length > 0) {
        const last = history.pop();
        let imgState = new Image();
        imgState.src = last;
        imgState.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgState, 0, 0);
            updatePreview();
        };
    }
}

// Preview update
function updatePreview() {
    preview.src = canvas.toDataURL("image/png");
}

// Download
function downloadImage() {
    const link = document.createElement("a");
    link.download = "edited.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}