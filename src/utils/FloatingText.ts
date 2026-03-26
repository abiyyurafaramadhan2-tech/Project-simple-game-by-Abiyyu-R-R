export class FloatingText {
  static show(scene: Phaser.Scene, x: number, y: number, text: string, color: string = '#ff0000') {
    const damageText = scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: color,
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    scene.tweens.add({
      targets: damageText,
      y: y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => damageText.destroy()
    });
  }
}
