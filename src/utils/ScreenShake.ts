export class ScreenShake {
  static shake(scene: Phaser.Scene, intensity: number = 0.02, duration: number = 300) {
    scene.cameras.main.shake(duration, intensity);
  }
}
