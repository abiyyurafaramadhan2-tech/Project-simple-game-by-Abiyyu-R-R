export class Projectile extends Phaser.GameObjects.Arc {
  public active: boolean = false;
  private speed: number = 0;
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  public damage: number = 0;
  public owner: 'player' | 'enemy' = 'player';
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 5, 0xffff00);
    this.setDepth(5);
    scene.add.existing(this);
    this.setVisible(false);
    this.active = false;
  }
  
  fire(x: number, y: number, direction: Phaser.Math.Vector2, speed: number, damage: number, owner: 'player' | 'enemy') {
    this.setPosition(x, y);
    this.direction = direction.clone().normalize();
    this.speed = speed;
    this.damage = damage;
    this.owner = owner;
    this.setVisible(true);
    this.active = true;
    this.setFillStyle(owner === 'player' ? 0x00ff00 : 0xff0000);
  }
  
  update() {
    if (!this.active) return;
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    if (this.x < 0 || this.x > this.scene.cameras.main.width || this.y < 0 || this.y > this.scene.cameras.main.height) {
      this.deactivate();
    }
  }
  
  deactivate() {
    this.active = false;
    this.setVisible(false);
  }
}    this.active = false;
    this.setVisible(false);
  }
}
