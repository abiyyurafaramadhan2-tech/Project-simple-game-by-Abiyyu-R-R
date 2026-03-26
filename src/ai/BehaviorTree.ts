  export abstract class BTNode {
  abstract run(context: any): 'success' | 'failure' | 'running';
}

export class Selector extends BTNode {
  private children: BTNode[];
  constructor(children: BTNode[]) {
    super();
    this.children = children;
  }
  run(context: any): 'success' | 'failure' | 'running' {
    for (let child of this.children) {
      const status = child.run(context);
      if (status !== 'failure') return status;
    }
    return 'failure';
  }
}

export class Sequence extends BTNode {
  private children: BTNode[];
  constructor(children: BTNode[]) {
    super();
    this.children = children;
  }
  run(context: any): 'success' | 'failure' | 'running' {
    for (let child of this.children) {
      const status = child.run(context);
      if (status !== 'success') return status;
    }
    return 'success';
  }
}

export class Condition extends BTNode {
  private condition: (ctx: any) => boolean;
  constructor(cond: (ctx: any) => boolean) {
    super();
    this.condition = cond;
  }
  run(context: any): 'success' | 'failure' {
    return this.condition(context) ? 'success' : 'failure';
  }
}

export class Action extends BTNode {
  private action: (ctx: any) => 'success' | 'failure' | 'running';
  constructor(action: (ctx: any) => 'success' | 'failure' | 'running') {
    super();
    this.action = action;
  }
  run(context: any): 'success' | 'failure' | 'running' {
    return this.action(context);
  }
}

export class BehaviorTree {
  private root: BTNode;
  constructor(root: BTNode) {
    this.root = root;
  }
  run(context: any): 'success' | 'failure' | 'running' {
    return this.root.run(context);
  }
}
