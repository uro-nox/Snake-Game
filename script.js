const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#score strong");
const bestScoreEl = document.querySelector("#bestScore strong");
const speedEl = document.querySelector("#speed strong");
const statusEl = document.getElementById("status");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

const restartBtn = document.getElementById("restartBtn");
const overlayRestartBtn = document.getElementById("overlayRestart");
const pauseBtn = document.getElementById("pauseBtn");

const box = 20;
let snake;
let food;
let direction;
let score;
let gameSpeed;
let gameInterval;
let isPaused = false;
let isGameOver = false;

const bestScore = Number(localStorage.getItem("snakeBestScore") || 0);
bestScoreEl.textContent = bestScore;

function randomFoodPosition() {
  let nextFood;
  do {
    nextFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } while (snake.some((seg) => seg.x === nextFood.x && seg.y === nextFood.y));
  return nextFood;
}

function setStatus(text, className) {
  statusEl.textContent = text;
  statusEl.className = `status ${className}`;
}

function updateSpeedBadge() {
  const speedMultiplier = (150 / gameSpeed).toFixed(1);
  speedEl.textContent = `${speedMultiplier}x`;
}

function startGameLoop() {
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, gameSpeed);
}

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  gameSpeed = 150;
  isPaused = false;
  isGameOver = false;
  scoreEl.textContent = score;
  updateSpeedBadge();
  food = randomFoodPosition();
  setStatus("Playing", "playing");
  pauseBtn.textContent = "⏸️ Pause";
  overlay.classList.add("hidden");
  startGameLoop();
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  setStatus("Game Over", "over");
  overlayText.textContent = `💀 Game Over • Score ${score}`;
  overlay.classList.remove("hidden");

  const currentBest = Number(localStorage.getItem("snakeBestScore") || 0);
  if (score > currentBest) {
    localStorage.setItem("snakeBestScore", score);
    bestScoreEl.textContent = score;
  }
}

document.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === " " && !isGameOver) {
    togglePause();
    return;
  }

  if (isPaused || isGameOver) return;

  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x, food.y, box, box);

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#166534" : "#22c55e";
    ctx.fillRect(part.x, part.y, box, box);
  });

  const head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = score;

    if (gameSpeed > 60) {
      gameSpeed -= 5;
      updateSpeedBadge();
      startGameLoop();
    }

    food = randomFoodPosition();
  } else {
    snake.pop();
  }
}

function togglePause() {
  if (isGameOver) return;

  if (isPaused) {
    isPaused = false;
    setStatus("Playing", "playing");
    overlay.classList.add("hidden");
    pauseBtn.textContent = "⏸️ Pause";
    startGameLoop();
  } else {
    isPaused = true;
    clearInterval(gameInterval);
    setStatus("Paused", "paused");
    overlayText.textContent = "⏸️ Paused";
    overlay.classList.remove("hidden");
    pauseBtn.textContent = "▶️ Resume";
  }
}

restartBtn.addEventListener("click", initGame);
overlayRestartBtn.addEventListener("click", initGame);
pauseBtn.addEventListener("click", togglePause);

document.getElementById("up").addEventListener("click", () => {
  if (!isPaused && !isGameOver && direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
  if (!isPaused && !isGameOver && direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
  if (!isPaused && !isGameOver && direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
  if (!isPaused && !isGameOver && direction !== "LEFT") direction = "RIGHT";
});

initGame();
