IsometricGame.Map = class {
  constructor(GameObject, size = 64, offset = {x: 0, y: 0, z: 0}) {
    this.tiles = [];
    this.objects = [];
    this.lastTileID = -1;
    this.lastObjectID = -1;
    this.offset = offset;
    this.size = size;
    this.extraTiles = [];
    this.GameObject = GameObject;
  }
  async load(file) {
    const texturesToLoad = [];
    for (let i in IsometricGame.Map.defaultTiles) {
      const tileData = IsometricGame.Map.defaultTiles[i];
      if (tileData.src) texturesToLoad.push(tileData.src);
      if (tileData.animation) {
        for (let ii in tileData.animation.textures) {
          texturesToLoad.push(tileData.animation.textures[ii]);
        }
      }
    }
    for (let i in IsometricGame.Map.defaultObjects) {
      const objectData = IsometricGame.Map.defaultObjects[i];
      if (objectData.src) texturesToLoad.push(objectData.src);
      if (objectData.animation) {
        for (let ii in objectData.animation.textures) {
          texturesToLoad.push(objectData.animation.textures[ii]);
        }
      }
    }
    await this.GameObject.loadTextures(texturesToLoad);
    const mapData = await (await fetch(file.search('http') !== -1 ? file : `src/maps/${file}.json`)).json();
    const tiles = mapData.tiles;
    for (let i in tiles) {
      const tile = tiles[i];
      this.createTile(tile.tid, tile.x + this.offset.x, tile.y + this.offset.y, tile.z + this.offset.z);
    }
  }
  createTile(tid, x, y, z) {
    this.lastTileID += 1;
    return this.tiles[this.tiles.push({ id: this.lastTileID, tid, x, y, z }) - 1];
  }
  createObject(oid, x, y, z) {
    this.lastObjectID += 1;
    return this.objects[this.objects.push({ id: this.lastObjectID, oid, x, y, z }) - 1]; 
  }
  download() {
    const newTiles = [...this.tiles];
    newTiles.map(tile => delete tile.id);
    const dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      name: 'AutoGenerated',
      version: '1.0.0',
      author: 'AutoGenerated',
      tiles: newTiles,
      // TODO: Add objects
    }));

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataString);
    downloadAnchorNode.setAttribute('download', `map.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  draw() {
    const elements = [ ...this.tiles, ...this.objects ];
    const layers = [];
    for (let i in elements) {
      const element = elements[i];
      if (!layers[element.z]) layers[element.z] = {};
      if (typeof element.tid !== 'undefined') {
        if (!layers[element.z].tiles) layers[element.z].tiles = [];
        layers[element.z].tiles.push(element);
      } else if (typeof element.oid !== 'undefined') {
        if (!layers[element.z].objects) layers[element.z].objects = [];
        layers[element.z].objects.push(element);
      }
    }

    for (let layerID in layers) {
      const layer = layers[layerID];
      for(let tileID in layer.tiles) { // draw tiles
        const tile = layer.tiles[tileID];

        if (Math.abs((tile.x + tile.y) / 2 + this.GameObject.camera.y / (this.size * this.GameObject.camera.size) * 2) < this.GameObject.renderDistance && Math.abs((tile.x - tile.y) / 2 + this.GameObject.camera.x / (this.size * this.GameObject.camera.size)) < this.GameObject.renderDistance) {
          let tileData;
          if (IsometricGame.Map.defaultTiles[tile.tid]) { // TODO: Doda?? w??asne elementy od tw??rcy mapy
            tileData = IsometricGame.Map.defaultTiles[tile.tid];
          }
          const screenPosition = this.GameObject.getScreenPositionFromTile(tile.x, tile.y, tile.z, this.size * this.GameObject.camera.size);
    
          let src = tileData.src;
          if (tileData.animation) {
            const t = Date.now() % tileData.animation.duration * tileData.animation.textures.length;
            for (let ii in tileData.animation.textures) {
              ii = Number(ii);
              const interval = (ii + 1) * tileData.animation.duration;
              if (t <= interval && t > interval - tileData.animation.duration) {
                src = tileData.animation.textures[ii];
                break;
              }
            }
          }
    
          this.GameObject.drawImage(src, screenPosition.x, screenPosition.y, this.size * this.GameObject.camera.size, this.size * this.GameObject.camera.size);
        }
      }
      for(let objectID in layer.objects) { // draw tiles
        const object = layer.objects[objectID];



        if (Math.abs((object.x + object.y) / 2 + this.GameObject.camera.y / (this.size * this.GameObject.camera.size) * 2) < this.GameObject.renderDistance && Math.abs((object.x - object.y) / 2 + this.GameObject.camera.x / (this.size * this.GameObject.camera.size)) < this.GameObject.renderDistance) {
          let objectData;
          if (IsometricGame.Map.defaultObjects[object.oid]) { // TODO: Doda?? w??asne elementy od tw??rcy mapy
            objectData = IsometricGame.Map.defaultObjects[object.oid];
          }
          const screenPosition = this.GameObject.getScreenPositionFromObject(object.x, object.y, object.z, this.size * this.GameObject.camera.size);
    
          let src = objectData.src;
          if (objectData.animation) {
            const t = Date.now() % objectData.animation.duration * objectData.animation.textures.length;
            for (let ii in objectData.animation.textures) {
              ii = Number(ii);
              const interval = (ii + 1) * objectData.animation.duration;
              if (t <= interval && t > interval - objectData.animation.duration) {
                src = objectData.animation.textures[ii];
                break;
              }
            }
          }
    
          this.GameObject.drawImage(src, screenPosition.x, screenPosition.y, this.size * this.GameObject.camera.size, this.size * this.GameObject.camera.size);
        }



      }
    }

    for (let i in this.tiles) {
      const tile = this.tiles[i];

    }
  }
}

IsometricGame.Map.defaultObjects = {
  0: {
    name: 'Sprite',
    src: 'src/img/tex/sprite.png',
    collidable: true,
    physics: true,
  },
};

IsometricGame.Map.defaultTiles = {
  0: {
    name: 'Grass',
    src: 'src/img/tex/grass.png',
    animation: {
      duration: 1200, //ms
      textures: [
        'src/img/tex/grass.png',
        'src/img/tex/grass2.png',
      ],
    },
    collidable: true,
  },
  1: {
    name: 'Stone',
    src: 'src/img/tex/stone.png',
    collidable: true,
  },
  2: {
    name: 'Water',
    src: 'src/img/tex/water.png',
    animation: {
      duration: 1000, //ms
      textures: [
        'src/img/tex/water.png',
        'src/img/tex/water2.png',
      ],
    },
    collidable: false,
  },
}