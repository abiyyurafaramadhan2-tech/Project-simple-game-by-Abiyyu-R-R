import { ScreenShake } from '../utils/ScreenShake';

export class UltimateEffect {
  static cast(scene: Phaser.Scene, x: number, y: number, radius: number = 200, damage: number = 50) {
    ScreenShake.shake(scene, 0.05, 400);
    
    const circle = scene.add.circle(x, y, radius, 0xff5500, 0.7);
    scene.tweens.add({
      targets: circle,
      scale: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => circle.destroy()
    });
    
    const particles = scene.add.particles(x, y, 'flares', {
      frame: 'white',
      speed: 200,
      lifespan: 800,
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD'
    });
    scene.time.delayedCall(500, () => particles.destroy());
    
    // Deal damage to enemies in radius
    const enemies = (scene as any).enemies as Phaser.GameObjects.Group;
    if (enemies) {
      enemies.getChildren().forEach((enemy: any) => {
        const dx = enemy.x - x;
        const dy = enemy.y - y;
        if (Math.hypot(dx, dy) <= radius) {
          enemy.takeDamage(damage);
        }
      });
    }
  }
}
