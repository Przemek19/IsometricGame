class IsometricGame {
  constructor() {
  }
  create(options = {}) {
    options.width = !!options.width ? options.width : 800;
    options.height = !!options.height ? options.height : 600;
    options.element = !!options.element ? options.element : 'body';
    options.background = !!options.background ? options.background : '#222';
    this.fpsMax = !!options.fpsMax ? options.fpsMax : 60;

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.canvas.style.background = options.background;
    this.camera = {
      x: 0,
      y: 0,
      sx: 0,
      sy: 0,
      size: 1,
    };
    document.querySelector(options.element).appendChild(this.canvas);
  }

  getScreenPositionFromTile(x, y, z = 0, size) {
    return {
      x: this.canvas.width / 2 - size / 2 + size * x / 2 - size / 2 * y - size * this.camera.x / 2 + size * this.camera.y / 2,
      y: this.canvas.height / 2 - size / 2 + size * y / 4 + size / 4 * x - size / 4 * z - size * this.camera.x / 4 - this.camera.y / 4 * size,
    };
  }

  getScreenPositionFromObject(x, y, z = 0, size) {
    return {
      x: this.canvas.width / 2 - size / 2 + size * x / 2 - size / 2 * y + this.camera.x - this.camera.y,
      y:  this.canvas.height / 2 - size / 2 + size * y / 4 + size / 4 * x - size / 4 * z - size / 1.5 + this.camera.y / 2 +  this.camera.x,
    };
  }
  
  startRender(renderDistance = 8) {
    if (this.rendering) throw 'Game is already rendering';
    this.rendering = true;
    this.renderDistance = renderDistance;
    const xxx = () => {
      if (this.preRender) this.preRender();
      this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.render) this.render();
      //requestAnimationFrame(xxx);
      setTimeout(xxx, 1000 / this.fpsMax);
    };
    xxx();
  }

  stopRender() {
    if (!this.rendering) throw 'Game is not rendering';
    clearInterval(this.rendering);
    delete this.rendering;
  }

  drawImage(src, x, y, width, height, color) {
    if (!this.textures[src]) throw 'This image is not loaded';
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.textures[src], x, y, width, height);
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#ffffff';
    }
  }

  drawText(text, x = 0, y = 0, font = '16px Arial', color = '#fff', textAlign = 'left') {
    const ctx = this.canvas.getContext('2d');
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.textAlign = textAlign;
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
  }

  drawRectangle(x = 0, y = 0, width = 0, height = 0, color = '#fff') {
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = '#ffffff';
  }

  async loadTextures(textures) {
    this.textures = !!this.textures ? this.textures : {};
    const texturesToLoad = textures.length;
    let loadedTextures = 0;
    for (let texture of textures) {
      if (!this.textures[texture]) {
        this.textures[texture] = new Image();
        this.textures[texture].src = texture;
        this.textures[texture].onload = () => {
          loadedTextures += 1;
        }
      } else {
        loadedTextures += 1;
      }
    }
    return new Promise((res) => {
      const interval = setInterval(() => {
        if (loadedTextures === texturesToLoad) {
          clearInterval(interval);
          res();
        }
      }, 10);
    });
  }
}