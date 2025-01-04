/*
eu tava na função draw terrain do tilemanager, fui para
createTile e agora vou criar um objeto que gera open simplex noise
*/

import { Render } from "./classes/render.js";
import { Player } from "./classes/player.js";
import { Cursor } from "./classes/cursor.js";
import { Keyboard } from "./classes/keyboard.js";
import { Tilemanager } from "./classes/tileManager.js";
import { Label } from "./classes/label.js";


// const CVS = document.getElementById("mainCanvas") as HTMLCanvasElement;
// const CTX = CVS.getContext("2d") as CanvasRenderingContext2D;


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});

const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
const tmp = new Uint8Array(256);


interface PermTables {
  perm: Uint8Array;
  permMod12: Uint8Array;
}


class Grad {
  public x: number;
  public y: number;
  public z: number;
	
  constructor(x: number, y: number, z: number) {
    this.x = x; this.y = y; this.z = z;
  }

	dot2(x: number, y: number): number {
		return this.x * x + this.y * y;
	}
}
class Perlin {
  private gradP: Array<Grad>;
  private grad3: Array<Grad>;
  private p: Array<number>;

  constructor(seed: number) {
    this.gradP = new Array(512);
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ];
    this.p = [
      151,
      160,
      137,
      91,
      90,
      15,
      131,
      13,
      201,
      95,
      96,
      53,
      194,
      233,
      7,
      225,
      140,
      36,
      103,
      30,
      69,
      142,
      8,
      99,
      37,
      240,
      21,
      10,
      23,
      190,
      6,
      148,
      247,
      120,
      234,
      75,
      0,
      26,
      197,
      62,
      94,
      252,
      219,
      203,
      117,
      35,
      11,
      32,
      57,
      177,
      33,
      88,
      237,
      149,
      56,
      87,
      174,
      20,
      125,
      136,
      171,
      168,
      68,
      175,
      74,
      165,
      71,
      134,
      139,
      48,
      27,
      166,
      77,
      146,
      158,
      231,
      83,
      111,
      229,
      122,
      60,
      211,
      133,
      230,
      220,
      105,
      92,
      41,
      55,
      46,
      245,
      40,
      244,
      102,
      143,
      54,
      65,
      25,
      63,
      161,
      1,
      216,
      80,
      73,
      209,
      76,
      132,
      187,
      208,
      89,
      18,
      169,
      200,
      196,
      135,
      130,
      116,
      188,
      159,
      86,
      164,
      100,
      109,
      198,
      173,
      186,
      3,
      64,
      52,
      217,
      226,
      250,
      124,
      123,
      5,
      202,
      38,
      147,
      118,
      126,
      255,
      82,
      85,
      212,
      207,
      206,
      59,
      227,
      47,
      16,
      58,
      17,
      182,
      189,
      28,
      42,
      223,
      183,
      170,
      213,
      119,
      248,
      152,
      2,
      44,
      154,
      163,
      70,
      221,
      153,
      101,
      155,
      167,
      43,
      172,
      9,
      129,
      22,
      39,
      253,
      19,
      98,
      108,
      110,
      79,
      113,
      224,
      232,
      178,
      185,
      112,
      104,
      218,
      246,
      97,
      228,
      251,
      34,
      242,
      193,
      238,
      210,
      144,
      12,
      191,
      179,
      162,
      241,
      81,
      51,
      145,
      235,
      249,
      14,
      239,
      107,
      49,
      192,
      214,
      31,
      181,
      199,
      106,
      157,
      184,
      84,
      204,
      176,
      115,
      121,
      50,
      45,
      127,
      4,
      150,
      254,
      138,
      236,
      205,
      93,
      222,
      114,
      67,
      29,
      24,
      72,
      243,
      141,
      128,
      195,
      78,
      66,
      215,
      61,
      156,
      180,
    ];

