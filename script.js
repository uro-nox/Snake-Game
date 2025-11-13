const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
let snake, food, direction, score, gameSpeed, gameInterval;

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  gameSpeed = 150;
  scoreEl.textContent = "Score: " + score;
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, gameSpeed);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw food
  ctx.fillStyle = "brown";
  ctx.fillRect(food.x, food.y, box, box);

  // draw snake
  ctx.fillStyle = "black";
  snake.forEach(part => ctx.fillRect(part.x, part.y, box, box));

  // move snake
  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // check collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert("💀 Game Over! Final Score: " + score);
    return;
  }

  snake.unshift(head);

  // eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = "Score: " + score;

    // speed up slightly
    if (gameSpeed > 60) {
      gameSpeed -= 5;
      clearInterval(gameInterval);
      gameInterval = setInterval(drawGame, gameSpeed);
    }

    // new food position
    food.x = Math.floor(Math.random() * (canvas.width / box)) * box;
    food.y = Math.floor(Math.random() * (canvas.height / box)) * box;
  } else {
    snake.pop();
  }
}

// Restart button
restartBtn.addEventListener("click", initGame);

// Mobile controls
document.getElementById("up").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

initGame();
