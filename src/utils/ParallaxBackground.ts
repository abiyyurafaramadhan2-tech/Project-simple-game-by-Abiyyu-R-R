export class ParallaxBackground {
  private layers: Phaser.GameObjects.TileSprite[];
  
  constructor(scene: Phaser.Scene, keys: string[], speeds: number[]) {
    this.layers = [];
    keys.forEach((key, i) => {
      const layer = scene.add.tileSprite(0, 0, scene.cameras.main.width, scene.cameras.main.height, key);
      layer.setOrigin(0, 0);
      layer.setScrollFactor(0);
      layer.setDepth(-10 - i);
      this.layers.push(layer);
    });
    this.layers.forEach((layer, i) => {
      (layer as any).speed = speeds[i];
    });
  }
  
  update(camera: Phaser.Cameras.Scene2D.Camera) {
    this.layers.forEach(layer => {
      const speed = (layer as any).speed;
      layer.tilePositionX = camera.scrollX * speed;
    });
  }
}
