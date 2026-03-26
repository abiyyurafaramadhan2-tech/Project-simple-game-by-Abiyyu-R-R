import { Scene } from 'phaser';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  
  preload() {
    this.load.setPath('assets');
    // Placeholder loading, you can add actual assets here
    this.load.image('dummy', 'placeholder.png');
  }
  
  create() {
    this.scene.start('PreloadScene');
  }
}
