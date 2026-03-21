/**
 * Enemy class - spawns from edges, chases the player
 * Different types have different sizes, speeds, health, and colors
 */
class Enemy {
    /**
     * @param {string} type - 'basic', 'fast', or 'tank'
     */
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.alive = true;
        this.hitFlash = 0;

        // Configure stats by type
        switch (type) {
            case 'fast':
                this.radius = 12;
                this.speed = 3.5;
                this.health = 1;
                this.maxHealth = 1;
                this.color = '#ff0';
                this.damage = 8;
                this.score = 15;
                break;
            case 'tank':
                this.radius = 26;
                this.speed = 1.2;
                this.health = 5;
                this.maxHealth = 5;
                this.color = '#f80';
                this.damage = 25;
                this.score = 30;
                break;
            default: // basic
                this.radius = 16;
                this.speed = 2;
                this.health = 2;
                this.maxHealth = 2;
                this.color = '#f0f';
                this.damage = 15;
                this.score = 10;
        }
    }

    /** Spawn an enemy at a random screen edge */
    static spawnAtEdge(canvasW, canvasH, type = 'basic') {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        switch (side) {
            case 0: x = Math.random() * canvasW; y = -30; break;        // top
            case 1: x = canvasW + 30; y = Math.random() * canvasH; break; // right
            case 2: x = Math.random() * canvasW; y = canvasH + 30; break;  // bottom
            case 3: x = -30; y = Math.random() * canvasH; break;         // left
        }
        return new Enemy(x, y, type);
    }

    update(playerX, playerY) {
        // Move toward player
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        if (this.hitFlash > 0) this.hitFlash--;
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hitFlash = 4;
        if (this.health <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        const drawColor = this.hitFlash > 0 ? '#fff' : this.color;

        ctx.save();
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 12;

        // Draw enemy as a pulsing polygon
        const sides = this.type === 'tank' ? 6 : this.type === 'fast' ? 3 : 4;
        const angle = Date.now() * 0.002; // slow rotation

        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const a = angle + (Math.PI * 2 * i) / sides;
            const px = this.x + Math.cos(a) * this.radius;
            const py = this.y + Math.sin(a) * this.radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = drawColor;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Health bar for tanks
        if (this.type === 'tank' && this.health < this.maxHealth) {
            const barW = this.radius * 2;
            const barH = 4;
            const barX = this.x - barW / 2;
            const barY = this.y - this.radius - 10;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = this.color;
            ctx.fillRect(barX, barY, barW * (this.health / this.maxHealth), barH);
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }
}
