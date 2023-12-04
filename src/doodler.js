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
