/**
 * Player class - handles movement, aiming, shooting, and rendering
 */
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 18;
        this.speed = 4;
        this.angle = 0;           // angle toward mouse
        this.health = 100;
        this.maxHealth = 100;
        this.shootCooldown = 0;   // frames until next shot allowed
        this.shootRate = 8;       // frames between shots
        this.invincibleTimer = 0; // brief invincibility after hit
        this.damageFlash = 0;     // visual flash on taking damage
    }

    /** Update position based on current input state */
    update(keys, mouseX, mouseY, canvasW, canvasH) {
        // Movement
        let dx = 0, dy = 0;
        if (keys['w'] || keys['arrowup'])    dy -= 1;
        if (keys['s'] || keys['arrowdown'])  dy += 1;
        if (keys['a'] || keys['arrowleft'])  dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Clamp to canvas
        this.x = Math.max(this.radius, Math.min(canvasW - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvasH - this.radius, this.y));

        // Aim toward mouse
        this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);

        // Timers
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.invincibleTimer > 0) this.invincibleTimer--;
        if (this.damageFlash > 0) this.damageFlash--;
    }

    /** Try to shoot - returns a Bullet or null */
    shoot() {
        if (this.shootCooldown > 0) return null;
        this.shootCooldown = this.shootRate;

        // Spawn bullet slightly in front of player
        const bx = this.x + Math.cos(this.angle) * (this.radius + 8);
        const by = this.y + Math.sin(this.angle) * (this.radius + 8);
        return new Bullet(bx, by, this.angle);
    }

    /** Take damage from enemy contact */
    takeDamage(amount) {
        if (this.invincibleTimer > 0) return;
        this.health -= amount;
        this.invincibleTimer = 30; // ~0.5s invincibility
        this.damageFlash = 10;
        if (this.health < 0) this.health = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Invincibility blink
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 3) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        // Body - triangle ship shape
        const color = this.damageFlash > 0 ? '#f44' : '#0ff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(this.radius + 4, 0);                        // nose
        ctx.lineTo(-this.radius * 0.7, -this.radius * 0.7);    // top-left
        ctx.lineTo(-this.radius * 0.4, 0);                     // indent
        ctx.lineTo(-this.radius * 0.7, this.radius * 0.7);     // bottom-left
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Gun barrel
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.radius * 0.3, -2, this.radius * 0.6, 4);

        ctx.shadowBlur = 0;
        ctx.restore();
    }
}
