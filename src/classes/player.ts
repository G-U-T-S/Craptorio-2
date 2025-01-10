import { Render } from "./render.js";


export class Player {
  public x: number; public y: number;
  public lx: number; public ly: number;
  public animFrame: number; readonly animSpeed: 8; public animDir: number;
  readonly animMax: number; public lastDir: string; public moveSpeed: number;
  readonly directions: { [index: string]: {id: number, flip: number, rot: number, dust: {x: number, y: number}} };
  public atlasCoord: {x: number, y: number}; private render: Render;

  constructor(render: Render) {
    this.x = 0, this.y = 0;
    this.lx = 0, this.ly = 0
    this.animFrame = 0; this.animSpeed = 8; this.animDir = 0;
    this.animMax = 4; this.lastDir = "0,0"; this.moveSpeed = 50.0
    this.directions = {
      '0,0':   {id: 362, flip: 0, rot: 0, dust: {x: 4, y: 11}},  //--straight
      '0,-1':  {id: 365, flip: 0, rot: 0, dust: {x: 4, y: 11}},  //--up
      '0,1':   {id: 365, flip: 2, rot: 0, dust: {x: 4, y: -2}},  //--down
      '-1,0':  {id: 363, flip: 1, rot: 0, dust: {x: 11,y:  5}},  //--left
      '1,0':   {id: 363, flip: 0, rot: 0, dust: {x: -2,y:  5}},  //--right
      '1,-1':  {id: 364, flip: 0, rot: 0, dust: {x: -2,y: 10}},  //--up-right
      '-1,-1': {id: 364, flip: 1, rot: 0, dust: {x: 10,y: 10}},  //--up-left
      '-1,1':  {id: 364, flip: 3, rot: 0, dust: {x: 10,y: -2}},  //--down-left
      '1,1':   {id: 364, flip: 2, rot: 0, dust: {x: -2,y: -2}}   //--down-right
    }
    this.render = render;
    this.atlasCoord = {x: 0, y: 32};
  }

  public update(delta: number, tick: number, keys: {w: boolean, a: boolean, s: boolean, d: boolean}, cursorProg: boolean): void {
    if (tick % this.animSpeed === 0) {
      if (this.animDir === 0) {
        this.animFrame = this.animFrame + 1
        
        if (this.animFrame > this.animMax) {
          this.animDir = 1
          this.animFrame = this.animMax
        }
      }
      else {
        this.animFrame = this.animFrame - 1

        if (this.animFrame < 0) {
          this.animDir = 0;
          this.animFrame = 0
        }
      }

    }

    this.lx = this.x;
    this.ly = this.y;

    let xDir = 0; let yDir = 0;
    
    if (keys.w) {
      yDir = -1;
    }
    if (keys.s) {
      yDir = 1;
    }
    if (keys.a) {
      xDir = -1;
    }
    if (keys.d) {
      xDir = 1;
    }

    if (!cursorProg) {
      // const dust_dir = this.directions[`${x_dir},${y_dir}`].dust;

      // const dx: number = 240/2 - 4 + dust_dir.x;
      // const dy: number = 136/2 - 4 + this.anim_frame + dust_dir.y;
      
      //& Math.random() retornar entre 0 e 1;
      // if (dust_dir && (x_dir !== 0 || y_dir !== 0)) {
      //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
      // }
      // else if (tick % 24 == 0) {
      //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
      // }
      
      if (xDir !== 0 || yDir !== 0) {
        // sound('move');
        //! removi o delta time
        // this.move(xDir * this.moveSpeed, yDir * this.moveSpeed);
        this.x += (xDir * this.moveSpeed) * delta;
        this.y += (yDir * this.moveSpeed) * delta;
      }
    }
  
    this.lastDir = `${xDir},${yDir}`;

    switch (this.lastDir) {
      case "-1,0": {
        this.atlasCoord.x = 16;
        break;
      }
      case "-1,1": {
        this.atlasCoord.x = 48;
        break;
      }
      case "-1,-1": {
        this.atlasCoord.x = 32;
        break;
      }
      case "0,1": {
        this.atlasCoord.x = 64;
        break;
      }
      case "0,-1": {
        this.atlasCoord.x = 56;
        break;
      }
      case "1,0": {
        this.atlasCoord.x = 8
        break;
      }
      case "1,1": {
        this.atlasCoord.x = 40;
        break;
      }
      case "1,-1": {
        this.atlasCoord.x = 24;
        break;
      }
      default: {
        this.atlasCoord.x = 0;
        this.atlasCoord.y = 32;
        break;
      }
    }
  }

  // public move(x: number, y: number): void {
  //   this.x = this.x + x;
  //   this.y = this.y + y;
  // }

  public draw() {
    this.render.drawSprite(
      "sprites", this.render.centerCanvas.x - 16, this.render.centerCanvas.y + this.animFrame,
      this.atlasCoord.x, this.atlasCoord.y
    );
  }
}