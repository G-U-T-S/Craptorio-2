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

let tick = 0;
let state: string = "start";


function hovered(mouse: {x: number, y: number}, box: {x: number, y: number, w: number, h: number}) {
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

  drawBg("black");
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
function drawText(text: string, x: number, y: number, fontSize: number, color: string, baseLine: "top" | "bottom" | "middle", textAling: "left" | "center" | "right") {
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
    hovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height })
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


function gameLoop() {
  drawBg("black");
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
    drawText(info[i][0], panelCoords.x + panelCoords.w + 5, panelCoords.y + (i * 20) - 5, 20, "black", "top", "right");
  }

  if (drawTextButton(panelCoords.x, panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", {x: 0, y: 2}), false)) {
    state = 'start';
  }
}


function BOOT(): void {
  resizeCanvas();

  TIC();
}


function TIC() {
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