import Inventory from "./inventory.js";
import render from "./render.js";


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
  public x = 0; public y = 0;
  public inv = new Inventory(0, 0, 1, 1, 8 * 6, 8 * 6, 8 * 6);
  public l = false; public m = false; public r = false;
  // public heldLeft = false; public heldRight = false;
  public holdTime = 0; public type: "pointer" | "item" = "pointer";
  public prog = false; public drag = false; public rot = 0;

  constructor() {
    window.addEventListener("mousemove", (ev) => {
      const rect = render.canvas.getBoundingClientRect();
      this.x = ev.clientX - rect.left;
      this.y = ev.clientY - rect.top;
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
    });
  }

  update(): void {
    const l = this.l; const r = this.r;
    // const sx = this.sx; const sy = this.sy;
  
    // // const { wx, wy } = get_world_cell(this.x, this.y);
    // // const { tx, ty } = world_to_screen(wx, wy);
  
    // if (l && this.l && !this.heldLeft && !this.r) {
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
    // this.lr = this.r;// this.lsx = this.sx;
    // this.lsy = this.sy; this.sx = sx;
    // this.sy = sy;
    
    // if (this.tx !== this.ltx || this.ty !== this.lty) {
    //   this.holdTime = 0;
    // }
  }

  rotate(dir: string): void {
    if (cursor.drag) {
      this.rot = (dir == 'r' && this.rot + 1) || (this.rot - 1);
      if (this.rot > 3) { this.rot = 0; }
      if (this.rot < 0) { this.rot = 3; }
    
    //   local k = get_key(cursor.x, cursor.y)
    //   local tile, cell_x, cell_y = get_world_cell(cursor.x, cursor.y)
    //   if ENTS[k] then
    //     if ENTS[k].type == 'transport_belt' and cursor.type == 'pointer' then
    //       sound('rotate_' .. dir)
    //       ENTS[k]:rotate(ENTS[k].rot + 1)
    //       local tiles = {
    //         [1] = {x = cell_x, y = cell_y - 1},
    //         [2] = {x = cell_x + 1, y = cell_y},
    //         [3] = {x = cell_x, y = cell_y + 1},
    //         [4] = {x = cell_x - 1, y = cell_y}}
    //       for i = 1, 4 do
    //         local k = get_world_key(tiles[i].x, tiles[i].y)
    //         if ENTS[k] and ENTS[k].type == 'transport_belt' then ENTS[k]:set_curved() end
    //       end
    //     end
    //     if ENTS[k].type == 'inserter' and cursor.type == 'pointer' then
    //       sound('rotate_' .. dir)
    //       ENTS[k]:rotate(ENTS[k].rot + 1)
    //     end
    //   end
    }

    // if cursor.type == 'item' then sound('rotate_' + dir) end
  }
}

const cursor = new Cursor();
export default cursor;