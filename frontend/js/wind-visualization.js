// Enhanced Wind Visualization with Realistic Physics
let canvas;
let ctx;
let particles = [];
let animationId;
let windField = null;
let noiseOffset = 0;
let targetParticleCount = 1500;
let currentParticleCount = 1500;
let lastFrameTime = 0;
let frameSkipCounter = 0;

const PARTICLE_CONFIG = {
    minCount: 500,
    maxCount: 2000, // Reduced from 5000 for better performance
    baseMaxAge: 100,
    baseSpeed: 0.8,
    lineWidth: 1.8,
    fadeOpacity: 0.96,
    turbulenceStrength: 0.15,
    glowIntensity: 0.4,
    targetFPS: 60, // Target frame rate
    maxFrameTime: 16.67 // Maximum ms per frame (60 FPS)
};

// Simplified Perlin noise implementation
class SimplexNoise {
    constructor() {
        this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(Math.random() * 256);
        }
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    noise(xin, yin) {
        let n0, n1, n2;
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = this.perm[ii + this.perm[jj]] % 12;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }
}

const noise = new SimplexNoise();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.maxAge = PARTICLE_CONFIG.baseMaxAge;
        this.speed = PARTICLE_CONFIG.baseSpeed;
        this.vx = 0;
        this.vy = 0;
        this.trail = [];
        this.trailLength = 5;
    }

    update(windSpeed, windDirection, noiseOffset) {
        // Convert wind direction to radians (meteorological to mathematical)
        const angleRad = ((windDirection + 180) % 360) * Math.PI / 180;

        // Calculate base velocity from wind
        const speedFactor = Math.max(0.3, Math.min(3, windSpeed / 5));
        const baseVx = Math.cos(angleRad) * this.speed * speedFactor;
        const baseVy = Math.sin(angleRad) * this.speed * speedFactor;

        // Add turbulence using Perlin noise
        const noiseScale = 0.003;
        const noiseValue = noise.noise(
            this.x * noiseScale + noiseOffset,
            this.y * noiseScale + noiseOffset
        );

        const turbulenceAngle = noiseValue * Math.PI * 2;
        const turbulenceStrength = PARTICLE_CONFIG.turbulenceStrength * speedFactor;

        // Combine wind and turbulence
        this.vx = baseVx + Math.cos(turbulenceAngle) * turbulenceStrength;
        this.vy = baseVy + Math.sin(turbulenceAngle) * turbulenceStrength;

        // Update trail
        this.trail.push({ x: this.x, y: this.y });
        this.trailLength = Math.floor(3 + speedFactor * 4);
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Increment age
        this.age++;

        // Adjust max age based on wind speed
        this.maxAge = PARTICLE_CONFIG.baseMaxAge / Math.max(0.5, speedFactor * 0.5);

        // Reset if too old or out of bounds
        if (this.age > this.maxAge || this.isOutOfBounds()) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.age = 0;
        this.trail = [];
    }

    isOutOfBounds() {
        return this.x < -50 || this.x > canvas.width + 50 ||
            this.y < -50 || this.y > canvas.height + 50;
    }

    draw(ctx, color, glowColor) {
        const opacity = 1 - (this.age / this.maxAge);

        // Draw trail with gradient
        if (this.trail.length > 1) {
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 1; i < this.trail.length; i++) {
                const trailOpacity = opacity * (i / this.trail.length) * 0.6;
                ctx.strokeStyle = color;
                ctx.globalAlpha = trailOpacity;
                ctx.lineWidth = PARTICLE_CONFIG.lineWidth * (i / this.trail.length);

                ctx.beginPath();
                ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.stroke();
            }

            // Add glow effect for high-speed particles
            if (windField && windField.speed > 8) {
                ctx.shadowBlur = 15 * PARTICLE_CONFIG.glowIntensity;
                ctx.shadowColor = glowColor;
            }

            // Draw current segment
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity * 0.8;
            ctx.lineWidth = PARTICLE_CONFIG.lineWidth;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.globalCompositeOperation = 'source-over';
        }
    }
}

/**
 * Initialize wind visualization canvas
 */
