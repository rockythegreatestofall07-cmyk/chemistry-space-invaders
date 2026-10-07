/* ==========================================================================
   HTML5 Canvas Game Engine - Chemistry Space Invaders
   AI Planes Shoot Lasers, Dodge & Continuous Seamless Action
   ========================================================================== */

import { sounds } from './audio.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Entities
    this.player = new Player(this.width / 2, this.height - 45);
    this.invaders = [];
    this.hazards = [];
    this.lasers = []; // Player Lasers
    this.enemyLasers = []; // Enemy AI Lasers!
    this.particles = [];
    this.shockwaves = [];
    this.stars = [];

    // Callbacks
    this.onHitAnswerCallback = null;
    this.onDestroyHazardCallback = null;
    this.onPlayerHitCallback = null;

    // State & Timers
    this.animId = null;
    this.isRunning = false;
    this.hazardSpawnTimer = 0;

    this.initStarfield();
  }

  initStarfield() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() < 0.2 ? 2.5 : 1.2,
        speed: 0.4 + Math.random() * 0.8,
        alpha: 0.3 + Math.random() * 0.7
      });
    }
  }

  setupQuestion(optionsArray) {
    // Continuous seamless update: Update answer ships smoothly
    this.invaders = [];
    const startX = 140;
    const spacing = (this.width - 280) / 2;

    optionsArray.forEach((optionText, index) => {
      const x = startX + index * spacing;
      const y = 90;
      this.invaders.push(new AnswerInvader(x, y, index, optionText));
    });

    if (this.hazards.length === 0) {
      this.spawnHazard();
      this.spawnHazard();
    }
  }

  spawnHazard() {
    if (this.hazards.length < 4) {
      this.hazards.push(new HazardEnemy(this.width, this.height));
    }
  }

  firePlayerLaser() {
    if (this.lasers.length < 3) {
      this.lasers.push(new Laser(this.player.x - 14, this.player.y - 15));
      this.lasers.push(new Laser(this.player.x + 14, this.player.y - 15));
      return true;
    }
    return false;
  }

  start(onHitAnswer, onDestroyHazard, onPlayerHit) {
    this.onHitAnswerCallback = onHitAnswer;
    this.onDestroyHazardCallback = onDestroyHazard;
    this.onPlayerHitCallback = onPlayerHit;

    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isRunning) return;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      this.update(dt);
      this.draw();

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }

  update(dt) {
    // 1. Update Stars
    this.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    });

    // 2. Update Player
    this.player.update(dt, this.width, this.particles);

    // 3. Update Invaders
    this.invaders.forEach(invader => invader.update(dt));

    // 4. Update Hazard Enemies (Alien Drones & Meteors)
    this.hazardSpawnTimer += dt;
    if (this.hazardSpawnTimer > 3.0) {
      this.hazardSpawnTimer = 0;
      this.spawnHazard();
    }

    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const hazard = this.hazards[i];
      hazard.update(dt, this.width, this.height, this.enemyLasers, this.player.x);

      // Check direct collision with Player
      if (this.player.invulnerableTimer <= 0 && hazard.collidesWithPlayer(this.player)) {
        this.createExplosion(this.player.x, this.player.y, '#ff0055', 25);
        this.player.triggerHit();

        if (this.onPlayerHitCallback) {
          this.onPlayerHitCallback();
        }
      }
    }

    // 5. Update Enemy Lasers (AI Planes Shoot Player!)
    for (let i = this.enemyLasers.length - 1; i >= 0; i--) {
      const elaser = this.enemyLasers[i];
      elaser.update(dt);

      if (elaser.y > this.height + 20) {
        this.enemyLasers.splice(i, 1);
        continue;
      }

      // Check collision with Player
      if (this.player.invulnerableTimer <= 0 && elaser.collidesWithPlayer(this.player)) {
        this.createExplosion(this.player.x, this.player.y, '#ff0044', 20);
        this.enemyLasers.splice(i, 1);
        this.player.triggerHit();

        if (this.onPlayerHitCallback) {
          this.onPlayerHitCallback();
        }
      }
    }

    // 6. Update Player Lasers & Collisions with Answer Ships OR AI Planes
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.update(dt);

      if (laser.y < -10) {
        this.lasers.splice(i, 1);
        continue;
      }

      let laserDestroyed = false;

      // A. Check Collision with Answer Invaders
      for (let j = 0; j < this.invaders.length; j++) {
        const invader = this.invaders[j];
        if (invader.containsPoint(laser.x, laser.y)) {
          this.createExplosion(invader.x, invader.y, invader.color, 45);
          this.shockwaves.push(new ShockwaveRing(invader.x, invader.y, invader.color));

          this.lasers.splice(i, 1);
          laserDestroyed = true;

          if (this.onHitAnswerCallback) {
            this.onHitAnswerCallback(invader.index);
          }
          break;
        }
      }

      if (laserDestroyed) continue;

      // B. Check Collision with Hazard AI Planes (KILL AI ENEMY WITH EXPLOSION!)
      for (let k = this.hazards.length - 1; k >= 0; k--) {
        const hazard = this.hazards[k];
        if (hazard.containsPoint(laser.x, laser.y)) {
          this.createExplosion(hazard.x, hazard.y, hazard.color, 35);
          this.shockwaves.push(new ShockwaveRing(hazard.x, hazard.y, hazard.color));

          this.hazards.splice(k, 1);
          this.lasers.splice(i, 1);
          laserDestroyed = true;

          if (this.onDestroyHazardCallback) {
            this.onDestroyHazardCallback(hazard.x, hazard.y);
          }

          setTimeout(() => this.spawnHazard(), 1500);
          break;
        }
      }
    }

    // 7. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // 8. Update Shockwave Rings
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.update(dt);
      if (sw.radius >= sw.maxRadius) this.shockwaves.splice(i, 1);
    }
  }

  createExplosion(x, y, color, count = 30) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  draw() {
    this.ctx.fillStyle = '#030310';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Stars
    this.stars.forEach(star => {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Shockwaves
    this.shockwaves.forEach(sw => sw.draw(this.ctx));

    // Answer Invaders
    this.invaders.forEach(invader => invader.draw(this.ctx));

    // Hazard AI Enemies
    this.hazards.forEach(hazard => hazard.draw(this.ctx));

    // Enemy Lasers
    this.enemyLasers.forEach(elaser => elaser.draw(this.ctx));

    // Player Lasers
    this.lasers.forEach(laser => laser.draw(this.ctx));

    // Particles
    this.particles.forEach(p => p.draw(this.ctx));

    // Player Ship
    this.player.draw(this.ctx);
  }
}

/* --------------------------------------------------------------------------
   REALISTIC PLAYER SPACESHIP
   -------------------------------------------------------------------------- */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 36;
    this.speed = 360;

    this.moveLeft = false;
    this.moveRight = false;
    this.bankAngle = 0;
    this.flameTimer = 0;
    this.invulnerableTimer = 0;
  }

  triggerHit() {
    this.invulnerableTimer = 1.5;
  }

  update(dt, screenWidth, particleList) {
    if (this.moveLeft) {
      this.x -= this.speed * dt;
      this.bankAngle = Math.max(-0.28, this.bankAngle - dt * 4);
    } else if (this.moveRight) {
      this.x += this.speed * dt;
      this.bankAngle = Math.min(0.28, this.bankAngle + dt * 4);
    } else {
      this.bankAngle *= 0.82;
    }

    const halfW = this.width / 2;
    if (this.x < halfW + 10) this.x = halfW + 10;
    if (this.x > screenWidth - halfW - 10) this.x = screenWidth - halfW - 10;

    this.flameTimer += dt * 12;

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    if (Math.random() < 0.6) {
      particleList.push(new EngineTrailParticle(this.x, this.y + 16));
    }
  }

  draw(ctx) {
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 15) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.bankAngle);

    // Pixelated 8-bit Retro Arcade Ship Sprite Matrix
    // Pixel size: 3x3 for crisp arcade resolution
    const pSize = 3;

    // Animated thruster frame toggle
    const flameOn = Math.floor(this.flameTimer * 3) % 2 === 0;

    // Sprite palette map
    const palette = {
      'W': '#ffffff', // Cockpit White Highlight
      'C': '#00ffff', // Neon Cyan Hull
      'B': '#0099ff', // Bright Blue Armor
      'D': '#0044aa', // Dark Blue Shadow Body
      'G': '#00ff66', // Plasma Gun Green
      'Y': '#ffff00', // Thruster Flame Core Yellow
      'P': '#ff007f', // Thruster Magenta Flame
      'O': '#ff6600'  // Outer Thruster Flame
    };

    const sprite = [
      "........W........",
      ".......CCC.......",
      "......CWWWC......",
      "......CBBBC......",
      ".....DCBBBCD.....",
      "G...DDCBBBDDD...G",
      "G..DDDCCCCCDDD..G",
      "GG.DDDDBBBDDDD.GG",
      ".G.DDDDDDDDDDD.G.",
      "..DDDDDDDDDDDDD..",
      "..D..DDDDDDD..D..",
      ".....D.D.D.D.....",
      flameOn ? ".....P.Y.Y.P....." : ".....O.P.P.O.....",
      flameOn ? ".....P..P..P....." : "......P...P......",
      flameOn ? "......P...P......" : "................."
    ];

    const rows = sprite.length;
    const cols = sprite[0].length;
    const offsetX = -(cols * pSize) / 2;
    const offsetY = -(rows * pSize) / 2;

    // Turn off image smoothing for ultra crisp retro pixels
    ctx.imageSmoothingEnabled = false;

    for (let r = 0; r < rows; r++) {
      const line = sprite[r];
      for (let c = 0; c < cols; c++) {
        const char = line[c];
        if (char !== '.' && palette[char]) {
          ctx.fillStyle = palette[char];
          ctx.fillRect(offsetX + c * pSize, offsetY + r * pSize, pSize, pSize);
        }
      }
    }

    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   HAZARD ENEMY DRONE (Shoots Enemy Lasers at Player)
   -------------------------------------------------------------------------- */
