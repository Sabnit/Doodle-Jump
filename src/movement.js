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
      x: DOODLER_X,
      y: DOODLER_Y,
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
