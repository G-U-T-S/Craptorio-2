import entityManager from "./entityManager.js";

// export class CURSOR {
//   x: 0, y: 0, lx: 8, ly: 8,
//   tx: 8, ty: 8, wx: 0, wy: 0,
//   sx: 0, sy: 0, lsx: 0, lsy: 0,
//   l: false, ll: false, m: false, lm: false,
//   r: false, lr: false, prog: false, rot: 0,
//   heldLeft: false, heldRight: false, ltx: 0, lty: 0,
//   lastRotation: 0, holdTime: 0, type: 'pointer', item: 'transport_belt',
//   drag: false, panelDrag: false, dragDir: 0, dragLoc: {x: 0, y: 0},
//   handItem: {id: 0, count: 0}, dragOffset: {x: 0, y: 0}, itemStack: {id: 9, count: 100}
// };
class Cursor {
  public x: number; public y: number;
  public l: boolean; public ll: boolean;
  public m: boolean; public r: boolean
  public prog: boolean; public canvasId: string;

  constructor(canvasId = "mainCanvas") {
    this.x = 0; this.y = 0;
    this.l = false; this.ll = false;
    this.m = false; this.r = false;
    this.prog = false; this.canvasId = canvasId;

    window.addEventListener("mousemove", (ev) => {
      const canvas = ev.target;

      if (canvas instanceof HTMLCanvasElement && canvas.id === this.canvasId) {
        const rect = canvas.getBoundingClientRect();
        this.x = ev.clientX - rect.left;
        this.y = ev.clientY - rect.top;
      }
    });
    window.addEventListener("mousedown", (ev) => {
      if (ev.button === 0) {
        this.l = true;
      }
      if (ev.button === 1) {
        this.m = true;
      }
      if (ev.button === 2) {
        this.r = true;
      }
    });
    window.addEventListener("mouseup", (ev) => {
      if (ev.button === 0) {
        this.l = false;
      }
      if (ev.button === 1) {
        this.m = false;
      }
      if (ev.button === 2) {
        this.r = false;
      }

      //! TEMP
      entityManager.addEnt("stone_furnace", {x: this.x, y: this.y});
    });
  }

  update(): void {
    const l = this.l; const r = this.r;
    // const sx = this.sx; const sy = this.sy;
  
    // // const { wx, wy } = get_world_cell(this.x, this.y);
    // // const { tx, ty } = world_to_screen(wx, wy);
  
    // // --update hold state for left and right click
    // if (l && this.l &&  !this.heldLeft && !this.r) {
    //   this.heldLeft = true
    // }
  
    // if (r && this.r && !this.heldRight && !this.l) {
    //   this.heldRight = true;
    // }
  
    // if (this.heldLeft || this.heldRight) {
    //   this.holdTime = this.holdTime + 1;
    // }
  
    // if (!l && this.heldLeft) {
    //   this.heldLeft = false;
    //   this.holdTime = 0;
    // }
  
    // if (!r && this.heldRight) {
    //   this.heldRight = false;
    //   this.holdTime = 0;
    // }
  
    // this.ltx = this.tx; this.lty = this.ty;
    // // this.wx = wx; this.wy = wy;
    // // this.tx = tx; this.ty = ty;
    // this.sx = sx; this.sy = sy;
    // this.lx = this.x; this.ly = this.y;
    // this.ll = this.l; this.lm = this.m;
    // this.lr = this.r; this.lsx = this.sx;
    // this.lsy = this.sy; this.sx = sx;
    // this.sy = sy;
    
    // if (this.tx !== this.ltx || this.ty !== this.lty) {
    //   this.holdTime = 0;
    // }
  }
}

const cursor = new Cursor();
export default cursor;