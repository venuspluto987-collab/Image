const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const brush = document.getElementById("brushSize");

let img = new Image();
let drawing = false;

// Upload image
document.getElementById("upload").addEventListener("change", function(e) {
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
});

// Mouse events
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 🔥 REAL ERASE (makes transparent)
    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(x, y, brush.value, 0, Math.PI * 2);
    ctx.fill();
});

// Download PNG (with transparency)
function downloadImage() {
    const link = document.createElement("a");
    link.download = "transparent.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
