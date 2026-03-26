import { IHitbox } from '../types/interfaces';

export class Hitbox {
  static collide(a: IHitbox, b: IHitbox): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
}
