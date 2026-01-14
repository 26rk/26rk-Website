const liveBadge = document.querySelector('.project-badge.live');
const gameModal = document.getElementById('snakeGame');
const gameClose = document.querySelector('.game-close');

const gameTabs = document.querySelectorAll('.game-tab');
const gameTabContents = document.querySelectorAll('.game-tab-content');

gameTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const gameName = this.getAttribute('data-game');
        
        gameTabs.forEach(t => t.classList.remove('active'));
        gameTabContents.forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(`${gameName}GameTab`).classList.add('active');
        
        if (gameName === 'snake') {
            stopDino();
        } else if (gameName === 'dino') {
            stopSnake();
        }
    });
});

if (liveBadge && gameModal) {
    liveBadge.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        gameModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        startSnake();
    });
}

if (gameClose && gameModal) {
    gameClose.addEventListener('click', function() {
        gameModal.classList.remove('active');
        document.body.style.overflow = '';
        stopSnake();
        stopDino();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && gameModal.classList.contains('active')) {
        gameModal.classList.remove('active');
        document.body.style.overflow = '';
        stopSnake();
        stopDino();
    }
});

const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
const restartSnakeBtn = document.getElementById('restartSnake');

const gridSize = 20;
const tileCount = 20;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let snakeScore = 0;
let snakeHighScore = localStorage.getItem('snakeHighScore') || 0;
let snakeGameLoop;
let snakeGameRunning = false;

const snakeHighScoreElement = document.getElementById('snakeHighScore');
if (snakeHighScoreElement) {
    snakeHighScoreElement.textContent = snakeHighScore;
}

if (restartSnakeBtn) {
    restartSnakeBtn.addEventListener('click', function() {
        startSnake();
    });
}

document.addEventListener('keydown', function(e) {
    if (!snakeGameRunning) return;
    
    const key = e.key.toLowerCase();
    
    if ((key === 'arrowup' || key === 'w') && dy === 0) {
        dx = 0;
        dy = -1;
    } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
        dx = 0;
        dy = 1;
    } else if ((key === 'arrowleft' || key === 'a') && dx === 0) {
        dx = -1;
        dy = 0;
    } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
        dx = 1;
        dy = 0;
    }
});

function startSnake() {
    snake = [{x: 10, y: 10}];
    food = generateFood();
    dx = 0;
    dy = 0;
    snakeScore = 0;
    const snakeScoreElement = document.getElementById('snakeScore');
    if (snakeScoreElement) {
        snakeScoreElement.textContent = snakeScore;
    }
    snakeGameRunning = true;
    
    if (snakeGameLoop) clearInterval(snakeGameLoop);
    
    drawSnake();
    
    snakeGameLoop = setInterval(updateSnake, 100);
}

function stopSnake() {
    snakeGameRunning = false;
    if (snakeGameLoop) clearInterval(snakeGameLoop);
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    
    return newFood;
}

function updateSnake() {
    if (!snakeGameRunning) return;
    
    if (dx === 0 && dy === 0) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOverSnake();
        return;
    }
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOverSnake();
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        const snakeScoreElement = document.getElementById('snakeScore');
        if (snakeScoreElement) {
            snakeScoreElement.textContent = snakeScore;
        }
        food = generateFood();
        
        if (snakeScore > snakeHighScore) {
            snakeHighScore = snakeScore;
            localStorage.setItem('snakeHighScore', snakeHighScore);
            const snakeHighScoreElement = document.getElementById('snakeHighScore');
            if (snakeHighScoreElement) {
                snakeHighScoreElement.textContent = snakeHighScore;
            }
        }
    } else {
        snake.pop();
    }
    
    drawSnake();
}

