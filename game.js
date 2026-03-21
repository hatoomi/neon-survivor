/**
 * Game - main controller
 * Manages game loop, input, spawning, collisions, and state transitions
 */
(function () {
    // --- Canvas setup ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- DOM references ---
    const menuScreen    = document.getElementById('menu');
    const gameoverScreen = document.getElementById('gameover');
    const pauseOverlay  = document.getElementById('pauseOverlay');
    const hud           = document.getElementById('hud');
    const healthFill    = document.getElementById('healthFill');
    const healthText    = document.getElementById('healthText');
    const scoreValue    = document.getElementById('scoreValue');
    const waveValue     = document.getElementById('waveValue');
    const finalScore    = document.getElementById('finalScore');
    const finalWave     = document.getElementById('finalWave');

    // --- Game state ---
    let state = 'menu'; // 'menu' | 'playing' | 'paused' | 'gameover'
    let player, bullets, enemies, particles;
    let score, wave, spawnTimer, spawnInterval, waveTimer, waveThreshold;
    let screenShake = 0;

    // --- Input tracking ---
    const keys = {};
    let mouseX = 0, mouseY = 0;
    let mouseDown = false;

    // --- Sound effects (Web Audio API) ---
    let audioCtx;
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;

        switch (type) {
            case 'shoot':
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, t);
                osc.frequency.exponentialRampToValueAtTime(200, t + 0.08);
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
                osc.start(t);
                osc.stop(t + 0.08);
                break;
            case 'hit':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, t);
                osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
                osc.start(t);
                osc.stop(t + 0.1);
                break;
            case 'explosion':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.exponentialRampToValueAtTime(30, t + 0.3);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                osc.start(t);
                osc.stop(t + 0.3);
                break;
            case 'playerHit':
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.start(t);
                osc.stop(t + 0.2);
                break;
        }
    }

    // --- Input handlers ---
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;

        if (e.key.toLowerCase() === 'p' && state === 'playing') {
            pauseGame();
        } else if (e.key.toLowerCase() === 'p' && state === 'paused') {
            resumeGame();
        }
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) mouseDown = true;
    });
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) mouseDown = false;
    });
    // Prevent context menu on right-click during gameplay
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // --- Button handlers ---
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('menuBtn').addEventListener('click', showMenu);
    document.getElementById('resumeBtn').addEventListener('click', resumeGame);

    // --- State transitions ---
    function showMenu() {
        state = 'menu';
        menuScreen.classList.remove('hidden');
        gameoverScreen.classList.add('hidden');
        pauseOverlay.classList.add('hidden');
        hud.classList.add('hidden');
    }

    function startGame() {
        initAudio();
        state = 'playing';

        // Hide all overlays, show HUD
        menuScreen.classList.add('hidden');
        gameoverScreen.classList.add('hidden');
        pauseOverlay.classList.add('hidden');
        hud.classList.remove('hidden');

        // Initialize game objects
        player = new Player(canvas.width / 2, canvas.height / 2);
        bullets = [];
        enemies = [];
        particles = [];
        score = 0;
        wave = 1;
        spawnTimer = 0;
        spawnInterval = 90;  // frames between spawns (decreases over time)
        waveTimer = 0;
        waveThreshold = 600; // frames per wave (~10 seconds at 60fps)
        screenShake = 0;

        updateHUD();
    }

    function pauseGame() {
        state = 'paused';
        pauseOverlay.classList.remove('hidden');
    }

    function resumeGame() {
        state = 'playing';
        pauseOverlay.classList.add('hidden');
    }

    function gameOver() {
        state = 'gameover';
        hud.classList.add('hidden');
        gameoverScreen.classList.remove('hidden');
        finalScore.textContent = `SCORE: ${score}`;
        finalWave.textContent = `Wave ${wave}`;
    }

    // --- HUD ---
    function updateHUD() {
        const pct = Math.max(0, player.health / player.maxHealth) * 100;
        healthFill.style.width = pct + '%';
        healthText.textContent = Math.ceil(player.health);

        // Color shifts: green -> yellow -> red
        if (pct > 50) {
            healthFill.style.backgroundColor = '#0f0';
        } else if (pct > 25) {
            healthFill.style.backgroundColor = '#ff0';
        } else {
            healthFill.style.backgroundColor = '#f00';
        }

        scoreValue.textContent = score;
        waveValue.textContent = wave;
    }

    // --- Spawning ---
    function spawnEnemy() {
        // Pick type based on wave
        let type = 'basic';
        const roll = Math.random();
        if (wave >= 3 && roll < 0.25) {
            type = 'fast';
        }
        if (wave >= 5 && roll < 0.15) {
            type = 'tank';
        }

        const enemy = Enemy.spawnAtEdge(canvas.width, canvas.height, type);

        // Scale speed with wave
        enemy.speed += (wave - 1) * 0.15;

        enemies.push(enemy);
    }

    // --- Collision helpers ---
    function circlesCollide(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < a.radius + b.radius;
    }

    // --- Particle burst ---
    function spawnExplosion(x, y, color, count = 12) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, color));
        }
    }

    // --- Background grid ---
    function drawGrid() {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const spacing = 50;
        for (let x = 0; x < canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // --- Main game loop ---
    function gameLoop() {
        requestAnimationFrame(gameLoop);

        if (state !== 'playing') {
            // Still draw the game behind pause overlay
            if (state === 'paused') {
                drawFrame();
            }
            return;
        }

        update();
        drawFrame();
    }

    function update() {
        // Player
        player.update(keys, mouseX, mouseY, canvas.width, canvas.height);

        // Shooting
        if (mouseDown) {
            const bullet = player.shoot();
            if (bullet) {
                bullets.push(bullet);
                playSound('shoot');
            }
        }

        // Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update(canvas.width, canvas.height);
            if (!bullets[i].alive) bullets.splice(i, 1);
        }

        // Enemy spawning
        spawnTimer++;
        if (spawnTimer >= spawnInterval) {
            spawnTimer = 0;
            spawnEnemy();
        }

        // Wave progression
        waveTimer++;
        if (waveTimer >= waveThreshold) {
            waveTimer = 0;
            wave++;
            // Increase difficulty: faster spawns, capped at 20 frames
            spawnInterval = Math.max(20, spawnInterval - 8);
        }

        // Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update(player.x, player.y);
        }

        // --- Collision: bullets vs enemies ---
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
            for (let ei = enemies.length - 1; ei >= 0; ei--) {
                if (circlesCollide(bullets[bi], enemies[ei])) {
                    enemies[ei].takeDamage(1);
                    bullets[bi].alive = false;
                    playSound('hit');

                    // Small hit particles
                    spawnExplosion(bullets[bi].x, bullets[bi].y, enemies[ei].color, 4);

                    if (!enemies[ei].alive) {
                        // Enemy destroyed
                        score += enemies[ei].score;
                        spawnExplosion(enemies[ei].x, enemies[ei].y, enemies[ei].color, 16);
                        playSound('explosion');
                        screenShake = 6;
                        enemies.splice(ei, 1);
                    }

                    bullets.splice(bi, 1);
                    break;
                }
            }
        }

        // --- Collision: enemies vs player ---
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (circlesCollide(enemies[i], player)) {
                player.takeDamage(enemies[i].damage);
                playSound('playerHit');
                screenShake = 8;

                // Destroy the enemy on contact
                spawnExplosion(enemies[i].x, enemies[i].y, enemies[i].color, 10);
                enemies.splice(i, 1);

                if (player.health <= 0) {
                    spawnExplosion(player.x, player.y, '#0ff', 30);
                    gameOver();
                    return;
                }
            }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (!particles[i].alive) particles.splice(i, 1);
        }

        // Screen shake decay
        if (screenShake > 0) screenShake -= 0.5;

        updateHUD();
    }

    function drawFrame() {
        ctx.save();

        // Apply screen shake
        if (screenShake > 0) {
            const sx = (Math.random() - 0.5) * screenShake * 2;
            const sy = (Math.random() - 0.5) * screenShake * 2;
            ctx.translate(sx, sy);
        }

        // Clear
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

        drawGrid();

        // Draw all game objects
        for (const p of particles) p.draw(ctx);
        for (const b of bullets) b.draw(ctx);
        for (const e of enemies) e.draw(ctx);
        if (player) player.draw(ctx);

        ctx.restore();
    }

    // Start the loop
    gameLoop();
})();
