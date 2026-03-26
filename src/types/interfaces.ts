export interface ICooldown {
  skillId: string;
  remaining: number;
  total: number;
}

export interface IProjectileConfig {
  x: number;
  y: number;
  direction: Phaser.Math.Vector2;
  speed: number;
  damage: number;
  owner: 'player' | 'enemy';
}

export interface IEnemyConfig {
  x: number;
  y: number;
  type: 'melee' | 'ranged';
}

export interface IInputState {
  x: number;
  y: number;
  isActive: boolean;
  dash: boolean;
  attack: boolean;
  ultimate: boolean;
}

export interface IHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}
