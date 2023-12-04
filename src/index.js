// Board and Context
const board = document.getElementById("board");
const context = board.getContext("2d");

// Score and game stat
let score = 0;
let maxScore = 0;
let gameOver = false;

// Sound variables
let jumpSound = new Audio("./sound/jump.wav");
let fallingSound = new Audio("./sound/falling-sound.mp3");

// Initialization
window.onload = function () {
  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;

  // Load doodler image
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./img/doodler-right.png";
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function () {
    context.drawImage(
      doodler.img,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./img/doodler-left.png";

  // Load platform image

  platformImg = new Image();
  platformImg.src = "./img/platform.png";

  velocityY = initialVelocityY;
  velocityX;

  placePlatforms();

  requestAnimationFrame(update);

  // Event listeners for doodler movement
  document.addEventListener("keydown", moveDoodler);
  document.addEventListener("keyup", stopDoodle);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // Move doodler to the opposite side if it goes beyond canvas
  doodler.x += velocityX;
  if (doodler.x > BOARD_WIDTH) {
    doodler.x = 0;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = BOARD_WIDTH;
  }

  // Stops the doodler from being a flash by resetting the value of gravity
  velocityY += gravity;
  if (velocityY > 0) {
    gravity = 0.2; // Increase gravity when doodle falls
  } else {
    gravity = 0.1; // Reset gravity when doodle jumps
  }

  if (gravity > maxGravity) {
    gravity = maxGravity;
  }

  // Game logic when the doodler falls
  doodler.y += velocityY;
  if (doodler.y > board.height) {
    gameOver = true;
    fallingSound.play();
  }

  // Create platforms
  function updatePlatforms() {
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      handlePlatformMovement(platform);
      handlePlatformCollision(platform);
      handlePlatformScore(platform);
      drawPlatform(platform);
    }
  }

  // clear platforms and add new platform
  while (platformArray.length > 0 && platformArray[0].y >= BOARD_HEIGHT) {
    platformArray.shift(); //removes first element from the array
    newPlatform(); //replace with new platform on top
  }
  // Drawing doodler image
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  updatePlatforms();

  // Display score at top left corner
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);

  if (gameOver) {
    context.fillText(
      `Game Over Press 'Space' to Restart`,
      BOARD_WIDTH / 7,
      (BOARD_HEIGHT * 6) / 8
    );
    context.fillText(
      `You score is ${score}`,
      BOARD_WIDTH / 7,
      (BOARD_HEIGHT * 7) / 8
    );
  }
}
