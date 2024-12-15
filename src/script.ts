const CVS = document.getElementById("mainCanvas") as HTMLCanvasElement;
const CTX = CVS.getContext("2d") as CanvasRenderingContext2D;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});
window.addEventListener("mousemove", (ev) => {
  //TODO talvez page não seja ideal;
  CURSOR.x = ev.pageX;
  CURSOR.y = ev.pageY;
});
window.addEventListener("mousedown", (ev) => {
  if (ev.button === 0) {
    CURSOR.l = true;
  }
  if (ev.button === 1) {
    CURSOR.m = true;
  }
  if (ev.button === 2) {
    CURSOR.r = true;
  }
});
window.addEventListener("mouseup", (ev) => {
  if (ev.button === 0) {
    CURSOR.l = false;
  }
  if (ev.button === 1) {
    CURSOR.m = false;
  }
  if (ev.button === 2) {
    CURSOR.r = false;
  }
});
window.addEventListener("keydown", (ev) => {
if (ev instanceof KeyboardEvent) {
  if (KEYBOARD[ev.key] !== undefined) {
    KEYBOARD[ev.key] = true;
  }
}
});
window.addEventListener("keyup", (ev) => {
if (ev instanceof KeyboardEvent) {
  if (KEYBOARD[ev.key] !== undefined) {
    KEYBOARD[ev.key] = false;
  }
}
});

class Vec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  mult(other: Vec2): Vec2 {
    return new Vec2(this.x * other.x, this.y * other.y);
  }

  div(other: Vec2): Vec2 {
    return new Vec2(this.x / other.x, this.y / other.y);
  }

  unm(): Vec2 {
    return new Vec2(-this.x, -this.y);
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(other: Vec2): number {
    return ((this.x - other.x) ^ 2 + (this.y - other.y) ^ 2) ^ 0.5;
  }

  normalize(): Vec2 {
    const lenght = this.length();

    if (lenght === 0) {
      return new Vec2(0, 0);
    }

    return new Vec2(this.x / length, this.y / length);
  }

  rotate(angle: number): Vec2 {
    const cos = Math.cos(angle)
    const sen = Math.sin(angle)
    return new Vec2(this.x * cos - this.y * sen, this.x * sen + this.y * cos);
  }

  _div(): number {
    return this.x / this.y;
  }

  //* maybe makes more sense if returns the larger or smaller vector;
  min(other: Vec2): Vec2 {
    return new Vec2(Math.min(this.x, other.x), Math.min(this.y, other.y));
  }

  max(other: Vec2): Vec2 {
    return new Vec2(Math.max(this.x, other.x), Math.max(this.y, other.y))
  }
  //*--------------------------------

  abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y));
  }

  // mix(other: Vec2, n: number): number {
  //   return this * n + v * math.max(0, 1 - n)
  // }

  toString(): string {
    return `${this.x}_#{this.y}`;
  }
}
class BaseEntity {
  public type: string;
  public otherKey: string;
  public updated: boolean;
  public drawn: boolean;
  public isHovered: boolean;
  public beltDrawn: boolean;
  public curveChecked: boolean

  constructor(type: string, otherKey: string) {
    this.type = type;
    this.otherKey = otherKey;
    this.updated = false;
    this.drawn = false;
    this.isHovered = false;
    this.beltDrawn = false;
    this.curveChecked = false;
  }
}

//TODO  simplex.seed()
const SEED = 172046262608.13;
const OFFSET = randRange(100000, 500000);
const BELT_ID_STRAIGHT  = 256
const BELT_ID_CURVED    = 260
const BELT_ARROW_ID     = 287
const BELT_COLORKEY     = 0
const BELT_TICKRATE     = 5
const BELT_MAXTICK      = 3

const UBELT_IN          = 278
const UBELT_OUT         = 277
const UBELT_COLORKEY    = 0
const UBELT_TICKRATE    = 5
const UBELT_MAXTICK     = 3

const DRILL_BURNER_SPRITE_ID = 273;
const DRILL_ELEC_SPRITE_ID   = 368;
const DRILL_INV_ID           = 276;
const DRILL_MINI_BELT_ID     = 304;
const DRILL_BELT_ID          = 304;
const DRILL_BIT_ID           = 275;
const DRILL_TICK_RATE        = 8;
const DRILL_BIT_DIR          = 1;

const FURNACE_ID             = 488;
const FURNACE_FUEL_ICON      = 291;
const FURNACE_ANIM_TICKRATE  = 9;
const FURNACE_ANIM_TICKS     = 2;
const FURNACE_TICKRATE       = 5;
const FURNACE_BUFFER_INPUT   = 50;
const FURNACE_BUFFER_OUTPUT  = 100;
const FURNACE_BUFFER_FUEL    = 50;
const FURNACE_SMELT_TIME     = 3 * 60;
const FURNACE_COLORKEY       = 6;
const FURNACE_FIRE_KEYS      = [7, 11, 10];

const CRAFTER_ID        = 312;
const CRAFTER_TICKRATE  = 5;
const CRAFTER_ANIM_RATE = 5;
const CRAFTER_TIME_ID   = 337;

