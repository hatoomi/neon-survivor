/**
 * Particle class - used for explosion/death effects
 */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.life = 1.0; // fades from 1 to 0
        this.decay = Math.random() * 0.03 + 0.02;
        this.alive = true;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98; // friction
        this.vy *= 0.98;
        this.life -= this.decay;
        if (this.life <= 0) this.alive = false;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
