// Platforms varaibles
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let passedPlatforms = [];
let platformImg;

// Gives the canvas visual effect that the canvas is moving and pushes the platform downwards
function handlePlatformMovement(platform) {
  if (velocityY < 0 && doodler.y < (BOARD_HEIGHT * 3) / 4) {
    platform.y -= initialVelocityY; // Slide platform down
  }
}

// Detects doodler and platform collision
function handlePlatformCollision(platform) {
  if (detectCollision(doodler, platform) && velocityY >= 0) {
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
