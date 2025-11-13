const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box,
};
let gameInterval;

// Draw everything
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food (brown)
  ctx.fillStyle = "brown";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw snake (gray)
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "gray";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Collision detection
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over!");
    return;
  }

  snake.unshift(newHead);
}

function collision(head, arr) {
  return arr.some((segment) => segment.x === head.x && segment.y === head.y);
}

// Keyboard control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Swipe controls for mobile
let startX, startY;
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchmove", (e) => {
  if (!startX || !startY) return;
  const touch = e.touches[0];
  const diffX = startX - touch.clientX;
  const diffY = startY - touch.clientY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "RIGHT") direction = "LEFT";
    else if (diffX < 0 && direction !== "LEFT") direction = "RIGHT";
  } else {
    if (diffY > 0 && direction !== "DOWN") direction = "UP";
    else if (diffY < 0 && direction !== "UP") direction = "DOWN";
  }

  startX = null;
  startY = null;
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "🌙 Dark";
  } else {
    themeToggle.textContent = "🌞 Light";
  }
});

// Start game loop
gameInterval = setInterval(drawGame, 120);
