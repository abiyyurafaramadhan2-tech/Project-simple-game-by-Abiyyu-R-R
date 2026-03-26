export class SteeringBehavior {
  private enemy: any;
  private player: any;
  private separationRadius: number = 40;
  private separationStrength: number = 1.2;
  private alignmentRadius: number = 50;
  private cohesionRadius: number = 60;
  
  constructor(enemy: any, player: any) {
    this.enemy = enemy;
    this.player = player;
  }
  
  update(dt: number) {
    if (!this.enemy.scene.enemies) return;
    const neighbors = this.enemy.scene.enemies.getChildren().filter((e: any) => e !== this.enemy);
    let separation = new Phaser.Math.Vector2();
    let alignment = new Phaser.Math.Vector2();
    let cohesion = new Phaser.Math.Vector2();
    let neighborCount = 0;
    
    neighbors.forEach((other: any) => {
      const dx = this.enemy.x - other.x;
      const dy = this.enemy.y - other.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.separationRadius) {
        separation.x += dx / dist;
        separation.y += dy / dist;
      }
      if (dist < this.alignmentRadius) {
        alignment.x += other.velocity.x;
        alignment.y += other.velocity.y;
      }
      if (dist < this.cohesionRadius) {
        cohesion.x += other.x;
        cohesion.y += other.y;
        neighborCount++;
      }
    });
    
    if (neighborCount > 0) {
      cohesion.x = (cohesion.x / neighborCount) - this.enemy.x;
      cohesion.y = (cohesion.y / neighborCount) - this.enemy.y;
      cohesion.normalize().scale(0.5);
    }
    
    separation.normalize().scale(this.separationStrength);
    alignment.normalize().scale(0.3);
    cohesion.normalize().scale(0.2);
    
    this.enemy.velocity.x += (separation.x + alignment.x + cohesion.x) * dt * 100;
    this.enemy.velocity.y += (separation.y + alignment.y + cohesion.y) * dt * 100;
    
    const maxSpeed = 150;
    if (this.enemy.velocity.length() > maxSpeed) {
      this.enemy.velocity.normalize().scale(maxSpeed);
    }
  }
}
