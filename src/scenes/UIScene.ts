import { Scene } from 'phaser';

export class UIScene extends Scene {
  private healthText!: Phaser.GameObjects.Text;
  private dashCooldown!: Phaser.GameObjects.Graphics;
  private ultimateCooldown!: Phaser.GameObjects.Graphics;
  
  constructor() {
    super({ key: 'UIScene', active: true });
  }
  
  create() {
    this.healthText = this.add.text(16, 16, 'Health: 100', { fontSize: '24px', color: '#fff' }).setScrollFactor(0);
    this.dashCooldown = this.add.graphics().setScrollFactor(0);
    this.ultimateCooldown = this.add.graphics().setScrollFactor(0);
    
    const mainScene = this.scene.get('MainScene');
    mainScene.events.on('update', this.updateUI, this);
  }
  
  updateUI() {
    const mainScene = this.scene.get('MainScene') as any;
    if (!mainScene.player) return;
    const player = mainScene.player;
    this.healthText.setText(`Health: ${player.health}/${player.maxHealth}`);
    
    const dashProgress = mainScene.cooldownManager.getProgress('dash');
    const ultimateProgress = mainScene.cooldownManager.getProgress('ultimate');
    
    this.dashCooldown.clear();
    this.dashCooldown.fillStyle(0x00ff00, 0.8);
    this.dashCooldown.fillRect(16, 60, 200 * dashProgress, 20);
    this.dashCooldown.fillStyle(0xffffff, 0.5);
    this.dashCooldown.fillRect(16, 60, 200, 20);
    
    this.ultimateCooldown.clear();
    this.ultimateCooldown.fillStyle(0xff5500, 0.8);
    this.ultimateCooldown.fillRect(16, 90, 200 * ultimateProgress, 20);
    this.ultimateCooldown.fillStyle(0xffffff, 0.5);
    this.ultimateCooldown.fillRect(16, 90, 200, 20);
  }
}