class HazardEnemy {
  constructor(screenWidth, screenHeight) {
    this.type = Math.random() < 0.5 ? 'alien_scout' : 'meteor';
    this.radius = 18;
    this.shootTimer = Math.random() * 1.5;

    if (this.type === 'alien_scout') {
      this.x = Math.random() < 0.5 ? -20 : screenWidth + 20;
      this.y = 170 + Math.random() * 120;
      this.vx = (this.x < 0 ? 1 : -1) * (140 + Math.random() * 80);
      this.vy = Math.sin(Math.random() * Math.PI) * 30;
      this.color = '#ff0055';
    } else {
      this.x = 50 + Math.random() * (screenWidth - 100);
      this.y = -20;
      this.vx = (Math.random() - 0.5) * 80;
      this.vy = 120 + Math.random() * 90;
      this.color = '#ff9900';
    }

    this.angle = 0;
    this.spinSpeed = (Math.random() - 0.5) * 4;
  }

  update(dt, screenWidth, screenHeight, enemyLasers, playerX) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.spinSpeed * dt;

    // AI Plane Shoot Laser at Player!
    if (this.type === 'alien_scout') {
      this.shootTimer += dt;
      if (this.shootTimer > 2.0) {
        this.shootTimer = 0;
        enemyLasers.push(new EnemyLaser(this.x, this.y + 12, playerX));
        sounds.playEnemyLaser();
      }

      if (this.x < -30) this.x = screenWidth + 30;
      if (this.x > screenWidth + 30) this.x = -30;
    } else {
      if (this.y > screenHeight + 30) {
        this.y = -20;
        this.x = 50 + Math.random() * (screenWidth - 100);
      }
    }
  }

  containsPoint(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return (dx * dx + dy * dy) <= (this.radius + 6) * (this.radius + 6);
  }

  collidesWithPlayer(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    return (dx * dx + dy * dy) <= (this.radius + 20) * (this.radius + 20);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.imageSmoothingEnabled = false;

    const pSize = 3;

    if (this.type === 'alien_scout') {
      const palette = {
        'R': '#ff0055', // Neon Red Alien Hull
        'P': '#ff66bb', // Pink Highlights
        'C': '#00ffff', // Eye / Core Cyan
        'W': '#ffffff', // Eye White Center
        'D': '#990033'  // Dark Red Shadow
      };

      const sprite = [
        ".....R.....",
        "....RRR....",
        "...RPRPR...",
        "..RPPCPP...",
        "..RPCWCPR..",
        ".RRPPCPPRR.",
        "RRRDDDDDRRR",
        "R.R.R.R.R.R"
      ];

      const rows = sprite.length;
      const cols = sprite[0].length;
      const offsetX = -(cols * pSize) / 2;
      const offsetY = -(rows * pSize) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const char = sprite[r][c];
          if (char !== '.' && palette[char]) {
            ctx.fillStyle = palette[char];
            ctx.fillRect(offsetX + c * pSize, offsetY + r * pSize, pSize, pSize);
          }
        }
      }
    } else {
      // Space Meteor Pixel Art
      const palette = {
        'M': '#8b5a2b', // Meteor Brown
        'L': '#cd853f', // Light Rock Highlight
        'D': '#4a2e16', // Dark Crater Shadow
        'O': '#ff7700'  // Fiery Outer Rim
      };

      const sprite = [
        "..OLLMO..",
        ".OLLMMMD.",
        "OLLDMMMMO",
        "LMDDMMMMD",
        "LMMMMDDMD",
        ".DMMMDDD.",
        "..DDDDD.."
      ];

      const rows = sprite.length;
      const cols = sprite[0].length;
      const offsetX = -(cols * pSize) / 2;
      const offsetY = -(rows * pSize) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const char = sprite[r][c];
          if (char !== '.' && palette[char]) {
            ctx.fillStyle = palette[char];
            ctx.fillRect(offsetX + c * pSize, offsetY + r * pSize, pSize, pSize);
          }
        }
      }
    }

    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   ENEMY LASER CLASS (Fired downwards by AI planes)
   -------------------------------------------------------------------------- */