const CURSOR_POINTER = 286;
const CURSOR_HIGHLIGHT = 309;
const CURSOR_HIGHLIGHT_CORNER = 307;
const CURSOR_HIGHLIGHT_CORNER_S = 336;
const CURSOR_HAND_ID = 320;
const CURSOR_GRAB_ID = 321;
const WATER_SPRITE = 224;
const CURSOR_MINING_SPEED = 50;
const TECHNOLOGY = {};
const ROCKETS = {};
const ORES = {};
const DUST = {};
const SPRITES = {};
const ENTS: { [index: string]: BaseEntity }= {};
const CURRENT_RECIPE = {x: 0, y: 0, id: 0};
const RESOURCES = {
  '2': {name: 'Petrified Fossil', id: 5, min:  5, max: 20}, //--rocks
  '7': {name: 'Medium Rock', id: 5, min:  5, max: 10},
  '8': {name: 'Pebble', id: 5, min: 1, max:  3},
  '9': {name: 'Bone', id: 5, min:  1, max:  3},
  '10': {name: 'Skull', id: 5, min:  5, max:  10},
  '24': {name: 'Small Rock', id: 5, min:  1, max:  3},
  '26': {name: 'Medium Rock', id: 5, min:  4, max: 15},
  '40': {name: 'Medium Rock', id: 5, min:  4, max: 15},
  '42': {name: 'Large Rock', id: 5, min:  4, max: 15},
  '3': {name: 'Cactus Sprouts', id: 32, min: 5, max: 12}, //--fiber
  '4': {name: 'Wildflower Patch', id: 32, min: 10, max: 20},
  '5': {name: 'Flowering Cactus', id: 32, min: 19, max: 45},
  '6': {name: 'Large Wildflower', id: 32, min: 5, max: 17},
  '1': {name: 'Palm Sprout', id: 32, min: 5, max: 12},
  '17': {name: 'Grass', id: 32, min: 5, max: 12},
  '18': {name: 'Small Wildflowers', id: 32, min: 5, max: 12},
  '19': {name: 'Grass', id: 32, min: 5, max: 12},
  '20': {name: 'Bean Sprouts', id: 32, min: 5, max: 12},
  '21': {name: 'Wildflower', id: 32, min: 5, max: 12},
  '22': {name: 'Wildflower', id: 32, min: 5, max: 12},
  '23': {name: 'Fungal Sprout', id: 32, min: 5, max: 15},
  '33': {name: 'Grass', id: 32, min: 5, max: 12},
  '34': {name: 'Grass', id: 32, min: 5, max: 12},
  '35': {name: 'Large Grass Patch', id: 32, min: 5, max: 12},
  '36': {name: 'Wildflower Stem', id: 32, min: 5, max: 12},
  '37': {name: 'Small Wildflowers', id: 32, min: 5, max: 12},
  '39': {name: 'Grass', id: 32, min: 5, max: 12}
};
const DUMMIES = {
  'dummy_furnace': true,
  'dummy_assembler': true,
  'dummy_drill': true,
  'dummy_lab': true,
  'dummy_splitter': true,
  'dummy_refinery': true,
  'dummy_silo': true
};
const OPENSiES = {
  'stone_furnace': true,
  'assembly_machine': true,
  'research_lab': true,
  'chest': true,
  'mining_drill': true,
  'bio_refinery': true,
  'rocket_silo': true
};
const UI = {
  draw_logo: () => {
    // draw_image(0, 48, 240, 46, logo, 1);
  },

  draw_menu: () => {
    if (state === 'start') {
      // draw_logo();
      
      // if (ui.draw_text_button(120 - ((text_width('  Start  ') + 2) /2), 100, UI_BUTTON2, _, 8, 9, 15, 10, {text = '  Start  ', x = 1, y = 1, bg = 15, fg = 4, shadow = {x = 1, y = 0}})) {
      //   state = 'game'
      //   cls(0)
      //   vbank(0)
      // }
      
      // if (ui.draw_text_button(120 - ((text_width('  Controls  ') + 2) /2), 110, UI_BUTTON2, _, 8, 9, 15, 10, {text = '  Controls  ', x = 1, y = 1, bg = 15, fg = 4, shadow = {x = 1, y = 0}})) {
      //   state = 'help'
      // }
    }

    else if (state == 'help') {
      // const info = {
      //   {'W A S D', 'Move PLAYER'},
      //   {'ESC', 'Exit game'},
      //   {'CTRL + R', 'Reload game'},
      //   {'I or TAB', 'Toggle inventory window'},
      //   {'C', 'Toggle crafting window'},
      //   {'T', 'Toggle research window'},
      //   {'R', 'Rotate held item or hovered object'},
      //   {'Q', 'Pipette tool - copy/swap objects'},
      //   {'Left-click', 'Place/deposit item/open machine'},
      //   {'Right-click hold', 'Mine resource or destroy object'},
      //   {'Scroll +/-', 'Scroll active hotbar slot'}
      // };

      // ui.draw_panel(0, 0, 240, 136, 8, 9, {text = 'Controls', bg = 15, fg = 4})
      // for i = 1, #info do
      //   prints(info[i][2], 3, 10 + ((i-1) * 7), 15, 4)
      //   prints(info[i][1], 150, 10 + ((i-1) * 7), 15, 11, _, true)
      // end

      // if ui.draw_button(240 - 12, 1, 1, UI_BUTTON, 2, 8, 3) {
      //   cls()
      //   state = 'start'
        
      //   return;
      // }
    }
  },
};
const PLAYER = {
  x: 100*8, y: 50*8, spr: 362,
  lx: 0, ly: 0, shadow: 382,
  anim_frame: 0, anim_speed: 8, anim_dir: 0,
  anim_max: 4, last_dir: '0,0', move_speed: 0.15,
  directions: <{ [index: string]: { id: number, flip: number, dust: Vec2}}>{
    '0,0':   {id: 362, flip: 0, rot: 0, dust: new Vec2(4, 11)},   //--straight
    '0,-1':  {id: 365, flip: 0, rot: 0, dust: new Vec2(4, 11)},   //--up
    '0,1':   {id: 365, flip: 2, rot: 0, dust: new Vec2(4, -2)},   //--down
    '-1,0':  {id: 363, flip: 1, rot: 0, dust: new Vec2(11, 5)},   //--left
    '1,0':   {id: 363, flip: 0, rot: 0, dust: new Vec2(-2, 5)},   //--right
    '1,-1':  {id: 364, flip: 0, rot: 0, dust: new Vec2(-2, 10)},  //--up-right
    '-1,-1': {id: 364, flip: 1, rot: 0, dust: new Vec2(10, 10)},  //--up-left
    '-1,1':  {id: 364, flip: 3, rot: 0, dust: new Vec2(10, -2)},  //--down-left
    '1,1':   {id: 364, flip: 2, rot: 0, dust: new Vec2(-2, -2)}   //--down-right
  },
};
const CURSOR = {
  x: 8, y: 8, id: 352, lx: 8, ly: 8,
  tx: 8, ty: 8, wx: 0, wy: 0,
  sx: 0, sy: 0, lsx: 0, lsy: 0,
  l: false, ll: false, m: false, lm: false,
  r: false, lr: false, prog: false, rot: 0,
  held_left: false, held_right: false, ltx: 0, lty: 0,
  last_rotation: 0, hold_time: 0, type: 'pointer', item: 'transport_belt',
  drag: false, panel_drag: false, drag_dir: 0, drag_loc: {x: 0, y: 0},
  hand_item: {id: 0, count: 0, drag_offset: {x: 0, y: 0}, item_stack: {id: 9, count: 100}}
};
const KEYBOARD: { [index: string]: boolean }= {
  "shift": false, // 16
  "alt": false,
  "ctrl": false,
  "tab": false,
  "w": false, // 87
  "a": false, // 65
  "s": false, // 83
  "d": false, // 68
  "f": false,
  "g": false,
  "m": false,
  "r": false,
  "q": false,
  "i": false,
  "h": false,
  "c": false,
  "y": false,
  "e": false,
  "t": false,
  "0": false,
  "1": false,
  "2": false,
  "3": false,
  "4": false,
  "5": false,
  "6": false,
  "7": false,
  "8": false,
  "9": false,
};


