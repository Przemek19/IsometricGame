const Game = new IsometricGame();
const map = new IsometricGame.Map(Game, 128, { x: 0, y: 0, z: 0 });

Game.create({
  element: '#game', width: window.innerWidth, height: window.innerHeight, fpsMax: 1000, background: '#013',
  //devmode: true,
});

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
  'src/img/tex/whitebox.png',
  'src/img/tex/greenbox.png',
  'src/img/tex/tile_select.png',
  'src/img/tex/tile_select2.png',
  'src/img/tex/container.png',
  'src/img/tex/container2.png',
  'src/img/tex/123.png',
  'src/img/shadow.png',
]).then(async () => {
  Game.startRender(16);
  const keydowns = {};
  document.addEventListener('keydown', e => {
    keydowns[e.key.toLowerCase()] = true;
  });
  document.addEventListener('keyup', e => {
    keydowns[e.key.toLowerCase()] = undefined;
  });
  let cameraSizeChangeTo = undefined;
  let cameraActualSize = undefined;
  document.addEventListener('wheel', e => {
    Game.camera.size = Math.max(Math.min(Game.camera.size - e.deltaY / 1000, 5), 0.2);
    // cameraActualSize = Game.camera.size;
    // cameraSizeChangeTo = Math.max(Math.min(Game.camera.size - e.deltaY / 1000, 5), 0.2);
    // let anim = 0;
    // const yyy = () => {
    //   anim += 10;
    //   Game.camera.size = cameraActualSize * (1 - anim / 100) + cameraSizeChangeTo * (anim / 100)
    //   if (anim < 100) setTimeout(yyy, 1);
    // }
    //yyy();
  });

  await map.load('sandbox');
  //const player = map.createObject(0, 7, 7, 2);
  // map.createTile(0, 0, 2, 6);
  // map.createTile(0, 0, 2, 8);
  // map.createTile(0, 0, 3, 6);

  for (let x = -10; x <= 10; x += 1) {
    for (let y = -10; y <= 10; y += 1) {
      for (let z = 0; z <= 0; z += 2) {
        //map.createTile(0, x, y, z);
      }
    }
  }
  //               id  x   y  z
  map.createObject(0, 0, 0, 2);
  map.createObject(1, 0, 0, 2);
  map.createObject(2, 0, 0, 2);

  let startX = 0;
  let startY = 0;
  let startCamera = {x:0,y:0};
  let isMove = false;
  let mouse = { x: '?', y: '?' };

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
    mouse = { x: e.offsetX, y: e.offsetY };
    if (isMove === true) {
      const moveX = startX - e.offsetX;
      const moveY = startY - e.offsetY;
      const size = map.size * Game.camera.size;
      Game.camera.y = startCamera.y + moveY / (size / 2) - moveX / size;
      Game.camera.x = startCamera.x + moveY / (size / 2) + moveX / size;
    }
  });

  window.addEventListener('resize', e => {
    Game.canvas.width = window.innerWidth - 0;
    Game.canvas.height = window.innerHeight - 0;
    //console.log(Math.ceil(Math.max(Game.canvas.width, Game.canvas.height * 2) / (map.size / 2)));
    //Game.renderDistance = Math.ceil(Math.max(Game.canvas.width, Game.canvas.height) / map.size);
    //console.log(Game.renderDistance);
  });

  Game.render = () => {

    //

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
    let lookingAt = { x: 0, y: 0, z: 0 };
    if (mouse.x !== '?') lookingAt = map.getTileCursorOn(mouse.x, mouse.y, 0);
    //Game.camera.x = 6;
    //Game.camera.y = 6;

    const s = map.size / 2 * Game.camera.size;
    //Game.drawImage('src/img/tex/container.png', 1024, 256, 2 * s + (s * (3 - 1)) + s * (2 - 1),
    //(Math.max(3, 2)-1) * s + s / 2 + 2 * s);

    Game.drawImage('src/img/shadow.png', 0, 0, Game.canvas.width, Game.canvas.height);
    Game.drawImage('src/img/shadow.png', 0, 0, Game.canvas.width, Game.canvas.height);

    Game.drawText(`FPS: ${lastfps}`, 6, 20, '14px Arial');
    Game.drawText(`Camera: ${Math.round(Game.camera.x * 100) / 100}x; ${Math.round(Game.camera.y * 100) / 100}y (${Math.round(Game.camera.size * 100)})%`, 6, 40, `14px Arial`);
    Game.drawText(`Mouse: ${mouse.x}x (${Math.round(mouse.x / Game.canvas.width * 1000) / 10}%) ${mouse.y}y (${Math.round(mouse.y / Game.canvas.height * 1000) / 10}%)`, 6, 60, '14px Arial');
    Game.drawText(`Looking at: ${lookingAt.x}x;${lookingAt.y}y;${lookingAt.z}z`, 6, 80, '14px Arial');

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