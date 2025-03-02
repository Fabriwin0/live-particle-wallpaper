import p5 from 'p5';

let particles = [];
let trailAlpha = 50;
let emissionRate = 1; // Adjust for slime-like growth
let backgroundColor = [0, 0, 0, 20]; // Black with some transparency

const sketch = (sketch) => {

    class Particle {
        constructor(x, y) {
            this.pos = sketch.createVector(x, y);
            this.vel = p5.Vector.random2D().mult(sketch.random(0.5, 2));
            this.size = sketch.random(2, 5);
            this.color = [sketch.random(100, 255), sketch.random(0, 200), sketch.random(100, 255)]; // Neon-like colors
            this.alpha = 255;
            this.pulseSpeed = sketch.random(0.01, 0.05);
            this.pulseOffset = sketch.random(0, 1000);
        }

        update() {
            this.pos.add(this.vel);
            this.vel.mult(0.99); // Slight friction for perpetual motion

            // Bounce off edges
            if (this.pos.x < 0 || this.pos.x > sketch.width) {
                this.vel.x *= -1;
            }
            if (this.pos.y < 0 || this.pos.y > sketch.height) {
                this.vel.y *= -1;
            }

            this.alpha -= 2; // Fade out
            if (this.alpha < 0) {
                this.alpha = 0;
            }
        }

        drawTrail() {
            let trailColor = [...this.color, this.alpha];
            sketch.drawingContext.shadowBlur = 10;
            sketch.drawingContext.shadowColor = sketch.color(this.color[0], this.color[1], this.color[2], this.alpha);
            sketch.noStroke();
            sketch.fill(trailColor);
            sketch.ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
            sketch.drawingContext.shadowBlur = 0;
        }

        draw() {
            this.drawTrail();
            let pulse = sketch.map(sketch.sin(sketch.frameCount * this.pulseSpeed + this.pulseOffset), -1, 1, 0.5, 1.5);
            let glowSize = this.size * pulse;
            let glowColor = [...this.color, this.alpha * 0.5]; // Less opaque glow
            sketch.drawingContext.shadowBlur = 20;
            sketch.drawingContext.shadowColor = sketch.color(this.color[0], this.color[1], this.color[2], this.alpha * 0.5);
            sketch.noStroke();
            sketch.fill(glowColor);
            sketch.ellipse(this.pos.x, this.pos.y, glowSize, glowSize);
            sketch.drawingContext.shadowBlur = 0;
            sketch.fill(this.color);
            sketch.ellipse(this.pos.x, this.pos.y, this.size, this.size);
        }
    }

    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        sketch.frameRate(60);
        sketch.blendMode(sketch.ADD); // For neon-like effect
    };

    sketch.draw = () => {
        sketch.background(backgroundColor);

        // Organic growth
        if (sketch.random(1) < emissionRate / 100) {
            particles.push(new Particle(sketch.random(sketch.width), sketch.random(sketch.height)));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.update();
            p.draw();

            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    };

    sketch.windowResized = () => {
        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    };
};
new p5(sketch);