let biome = 1;
let db_time = 0.0;
let launched = false;
let show_tile_widget = false;
let debug = false;
let alt_mode = false;
let show_count = false;
let num_colors = 3;
let start_color = 8;
let tileSize = 8;
let tileCount = 1;
let amplitude = num_colors;
let frequency = 0.185;
let speed = 0.0022;
let ticks_elapsed = 0;
let last_frame_time = ticks_elapsed;
let show_mini_map = false;
let show_tech = false;
let vis_ents: { [index: string]: Array<string>} = {};
let tick = 0;
let belt_tick = 0;
let ubelt_tick = 0;
let drill_bit_tick = 0;
let drill_anim_tick = 0;
let furnace_anim_tick = 0;
let crafter_anim_frame = 0;
let crafter_anim_dir = 1;
let state = "start";
let _t = 0;



// this is my implementation for the function time() of TIC-80;
function time(): number {
  return ticks_elapsed;
}
function lapse(fn: CallableFunction): number {
	const t: number = time();
  fn();
	return Math.floor((time() - t));
}
function get_visible_ents(): void {
  vis_ents = {
    'transport_belt': [],
    'inserter': [],
    'power_pole': [],
    'splitter': [],
    'mining_drill': [],
    'stone_furnace': [],
    'underground_belt': [],
    //--['underground_belt_exit'] = [],
    'assembly_machine': [],
    'research_lab': [],
    'chest': [],
    'bio_refinery': [],
    'rocket_silo': []
  }

  for (let x = 1; x <= 31; x++) {
    for (let y = 1; y <= 18; y++) {
      const worldX = (x * 8) + (PLAYER.x - 116);
      const worldY = (y * 8) + (PLAYER.y - 64);
      const cellX = Math.floor(worldX / 8);
      const cellY = Math.floor(worldY / 8);
      const k = `${cellX}'-'${cellY}`;

      //& o que acontece aqui é "#vis_ents[type]" pega o quantidade
      //& de objetos na array daquele type;
      if (ENTS[k] && vis_ents[ENTS[k].type]) {
        const type = ENTS[k].type;
        const index = vis_ents[type].length;
        // local index = #vis_ents[type] + 1;
        
        vis_ents[type][index] = k;
      }
    }
  }
}
function get_cell(x: number, y: number): {x: number, y: number} {
  return {x: x - (x % 8), y: y - (y % 8)};
}
function get_screen_cell(mouseX: number, mouseY: number): {sx: number, sy: number} {
  const cam_x = 116 - PLAYER.x;
  const cam_y =  64 - PLAYER.y;
  const mx = Math.floor(cam_x) % 8;
  const my = Math.floor(cam_y) % 8;
  
  return {sx: mouseX - ((mouseX - mx) % 8), sy:  mouseY - ((mouseY - my) % 8)};
}
function get_world_cell(mouseX: number, mouseY: number): {wx: number, wy: number} {
  const cam_x = PLAYER.x - 116 + 1;
  const cam_y = PLAYER.y - 64 + 1;
  const sub_tile_x = cam_x % 8;
  const sub_tile_y = cam_y % 8;
  const sx = Math.floor((mouseX + sub_tile_x) / 8);
  const sy = Math.floor((mouseY + sub_tile_y) / 8);
  const wx = Math.floor(cam_x / 8) + sx + 1;
  const wy = Math.floor(cam_y / 8) + sy + 1;

  //TODO return TileMan.tiles[wy][wx], wx, wy; TILEMAN?
  return {wx: wx, wy: wy};
}
function get_key(x: number, y: number): string {
  const { wx, wy } = get_world_cell(x, y);
  return `${wx}-${wy}`;
}
function get_ent(x: number, y: number): string {
  const k = get_key(x, y);
  
  if (!ENTS[k]) {
    return "";
  }

  if (ENTS[k].type === 'splitter') { return k; }

  if (ENTS[k].type === 'underground_belt_exit') { return ENTS[k].otherKey; }
  
  if (ENTS[k].type === 'underground_belt') { return k; }
  
  if (ENTS[k].otherKey) {return ENTS[k].otherKey}
  
  else{ return k; }
  
  // return false;
}
function move_player(x: number, y: number): void {
  PLAYER.x, PLAYER.y = PLAYER.x + x, PLAYER.y + y;
}
function update_player(): void {
  const dt = time() - last_frame_time;
  if (tick % PLAYER.anim_speed === 0) {

    if (PLAYER.anim_dir === 0) {
      PLAYER.anim_frame = PLAYER.anim_frame + 1
      
      if (PLAYER.anim_frame > PLAYER.anim_max) {
        PLAYER.anim_dir = 1
        PLAYER.anim_frame = PLAYER.anim_max
      }
    }
    else {
      PLAYER.anim_frame = PLAYER.anim_frame - 1

      if (PLAYER.anim_frame < 0) {
        PLAYER.anim_dir = 0;
        PLAYER.anim_frame = 0
      }
    }

  }

  // PLAYER.lx, PLAYER.ly = PLAYER.x, PLAYER.y
  PLAYER.lx = PLAYER.x;
  PLAYER.ly = PLAYER.y;

  // local x_dir, y_dir = 0, 0
  let x_dir = 0; let y_dir = 0;
  
  if (KEYBOARD["w"]) {
    y_dir = -1;
  }
  if (KEYBOARD["s"]) {
    y_dir = 1;
  }
  if (KEYBOARD["a"]) {
    x_dir = -1;
  }
  if (KEYBOARD["d"]) {
    x_dir = 1;
  }

  if (!CURSOR.prog) {
    const dust_dir = PLAYER.directions[`${x_dir},${y_dir}`].dust;

    const dx: number = 240/2 - 4 + dust_dir.x;
    const dy: number = 136/2 - 4 + PLAYER.anim_frame + dust_dir.y;
    
    //& Math.random() retornar entre 0 e 1;
    // if (dust_dir && (x_dir !== 0 || y_dir !== 0)) {
    //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
    // }
    // else if (tick % 24 == 0) {
    //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
    // }
    
    if (x_dir !== 0 || y_dir !== 0) {
      // sound('move');
      move_player(x_dir * PLAYER.move_speed * dt, y_dir * PLAYER.move_speed * dt);
    }
  }
  
  PLAYER.last_dir = `${x_dir},${y_dir}`;
}
function update_cursor_state(): void {
  // local x, y, l, m, r, sx, sy = mouse()
  const x = CURSOR.x;
  const y = CURSOR.y;
  const l = CURSOR.l;
  const m = CURSOR.m;
  const r = CURSOR.r;
  const sx = CURSOR.sx;
  const sy = CURSOR.sy;

  const { wx, wy } = get_world_cell(x, y);
  const { tx, ty } = world_to_screen(wx, wy);

  // --update hold state for left and right click
  if (l && CURSOR.l &&  !CURSOR.held_left && !CURSOR.r) {
    CURSOR.held_left = true
  }

  if (r && CURSOR.r && !CURSOR.held_right && !CURSOR.l) {
    CURSOR.held_right = true;
  }

  if (CURSOR.held_left || CURSOR.held_right) {
    CURSOR.hold_time = CURSOR.hold_time + 1;
  }

  if (!l && CURSOR.held_left) {
    CURSOR.held_left = false;
    CURSOR.hold_time = 0;
  }

  if (!r && CURSOR.held_right) {
    CURSOR.held_right = false;
    CURSOR.hold_time = 0;
  }

  CURSOR.ltx = CURSOR.tx;
  CURSOR.lty = CURSOR.ty;
  CURSOR.wx = wx;
  CURSOR.wy = wy;
  CURSOR.tx = tx;
  CURSOR.ty = ty;
  CURSOR.sx = sx;
  CURSOR.sy = sy;
  CURSOR.lx = CURSOR.x;
  CURSOR.ly = CURSOR.y;
  CURSOR.ll = CURSOR.l;
  CURSOR.lm = CURSOR.m;
  CURSOR.lr = CURSOR.r;
  CURSOR.lsx = CURSOR.sx;
  CURSOR.lsy = CURSOR.sy;
  CURSOR.x = x;
  CURSOR.y = y;
  CURSOR.l = l;
  CURSOR.m = m;
  CURSOR.sx = sx;
  CURSOR.sy = sy;
  
  if (CURSOR.tx !== CURSOR.ltx || CURSOR.ty !== CURSOR.lty) {
    CURSOR.hold_time = 0
  }
}
function dispatch_keypress(): void {
  if (KEYBOARD["f"]) {}
  if (KEYBOARD["g"]) {}

  if (KEYBOARD["m"]) {
    show_mini_map = !show_mini_map;
  }
  if (KEYBOARD["r"]) {}
  if (KEYBOARD["l"]) {}
  if (KEYBOARD["q"]) {}
  if (KEYBOARD["i"] || KEYBOARD["tab"]) {}
  if (KEYBOARD["h"]) {}
  if (KEYBOARD["c"]) {}
  if (KEYBOARD["y"]) {}
  if (KEYBOARD["shift"]) {}
  if (KEYBOARD["alt"]) {}
  if (KEYBOARD["ctrl"]) {}
  if (KEYBOARD["e"]) {}

  if (KEYBOARD["t"]) {
    //   if keyp(20) then
//     show_tech = not show_tech
//     if show_tech then
//       biome = 10
//       --poke(0x03FF8, UI_FG)
//     end
//   end
  }
  //   --0-9
//   for i = 1, INVENTORY_COLS do
//     local key_n = 27 + i
//     --if i == 10 then key_n = 27 end
//     if keyp(key_n) then set_active_slot(i) end
//   end
// end
}
function dispatch_input(): void {
  update_cursor_state();
  dispatch_keypress();

  if (show_tech) {
    return;
  }

  const {wx, wy} = get_world_cell(CURSOR.x, CURSOR.y);
  const k = get_ent(CURSOR.x, CURSOR.y);

  if (ENTS[k] !== undefined) {
    ENTS[k].isHovered = true;
  }

//if CURSOR.sy ~= 0 then cycle_hotbar(CURSOR.sy*-1) end

  if (!CURSOR.l) {
    CURSOR.panel_drag = false;
    CURSOR.drag = false;
  }

  //& begin mouse-over priority dispatch
  // if ()

// function dispatch_input()
//   --begin mouse-over priority dispatch
//   if ui.active_window and ui.active_window:is_hovered(CURSOR.x, CURSOR.y) then
//     if (CURSOR.l and not CURSOR.ll) or (CURSOR.r and not CURSOR.lr) then
//       if ui.active_window:click(CURSOR.x, CURSOR.y) then
//         --trace('clicked active window')
//       end
//     end
//     return
//   end
  
//   if craft_menu.vis and craft_menu:is_hovered(CURSOR.x, CURSOR.y) then
//     if CURSOR.l and not CURSOR.ll then
//       if craft_menu:click(CURSOR.x, CURSOR.y, 'left') then return end
//     elseif CURSOR.r and CURSOR.lr then
//       if craft_menu:click(CURSOR.x, CURSOR.y, 'right') then return end
//     end
//     if craft_menu.vis and CURSOR.panel_drag then
//       craft_menu.x = math.max(1, math.min(CURSOR.x + CURSOR.drag_offset.x, 239 - craft_menu.w))
//       craft_menu.y = math.max(1, math.min(CURSOR.y + CURSOR.drag_offset.y, 135 - craft_menu.h))
//       return
//       --consumed = true
//     end
//     if craft_menu.vis and not CURSOR.panel_drag and CURSOR.l and not CURSOR.ll and craft_menu:is_hovered(CURSOR.x, CURSOR.y) then
//       if craft_menu:click(CURSOR.x, CURSOR.y) then
//         return
//       elseif not craft_menu.docked then
//         CURSOR.panel_drag = true
//         CURSOR.drag_offset.x = craft_menu.x - CURSOR.x
//         CURSOR.drag_offset.y = craft_menu.y - CURSOR.y
//         return
//       end
//     end
//     return
//   end
  
//   if inv:is_hovered(CURSOR.x, CURSOR.y) then
//     if (CURSOR.l and not CURSOR.ll) or (CURSOR.r and not CURSOR.lr) then
//       inv:clicked(CURSOR.x, CURSOR.y)
//     end
//     return
//   end

//   if CURSOR.type == 'item' and CURSOR.item_stack.id ~= 0 then
//     --check other visible widgets
//     local item = ITEMS[CURSOR.item_stack.id]
//     local count = CURSOR.item_stack.count
//     --check for ents to deposit item stack
//     if key(63) and ENTS[k] and ENTS[k].deposit_stack then --TODO
//       if CURSOR.r and not CURSOR.lr then
//         local result, stack = ENTS[k]:deposit_stack({id = CURSOR.item_stack.id, count = 1})
//         if result then
//           CURSOR.item_stack.count = CURSOR.item_stack.count - 1
//           if CURSOR.item_stack.slot then
//             inv.slots[CURSOR.item_stack.slot].count = inv.slots[CURSOR.item_stack.slot].count - 1
//             if inv.slots[CURSOR.item_stack.slot].count < 1 then
//               inv.slots[CURSOR.item_stack.slot].count = 0
//               inv.slots[CURSOR.item_stack.slot].id = 0
//             end
//           end
//           ui.new_alert(CURSOR.x, CURSOR.y, '-1 ' .. ITEMS[CURSOR.item_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           if CURSOR.item_stack.count < 1 then
//             set_cursor_item()
//           end
//         end
//       elseif CURSOR.l and not CURSOR.ll then
//         local result, stack = ENTS[k]:deposit_stack(CURSOR.item_stack)
//         local old_stack = {id = CURSOR.item_stack.id, count = CURSOR.item_stack.count}
//         if stack.count == 0 then
//           ui.new_alert(CURSOR.x, CURSOR.y, -old_stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           set_cursor_item()
//         else
//           ui.new_alert(CURSOR.x, CURSOR.y, '- ' .. (old_stack.count - stack.count) .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           CURSOR.item_stack.count = stack.count
//         end
//       end
//       return
//       --if item is placeable, run callback for item type
//       --checking transport_belt's first (for drag-placement), then other items
//     else
//       if CURSOR.l and CURSOR.item == 'transport_belt' and (CURSOR.tx ~= CURSOR.ltx or CURSOR.ty ~= CURSOR.lty)  then
//         --trace('placing belt')
//         local slot = CURSOR.item_stack.slot
//         local item_consumed = callbacks[CURSOR.item].place_item(CURSOR.x, CURSOR.y)
//         if slot and item_consumed then
//           inv.slots[slot].count = inv.slots[slot].count - 1
//           CURSOR.item_stack.count = inv.slots[slot].count
//         elseif item_consumed ~= false then
//           CURSOR.item_stack.count = CURSOR.item_stack.count - 1
//           if CURSOR.item_stack.count < 1 then
//             set_cursor_item()
//           end
//         end
//         if slot and inv.slots[slot].count < 1 then
//           inv.slots[slot].id = 0
//           inv.slots[slot].count = 0
//           set_cursor_item()
//         end
//         return
//       elseif CURSOR.l and not CURSOR.ll and ITEMS[CURSOR.item_stack.id].type == 'placeable' then
//         if callbacks[CURSOR.item] then
//           local item_consumed = callbacks[CURSOR.item].place_item(CURSOR.x, CURSOR.y)
//           if item_consumed ~= false then
//             CURSOR.item_stack.count = CURSOR.item_stack.count - 1
//             if CURSOR.item_stack.count < 1 then
//               set_cursor_item()
//             end
//             if CURSOR.item_stack.slot then
//               inv.slots[CURSOR.item_stack.slot].count = inv.slots[CURSOR.item_stack.slot].count - 1
//               if inv.slots[CURSOR.item_stack.slot].count < 1 then
//                 inv.slots[CURSOR.item_stack.slot].id = 0
//                 inv.slots[CURSOR.item_stack.slot].count = 0
//                 set_cursor_item()
//               end
//             end
//           end
//         end
//         return
//       elseif CURSOR.r then
//         --remove_tile(CURSOR.x, CURSOR.y)
//         return
//       end
//     end
//   elseif CURSOR.type == 'pointer' then
//     if CURSOR.l and not CURSOR.ll and key(63) and ENTS[k] and ENTS[k].return_all then
//       --try to take all items
//       ENTS[k]:return_all()
//       return
//     end
//   end

//   if CURSOR.held_right and CURSOR.type == 'pointer' then
//     local sx, sy = get_screen_cell(CURSOR.x, CURSOR.y)
//     local tile, wx, wy = get_world_cell(CURSOR.x, CURSOR.y)
//     local result = resources[tostring(tile.sprite_id)]
//     local k = get_ent(CURSOR.x, CURSOR.y)
//     if not result and not tile.is_tree and not ENTS[k] and not tile.ore then CURSOR.prog = false return end
//     if tick % 4 == 0 then
//       local px, py = sx + 4, sy + 4
//       line(120, 67 + PLAYER.anim_frame, px, py, floor(math.random(1, 3) + 0.5))
//       for i = 1, 3 do
//         --local rx = px + floor((math.random() + 0.5) * -3)
//         --local ry = py + floor((math.random() + 0.5) * -3)
//         local rr = 1 + floor((math.random() + 0.5) * 4)
//         local rc = 1 + floor((math.random(6) + 0.5))
//         circb(px, py, rr, rc)
//       end
//     end
//     if tile.is_tree then
//       --local sx, sy = world_to_screen(wx, wy)
//       local c1, c2 = 3, 4
//       if tile.biome < 2 then c1, c2 = 2, 3 end
//       ui.highlight(CURSOR.tx - 9 + tile.offset.x, CURSOR.ty - 27 + tile.offset.y, 24, 32, false, c1, c2)
//       ui.highlight(CURSOR.tx + tile.offset.x - 2, CURSOR.ty - 1 + tile.offset.y, 8, 8, false, c1, c2)
//     end
//     if result or tile.ore or ENTS[k] then
//       ui.highlight(sx - 1, sy - 1, 8, 8, false, 3, 4)
//     end
//     if (ENTS[k] or tile.is_tree or tile.ore or result) then
//       --if tick % 20 == 0 then
//         --if tile.is_tree then
//         --  sound('axe')
//         --else
//           sound('laser')
//         --end
//       --end
//       CURSOR.prog = remap(clamp(CURSOR.hold_time, 0, CURSOR_MINING_SPEED), 0, CURSOR_MINING_SPEED, 0, 9)
//       -- line(CURSOR.x - 4, CURSOR.y + 7, CURSOR.x + 5, CURSOR.y + 7, 0)
//       -- line(CURSOR.x - 4, CURSOR.y + 7, CURSOR.x - 4 + prog, CURSOR.y + 7, 2)
//       --and tile.is_tree or ENTS[k]
//       if CURSOR.prog >= 9 then
//         remove_tile(CURSOR.x, CURSOR.y)
//         CURSOR.prog = false
//         CURSOR.held_right = false
//         CURSOR.hold_time = 0
//         return
//       end
//     end
//   else
//     CURSOR.prog = false
//   end

//     --check for held item placement/deposit to other ents
//   --  if ENTS[k] then ENTS[k].is_hovered = true end
//   if CURSOR.l and not CURSOR.ll and not craft_menu:is_hovered(CURSOR.x, CURSOR.y) and inv:is_hovered(CURSOR.x, CURSOR.y) then
//     local slot = inv:get_hovered_slot(CURSOR.x, CURSOR.y)
//     if slot then
//       --trace(slot.index)
//       inv.slots[slot.index]:callback()
//       return
//     end
    
//     --consumed = true
//   end

//   if CURSOR.l and not CURSOR.ll and ENTS[k] then

//     if dummies[ENTS[k].type] then
//       k = ENTS[k].other_key
//     end

//     if opensies[ENTS[k].type] then
//       if key(63) and CURSOR.type == 'pointer' then
        
//       end
//       if key(64) and CURSOR.type == 'item' and ENTS[k].deposit_stack then
//         local old_stack = CURSOR.item_stack
//         local result, stack = ENTS[k]:deposit_stack(CURSOR.item_stack)
//         if result then
//           if stack then
//             if stack.count > 0 then
//               CURSOR.item_stack.count = stack.count
//             else
//               CURSOR.item_stack = {id = 0, count = 0, slot = false}
//               CURSOR.type = 'pointer'
//             end
//             sound('deposit')
//             ui.new_alert(CURSOR.x, CURSOR.y, stack.count - old_stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 2)
//           end
//         end
//       else
//         ui.active_window = ENTS[k]:open()
//       end
//     end

//     return
//     --consumed = true
//   end
// end
}
//! não tenho certeza se essas funções funcionam de screen e world;
function screen_to_world(screenX: number, screenY: number, playerX: number, playerY: number): {wordX: number, wordY: number} {
  const cam_x = playerX - 116;
  const cam_y = playerY - 64;
  const sub_tile_x = cam_x % 8;
  const sub_tile_y = cam_y % 8;
  const sx = Math.floor((screenX + sub_tile_x) / 8);
  const sy = Math.floor((screenY + sub_tile_y) / 8);
  const wx = Math.floor(cam_x / 8) + sx + 1;
  const wy = Math.floor(cam_y / 8) + sy + 1;
  
  return {wordX: wx, wordY: wy};
}
function world_to_screen(worldX: number, worldY: number): {tx: number, ty: number} {
  const screen_x = (worldX * 8) - (PLAYER.x - 116);
  const screen_y = (worldY * 8) - (PLAYER.y - 64);
  
  return {tx: screen_x - 8, ty: screen_y - 8};
}
function resizeCanvas(): void {
  CVS.width = window.innerWidth;
  CVS.height = window.innerHeight;
}
function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function BOOT(): void {
  resizeCanvas();

  //TODO spawn_player()
  TIC();
}


