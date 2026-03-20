const canvas = document.getElementById('poster-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const photoInput = document.getElementById('photo');

const nameInput = document.getElementById('name');
const aliasInput = document.getElementById('alias');
const storyInput = document.getElementById('story');
const bountyInput = document.getElementById('bounty');

// Initial Draw (Placeholder Background)
function initCanvas() {
    ctx.fillStyle = '#f4e4bc'; // Old paper color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borders
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Wanted Text
    ctx.fillStyle = '#3e2723';
    ctx.font = '900 80px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('WANTED', canvas.width / 2, 120);
    
    ctx.font = '700 30px Inter';
    ctx.fillText('DEAD OR ALIVE', canvas.width / 2, 160);
}

initCanvas();

generateBtn.addEventListener('click', () => {
    const file = photoInput.files[0];
    if (!file) {
        alert('사진을 먼저 올려주세요!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            renderPoster(img);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function renderPoster(img) {
    // 1. Background
    ctx.fillStyle = '#f4e4bc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw Image
    const padding = 60;
    const imgWidth = canvas.width - (padding * 2);
    const imgHeight = 400;
    
    // Grayscale / Sepia effect
    ctx.filter = 'sepia(0.8) contrast(1.2) grayscale(0.5)';
    ctx.drawImage(img, padding, 180, imgWidth, imgHeight);
    ctx.filter = 'none'; // Reset filter for text
    
    // 3. Borders & Wanted Text
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    ctx.fillStyle = '#3e2723';
    ctx.font = '900 80px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('WANTED', canvas.width / 2, 120);
    
    ctx.font = '700 25px Inter';
    ctx.fillText('REWARD FOR INFORMATION LEADING TO CAPTURE', canvas.width / 2, 160);

    // 4. Dynamic Text (Name, Alias, Story, Bounty)
    ctx.fillStyle = '#000';
    
    // Name
    ctx.font = '900 50px Inter';
    ctx.fillText(nameInput.value || 'Unknown Villain', canvas.width / 2, 630);
    
    // Alias
    ctx.font = 'italic 700 25px Inter';
    ctx.fillText(aliasInput.value || '', canvas.width / 2, 670);
    
    // Story (Multline)
    ctx.font = '400 18px Inter';
    const lines = getLines(ctx, storyInput.value || '', canvas.width - 120);
    lines.slice(0, 3).forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, 710 + (i * 25));
    });
    
    // Bounty
    ctx.fillStyle = '#b71c1c';
    ctx.font = '900 40px Inter';
    ctx.fillText(bountyInput.value || '₩0', canvas.width / 2, 780);

    // Enable Download
    downloadBtn.disabled = false;
}

// Multiline text helper
function getLines(ctx, text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `wanted_poster_${nameInput.value}.png`;
    link.href = canvas.toDataURL();
    link.click();
});
