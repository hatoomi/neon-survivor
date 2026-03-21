/**
 * Bullet class - handles projectile movement and rendering
 */
class Bullet {
    constructor(x, y, angle, speed = 10) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.speed = speed;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.alive = true;
        this.trail = []; // positions for trail effect
    }

    update(canvasW, canvasH) {
        // Save trail position
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;

        // Remove if off screen
        if (this.x < -20 || this.x > canvasW + 20 ||
            this.y < -20 || this.y > canvasH + 20) {
            this.alive = false;
        }
    }

    draw(ctx) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i / this.trail.length) * 0.4;
            const size = this.radius * (i / this.trail.length);
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.fill();
        }

        // Draw bullet with glow
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