function TIC() {
  CTX.fillRect(0, 0, CVS.width, CVS.height);

  CURRENT_RECIPE.x = 0;
  CURRENT_RECIPE.y = 0;
  CURRENT_RECIPE.id = 0;

  // --change mouse CURSOR
  //! poke(0x3FFB, 286); dont know what this do;

  // --draw main menu
  if (state === "start" || state === 'help') {
    update_cursor_state();
    //TODO UI.draw_menu();
    tick = tick + 1;
    
    return;
  }

  if (state === "first_launch") {
    update_cursor_state();
    //TODO UI.draw_endgame_window();
    tick = tick + 1;
    
    return;
  }

  const start: number = time();
  //TODO update_water_effect(time());
  //TODO cls(0); clear the screen?

  let m_time = 0;
  const gv_time = lapse(get_visible_ents);
  //TODO let m_time = lapse(draw_terrain);

  const up_time = lapse(update_player);
  //TODO const hi_time = lapse(dispatch_input);

  if (tick % BELT_TICKRATE === 0){
    belt_tick = belt_tick + 1;

    if (belt_tick > BELT_MAXTICK) {
      belt_tick = 0;
    }
  }

  if (tick % UBELT_TICKRATE === 0) {
    ubelt_tick = ubelt_tick + 1;
    
    if (ubelt_tick > UBELT_MAXTICK) {
      ubelt_tick = 0;
    }
  }

  if (tick % DRILL_TICK_RATE === 0) {
    drill_bit_tick = drill_bit_tick + DRILL_BIT_DIR;

    if (drill_bit_tick > 7 || drill_bit_tick < 0) {
      drill_anim_tick = drill_anim_tick + 1;
    }
    if (drill_anim_tick > 2) {
      drill_anim_tick = 0;
    }
  }

  if (tick % FURNACE_ANIM_TICKRATE === 0) {
    furnace_anim_tick = furnace_anim_tick + 1;

    //TODO for y = 0, 3 do
    //   set_sprite_pixel(490, 0, y, floor(math.random(2, 4)))
    //   set_sprite_pixel(490, 1, y, floor(math.random(2, 4)))
    // end

    if (furnace_anim_tick > FURNACE_ANIM_TICKS) {
      furnace_anim_tick = 0;
    }
  }

  if (tick % CRAFTER_ANIM_RATE === 0) {
    crafter_anim_frame = crafter_anim_frame + crafter_anim_dir;

    if (crafter_anim_frame > 5) {
      crafter_anim_dir = -1;
    }
    else if (crafter_anim_frame < 1) {
      crafter_anim_dir = 1;
    }
  }

  // const ue_time = lapse(update_ents)
  // const de_time = lapse(draw_ents)
  let dcl_time = 0;
  if (!show_mini_map) {
    const st_time = time();
    // TileMan:draw_clutter(PLAYER, 32, 21)
    dcl_time = Math.floor(time() - st_time);
  }
  // --draw dust
  // particles()

  //  draw_player();


  //// local x, y, l, m, r = mouse();
  const x = CURSOR.x; const y = CURSOR.y;
  const l = CURSOR.l; const m = CURSOR.m;
  const r = CURSOR.r;

  let col = 5;
  if (r) {
    col = 2;
  }

  if (!show_mini_map) {
    // inv:draw()
    // craft_menu:draw()
    // if (UI.active_window) {
    //   if (ENTS[UI.active_window.ent_key]) {
    //     UI.active_window.draw()
    //   }
    //   else {
    //     UI.active_window = false;
    //   }
    // }
  }

  let ents = 0;
  Object.entries(vis_ents).forEach((v) => {
    Object.entries(v[1]).forEach(() => {
      ents += 1;
    });
  });


  if (show_mini_map) {
    const st_time = time();
    // TileMan:draw_worldmap(PLAYER, 0, 0, 192, 109, true)
    // pix(121, 69, 2)
  }

  //TODO deveria ser a linha abaixo, mas falta o tile:  const tile, wx, wy = get_world_cell(CURSOR.x, CURSOR.y)
  // const {wx, wy} = get_world_cell(CURSOR.x, CURSOR.y);
  // const {sx, sy} = get_screen_cell(CURSOR.x, CURSOR.y);
  // const k;
  const { wx, wy }  = get_world_cell(CURSOR.tx, CURSOR.ty);
  let k: string | boolean = `${wx}-${wy}`;// !k é uma posição
  
  if (KEYBOARD["shift"] && ENTS[k] !== undefined) {
    if (ENTS[k].type === 'underground_belt_exit') {
      //TODO ENTS[ENTS[k].otherKey]:draw_hover_widget(k);
    }
    else {
      k = get_ent(CURSOR.x, CURSOR.y);
      
      if (ENTS[k] !== undefined) {
        //TODO ENTS[k]:draw_hover_widget();
      }
    }
  }

  Object.entries(ENTS).forEach((k) => {
    const v = k[1];
    v.updated = false;
    v.drawn = false;
    v.isHovered = false;

    if (v.type === 'transport_belt') {
      v.beltDrawn = false;
      v.curveChecked = false;
    }
  });
 
//  if show_tech then draw_research_screen() end
//   
// if show_tile_widget and not ENTS[k] then draw_tile_widget() end
//   
// if CURRENT_RECIPE.id > 0 then
//     show_recipe_widget()
// end

//   render_cursor_progress()

//   ui.update_alerts()

  last_frame_time = time();

//   update_rockets();

  tick = tick + 1;

  requestAnimationFrame(TIC);
}