class EnemyLaser {
  constructor(x, y, targetX) {
    this.x = x;
    this.y = y;
    this.speed = 340;
    this.vx = (targetX - x) * 0.4;
  }

  update(dt) {
    this.y += this.speed * dt;
    this.x += this.vx * dt;
  }

  collidesWithPlayer(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    return (dx * dx + dy * dy) <= 18 * 18;
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff0055';
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(this.x - 3, this.y, 6, 14);
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   ANSWER INVADER SPACESHIP CLASS
   -------------------------------------------------------------------------- */
class AnswerInvader {
  constructor(x, y, index, optionText) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.index = index;
    this.optionText = optionText;

    this.width = 190;
    this.height = 70;
    this.floatTimer = index * 1.2;

    const colors = ['#00f0ff', '#ff007f', '#ffd700'];
    this.color = colors[index % colors.length];
  }

  update(dt) {
    this.floatTimer += dt * 2;
    this.y = this.baseY + Math.sin(this.floatTimer) * 8;
  }

  containsPoint(px, py) {
    return (
      px >= this.x - this.width / 2 &&
      px <= this.x + this.width / 2 &&
      py >= this.y - this.height / 2 &&
      py <= this.y + this.height / 2
    );
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.fillStyle = '#0a0a24';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2 + 10, -this.height / 2 - 6, 6, 6);
    ctx.fillRect(this.width / 2 - 16, -this.height / 2 - 6, 6, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.optionText, 0, 0);

    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   PLAYER LASER PROJECTILE CLASS
   -------------------------------------------------------------------------- */
class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 600;
  }

  update(dt) {
    this.y -= this.speed * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff66';
    ctx.fillStyle = '#00ff66';
    ctx.fillRect(this.x - 2, this.y - 12, 4, 16);
    ctx.restore();
  }
}

/* --------------------------------------------------------------------------
   PARTICLE & SHOCKWAVE CLASSES
   -------------------------------------------------------------------------- */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 220;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = 2 + Math.random() * 4;
    this.life = 0.4 + Math.random() * 0.4;
    this.maxLife = this.life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }
}

class EngineTrailParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 8;
    this.y = y;
    this.vy = 60 + Math.random() * 40;
    this.vx = (Math.random() - 0.5) * 20;
    this.size = 2 + Math.random() * 3;
    this.life = 0.25;
    this.maxLife = this.life;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = Math.random() < 0.5 ? '#00f0ff' : '#ff007f';
    ctx.globalAlpha = alpha;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1.0;
  }
}

class ShockwaveRing {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 5;
    this.maxRadius = 45;
    this.speed = 120;
  }

  update(dt) {
    this.radius += this.speed * dt;
  }

  draw(ctx) {
    const alpha = Math.max(0, 1 - this.radius / this.maxRadius);
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