function drawSnake() {
    if (!snakeCtx) return;
    
    snakeCtx.fillStyle = '#000';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.fillStyle = '#5bd287';
    for (let segment of snake) {
        snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    snakeCtx.fillStyle = '#ff6b6b';
    snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function gameOverSnake() {
    snakeGameRunning = false;
    clearInterval(snakeGameLoop);
    
    snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.fillStyle = '#5bd287';
    snakeCtx.font = "bold 30px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('Game Over!', snakeCanvas.width / 2, snakeCanvas.height / 2 - 20);
    
    snakeCtx.fillStyle = '#fff';
    snakeCtx.font = "20px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    snakeCtx.fillText(`Score: ${snakeScore}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 20);
}

if (snakeCtx) {
    drawSnake();
}

const dinoCanvas = document.getElementById('dinoCanvas');
const dinoCtx = dinoCanvas ? dinoCanvas.getContext('2d') : null;
const restartDinoBtn = document.getElementById('restartDino');

let dinoY = 150;
let dinoVelocity = 0;
const gravity = 0.6;
const jumpPower = -13;
let isJumping = false;

let obstacles = [];
let dinoScore = 0;
let dinoHighScore = localStorage.getItem('dinoHighScore') || 0;
let dinoGameLoop;
let dinoGameRunning = false;
let obstacleSpeed = 5;
let frameCount = 0;

const dinoHighScoreElement = document.getElementById('dinoHighScore');
if (dinoHighScoreElement) {
    dinoHighScoreElement.textContent = dinoHighScore;
}

if (restartDinoBtn) {
    restartDinoBtn.addEventListener('click', function() {
        startDino();
    });
}

document.addEventListener('keydown', function(e) {
    if (!dinoGameRunning) return;
    
    if ((e.key === ' ' || e.key === 'ArrowUp') && !isJumping) {
        e.preventDefault();
        dinoVelocity = jumpPower;
        isJumping = true;
    }
});

function startDino() {
    dinoY = 150;
    dinoVelocity = 0;
    isJumping = false;
    obstacles = [];
    dinoScore = 0;
    obstacleSpeed = 3;
    frameCount = 0;
    
    const dinoScoreElement = document.getElementById('dinoScore');
    if (dinoScoreElement) {
        dinoScoreElement.textContent = dinoScore;
    }
    dinoGameRunning = true;
    
    if (dinoGameLoop) cancelAnimationFrame(dinoGameLoop);
    
    updateDino();
}

function stopDino() {
    dinoGameRunning = false;
    if (dinoGameLoop) cancelAnimationFrame(dinoGameLoop);
}

function updateDino() {
    if (!dinoGameRunning) return;
    
    frameCount++;
    
    dinoVelocity += gravity;
    dinoY += dinoVelocity;
    
    if (dinoY > 150) {
        dinoY = 150;
        dinoVelocity = 0;
        isJumping = false;
    }
    
    const spawnRate = Math.max(80, 140 - Math.floor(dinoScore / 5) * 10);
    
    if (frameCount % spawnRate === 0) {
        const obstacleTypes = [
            { width: 12, height: 30, type: 'cactus' },
            { width: 15, height: 35, type: 'tall-cactus' },
            { width: 20, height: 20, type: 'rock' },
            { width: 18, height: 40, type: 'tree' }
        ];
        
        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        obstacles.push({
            x: 600,
            width: randomType.width,
            height: randomType.height,
            type: randomType.type
        });
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            dinoScore++;
            const dinoScoreElement = document.getElementById('dinoScore');
            if (dinoScoreElement) {
                dinoScoreElement.textContent = dinoScore;
            }
            
            if (dinoScore > dinoHighScore) {
                dinoHighScore = dinoScore;
                localStorage.setItem('dinoHighScore', dinoHighScore);
                const dinoHighScoreElement = document.getElementById('dinoHighScore');
                if (dinoHighScoreElement) {
                    dinoHighScoreElement.textContent = dinoHighScore;
                }
            }
            
            if (dinoScore % 10 === 0 && obstacleSpeed < 12) {
                obstacleSpeed += 0.3;
            }
        }
        
        const dinoLeft = 35;
        const dinoRight = 55;
        const dinoTop = dinoY + 5;
        const dinoBottom = dinoY + 25;
        
        const obsLeft = obstacles[i].x;
        const obsRight = obstacles[i].x + obstacles[i].width;
        const obsTop = 160 - obstacles[i].height;
        const obsBottom = 160;
        
        if (dinoRight > obsLeft && dinoLeft < obsRight &&
            dinoBottom > obsTop && dinoTop < obsBottom) {
            gameOverDino();
            return;
        }
    }
    
    drawDino();
    
    dinoGameLoop = requestAnimationFrame(updateDino);
}

function drawDino() {
    if (!dinoCtx) return;
    
    dinoCtx.fillStyle = '#000';
    dinoCtx.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    
    dinoCtx.fillStyle = '#5bd287';
    dinoCtx.fillRect(30, dinoY, 30, 30);
    
    dinoCtx.fillStyle = '#5bd287';
    dinoCtx.fillRect(0, 180, 600, 2);
    
    for (let obstacle of obstacles) {
        dinoCtx.fillStyle = '#5bd287';
        
        if (obstacle.type === 'cactus') {
            dinoCtx.fillRect(obstacle.x, 160 - obstacle.height, obstacle.width, obstacle.height);
            dinoCtx.fillRect(obstacle.x + 3, 160 - obstacle.height + 5, 4, 6);
        } else if (obstacle.type === 'tall-cactus') {
            dinoCtx.fillRect(obstacle.x, 160 - obstacle.height, obstacle.width, obstacle.height);
            dinoCtx.fillRect(obstacle.x + 2, 160 - obstacle.height + 8, 4, 6);
            dinoCtx.fillRect(obstacle.x + 9, 160 - obstacle.height + 8, 4, 6);
        } else if (obstacle.type === 'rock') {
            dinoCtx.beginPath();
            dinoCtx.moveTo(obstacle.x + obstacle.width / 2, 160 - obstacle.height);
            dinoCtx.lineTo(obstacle.x + obstacle.width, 160);
            dinoCtx.lineTo(obstacle.x, 160);
            dinoCtx.closePath();
            dinoCtx.fill();
        } else if (obstacle.type === 'tree') {
            dinoCtx.fillRect(obstacle.x + 6, 160 - 25, 6, 25);
            dinoCtx.beginPath();
            dinoCtx.moveTo(obstacle.x, 160 - 25);
            dinoCtx.lineTo(obstacle.x + 9, 160 - 40);
            dinoCtx.lineTo(obstacle.x + 18, 160 - 25);
            dinoCtx.closePath();
            dinoCtx.fill();
        }
    }
}

function gameOverDino() {
    dinoGameRunning = false;
    cancelAnimationFrame(dinoGameLoop);
    
    dinoCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    dinoCtx.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    
    dinoCtx.fillStyle = '#5bd287';
    dinoCtx.font = "bold 30px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    dinoCtx.textAlign = 'center';
    dinoCtx.fillText('Game Over!', dinoCanvas.width / 2, dinoCanvas.height / 2 - 20);
    
    dinoCtx.fillStyle = '#fff';
    dinoCtx.font = "20px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    dinoCtx.fillText(`Score: ${dinoScore}`, dinoCanvas.width / 2, dinoCanvas.height / 2 + 20);
}

if (dinoCtx) {
    dinoCtx.fillStyle = '#000';
    dinoCtx.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    dinoCtx.fillStyle = '#5bd287';
    dinoCtx.fillRect(30, 150, 30, 30);
    dinoCtx.fillRect(0, 180, 600, 2);
}
