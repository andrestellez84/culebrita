const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'LEFT';
let food = randomFood();
let score = 0;

function restartGame() {
  clearInterval(game);
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = 'LEFT';
  food = randomFood();
  score = 0;
  document.getElementById('score').value = score;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game = setInterval(draw, 100);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function draw() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
    clearInterval(game);
    document.getElementById('score').value = score;
    alert('Juego terminado! Puntaje: ' + score);
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

let game = setInterval(draw, 100);

async function loadScores() {
  const res = await fetch('/scores');
  const data = await res.json();
  const ul = document.getElementById('scores');
  ul.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name}: ${item.score}`;
    ul.appendChild(li);
  });
}

async function saveScore(e) {
  e.preventDefault();
  const name = document.getElementById('player').value;
  const score = parseInt(document.getElementById('score').value, 10);
  await fetch('/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  });
  document.getElementById('player').value = '';
  loadScores();
}

document.getElementById('score-form').addEventListener('submit', saveScore);
window.addEventListener('load', loadScores);
document.getElementById('restart').addEventListener('click', restartGame);
