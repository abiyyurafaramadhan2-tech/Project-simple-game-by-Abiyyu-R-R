import { StateMachine } from '../states/StateMachine';
import { InputManager } from '../managers/InputManager';
import { CooldownManager } from '../managers/CooldownManager';
import { ProjectilePool } from '../managers/ProjectilePool';
import { IHitbox } from '../types/interfaces';
import { Hitbox } from '../utils/Hitbox';
import { FloatingText } from '../utils/FloatingText';
import { UltimateEffect } from './UltimateEffect';

export class Player extends Phaser.GameObjects.Container {
  private body: Phaser.GameObjects.Rectangle;
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  public health: number = 100;
  public maxHealth: number = 100;
  private speed: number = 300;
  private acceleration: number = 1500;
  private friction: number = 1200;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private stateMachine: StateMachine;
  private inputManager: InputManager;
  private cooldownManager: CooldownManager;
  private projectilePool: ProjectilePool;
  private invincible: boolean = false;
  private invincibleTimer: Phaser.Time.TimerEvent | null = null;
  public hitbox: IHitbox;
  
  constructor(scene: Phaser.Scene, x: number, y: number, inputManager: InputManager, cooldownManager: CooldownManager) {
    super(scene, x, y);
    this.inputManager = inputManager;
    this.cooldownManager = cooldownManager;
    this.projectilePool = new ProjectilePool(scene);
    
    this.body = scene.add.rectangle(0, 0, 32, 32, 0x00aaff);
    this.body.setStrokeStyle(2, 0xffffff);
    this.add(this.body);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const physicsBody = this.body as any;
    if (physicsBody.body) {
      physicsBody.body.setSize(28, 28);
      physicsBody.body.setOffset(2, 2);
    }
    
    this.hitbox = { x: 0, y: 0, width: 28, height: 28 };
    
    this.stateMachine = new StateMachine(this);
    this.stateMachine.changeState('idle');
    
    scene.events.on('update', this.update, this);
  }
  
  update(time: number, delta: number) {
    if (delta === 0) return;
    const dt = delta / 1000;
    
    const input = this.inputManager.getInput();
    let targetVel = new Phaser.Math.Vector2(0, 0);
    if (input.isActive && !this.stateMachine.isState('stunned')) {
      targetVel.set(input.x, input.y).normalize().scale(this.speed);
      this.direction = targetVel.clone().normalize();
    }
    
    // Acceleration & friction
    if (targetVel.length() > 0) {
      this.velocity.x += (targetVel.x - this.velocity.x) * this.acceleration * dt;
      this.velocity.y += (targetVel.y - this.velocity.y) * this.acceleration * dt;
    } else {
      this.velocity.x *= (1 - this.friction * dt);
      this.velocity.y *= (1 - this.friction * dt);
      if (Math.abs(this.velocity.x) < 5) this.velocity.x = 0;
      if (Math.abs(this.velocity.y) < 5) this.velocity.y = 0;
    }
    
    // Limit speed
    if (this.velocity.length() > this.speed) {
      this.velocity.normalize().scale(this.speed);
    }
    
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    this.body.setPosition(this.x, this.y);
    this.updateHitbox();
    
    // Handle skills
    if (input.dash && this.cooldownManager.isReady('dash') && !this.stateMachine.isState('dash') && !this.stateMachine.isState('stunned')) {
      this.stateMachine.changeState('dash');
    }
    if (input.attack && !this.stateMachine.isState('attack') && !this.stateMachine.isState('stunned')) {
      this.stateMachine.changeState('attack');
    }
    if (input.ultimate && this.cooldownManager.isReady('ultimate') && !this.stateMachine.isState('stunned')) {
      this.castUltimate();
    }
    
    this.stateMachine.update(dt);
    this.projectilePool.update();
  }
  
  private updateHitbox() {
    this.hitbox.x = this.x - this.hitbox.width / 2;
    this.hitbox.y = this.y - this.hitbox.height / 2;
  }
  
  getHitbox(): IHitbox {
    return this.hitbox;
  }
  
  takeDamage(amount: number, source?: any) {
    if (this.invincible) return;
    this.health -= amount;
    FloatingText.show(this.scene, this.x, this.y - 20, `-${amount}`, '#ff6666');
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    } else {
      this.invincible = true;
      this.body.setFillStyle(0xff8888);
      this.scene.time.delayedCall(1000, () => {
        this.invincible = false;
        this.body.setFillStyle(0x00aaff);
      });
    }
  }
  
  private die() {
    this.scene.scene.restart();
  }
  
  dash() {
    const dashDistance = 200;
    const dashSpeed = 800;
    const dir = this.direction.clone().normalize();
    this.velocity = dir.scale(dashSpeed);
    this.invincible = true;
    this.cooldownManager.startCooldown('dash', 1.5);
    
    // Trail effect
    const trail = this.scene.add.circle(this.x, this.y, 8, 0x88aaff, 0.8);
    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => trail.destroy()
    });
    
    this.scene.time.delayedCall(200, () => {
      this.invincible = false;
    });
  }
  
  attack() {
    const attackHitbox: IHitbox = {
      x: this.x + this.direction.x * 20 - 20,
      y: this.y + this.direction.y * 20 - 20,
      width: 40,
      height: 40
    };
    const enemies = (this.scene as any).enemies as Phaser.GameObjects.Group;
    if (enemies) {
      enemies.getChildren().forEach((enemy: any) => {
        if (Hitbox.collide(attackHitbox, enemy.getHitbox())) {
          enemy.takeDamage(20);
          FloatingText.show(this.scene, enemy.x, enemy.y - 10, '20', '#ffff00');
        }
      });
    }
    this.scene.time.delayedCall(300, () => this.stateMachine.changeState('idle'));
  }
  
  castUltimate() {
    this.cooldownManager.startCooldown('ultimate', 10);
    UltimateEffect.cast(this.scene, this.x, this.y, 200, 50);
  }
  
  getVelocity(): Phaser.Math.Vector2 {
    return this.velocity;
  }
  
  getDirection(): Phaser.Math.Vector2 {
    return this.direction;
  }
  }
