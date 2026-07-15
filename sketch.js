let mode;
let playerX;
let playerY;
let playerW;
let playerH;
let playerSpeed;
let bullets;
let enemies;
let stars;
let score;
let health;
let spawnTimer;
let enemySpeed;
let fireCooldown;

function setup() {
  createCanvas(800, 600);
  resetGame();
}

function resetGame() {
  mode = 0;
  playerW = 80;
  playerH = 24;
  playerX = width / 2 - playerW / 2;
  playerY = height - 80;
  playerSpeed = 24;

  bullets = [];
  enemies = [];
  stars = [];
  score = 0;
  health = 3;
  spawnTimer = 0;
  enemySpeed = 2.5;
  fireCooldown = 0;

  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), speed: random(0.5, 2) });
  }
}

function draw() {
  drawBackground();

  if (mode === 0) {
    drawTitleScreen();
  } else if (mode === 1) {
    updateGame();
    drawGame();
    checkGameOver();
  } else if (mode === 2) {
    drawGame();
    drawEndScreen();
  }
}

function drawBackground() {
  background(8, 12, 30);
  noStroke();
  fill(255, 255, 255, 180);
  stars.forEach(star => {
    circle(star.x, star.y, star.size);
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  });
}

function drawTitleScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(52);
  text('Space Defender', width / 2, height / 2 - 60);
  textSize(20);
  text('矢印キーで移動、スペースを押しっぱなしで連射', width / 2, height / 2);
  text('敵を倒してハイスコアを狙え！', width / 2, height / 2 + 30);
  textSize(18);
  text('クリックでスタート', width / 2, height / 2 + 80);
}

function drawEndScreen() {
  fill(255, 220, 0);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER);
  textSize(48);
  text('GAME OVER', width / 2, height / 2 - 20);
  textSize(28);
  text('SCORE: ' + score, width / 2, height / 2 + 20);
  noStroke();
  textSize(20);
  text('クリックでリスタート', width / 2, height / 2 + 60);
}

function updateGame() {
  updatePlayer();
  updateBullets();
  updateEnemies();
}

function drawGame() {
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawHUD();
}

function updatePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    playerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    playerX += playerSpeed;
  }
  playerX = constrain(playerX, 20, width - playerW - 20);

  if (fireCooldown > 0) {
    fireCooldown -= 1;
  }

  if (keyIsDown(32) && mode === 1 && fireCooldown <= 0) {
    bullets.push({ x: playerX + playerW / 2, y: playerY - 10 });
    fireCooldown = 2;
  }
}

function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= 16;
    if (bullet.y < -20) {
      bullets.splice(index, 1);
    }
  });
}

function updateEnemies() {
  spawnTimer += 1;
  if (spawnTimer > 45) {
    spawnTimer = 0;
    spawnEnemy();
  }
  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed;
    if (enemy.y > height + enemy.size) {
      enemies.splice(eIndex, 1);
      health -= 1;
    }

    bullets.forEach((bullet, bIndex) => {
      if (dist(bullet.x, bullet.y, enemy.x, enemy.y) < enemy.size / 1.5) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score += 10;
        enemySpeed += 0.05;
      }
    });
  });
}

function spawnEnemy() {
  let size = random(24, 42);
  enemies.push({
    x: random(40, width - 40),
    y: -size,
    size: size,
    speed: enemySpeed + random(0, 1.5),
    color: color(random(120, 255), random(80, 180), random(80, 220))
  });
}

function drawPlayer() {
  noStroke();
  fill(0, 200, 255);
  rect(playerX, playerY, playerW, playerH, 10);
  fill(255);
  triangle(playerX - 10, playerY, playerX, playerY + playerH, playerX - 10, playerY + playerH);
  triangle(playerX + playerW + 10, playerY, playerX + playerW, playerY + playerH, playerX + playerW + 10, playerY + playerH);
}

function drawBullets() {
  bullets.forEach(bullet => {
    noStroke();
    fill(255, 240, 100);
    rect(bullet.x - 5, bullet.y - 16, 10, 32, 5);
  });
}

function drawEnemies() {
  enemies.forEach(enemy => {
    fill(enemy.color);
    noStroke();
    ellipse(enemy.x, enemy.y, enemy.size, enemy.size);
    fill(255);
    ellipse(enemy.x - enemy.size * 0.18, enemy.y - enemy.size * 0.12, enemy.size * 0.22, enemy.size * 0.22);
    ellipse(enemy.x + enemy.size * 0.18, enemy.y - enemy.size * 0.12, enemy.size * 0.22, enemy.size * 0.22);
    fill(0);
    ellipse(enemy.x - enemy.size * 0.18, enemy.y - enemy.size * 0.12, enemy.size * 0.1, enemy.size * 0.1);
    ellipse(enemy.x + enemy.size * 0.18, enemy.y - enemy.size * 0.12, enemy.size * 0.1, enemy.size * 0.1);
    fill(255, 150, 150);
    arc(enemy.x, enemy.y + enemy.size * 0.18, enemy.size * 0.7, enemy.size * 0.4, 0, PI);
  });
}

function drawHUD() {
  fill(255);
  textSize(18);
  textAlign(LEFT);
  text('SCORE: ' + score, 16, 30);
  text('HEALTH: ' + health, 16, 56);
}

function checkGameOver() {
  if (health <= 0) {
    mode = 2;
    gameMessage = 'GAME OVER';
  }
}

function mousePressed() {
  if (mode === 0) {
    mode = 1;
  } else if (mode === 2) {
    resetGame();
    mode = 1;
  }
}

