// Doodler variables
let doodlerRightImg;
let doodlerLeftImg;

// Doodler properties
let doodler = {
  img: null,
  x: DOODLER_X,
  y: DOODLER_Y,
  width: DOODLER_WIDTH,
  height: DOODLER_HEIGHT,
};

// Physics properties
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -4; //starting velocity Y
let gravity = 0.3;
let maxGravity = 0.3;

// Board and Context
const domElement = {
  board: document.getElementById("board"),
  mainMenu: document.getElementById("main-menu"),
  gameOverMenu: document.getElementById("game-over"),
  menuBtn: document.getElementById("menu"),
};

const context = domElement.board.getContext("2d");

// Score and game stat
let score = 0;
let maxScore = 0;
let gameOver = false;
let highestScore = 0;

// Sound variables
const gameSound = {
  jumpSound: new Audio("./sound/jump.wav"),
  fallingSound: new Audio("./sound/falling-sound.mp3"),
};

// Initialization
window.onload = function () {
  const playButton = document.getElementById("start-game"); // Select the play button

  // Add a click event listener to the play button
  playButton.addEventListener("click", function () {
    init(); // Call the init function when the button is clicked
  });
};

function init() {
  domElement.board.height = BOARD_HEIGHT;
  domElement.board.width = BOARD_WIDTH;
  domElement.mainMenu.classList.add("hide");

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

  // Initialize velocity
  velocityY = initialVelocityY;
  velocityX; // stops the doodle from continuously moving

  placePlatforms();

  requestAnimationFrame(update);

  // Event listeners for doodler movement
  document.addEventListener("keydown", moveDoodler);
  document.addEventListener("keyup", stopDoodle);
}

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  // Move doodler to the opposite side if it goes beyond canvas
  doodler.x += velocityX;
  if (doodler.x > BOARD_WIDTH) {
    doodler.x = 0;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = BOARD_WIDTH;
  }

  // Control gravity for doodler
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
  if (doodler.y > BOARD_HEIGHT) {
    gameOver = true;
    gameSound.fallingSound.play();
  }

  // Update the highest score if needed
  if (score > highestScore) {
    highestScore = score;
  }

  // Update and draw platforms
  function updatePlatforms() {
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      handlePlatformMovement(platform);
      handlePlatformCollision(platform);
      handlePlatformScore(platform);
      drawPlatform(platform);
    }
  }

  // clear platforms and add new ones
  while (platformArray.length > 0 && platformArray[0].y >= BOARD_HEIGHT) {
    platformArray.shift(); //removes first platform from the platform array
    newPlatform(); //replace with new platform on top
  }
  // Draw doodler
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
    showGameOverMenu();
  }
}

function showGameOverMenu() {
  domElement.gameOverMenu.style.zIndex = 1;
  domElement.gameOverMenu.style.visibility = "visible";
  const scoreText = document.getElementById("score-number");
  scoreText.innerHTML = "You scored " + score + " points!";
  const highestScoreText = document.getElementById("highest-score");
  highestScoreText.innerHTML = "Highest Score: " + highestScore + " points!";
}

function hideGameOverMenu() {
  domElement.gameOverMenu.style.zIndex = -1;
  domElement.gameOverMenu.style.visibility = "hidden";
}
