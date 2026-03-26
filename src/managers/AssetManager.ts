export class AssetManager {
  static async loadImage(scene: Phaser.Scene, key: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      scene.load.image(key, url);
      scene.load.once(`filecomplete-image-${key}`, () => resolve());
      scene.load.once(`loaderror`, () => reject());
      scene.load.start();
    });
  }
}