    if (seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }
  
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }
  
    for (let i = 0; i < 256; i++) {
      let v;
      if (i & 1) {
        v = this.p[i] ^ (seed & 255);
      } else {
        v = this.p[i] ^ ((seed >> 8) & 255);
      }
  
      perm[i] = perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }

  fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  noise2D(x: number, y: number) {
    // Find unit grid cell containing point
    let X = Math.floor(x); let Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X;
    y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;
  
    // Calculate noise contributions from each of the four corners
    const n00 = this.gradP[X + perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
  
    // Compute the fade curve value for x
    const u = this.fade(x);
  
    // Interpolate the four results
    return lerp(
      lerp(n00, n10, u),
      lerp(n01, n11, u),
      this.fade(y),
    );
  }
}


const RENDER = new Render("mainCanvas");
const CURSOR = new Cursor("mainCanvas");
const KEYBOARD = new Keyboard();
const PLAYER = new Player(RENDER);
const TILEMAN = new Tilemanager("mainCanvas", PLAYER);

let tick = 0;
let state: string = "start";
let showMiniMap: boolean = false;
let integerScale: boolean = true;



function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/*
function worldToScreen(worldX: number, worldY: number): {tx: number, ty: number} {
  const screen_x = (worldX * 8) - (PLAYER.x - 116);
  const screen_y = (worldY * 8) - (PLAYER.y - 64);
  
  return {tx: screen_x - 8, ty: screen_y - 8};
}
function getWorldCell(mouseX: number, mouseY: number): {wx: number, wy: number} {
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
function getScreenell(mouseX: number, mouseY: number): {sx: number, sy: number} {
  const cam_x = 116 - PLAYER.x;
  const cam_y =  64 - PLAYER.y;
  const mx = Math.floor(cam_x) % 8;
  const my = Math.floor(cam_y) % 8;
  
  return {sx: mouseX - ((mouseX - mx) % 8), sy:  mouseY - ((mouseY - my) % 8)};
}
*/


function gameLoop() {
  RENDER.drawBg("black");

  PLAYER.update(tick, KEYBOARD, CURSOR);

  // TILEMAN.drawTerrain();
  PLAYER.draw(RENDER.canvas.width / 2, RENDER.canvas.height / 2);
}
function mainMenuLoop() {
  RENDER.drawBg("gray");

  const middleScreen = {
    x: RENDER.canvas.width / 2, y: RENDER.canvas.height / 2
  };
  
  if (RENDER.drawTextButton(CURSOR, middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", {x: 0, y: 2}), false)) {
    state = "game";
  }
  
  if (RENDER.drawTextButton(CURSOR, middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", {x: 0, y: 2}), false)) {
    state = 'help';
  }
}
function helpMenuLoop() {
  RENDER.drawBg("gray");

  const middleScreen = {
    x: RENDER.canvas.width / 2, y: RENDER.canvas.height / 2
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

  RENDER.drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", {x: 0, y: 0}));
  for (let i = 0; i < info.length; i++) {
    RENDER.drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
    RENDER.drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
  }

  if (RENDER.drawTextButton(CURSOR, middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", {x: 0, y: 2}), false)) {
    state = 'start';
  }
}


function BOOT(): void {
  RENDER.resizeCanvas();

  TIC();
}
function TIC() {
  CURSOR.update();

  if (state === "start") {
    mainMenuLoop();
  }
  else if (state === "help") {
    helpMenuLoop();
  }
  else if (state === "game") {
    // gameLoop();
    RENDER.clearScreen();
    // for (let x = 0; x < 100; x++) {
    //   for (let y = 0; y < 100; y++) {
    //     const noise = PERLIN.noise2D(x, y);
    //     console.log(noise)
    //     drawRect(
    //       x, y, 1, 1,
    //       `rgb(${255 * noise}, ${255 * noise}, ${255 * noise})`,
    //       `rgb(${255 * noise}, ${255 * noise}, ${255 * noise})`
    //     );
    //   } 
    // }
    return;
  }

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();