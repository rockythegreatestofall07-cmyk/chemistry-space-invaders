/* ==========================================================================
   Main Application Controller - Chemistry Space Invaders
   State management, continuous seamless gameplay, bottom fact feedback panel
   ========================================================================== */

import { GameEngine } from './game.js';
import { generateRandomizedGameData } from './questions.js';
import { sounds } from './audio.js';

class ChemistryApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.engine = new GameEngine(this.canvas);

    // Dynamic Game Data (Randomized per session)
    this.activeGameData = [];

    // State Variables
    this.currentLevelIdx = 0;
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.lives = 3;
    this.isMuted = false;
    this.idleTimer = null;
    this.tickerTimer = null;

    // UI Elements
    this.hudBar = document.getElementById('hud-bar');
    this.hudLevel = document.getElementById('hud-level');
    this.hudProgress = document.getElementById('hud-progress');
    this.hudScore = document.getElementById('hud-score');
    this.hudLives = document.getElementById('hud-lives');

    this.questionBanner = document.getElementById('question-banner');
    this.questionText = document.getElementById('question-text');

    // Bottom Fact & Answer Feedback Screen Elements (Placed at the bottom dashboard)
    this.bottomFactPanel = document.getElementById('bottom-fact-panel');
    this.bottomStatus = document.getElementById('bottom-status');
    this.bottomFactText = document.getElementById('bottom-fact-text');

    // Overlay Screens
    this.screenTitle = document.getElementById('screen-title');
    this.screenHelp = document.getElementById('screen-help');
    this.screenScores = document.getElementById('screen-scores');
    this.screenVictory = document.getElementById('screen-victory');
    this.screenGameOver = document.getElementById('screen-gameover');

    // Victory Elements
    this.finalScore = document.getElementById('final-score');
    this.finalRank = document.getElementById('final-rank');
    this.playerNameInput = document.getElementById('player-name');

    // Audio & Touch
    this.soundBtn = document.getElementById('sound-btn');

    this.initEvents();
    this.resetIdleTimer();
    this.loadLeaderboard();
  }

  initEvents() {
    // Button Event Listeners
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('how-to-btn').addEventListener('click', () => this.showScreen(this.screenHelp));
    document.getElementById('help-btn').addEventListener('click', () => this.showScreen(this.screenHelp));
    document.getElementById('close-help-btn').addEventListener('click', () => this.showScreen(this.screenTitle));

    document.getElementById('scores-btn').addEventListener('click', () => {
      this.renderLeaderboardUI();
      this.showScreen(this.screenScores);
    });
    document.getElementById('close-scores-btn').addEventListener('click', () => this.showScreen(this.screenTitle));

    document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
    document.getElementById('retry-btn').addEventListener('click', () => this.startGame());

    document.getElementById('save-score-btn').addEventListener('click', () => this.saveCurrentScore());

    this.soundBtn.addEventListener('click', () => {
      this.isMuted = sounds.toggleMute();
      this.soundBtn.textContent = this.isMuted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      this.resetIdleTimer();
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.engine.player.moveLeft = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.engine.player.moveRight = true;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        this.fireLaser();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.engine.player.moveLeft = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.engine.player.moveRight = false;
      }
    });

    // Mouse Controls
    this.canvas.addEventListener('mousemove', (e) => {
      this.resetIdleTimer();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * this.engine.width;
      this.engine.player.x = mouseX;
    });

    this.canvas.addEventListener('click', () => {
      this.fireLaser();
    });
  }

  fireLaser() {
    if (this.engine.isRunning) {
      if (this.engine.firePlayerLaser()) {
        sounds.playLaser();
      }
    }
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (this.engine.isRunning) {
        this.engine.stop();
        this.showScreen(this.screenTitle);
      }
    }, 120000);
  }

  showScreen(targetScreen) {
    [this.screenTitle, this.screenHelp, this.screenScores, this.screenVictory, this.screenGameOver].forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });

    if (targetScreen) {
      targetScreen.classList.remove('hidden');
      targetScreen.classList.add('active');
    }
  }

  startGame() {
    this.activeGameData = generateRandomizedGameData();

    this.score = 0;
    this.lives = 3;
    this.currentLevelIdx = 0;
    this.currentQuestionIdx = 0;

    this.hudBar.classList.remove('hidden');
    this.questionBanner.classList.remove('hidden');

    this.showScreen(null);
    this.updateHUD();

    this.resetBottomFactPanel();

    const level = this.activeGameData[this.currentLevelIdx];
    const q = level.questions[this.currentQuestionIdx];
    this.questionText.textContent = `TARGET: ${q.question}`;
    this.engine.setupQuestion(q.options);

    // Start engine continuous loop
    this.engine.start(
      (selectedIdx) => this.handleAnswerHit(selectedIdx),
      (hx, hy) => this.handleHazardDestroyed(hx, hy),
      () => this.handlePlayerHitByHazard()
    );
  }

  resetBottomFactPanel() {
    this.bottomFactPanel.classList.remove('correct', 'wrong');
    this.bottomStatus.textContent = '⚡ AIM & SHOOT LASERS AT ANSWERS ⚡';
    this.bottomFactText.textContent = 'Use Left/Right keys or Mouse to move • Press Space / Click to shoot!';
  }

  handleHazardDestroyed(hx, hy) {
    this.score += 25; // +25 PTS for killing AI plane!
    sounds.playHazardExplosion();
    this.updateHUD();

    this.updateBottomFactPanel('💥 ENEMY DRONE DESTROYED! (+25 PTS)', 'Great shooting! Clear hazard drones to gain bonus points.', false);
  }

  handlePlayerHitByHazard() {
    this.lives -= 1;
    sounds.playPlayerHit();
    this.updateHUD();

    this.updateBottomFactPanel('⚠️ SHIP HIT BY ENEMY LASER / METEOR!', 'Dodge incoming red alien laser fire and space rocks!', true);

    if (this.lives <= 0) {
      this.engine.stop();
      this.showScreen(this.screenGameOver);
      document.getElementById('gameover-score').textContent = this.score;
    }
  }

  updateHUD() {
    const level = this.activeGameData[this.currentLevelIdx] || { levelNumber: 1, title: 'LEVEL 1' };
    this.hudLevel.textContent = `L${level.levelNumber}: ${level.title.split(':')[1] || level.title}`;
    this.hudProgress.textContent = `QUESTION ${this.currentQuestionIdx + 1} / 5`;
    this.hudScore.textContent = String(this.score).padStart(4, '0');

    let hearts = '';
    for (let i = 0; i < this.lives; i++) hearts += '❤️';
    this.hudLives.textContent = hearts || '💀';
  }

  handleAnswerHit(selectedIdx) {
    const level = this.activeGameData[this.currentLevelIdx];
    const q = level.questions[this.currentQuestionIdx];

    const isCorrect = (selectedIdx === q.correctIndex);

    if (isCorrect) {
      this.score += 100;
      sounds.playCorrect();
      sounds.playExplosion();
      this.updateBottomFactPanel('✨ CORRECT ANSWER! (+100 PTS)', q.explanation, false);
    } else {
      this.lives -= 1;
      sounds.playWrong();
      const correctAnsStr = q.options[q.correctIndex];
      this.updateBottomFactPanel(`💡 NOT QUITE! (Correct Answer: ${correctAnsStr})`, q.explanation, true);
    }

    this.updateHUD();

    if (this.lives <= 0) {
      this.engine.stop();
      this.showScreen(this.screenGameOver);
      document.getElementById('gameover-score').textContent = this.score;
      return;
    }

    // Continuous non-stop progress to next question!
    this.currentQuestionIdx++;

    if (this.currentQuestionIdx >= 5) {
      this.currentQuestionIdx = 0;
      this.currentLevelIdx++;

      if (this.currentLevelIdx >= this.activeGameData.length) {
        this.engine.stop();
        this.triggerVictory();
        return;
      } else {
        sounds.playVictory();
      }
    }

    // Load next question immediately on engine canvas without stopping loop!
    const nextLevel = this.activeGameData[this.currentLevelIdx];
    const nextQ = nextLevel.questions[this.currentQuestionIdx];
    this.questionText.textContent = `TARGET: ${nextQ.question}`;
    this.engine.setupQuestion(nextQ.options);
    this.updateHUD();
  }

  updateBottomFactPanel(statusText, factText, isWrong) {
    clearTimeout(this.tickerTimer);

    this.bottomStatus.textContent = statusText;
    this.bottomFactText.textContent = factText;

    if (isWrong) {
      this.bottomFactPanel.classList.remove('correct');
      this.bottomFactPanel.classList.add('wrong');
    } else {
      this.bottomFactPanel.classList.remove('wrong');
      this.bottomFactPanel.classList.add('correct');
    }

    // Keep active for 4 seconds then reset to default guide text
    this.tickerTimer = setTimeout(() => {
      this.resetBottomFactPanel();
    }, 4000);
  }

  triggerVictory() {
    sounds.playVictory();
    this.showScreen(this.screenVictory);

    this.finalScore.textContent = this.score;

    let rank = 'EXHIBITION EXPLORER';
    if (this.score >= 2000) rank = 'MASTER CHEMIST 🌟';
    else if (this.score >= 1500) rank = 'ELEMENT SPECIALIST ⭐';
    else rank = 'JUNIOR CHEMIST 🧪';

    this.finalRank.textContent = rank;
  }

  saveCurrentScore() {
    const name = this.playerNameInput.value.trim() || 'Parent Chemist';
    const scores = JSON.parse(localStorage.getItem('chem_invaders_scores') || '[]');

    scores.push({ name, score: this.score, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.score - a.score);

    localStorage.setItem('chem_invaders_scores', JSON.stringify(scores.slice(0, 8)));

    this.renderLeaderboardUI();
    this.showScreen(this.screenScores);
  }

  loadLeaderboard() {
    if (!localStorage.getItem('chem_invaders_scores')) {
      const defaultScores = [
        { name: "Parent Chemist", score: 2000, date: "Exhibition" },
        { name: "Science Dad", score: 1800, date: "Exhibition" },
        { name: "Curious Visitor", score: 1600, date: "Exhibition" },
        { name: "Chemistry Fan", score: 1400, date: "Exhibition" }
      ];
      localStorage.setItem('chem_invaders_scores', JSON.stringify(defaultScores));
    }
  }

  renderLeaderboardUI() {
    const listContainer = document.getElementById('leaderboard-list');
    const scores = JSON.parse(localStorage.getItem('chem_invaders_scores') || '[]');

    listContainer.innerHTML = '';
    scores.forEach((entry, idx) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      item.innerHTML = `
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-score">${entry.score} PTS</span>
      `;
      listContainer.appendChild(item);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.chemApp = new ChemistryApp();
});
