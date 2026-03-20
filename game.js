const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('game-status');
const gameOverOverlay = document.getElementById('game-over-overlay');
const restartBtn = document.getElementById('restart-btn');
const finalScoreText = document.getElementById('final-score-text');
const funnyComment = document.getElementById('funny-comment');

// Load Player Image
const playerImg = new Image();
playerImg.src = 'photo3.png'; // Ha-Seung-Jin

let score = 0;
let gameActive = false;
let player = { x: 400, y: 500, w: 100, h: 100 };
let objects = [];
let powerupActive = false;
let powerupTimer = 0;

const comments = [
    "하과장님, 승진턱은 내고 가셔야죠!",
    "영수증 피하는 솜씨가 거의 신급이십니다.",
    "골프채만 챙기지 마시고 친구들도 챙기세요!",
    "오늘도 엄한 데 쏘고 계시군요... 엄데쏨!",
    "로또 당첨된 개두호 친구한테 가보시는 건 어때요?"
];

// Object types
const TYPES = {
    RECEIPT: { color: '#fff', score: 0, speed: 4, label: '🧾 영수증' },
    GOLF: { color: '#ffcc00', score: 10, speed: 5, label: '⛳ 골프채' },
    LOTTO: { color: '#00ff00', score: 50, speed: 7, label: '🎟️ 로또' },
    EOMDESSOM: { color: '#ff00ff', score: 0, speed: 6, label: '✨ 엄데쏨!' }
};

function initGame() {
    score = 0;
    scoreEl.innerText = score;
    objects = [];
    gameActive = true;
    powerupActive = false;
    gameOverOverlay.classList.add('hidden');
    statusEl.innerText = "RUN!!";
    requestAnimationFrame(update);
}

// Mouse/Touch control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    player.x = (e.clientX - rect.left) * scaleX - player.w / 2;
    // Bound check
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
});

function spawnObject() {
    const chance = Math.random();
    let type;
    if (chance < 0.7) type = TYPES.RECEIPT;
    else if (chance < 0.85) type = TYPES.GOLF;
    else if (chance < 0.95) type = TYPES.LOTTO;
    else type = TYPES.EOMDESSOM;

    objects.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        w: 50,
        h: 50,
        type: type
    });
}

function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    if (powerupActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff3b3b';
    }
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;

    // Powerup check
    if (powerupActive) {
        powerupTimer--;
        statusEl.innerText = `EOM-DE-SSOM MODE: ${Math.ceil(powerupTimer/60)}s`;
        if (powerupTimer <= 0) {
            powerupActive = false;
            statusEl.innerText = "RUN!!";
        }
    }

    // Spawn & Move Objects
    if (Math.random() < 0.03) spawnObject();

    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        obj.y += obj.type.speed;

        // Draw Object
        ctx.fillStyle = obj.type.color;
        ctx.font = '30px serif';
        ctx.fillText(obj.type.label, obj.x, obj.y);

        // Collision Check
        if (checkCollision(player, obj)) {
            if (obj.type === TYPES.RECEIPT) {
                if (!powerupActive) endGame();
            } else if (obj.type === TYPES.EOMDESSOM) {
                powerupActive = true;
                powerupTimer = 300; // 5 seconds
            } else {
                score += obj.type.score;
                scoreEl.innerText = score;
            }
            objects.splice(i, 1);
            continue;
        }

        // Out of bounds
        if (obj.y > canvas.height) {
            objects.splice(i, 1);
        }
    }

    requestAnimationFrame(update);
}

function checkCollision(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}

function endGame() {
    gameActive = false;
    gameOverOverlay.classList.remove('hidden');
    finalScoreText.innerText = `최종 점수: ${score}`;
    funnyComment.innerText = comments[Math.floor(Math.random() * comments.length)];
}

restartBtn.addEventListener('click', initGame);

// Start!
playerImg.onload = () => {
    initGame();
};
