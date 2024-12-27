const CVS = document.getElementById("mainCanvas") as HTMLCanvasElement;
const CTX = CVS.getContext("2d") as CanvasRenderingContext2D;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});
/*
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
*/

let tick = 0;
let state: "start" | "help" | "game" | "first_launch" = "start";


function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function resizeCanvas(): void {
  CVS.width = window.innerWidth;
  CVS.height = window.innerHeight;
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
function drawText(text: string, x: number, y: number, fontSize: number, color: string, baseLine: "top" | "bottom" | "middle", textAling: "left" | "center" | "right") {
  CTX.textBaseline = baseLine;
  CTX.textAlign = textAling;
  CTX.font = `${fontSize}px Arial`;
  CTX.strokeStyle = color;
  CTX.fillStyle = color;
  CTX.fillText(text, x, y);
}
function drawBg(color: string): void {
  CTX.fillStyle = color;
  CTX.fillRect(0, 0, CVS.width, CVS.height);
}
function clearScreen(): void {
  CTX.clearRect(0, 0, CVS.width, CVS.height);
}


function BOOT(): void {
  resizeCanvas();

  TIC();
}


function TIC() {
  /*
  if "menu":
    mainMenuLoop()
  
  elif "help":
    helpMenuLoop()
  
  elif "game":
    gameLoop()
  */

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();