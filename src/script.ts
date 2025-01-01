const CVS = document.getElementById("mainCanvas") as HTMLCanvasElement;
const CTX = CVS.getContext("2d") as CanvasRenderingContext2D;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});
window.addEventListener("mousemove", (ev) => {
  const rect = CVS.getBoundingClientRect();
  CURSOR.x = ev.clientX - rect.left;
  CURSOR.y = ev.clientY - rect.top;
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


class Player {
  public x: number; public y: number;
  public lx: number; public ly: number;
  public anim_frame: number; readonly anim_speed: 8; public anim_dir: number;
  readonly anim_max: number; public last_dir: string; public move_speed: number;
  readonly directions: { [index: string]: {id: number, flip: number, rot: number, dust: {x: number, y: number}} };

  constructor() {
    this.x = 0, this.y = 0;
    this.lx = 0, this.ly = 0
    this.anim_frame = 0; this.anim_speed = 8; this.anim_dir = 0;
    this.anim_max = 4; this.last_dir = "0,0"; this.move_speed = 1.9
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
  }

  public update(): void {
    // const dt = time() - last_frame_time;
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

    PLAYER.lx = PLAYER.x;
    PLAYER.ly = PLAYER.y;

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
      // const dust_dir = PLAYER.directions[`${x_dir},${y_dir}`].dust;

      // const dx: number = 240/2 - 4 + dust_dir.x;
      // const dy: number = 136/2 - 4 + PLAYER.anim_frame + dust_dir.y;
      
      //& Math.random() retornar entre 0 e 1;
      // if (dust_dir && (x_dir !== 0 || y_dir !== 0)) {
      //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
      // }
      // else if (tick % 24 == 0) {
      //   new_dust(dx, dy, 2, randRange(-1, 1) + (3*-x_dir), Math.random() + (3*-y_dir));
      // }
      
      if (x_dir !== 0 || y_dir !== 0) {
        // sound('move');
        //! removi o delta time
        this.move(x_dir * PLAYER.move_speed, y_dir * PLAYER.move_speed);
      }
    }
  
    PLAYER.last_dir = `${x_dir},${y_dir}`;
  }

  public move(x: number, y: number): void {
    PLAYER.x = PLAYER.x + x;
    PLAYER.y = PLAYER.y + y;
  }

  public draw() {
    switch (this.last_dir) {
      case "-1,0": {
        // FLIP
        break;
      }
      case "-1,1": {
        break;
      }
      case "-1,-1": {
        break;
      }
      case "0,0": {
        drawSprite("sprites", this.x, this.y, 0, 32);
        break;
      }
      case "0,1": {
        break;
      }
      case "0,-1": {
        break;
      }
      case "1,0": {
        drawSprite("sprites", this.x, this.y, 8, 32);
        break;
      }
      case "1,1": {
        break;
      }
      case "1,-1": {
        break;
      }
    }
  }
}
class Label {
  public text: string;
  public fg: string; public bg: string;
  public shadow: {x: number, y: number};
  
  constructor(txt: string, bg: string, fg: string, shadow: {x: number, y: number}) {
    this.text = txt;
    this.fg = fg; this.bg = bg;
    this.shadow = { ...shadow }; 
  }
}


const KEYBOARD: { [index: string]: boolean } = {
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
const CURSOR = {
  x: 0, y: 0, lx: 8, ly: 8,
  tx: 8, ty: 8, wx: 0, wy: 0,
  sx: 0, sy: 0, lsx: 0, lsy: 0,
  l: false, ll: false, m: false, lm: false,
  r: false, lr: false, prog: false, rot: 0,
  held_left: false, held_right: false, ltx: 0, lty: 0,
  last_rotation: 0, hold_time: 0, type: 'pointer', item: 'transport_belt',
  drag: false, panel_drag: false, drag_dir: 0, drag_loc: {x: 0, y: 0},
  hand_item: {id: 0, count: 0}, drag_offset: {x: 0, y: 0}, item_stack: {id: 9, count: 100}
};
const PLAYER = new Player();

const spriteAtlas = new Image();
spriteAtlas.src = "./assets/sprites.png";
const tilesAtlas = new Image();
tilesAtlas.src = "./assets/tiles.png";

let tick = 0;
let state: string = "start";
let integerScale: boolean = true;


function isHovered(mouse: {x: number, y: number}, box: {x: number, y: number, w: number, h: number}): boolean {
  return (
    mouse.x >= box.x &&
    mouse.x <= box.x + box.w &&
    mouse.y >= box.y &&
    mouse.y <= box.y + box.h
  );
}
function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function resizeCanvas(): void {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const width = windowWidth;
  const height = (windowWidth / 16) * 9;

  if (height > windowHeight) {
    CVS.height = windowHeight;
    CVS.width = (windowHeight / 9) * 16;
  }
  else {
    CVS.width = width;
    CVS.height = height;
  }

  if (integerScale) {
    CVS.width = Math.floor(CVS.width);
    CVS.height = Math.floor(CVS.height);
  }

  CTX.imageSmoothingEnabled = false;
  drawBg("black");
}
function drawSprite(src: "sprites" | "tiles", x: number, y: number, coordX: number, coordY: number, sizeX: number = 8, sizeY: number = 8): void {
  const scale = 5;

  if (src === "sprites") {
    CTX.drawImage(
      spriteAtlas, coordX, coordY,
      sizeX, sizeY, x, y, sizeX * scale, sizeY * scale
    )
  }
}
function drawRect(x: number, y: number, w: number, h: number, fillColor: string, strokeColor: string): void {
  CTX.strokeStyle = strokeColor;
  CTX.fillStyle = fillColor;
  CTX.fillRect(x, y, w, h);
}
function drawLine(x1: number, y1: number, x2: number, y2: number, strokeColor: string): void {
  CTX.strokeStyle = strokeColor;
  CTX.moveTo(x1, y1);
  CTX.lineTo(x2, y2);
}
function drawPanel(x: number, y: number, w: number, h: number, bg: string, fg: string, shadow_color: string, label: Label): void {
  drawRect(x, y, w, h, bg, bg); //-- background fill
  // drawRect(x, y + 6, w, 3, fg); //-- header lower-fill
  // drawRect(x + 2, y + h - 3, w - 4, 1, fg); //-- bottom footer fill
  // drawRect(x + (w / 2), y - 15, 50, 4, fg); //--header fill
  
  drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center"); // header
  //TODO drawText(label.text, x + (w / 2), (y - 15) + 2, 20, label.fg, "middle", "center");

  //TODO drawRect(x + 6, y, w - 12, 2, fg); //-- top border
  // drawRect(x, y + 6, 2, h - 12, fg); //-- left border
  // drawRect(x + w - 2, y + 6, 2, h - 12, fg); //-- right border
  // drawRect(x + 6, y + h - 2, w - 12, 2, fg); //-- bottom border

  // TODO if (shadow_color === "") {
  //   drawLine(x + 4, y + h, x + w - 3, y + h, shadow_color); //-- shadow
  //   drawLine(x + w - 2, y + h - 1, x + w, y + h - 3, shadow_color); //-- shadow
  //   drawLine(x + w, y + 4, x + w, y + h - 4, shadow_color); //- shadow
  // }
}
function drawText(text: string, x: number, y: number, fontSize: number, color: string, baseLine: "top" | "bottom" | "middle", textAling: "left" | "center" | "right"): void {
  CTX.textBaseline = baseLine;
  CTX.textAlign = textAling;
  CTX.font = `${fontSize}px Arial`;
  CTX.strokeStyle = color;
  CTX.fillStyle = color;
  CTX.fillText(text, x, y);
}
function drawTextButton(x: number, y: number, width: number, height: number, main_color: string, shadow_color: string, hover_color: string, label: Label, locked: boolean): boolean {
  const middle = {x: x + (width / 2), y: y + (height / 2)};
  const hov = (
    !locked &&
    isHovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height })
  );

  if (!locked && hov && !CURSOR.l) {
    drawRect(x, y, width, height, hover_color, hover_color);
    // drawLine(x, y + height, x + width, y + height, shadow_color);
  }
  else if (!locked && hov && CURSOR.l) {
    drawRect(x, y, width, height, hover_color, hover_color);
  }
  else {
    drawRect(x, y, width, height, main_color, main_color);
    // drawLine(x, y + height, x + width, y + height, shadow_color);
  }
  
  drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
  drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
  
  //! hov && CURSOR.l && !CURSOR.ll);
  if (hov && CURSOR.l) {
    return true;
  }
  
  return false;
}
function drawBg(color: string): void {
  CTX.fillStyle = color;
  CTX.fillRect(0, 0, CVS.width, CVS.height);
}
function clearScreen(): void {
  CTX.clearRect(0, 0, CVS.width, CVS.height);
}
function world_to_screen(worldX: number, worldY: number): {tx: number, ty: number} {
  const screen_x = (worldX * 8) - (PLAYER.x - 116);
  const screen_y = (worldY * 8) - (PLAYER.y - 64);
  
  return {tx: screen_x - 8, ty: screen_y - 8};
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
function get_screen_cell(mouseX: number, mouseY: number): {sx: number, sy: number} {
  const cam_x = 116 - PLAYER.x;
  const cam_y =  64 - PLAYER.y;
  const mx = Math.floor(cam_x) % 8;
  const my = Math.floor(cam_y) % 8;
  
  return {sx: mouseX - ((mouseX - mx) % 8), sy:  mouseY - ((mouseY - my) % 8)};
}
function updateCursorState(): void {
  const l = CURSOR.l; const r = CURSOR.r;
  const sx = CURSOR.sx; const sy = CURSOR.sy;

  const { wx, wy } = get_world_cell(CURSOR.x, CURSOR.y);
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

  CURSOR.ltx = CURSOR.tx; CURSOR.lty = CURSOR.ty;
  CURSOR.wx = wx; CURSOR.wy = wy;
  CURSOR.tx = tx; CURSOR.ty = ty;
  CURSOR.sx = sx; CURSOR.sy = sy;
  CURSOR.lx = CURSOR.x; CURSOR.ly = CURSOR.y;
  CURSOR.ll = CURSOR.l; CURSOR.lm = CURSOR.m;
  CURSOR.lr = CURSOR.r; CURSOR.lsx = CURSOR.sx;
  CURSOR.lsy = CURSOR.sy; CURSOR.sx = sx;
  CURSOR.sy = sy;
  
  if (CURSOR.tx !== CURSOR.ltx || CURSOR.ty !== CURSOR.lty) {
    CURSOR.hold_time = 0;
  }
}


function gameLoop() {
  drawBg("black");

  PLAYER.update();
  PLAYER.draw();
}
function mainMenuLoop() {
  drawBg("gray");

  const middleScreen = {
    x: CVS.width / 2, y: CVS.height / 2
  };
  
  if (drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", {x: 0, y: 2}), false)) {
    state = "game";
  }
  
  if (drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", {x: 0, y: 2}), false)) {
    state = 'help';
  }
}
function helpMenuLoop() {
  drawBg("gray");

  const middleScreen = {
    x: CVS.width / 2, y: CVS.height / 2
  };
  const info = [
    ['W A S D', 'Move PLAYER'],
    ['ESC', 'Exit game'],
    ['CTRL + R', 'Reload game'],
    ['I or TAB', 'Toggle inventory window'],
    ['C', 'Toggle crafting window'],
    ['T', 'Toggle research window'],
    ['R', 'Rotate held item or hovered object'],
    ['Q', 'Pipette tool - copy/swap objects'],
    ['Left-click', 'Place/deposit item/open machine'],
    ['Right-click hold', 'Mine resource or destroy object'],
    ['Scroll +/-', 'Scroll active hotbar slot']
  ];

  const panelCoords = {
    x: middleScreen.x - 250,
    y: middleScreen.y - 150,
    w: 500, h: 300
  };

  drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", {x: 0, y: 0}));
  for (let i = 0; i < info.length; i++) {
    drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
    drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
  }

  if (drawTextButton(middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", {x: 0, y: 2}), false)) {
    state = 'start';
  }
}


function BOOT(): void {
  resizeCanvas();

  TIC();
}
function TIC() {
  updateCursorState();

  if (state === "start") {
    mainMenuLoop();
  }
  else if (state === "help") {
    helpMenuLoop();
  }
  else if (state === "game") {
    gameLoop();
  }

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();