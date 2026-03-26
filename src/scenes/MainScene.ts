import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { InputManager } from '../managers/InputManager';
import { CooldownManager } from '../managers/CooldownManager';
import { ParallaxBackground } from '../utils/ParallaxBackground';

export class MainScene extends Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private inputManager!: InputManager;
  private cooldownManager!: CooldownManager;
  private background!: ParallaxBackground;
  
  constructor() {
    super({ key: 'MainScene' });
  }
  
  create() {
    this.inputManager = new InputManager(this);
    this.cooldownManager = new CooldownManager();
    
    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height / 2, this.inputManager, this.cooldownManager);
    this.enemies = this.add.group();
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
      const y = Phaser.Math.Between(100, this.cameras.main.height - 100);
      const enemy = new Enemy(this, x, y, this.player);
      this.enemies.add(enemy);
    }
    (window as any).enemies = this.enemies; // for quick access in player
    
    this.background = new ParallaxBackground(this, ['dummy', 'dummy'], [0.2, 0.5]);
    
    this.cameras.main.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }
  
  update(time: number, delta: number) {
    this.inputManager.update();
    this.cooldownManager.update(delta / 1000);
    this.background.update(this.cameras.main);
    
    // Simple collision between player and enemies
    this.enemies.getChildren().forEach((enemy: any) => {
      if (this.player.getHitbox() && enemy.getHitbox()) {
        // Already handled by enemy attack, but we can push away
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 30) {
          const angle = Math.atan2(dy, dx);
          const push = 5;
          this.player.x += Math.cos(angle) * push;
          this.player.y += Math.sin(angle) * push;
        }
      }
    });
  }
}
