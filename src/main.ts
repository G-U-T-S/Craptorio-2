//TODOS OS SPRITES SÃO ESCALONADOS POR CINCO


import RENDER from "./classes/render.js";
import PLAYER from "./classes/player.js";
import CURSOR from "./classes/cursor.js";
import KEYBOARD from "./classes/keyboard.js";
import ENTYMAN from "./classes/entityManager.js";
import { Tilemanager } from "./classes/tileManager.js";
import { Label } from "./classes/label.js";


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


const TILEMAN = new Tilemanager(1);
// const ENTS = {
//   "stone_furnace": new Map<string, Object>()
// };

let tick: number = 0;
let delta: number = 0;
let lastTime: number = 0;
let state: string = "game";
// let integerScale: boolean = true;


/*
function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
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

  //TODO return TileMan.tiles[wy][wx], wx, wy;
  return {wx: wx, wy: wy};
}

class baseEntity {
  public type: string;

  constructor(type: string) {
    this.type = type;
  }
}
/*
class stoneFurnace extends baseEntity {
  public globalPos: {x: number, y: number};


  constructor() {
    super("stone_furnace");

    this.globalPos = {x: 0, y: 0};
  }

  draw_item(x: number, y: number): void {
    // local sx, sy = get_screen_cell(x, y);
    // sspr(FURNACE_ID, sx, sy, FURNACE_COLORKEY, 1, 0, 0, 2, 2);
  }
}
*/
/*
class TransportBelt extends baseEntity {
  public actualTick: number;
  public globalPos: {x: number, y: number};
  public drawn: boolean;
  public outputKey: string;

  readonly coordStraight: {x: number, y: number};
  readonly coordCurved: {x: number, y: number};
  readonly coordArrow: {x: number, y: number};
  readonly tickrate: number;
  readonly maxTick: number;

  constructor() {
    super("transport_belt");

    this.actualTick = 0;
    this.globalPos = {x: 0, y: 0};
    this.drawn = false;
    this.outputKey = "";

    this.coordStraight = {x: 0, y: 0};
    this.coordCurved = {x: 0, y: 0};
    this.coordArrow = {x: 0, y: 0};
    this.tickrate = 5;
    this.maxTick = 3;
  }

  draw(ents: { [index: string]: baseEntity}): void {
    if (!this.drawn) {
      //! esse algoritimo pode ser perigoso, por envolver recurção.
      this.drawn = true;
      if (ents[this.outputKey] !== undefined && ents[this.outputKey] instanceof TransportBelt) {
        const outputBelt = ents[this.outputKey] as TransportBelt;
        
        if (!outputBelt.drawn) {
          outputBelt.draw(ents);
        }
      }
      // if (self.id == BELT_ID_CURVED) {rot = self.sprite_rot; flip = self.flip}
      // local sx, sy = world_to_screen(self.pos.x, self.pos.y)
      // self.screen_pos = {x = sx, y = sy}
      // sspr(self.id + belt_tick, sx, sy, BELT_COLORKEY, 1, flip, rot, 1, 1)
    }
  }
}
*/

function gameLoop() {
  RENDER.drawBg("black");

  PLAYER.update(delta, tick, {w: KEYBOARD.w, a: KEYBOARD.a, s: KEYBOARD.s, d: KEYBOARD.d}, CURSOR.prog);
  ENTYMAN.update();
  // TILEMAN.drawTerrain(showMiniMap);

  // RENDER.drawRect(0, 0, 250, 35, "black", "black");
  // RENDER.drawText(
  //   `Total Tiles: ${TILEMAN.totalTiles}`, 0, 0, 30,
  //   "white", "top", "left"
  // );
  PLAYER.draw();
  ENTYMAN.draw();

  // const coord = UTILS.getScreenCell();
  // RENDER.drawRect(coord.sx, coord.sy, 40, 40, "green", "green");
}
function mainMenuLoop() {
  RENDER.drawBg("gray");

  const middleScreen = {
    x: RENDER.canvas.width / 2, y: RENDER.canvas.height / 2
  };
  
  if (RENDER.drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", {x: 0, y: 2}), false)) {
    state = "game";
  }
  
  if (RENDER.drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", {x: 0, y: 2}), false)) {
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

  if (RENDER.drawTextButton(middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", {x: 0, y: 2}), false)) {
    state = 'start';
  }
}


function BOOT(): void {
  RENDER.resizeCanvas();

  TIC(1);
}
function TIC(currentTime: number) {
  CURSOR.update();

  delta = (currentTime - lastTime) / 100;
  lastTime = currentTime;

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