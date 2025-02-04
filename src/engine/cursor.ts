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
  public itemStack = { name: "", quant: 0 };
  public l = false; public m = false; public r = false;
  public type: "pointer" | "item" = "pointer";
  public rot = 0;

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

  rotate(dir: string): void {
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

    // if cursor.type == 'item' then sound('rotate_' + dir) end
  }

  setStack(stack?: { name: string, quant: number }): void {
    if (stack !== undefined) {
      this.itemStack.name = stack.name;
      this.itemStack.quant = stack.quant;
      this.type = "item";
    }
    else {
      this.itemStack.name = "";
      this.itemStack.quant = 0;
      this.type = "pointer";
    }
  }

  checkStack(): void {
    if (this.itemStack.quant <= 0 || this.itemStack.name === "") {
      this.itemStack.name = "";
      this.itemStack.quant = 0;
      this.type = "pointer";
    }
  }
}

const cursor = new Cursor();
export default cursor;