BOOT();
//TODO TileMan = TileManager:new()
//TODO sspr = spr
//TODO inv = make_inventory()
//TODO const starting_items = {
//   {id = 33, slot =  1}, {id = 10, slot =  2}, {id = 23, slot =  3},
//   {id = 24, slot =  4}, {id = 25, slot =  5}, {id = 26, slot =  6},
//   {id =  6, slot =  7}, {id =  8, slot =  8}, {id = 32, slot =  9},
//   {id = 20, slot = 10}, {id = 15, slot = 11}, {id = 14, slot = 12},
//   {id = 40, slot = 13}, {id = 41, slot = 14}, {id = 42, slot = 15},
//   {id = 43, slot = 16}, {id =  9, slot = 57}, {id = 18, slot = 58},
//   {id = 11, slot = 59}, {id = 13, slot = 60}, {id = 14, slot = 61},
//   {id = 22, slot = 62}, {id = 19, slot = 63}, {id = 30, slot = 64},
// }
// -- for k,v in ipairs(starting_items) do
// --   inv.slots[v.slot].id = v.id
// --   inv.slots[v.slot].count = ITEMS[v.id].stack_size
// -- end
//TODO craft_menu = ui.NewCraftPanel(135, 1)
// --------------------
//TODO sounds = {
//   ['deny']        = {id =  5, note = 'C-3', duration = 22, channel = 0, volume = 10, speed = 0},
//   ['place_belt']  = {id =  4, note = 'B-3', duration = 10, channel = 1, volume =  8, speed = 4},
//   ['delete']      = {id =  2, note = 'C-3', duration =  4, channel = 1, volume =  9, speed = 5},
//   ['rotate_r']    = {id =  3, note = 'E-5', duration = 10, channel = 1, volume =  8, speed = 3},
//   ['rotate_l']    = {id =  7, note = 'E-5', duration =  5, channel = 2, volume =  8, speed = 4},
//   ['move_cursor'] = {id =  0, note = 'C-4', duration =  4, channel = 0, volume =  8, speed = 5},
//   ['axe']         = {id =  9, note = 'D-3', duration = 20, channel = 0, volume =  6, speed = 4},
//   ['laser']       = {id =  0, note = 'D-3', duration =  5, channel = 0, volume =  4, speed = 7},
//   ['move']        = {id = 10, note = 'D-3', duration =  5, channel = 3, volume =  2, speed = 5},
//   ['deposit']     = {id = 11, note = 'D-6', duration =  3, channel = 1, volume =  5, speed = 7},
//   ['tech_done']   = {id = 12, note = 'D-8', duration = 50, channel = 2, volume = 10, speed = 6},
//   ['tech_add']    = {id = 13, note = 'G-5', duration = 50, channel = 1, volume = 10, speed = 6},
// }