function initializeWindVisualization() {
    console.log('Initializing enhanced wind visualization...');

    canvas = document.getElementById('windCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    for (let i = 0; i < currentParticleCount; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    // Start animation
    animate();

    console.log('Enhanced wind visualization initialized');
}

/**
 * Resize canvas to match window
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Subtract header height
}

/**
 * Update wind field data
 */
function updateWindField(windSpeed, windDirection) {
    windField = {
        speed: windSpeed,
        direction: windDirection
    };

    // Adjust particle count based on wind speed (OPTIMIZED for performance)
    if (windSpeed < 3) {
        targetParticleCount = 800;
    } else if (windSpeed < 6) {
        targetParticleCount = 1200;
    } else if (windSpeed < 10) {
        targetParticleCount = 1500;
    } else if (windSpeed < 15) {
        targetParticleCount = 1800;
    } else {
        // High wind - REDUCE particles to prevent lag
        targetParticleCount = 1500;
    }

    // Smoothly adjust particle count
    adjustParticleCount();

    console.log('Wind field updated:', windField, 'Target particles:', targetParticleCount);
}

/**
 * Smoothly adjust particle count
 */
function adjustParticleCount() {
    const diff = targetParticleCount - particles.length;
    const step = Math.ceil(Math.abs(diff) / 30); // Adjust over 30 frames

    if (diff > 0) {
        // Add particles
        for (let i = 0; i < Math.min(step, diff); i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    } else if (diff < 0) {
        // Remove particles
        particles.splice(0, Math.min(step, Math.abs(diff)));
    }
}

/**
 * Get color based on wind speed with smooth gradients
 */
function getWindColor(windSpeed) {
    // Smooth color transitions
    if (windSpeed < 2) {
        // Deep Blue to Cyan
        const t = windSpeed / 2;
        return interpolateColor('#1E3A8A', '#06B6D4', t);
    } else if (windSpeed < 5) {
        // Cyan to Green
        const t = (windSpeed - 2) / 3;
        return interpolateColor('#06B6D4', '#10B981', t);
    } else if (windSpeed < 8) {
        // Green to Yellow
        const t = (windSpeed - 5) / 3;
        return interpolateColor('#10B981', '#FBBF24', t);
    } else if (windSpeed < 12) {
        // Yellow to Orange
        const t = (windSpeed - 8) / 4;
        return interpolateColor('#FBBF24', '#F97316', t);
    } else if (windSpeed < 15) {
        // Orange to Red
        const t = (windSpeed - 12) / 3;
        return interpolateColor('#F97316', '#EF4444', t);
    } else {
        // Red to Magenta
        const t = Math.min((windSpeed - 15) / 5, 1);
        return interpolateColor('#EF4444', '#EC4899', t);
    }
}

/**
 * Get glow color for high-speed particles
 */
function getGlowColor(windSpeed) {
    if (windSpeed < 8) return 'rgba(6, 182, 212, 0.5)';
    if (windSpeed < 12) return 'rgba(251, 191, 36, 0.6)';
    if (windSpeed < 15) return 'rgba(249, 115, 22, 0.7)';
    return 'rgba(236, 72, 153, 0.8)';
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1, color2, t) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);

    return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Animation loop (OPTIMIZED with frame rate limiting)
 */
function animate(timestamp) {
    // Performance optimization: Skip frames if running slow
    const deltaTime = timestamp - lastFrameTime;

    // For high wind speeds, allow frame skipping to maintain performance
    if (windField && windField.speed > 12) {
        frameSkipCounter++;
        if (frameSkipCounter % 2 === 0) {
            // Skip every other frame for very high wind
            animationId = requestAnimationFrame(animate);
            return;
        }
    } else {
        frameSkipCounter = 0;
    }

    lastFrameTime = timestamp;

    // Clear canvas with TRANSPARENCY instead of dark fill
    // This allows the map to show through
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (windField) {
        const color = getWindColor(windField.speed);
        const glowColor = getGlowColor(windField.speed);

        // Update noise offset for flowing turbulence
        noiseOffset += 0.001 * (windField.speed / 5);

        // Smoothly adjust particle count
        adjustParticleCount();

        // Optimize: Only update visible particles
        const visibleParticles = particles.filter(p =>
            p.x >= -50 && p.x <= canvas.width + 50 &&
            p.y >= -50 && p.y <= canvas.height + 50
        );

        // Update and draw only visible particles
        visibleParticles.forEach(particle => {
            particle.update(windField.speed, windField.direction, noiseOffset);
            particle.draw(ctx, color, glowColor);
        });
    }

    // Continue animation
    animationId = requestAnimationFrame(animate);
}

/**
 * Stop animation
 */
function stopWindVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

/**
 * Clear wind field
 */
function clearWindField() {
    windField = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Get current particle count (for debugging)
 */
function getParticleCount() {
    return particles.length;
}
