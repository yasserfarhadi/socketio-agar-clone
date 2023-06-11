// player.locX = Math.floor(500 * Math.random() + 10); // horizontal axis
// player.locY = Math.floor(500 * Math.random() + 10); // vertical axis

//======DRAW====
const draw = () => {
  // reset the context translate back to default
  context.setTransform(1, 0, 0, 1, 0, 0);

  // crearRect clears out the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the screen/vp to the players location(x, y)
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  // translate moves the canvas/context to where the player at.
  context.translate(camX, camY);

  // arg1 and arg2 are center x and center y of the arc
  // arg3 = raduis of the circle
  // arg4 = where to start drawing in the radians - 0 = 3:00
  // arg5 = where to stop drawing in the radians - 2 pi = 3:00
  // context.fillStyle();

  // draw all the players
  players.forEach((p) => {
    if (!p.playerData) {
      // if the data doesn't exist, this is an absorbed player and we dont;t draw
      return;
    }
    context.beginPath();
    context.fillStyle = p.playerData.color;
    context.arc(
      p.playerData.locX,
      p.playerData.locY,
      p.playerData.radius,
      0,
      2 * Math.PI
    ); // draw arc/circle

    context.fill();
    context.lineWidth = 3; // how wide to draw a line in pixels
    context.strokeStyle = 'rgb(0, 255, 0)'; // draw a green lone
    context.stroke();
  });

  // draw all the orbs
  orbs.forEach((orb) => {
    context.beginPath(); // this will start a new path
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2); // draw arc/circle
    context.fill(); // draw a green lone
  });

  //it runs recursively every paint/frame.
  requestAnimationFrame(draw);
};

canvas.addEventListener('mousemove', (event) => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector ? xVector : 0.1;
  player.yVector = yVector ? yVector : 0.1;
});

// requestAnimationFrame(draw);
