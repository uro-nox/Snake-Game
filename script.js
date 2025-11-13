// Grab elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');
const gameContainer = document.getElementById('gameContainer');

const BOX = 20;
const GRID_COLS = Math.floor(400 / BOX);
const GRID_ROWS = Math.floor(400 / BOX);

let snake = [{ x: 9 * BOX, y: 10 * BOX }];
let direction = "RIGHT";
let food = spawnFood();
let gameInterval = null;
let speed = 120;

canvas.width = 400;
canvas.height = 400;

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = 'brown';
  ctx.fillRect(food.x, food.y, BOX, BOX);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(snake[i].x, snake[i].y, BOX, BOX);
  }

  // compute new head
  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === 'LEFT') headX -= BOX;
  if (direction === 'UP') headY -= BOX;
  if (direction === 'RIGHT') headX += BOX;
  if (direction === 'DOWN') headY += BOX;

  // Eat food?
  if (headX === food.x && headY === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Collisions
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(seg => seg.x === head.x && seg.y === head.y);
}

function spawnFood() {
  const fx = Math.floor(Math.random() * GRID_COLS) * BOX;
  const fy = Math.floor(Math.random() * GRID_ROWS) * BOX;
  for (let seg of snake) {
    if (seg.x === fx && seg.y === fy) {
      return spawnFood();
    }
  }
  return { x: fx, y: fy };
}

function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;
  setTimeout(() => {
    alert('Game Over!');
    location.reload();
  }, 50);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Swipe controls
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  if (touchStartX === null || touchStartY === null) return;
  const t = e.changedTouches[0];
  const dx = touchStartX - t.clientX;
  const dy = touchStartY - t.clientY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const threshold = 20;

  if (Math.max(absX, absY) >= threshold) {
    if (absX > absY) {
      if (dx > 0 && direction !== 'RIGHT') direction = 'LEFT';
      else if (dx < 0 && direction !== 'LEFT') direction = 'RIGHT';
    } else {
      if (dy > 0 && direction !== 'DOWN') direction = 'UP';
      else if (dy < 0 && direction !== 'UP') direction = 'DOWN';
    }
  }

  touchStartX = null;
  touchStartY = null;
}, { passive: true });

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.textContent = '🌙 Dark';
  } else {
    themeToggle.textContent = '🌞 Light';
  }
});

// start game
if (!gameInterval) gameInterval = setInterval(drawGame, speed);

// Prevent page scroll while swiping
canvas.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive:false });
