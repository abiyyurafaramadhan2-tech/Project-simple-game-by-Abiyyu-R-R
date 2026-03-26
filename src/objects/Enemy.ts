import { SteeringBehavior } from '../ai/SteeringBehavior';
import { EnemyAI } from '../ai/EnemyAI';
import { IHitbox } from '../types/interfaces';
import { FloatingText } from '../utils/FloatingText';
import { Hitbox } from '../utils/Hitbox';

export class Enemy extends Phaser.GameObjects.Container {
  public health: number = 50;
  private maxHealth: number = 50;
  private body: Phaser.GameObjects.Rectangle;
  public velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private ai: EnemyAI;
  private steering: SteeringBehavior;
  private attackCooldown: number = 0;
  public hitbox: IHitbox;
  
  constructor(scene: Phaser.Scene, x: number, y: number, player: any) {
    super(scene, x, y);
    this.body = scene.add.rectangle(0, 0, 28, 28, 0xff4444);
    this.body.setStrokeStyle(1, 0x000000);
    this.add(this.body);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.hitbox = { x: 0, y: 0, width: 28, height: 28 };
    this.updateHitbox();
    
    this.steering = new SteeringBehavior(this, player);
    this.ai = new EnemyAI(this, player);
    
    scene.events.on('update', this.update, this);
  }
  
  update(time: number, delta: number) {
    if (delta === 0) return;
    const dt = delta / 1000;
    
    this.ai.update(dt);
    this.steering.update(dt);
    
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    this.body.setPosition(this.x, this.y);
    this.updateHitbox();
    
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
  }
  
  private updateHitbox() {
    this.hitbox.x = this.x - this.hitbox.width / 2;
    this.hitbox.y = this.y - this.hitbox.height / 2;
  }
  
  getHitbox(): IHitbox {
    return this.hitbox;
  }
  
  takeDamage(amount: number) {
    this.health -= amount;
    FloatingText.show(this.scene, this.x, this.y - 10, `${amount}`, '#ffaaaa');
    this.body.setFillStyle(0xff8888);
    this.scene.time.delayedCall(100, () => this.body.setFillStyle(0xff4444));
    if (this.health <= 0) {
      this.destroy();
    }
  }
  
  attack(player: any) {
    if (this.attackCooldown <= 0) {
      player.takeDamage(10);
      this.attackCooldown = 1;
    }
  }
}
