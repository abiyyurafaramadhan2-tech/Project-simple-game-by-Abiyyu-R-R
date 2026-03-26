export class StateMachine {
  private states: Map<string, any> = new Map();
  private currentState: any = null;
  private context: any;
  
  constructor(context: any) {
    this.context = context;
  }
  
  addState(name: string, state: any) {
    this.states.set(name, state);
  }
  
  changeState(name: string) {
    if (this.currentState) this.currentState.onExit();
    this.currentState = this.states.get(name);
    if (this.currentState) this.currentState.onEnter();
  }
  
  update(dt: number) {
    if (this.currentState) this.currentState.onUpdate(dt);
  }
  
  isState(name: string): boolean {
    return this.currentState === this.states.get(name);
  }
}
