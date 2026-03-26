import { StateMachine } from './StateMachine';

export class PlayerState {
  protected player: any;
  protected stateMachine: StateMachine;
  
  constructor(player: any, stateMachine: StateMachine) {
    this.player = player;
    this.stateMachine = stateMachine;
  }
  
  onEnter() {}
  onUpdate(dt: number) {}
  onExit() {}
}

export class IdleState extends PlayerState {
  onEnter() {
    // nothing
  }
  onUpdate(dt: number) {
    const input = this.player.inputManager.getInput();
    if (input.isActive) {
      this.stateMachine.changeState('walk');
    }
  }
}

export class WalkState extends PlayerState {
  onUpdate(dt: number) {
    const input = this.player.inputManager.getInput();
    if (!input.isActive) {
      this.stateMachine.changeState('idle');
    }
  }
}

export class DashState extends PlayerState {
  private elapsed: number = 0;
  onEnter() {
    this.elapsed = 0;
    this.player.dash();
  }
  onUpdate(dt: number) {
    this.elapsed += dt;
    if (this.elapsed >= 0.2) {
      this.stateMachine.changeState('idle');
    }
  }
}

export class AttackState extends PlayerState {
  private elapsed: number = 0;
  onEnter() {
    this.elapsed = 0;
    this.player.attack();
  }
  onUpdate(dt: number) {
    this.elapsed += dt;
    if (this.elapsed >= 0.3) {
      this.stateMachine.changeState('idle');
    }
  }
}

export class StunnedState extends PlayerState {
  private elapsed: number = 0;
  onEnter() {
    this.elapsed = 0;
  }
  onUpdate(dt: number) {
    this.elapsed += dt;
    if (this.elapsed >= 1) {
      this.stateMachine.changeState('idle');
    }
  }
}
