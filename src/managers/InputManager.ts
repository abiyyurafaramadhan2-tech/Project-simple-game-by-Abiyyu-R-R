import { IInputState } from '../types/interfaces';

export class InputManager {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private joystickActive: boolean = false;
  private joystickBase!: Phaser.GameObjects.Ellipse;
  private joystickThumb!: Phaser.GameObjects.Ellipse;
  private joystickPointer: Phaser.Input.Pointer | null = null;
  private joystickRadius: number = 60;
  private inputState: IInputState = { x: 0, y: 0, isActive: false, dash: false, attack: false, ultimate: false };
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initKeyboard();
    this.initJoystick();
  }
  
  private initKeyboard() {
    if (!this.scene.input.keyboard) return;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  }
  
  private initJoystick() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const x = 120;
    const y = height - 120;
    
    this.joystickBase = this.scene.add.ellipse(x, y, this.joystickRadius * 2, this.joystickRadius * 2, 0x888888, 0.6);
    this.joystickThumb = this.scene.add.ellipse(x, y, 40, 40, 0xffffff, 0.9);
    this.joystickBase.setDepth(1000);
    this.joystickThumb.setDepth(1001);
    this.joystickBase.setInteractive();
    this.joystickBase.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.joystickActive = true;
      this.joystickPointer = pointer;
      this.updateJoystick(pointer);
    });
    this.joystickBase.on('pointerup', () => {
      this.joystickActive = false;
      this.joystickPointer = null;
      this.inputState.x = 0;
      this.inputState.y = 0;
      this.inputState.isActive = false;
      this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
    });
    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.joystickActive && pointer === this.joystickPointer) {
        this.updateJoystick(pointer);
      }
    });
  }
  
  private updateJoystick(pointer: Phaser.Input.Pointer) {
    const dx = pointer.x - this.joystickBase.x;
    const dy = pointer.y - this.joystickBase.y;
    let distance = Math.min(Math.hypot(dx, dy), this.joystickRadius);
    const angle = Math.atan2(dy, dx);
    const thumbX = this.joystickBase.x + Math.cos(angle) * distance;
    const thumbY = this.joystickBase.y + Math.sin(angle) * distance;
    this.joystickThumb.setPosition(thumbX, thumbY);
    if (distance > 0) {
      const normX = dx / distance;
      const normY = dy / distance;
      this.inputState.x = normX;
      this.inputState.y = normY;
      this.inputState.isActive = true;
    } else {
      this.inputState.x = 0;
      this.inputState.y = 0;
      this.inputState.isActive = false;
    }
  }
  
  update() {
    // Keyboard input
    let left = false, right = false, up = false, down = false;
    if (this.cursors) {
      left = this.cursors.left.isDown;
      right = this.cursors.right.isDown;
      up = this.cursors.up.isDown;
      down = this.cursors.down.isDown;
    }
    if (this.wasd) {
      left = left || this.wasd.left.isDown;
      right = right || this.wasd.right.isDown;
      up = up || this.wasd.up.isDown;
      down = down || this.wasd.down.isDown;
    }
    let moveX = (right ? 1 : 0) - (left ? 1 : 0);
    let moveY = (down ? 1 : 0) - (up ? 1 : 0);
    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      moveX /= len;
      moveY /= len;
      this.inputState.x = moveX;
      this.inputState.y = moveY;
      this.inputState.isActive = true;
    } else if (!this.joystickActive) {
      this.inputState.x = 0;
      this.inputState.y = 0;
      this.inputState.isActive = false;
    }
    
    // Skills
    const shift = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.inputState.dash = shift?.isDown || false;
    const space = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.inputState.attack = space?.isDown || false;
    const keyR = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.inputState.ultimate = keyR?.isDown || false;
  }
  
  getInput(): IInputState {
    return { ...this.inputState };
  }
    }
