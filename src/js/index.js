//*1 bring in all DOM elements
//*2 create rulesBtn eventListener to add show class that changes transform propertyX -400px to 0 , add closeBtn eventListener
//*3 see canvas API documentation, allows us to draw shapes on our canvas such as rectangles and paths must insert the canvas and ctx global variables
//*4 create ball properties dx, dy is speed of direction of x and y axis
//*5 create drawBall function:so we beginPath, create cricle using arc, add fill style, fill it, and closePath
//*6 create paddle properties for width and height take in mind canvas width and height for calculations
//*7 draw paddle on canvas use rect method for rectangle takes in position
//*8 create draw function to calll all draw functions for game such as ball, paddle etc...
//*9 create drawScore function and create local score variable
//*10 create brick global variables, create 2 bricks arrays: arr of columns of bricks or rows of columns, each column is also an arr, we have 9 rows and inside each one has a column
//*11 draw bricks on canvas forEach loops
//*12 add Window.requestAnimationFrame() method: tells the browser that you wish to perform an animation and requests that the browser calls a specified function
//*13 create movePaddle function. only uses x axis so we take x axis and append dx value. default is set to 0, not moving on its own. will implement keyboard events
//*14 add keyboard eventListeners and their respective functions
//*15 create moveBall function adds wall, paddle, and brick collision
//*16 create increaseScore and showAllBricks function
//*17 add lose functionality
//*18

const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//4 Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true
};

//6 Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
};

//10 Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

//10 Create bricks
//initialize empty array, create for loop: loop through # of rows, have an arr for each row, and whatever iteration is... set that to an arr
//second for loop: we loop through column and getting the positions count create x and y values for each 1. x = row iteration i and multiply that by width, add the offset
//take bricks arr and column and set that to an object, that object has x and y values, and use spread operator for brickInfo properties
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//5 Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

//7 Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

//11 Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

//13 Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//15 Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//16 Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) { //check if any bricks left if no remainder then showAllBricks

    ball.visible = false;
    paddle.visible = false;

    //After 0.5 sec restart the game
    setTimeout(function () {
      showAllBricks();
      score = 0;
      paddle.x = canvas.width / 2 - 40;
      paddle.y = canvas.height - 20;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.visible = true;
      paddle.visible = true;
    }, delay)
  }
}

//16 Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

//8 Draw everything
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//12 update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

//9 Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}


//14 Keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

//14 Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

//14 Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//2 Rules and close event handlers
rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});