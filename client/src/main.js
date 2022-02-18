const Game = new IsometricGame();
const map = new IsometricGame.Map(Game);

Game.create({ element: '#game', width: window.innerWidth - 64, height: window.innerHeight - 64 });

let lastfps, _fps = 0;
setInterval(() => { lastfps = _fps; _fps = 0 }, 1000);

Game.loadTextures([
  'src/img/tex/grass.png',
  'src/img/tex/stone.png',
  'src/img/tex/water.png',
  'src/img/tex/redbox.png',
]).then(() => {
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

  map.load('sandbox');
  const player = map.createObject(0, 7, 7, 2);

  Game.render = () => {

    if (keydowns['w']) Game.camera.y += 4;
    if (keydowns['s']) Game.camera.y -= 4;
    if (keydowns['a']) Game.camera.x += 4;
    if (keydowns['d']) Game.camera.x -= 4;

    if (keydowns['arrowup']) player.y -= 0.1;
    if (keydowns['arrowdown']) player.y += 0.1;
    if (keydowns['arrowleft']) player.x -= 0.1;
    if (keydowns['arrowright']) player.x += 0.1;

    map.draw();

    Game.drawText(`FPS: ${lastfps}`, 6, 20, '20px Arial');
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