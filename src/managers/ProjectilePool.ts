import { Projectile } from '../objects/Projectile';
import { IProjectileConfig } from '../types/interfaces';

export class ProjectilePool {
  private pool: Projectile[] = [];
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene, initialSize: number = 20) {
    this.scene = scene;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new Projectile(scene, 0, 0, new Phaser.Math.Vector2(0, 0), 0, 0, 'player'));
    }
  }
  
  fire(config: IProjectileConfig): Projectile | null {
    let projectile = this.pool.find(p => !p.active);
    if (!projectile) {
      projectile = new Projectile(this.scene, 0, 0, new Phaser.Math.Vector2(0, 0), 0, 0, 'player');
      this.pool.push(projectile);
    }
    projectile.fire(config.x, config.y, config.direction, config.speed, config.damage, config.owner);
    return projectile;
  }
  
  update() {
    this.pool.forEach(p => p.update());
  }
}
