import { BehaviorTree, Selector, Sequence, Condition, Action } from './BehaviorTree';

export class EnemyAI {
  private tree: BehaviorTree;
  private enemy: any;
  private player: any;
  private state: 'patrol' | 'chase' | 'attack' = 'patrol';
  
  constructor(enemy: any, player: any) {
    this.enemy = enemy;
    this.player = player;
    this.tree = new BehaviorTree(
      new Selector([
        new Sequence([
          new Condition(() => this.isPlayerInRange(150)),
          new Action(() => this.attackAction())
        ]),
        new Sequence([
          new Condition(() => this.isPlayerInRange(300)),
          new Action(() => this.chaseAction())
        ]),
        new Action(() => this.patrolAction())
      ])
    );
  }
  
  update(dt: number) {
    this.tree.run(this);
  }
  
  isPlayerInRange(range: number): boolean {
    const dx = this.player.x - this.enemy.x;
    const dy = this.player.y - this.enemy.y;
    return Math.hypot(dx, dy) < range;
  }
  
  attackAction(): 'success' | 'failure' | 'running' {
    this.state = 'attack';
    this.enemy.attack(this.player);
    return 'success';
  }
  
  chaseAction(): 'success' | 'failure' | 'running' {
    this.state = 'chase';
    const dx = this.player.x - this.enemy.x;
    const dy = this.player.y - this.enemy.y;
    const angle = Math.atan2(dy, dx);
    const desired = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(200);
    this.enemy.velocity = desired;
    return 'running';
  }
  
  patrolAction(): 'success' | 'failure' | 'running' {
    this.state = 'patrol';
    if (!this.enemy.patrolTarget) {
      const angle = Math.random() * Math.PI * 2;
      this.enemy.patrolTarget = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(50);
    }
    this.enemy.velocity = this.enemy.patrolTarget.clone().normalize().scale(100);
    if (Math.hypot(this.enemy.x - (this.enemy.startX + this.enemy.patrolTarget.x), 
                   this.enemy.y - (this.enemy.startY + this.enemy.patrolTarget.y)) < 10) {
      this.enemy.patrolTarget = null;
    }
    return 'running';
  }
}
