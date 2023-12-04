// Board and Context
const board = document.getElementById("board");
const context = board.getContext("2d");

// Doodler variables
let doodlerX = BOARD_WIDTH / 2 - DOODLER_WIDTH / 2;
let doodlerY = (BOARD_HEIGHT * 7) / 8 - DOODLER_HEIGHT;
let doodlerRightImg;
let doodlerLeftImg;

// Doodler properties
let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: DOODLER_WIDTH,
  height: DOODLER_HEIGHT,
};

// Physics properties
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -4; //starting velocity Y
let gravity = 0.3;
let maxGravity = 0.3;

// Platforms varaibles
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let passedPlatforms = [];
let platformImg;

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

  // Drawing doodler image
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

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

// Doodler movement
function moveDoodler(e) {
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    // Move right
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    // Move left
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    //Reset the game
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      width: DOODLER_WIDTH,
      height: DOODLER_HEIGHT,
    };

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

// Resets the horizontal velocity to stop doodler going horizontally to any direction
function stopDoodle() {
  velocityX = 0;
}

// Gives the canvas visual effect that the canvas is moving and pushes the platform downwards
function handlePlatformMovement(platform) {
  if (velocityY < 0 && doodler.y < (BOARD_HEIGHT * 3) / 4) {
    platform.y -= initialVelocityY; // Slide platform down
  }
}

// Detects doodler and platform collision
function handlePlatformCollision(platform) {
  if (Collision.detectCollision(doodler, platform) && velocityY >= 0) {
    jumpSound.play();
    velocityY = initialVelocityY; // Jump
  }
}

// Score is increases by 50 on every platform passed
function handlePlatformScore(platform) {
  if (!passedPlatforms.includes(platform)) {
    passedPlatforms.push(platform);
    score += 50; // Increase score when a platform is passed
  }
}

// Drawing platform image
function drawPlatform(platform) {
  context.drawImage(
    platform.img,
    platform.x,
    platform.y,
    platform.width,
    platform.height
  );
}

// Places the platform in random direction
function placePlatforms() {
  platformArray = [];

  //starting platforms
  let platform = {
    img: platformImg,
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT - 50,
    width: platformWidth,
    height: platformHeight,
  };

  platformArray.push(platform);

  for (let i = 0; i < 7; i++) {
    let randomX = Math.floor((Math.random() * BOARD_WIDTH * 3) / 4); //(0-1) * BOARD_WIDTH*3/4
    let platform = {
      img: platformImg,
      x: randomX,
      y: BOARD_HEIGHT - 75 * i - 150,
      width: platformWidth,
      height: platformHeight,
    };

    platformArray.push(platform);
  }
}

// Creates new platform
function newPlatform() {
  let randomX = Math.floor((Math.random() * BOARD_WIDTH * 3) / 4); //(0-1) * BOARD_WIDTH*3/4
  let platform = {
    img: platformImg,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight,
  };

  platformArray.push(platform);
}
