import { Scene } from 'phaser';

export class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }
  
  preload() {
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Loading...', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    // Generate texture for flares
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('flares', 16, 16);
  }
  
  create() {
    this.scene.start('MainScene');
  }
}
