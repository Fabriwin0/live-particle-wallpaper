// sketch.js
let particles = [];
let trailAlpha = 50;
let emissionRate = 1; // Adjust for slime-like growth
let backgroundColor = [0, 0, 0, 20]; // Black with some transparency

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D().mult(random(0.5, 2));
        this.size = random(2, 5);
        this.color = [random(100, 255), random(0, 200), random(100, 255)]; // Neon-like colors
        this.alpha = 255;
        this.pulseSpeed = random(0.01, 0.05);
        this.pulseOffset = random(0, 1000);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.mult(0.99); // Slight friction for perpetual motion

        // Bounce off edges
        if (this.pos.x < 0 || this.pos.x > width) {
            this.vel.x *= -1;
        }
        if (this.pos.y < 0 || this.pos.y > height) {
            this.vel.y *= -1;
        }

        this.alpha -= 2; // Fade out
        if (this.alpha < 0) {
            this.alpha = 0;
        }
    }

    drawTrail() {
        let trailColor = [...this.color, this.alpha];
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = color(this.color[0], this.color[1], this.color[2], this.alpha);
        noStroke();
        fill(trailColor);
        ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
        drawingContext.shadowBlur = 0;
    }

    draw() {
        this.drawTrail();
        let pulse = map(sin(frameCount * this.pulseSpeed + this.pulseOffset), -1, 1, 0.5, 1.5);
        let glowSize = this.size * pulse;
        let glowColor = [...this.color, this.alpha * 0.5]; // Less opaque glow
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = color(this.color[0], this.color[1], this.color[2], this.alpha * 0.5);
        noStroke();
        fill(glowColor);
        ellipse(this.pos.x, this.pos.y, glowSize, glowSize);
        drawingContext.shadowBlur = 0;
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    blendMode(ADD); // For neon-like effect
}

function draw() {
    background(backgroundColor);

    // Organic growth
    if (random(1) < emissionRate / 100) {
        particles.push(new Particle(random(width), random(height)));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.update();
        p.draw();

        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
