const Game = new IsometricGame();
const map = new IsometricGame.Map(Game, 128);

Game.create({ element: '#game', width: window.innerWidth - 64, height: window.innerHeight - 64, fpsMax: 1000 });

let lastfps, _fps = 0;
setInterval(() => { lastfps = _fps; _fps = 0 }, 1000);

Game.loadTextures([
  'src/img/tex/grass.png',
  'src/img/tex/grass2.png',
  'src/img/tex/stone.png',
  'src/img/tex/water.png',
  'src/img/tex/water2.png',
  'src/img/tex/redbox.png',
  'src/img/tex/sprite.png',
]).then(async () => {
  Game.startRender(16);
  const keydowns = {};
  document.addEventListener('keydown', e => {
    keydowns[e.key.toLowerCase()] = true;
  });
  document.addEventListener('keyup', e => {
    keydowns[e.key.toLowerCase()] = undefined;
  });
  document.addEventListener('wheel', e => {
    Game.camera.size = Math.max(Math.min(Game.camera.size - e.deltaY / 1000, 5), 0.2);
  });

  await map.load('sandbox');
  const player = map.createObject(0, 7, 7, 2);
  map.createTile(0, 0, 2, 6);
  map.createTile(0, 0, 2, 8);
  map.createTile(0, 0, 3, 6);

  for (let x = -10; x <= 10; x += 1) {
    for (let y = -10; y <= 10; y += 1) {
      for (let z = 0; z <= 4; z += 2) {
        //map.createTile(0, x, y, z);
      }
    }
  }

  let startX = 0;
  let startY = 0;
  let startCamera = {x:0,y:0};
  let isMove = false;

  Game.canvas.addEventListener('mousedown', e => {
    startX = e.offsetX;
    startY = e.offsetY;
    isMove = true;
    startCamera = {...Game.camera};
  });
  Game.canvas.addEventListener('mouseup', e => {
    isMove = false;
  });
  Game.canvas.addEventListener('mousemove', e => {
    if (isMove === true) {
      const moveX = startX - e.offsetX;
      const moveY = startY - e.offsetY;
      const size = map.size * Game.camera.size;
      Game.camera.y = startCamera.y + moveY / (size / 2) - moveX / size;
      Game.camera.x = startCamera.x + moveY / (size / 2) + moveX / size;
    }
  });

  Game.render = () => {

    if (keydowns['w']) {
      Game.camera.y -= 0.1 * 2;
      Game.camera.x -= 0.1 * 2;
    } 
    if (keydowns['s']) {
      Game.camera.y += 0.1 * 2;
      Game.camera.x += 0.1 * 2;
    }
    if (keydowns['a']) {
      Game.camera.y += 0.1;
      Game.camera.x -= 0.1;
    }
    if (keydowns['d']) {
      Game.camera.y -= 0.1;
      Game.camera.x += 0.1;
    }

    if (keydowns['arrowup']) player.y -= 0.1;
    if (keydowns['arrowdown']) player.y += 0.1;
    if (keydowns['arrowleft']) player.x -= 0.1;
    if (keydowns['arrowright']) player.x += 0.1;

    map.draw();
    //Game.camera.x = 6;
    //Game.camera.y = 6;

    Game.drawText(`FPS: ${lastfps}`, 6, 20, '16px Arial');
    Game.drawText(`Camera: ${Math.round(Game.camera.x * 100) / 100}x; ${Math.round(Game.camera.y * 100) / 100}y (${Math.round(Game.camera.size * 100)})%`, 6, 40, '16px Arial');
    _fps += 1;

    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 64, Game.canvas.height / 2 - 64 - 32 - 32, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 64 + 64, Game.canvas.height / 2 - 64 + 32 - 32, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 64 - 64, Game.canvas.height / 2 - 64 + 32 - 32, 128, 128);
    // Game.drawImage('src/img/tex/water.png', Game.canvas.width / 2 - 64, Game.canvas.height / 2 - 64 + 64, 128, 128);

    
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 + 64, Game.canvas.height / 2 - 64 + 64, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 128 - 64, Game.canvas.height / 2 - 64 + 64, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 128, Game.canvas.height / 2 - 64 + 64 + 32, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2, Game.canvas.height / 2 - 64 + 64 + 32, 128, 128);
    // Game.drawImage('src/img/tex/grass.png', Game.canvas.width / 2 - 64, Game.canvas.height / 2 - 64 + 128, 128, 128);
    // Game.drawImage('src/img/tex/redbox.png', Game.canvas.width / 2 - 64, Game.canvas.height / 2 - 64 + 128, 128, 128);
  }
});