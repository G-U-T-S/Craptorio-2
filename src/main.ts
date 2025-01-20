import render from "./classes/render.js";
import ui from "./classes/ui.js";
import keyboard from "./classes/keyboard.js";
import cursor from "./classes/cursor.js";
import player from "./classes/player.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import MiningDrill from "./classes/entities/mining_drill.js";
import TransportBelt from "./classes/entities/transport_belt.js";
import AssemblyMachine from "./classes/entities/assembly_machine.js";
import WoodChest from "./classes/entities/wood_chest.js";


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


let zoomScale = 5;
let tileSize = 8 * zoomScale;
const ents: { [index: string]: undefined | AssemblyMachine | MiningDrill | StoneFurnace | TransportBelt | UndergroundBelt | WoodChest} = {};
const visEnts: { [index: string]: Array<string>} = {
  transport_belt: [],
  inserter: [],
  splitter: [],
  mining_drill: [],
  stone_furnace: [],
  underground_belt: [],
  assembly_machine: [],
  research_lab: [],
  wood_chest: [],
  bio_refinary: [],
  rocket_silo: []
};

let tick: number = 0;

let beltTick: number = 0;

let uBeltTick: number = 0;

let drillTick: number = 0;
let drillBitTick: number = 0;
let drillBitDir: number = 1;
let drillAnimTick: number = 0;

let furnaceTick: number = 0;
let furnaceAnimTick: number = 0;

let crafterTick: number = 0;
let crafterAnimTick: number = 0;
let crafterAnimDir: number = 1;

let delta: number = 0;
let lastTime: number = 0;

type stateType = "start" | "game" | "help" | "firstLaunch";
let state: stateType = "game";
let showTech: boolean = false;
let showHelp: boolean = false;
let showMiniMap: boolean = false;
let showTileWidget: boolean = false;
let altMode: boolean = false;

const debugChest = new WoodChest({x: 0, y: 0});
const chestMap: Map<string, WoodChest> = new Map();
cursor.addMouseDownListener(() => {
  const pos = screenToWorld(cursor.x, cursor.y, true);
  const key = `${pos.x}-${pos.y}`;
  
  if (!chestMap.has(key)) {
    chestMap.set(key, new WoodChest({ ...pos }));
  }
});
cursor.addMouseWheelListener((scrollAmount: number) => {
  if (scrollAmount < 0) {
    zoomScale += 1;
  }
  else {
    zoomScale -= 1;
  }

  zoomScale = Math.min(Math.max(1, zoomScale), 6);
});


function screenToWorld(x: number, y: number, snapToGrid: boolean): {x: number, y: number} {
  const worldPos = {x: x + render.topLeft.x * zoomScale, y: y + render.topLeft.y * zoomScale};
  
  if (snapToGrid) {
    return {
      x: Math.floor(worldPos.x / tileSize) * tileSize,
      y: Math.floor(worldPos.y / tileSize) * tileSize
    };
  }
  
  return { ...worldPos };
}


function startMenuLoop(): void {
  state = ui.drawStartMenu() as stateType;
}
function helpMenuLoop(): void {
  state = ui.drawHelpMenu() as stateType;
}
function gameLoop(): void {
  // getVisibleEnts();

  player.update(delta, tick, {w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d}, cursor.prog);
  // dispatchInput();

  if (tick % UndergroundBelt.tickRate === 0) {
    beltTick += 1;
    if (beltTick > UndergroundBelt.maxTick) { beltTick = 0; }
  }

  if (tick % UndergroundBelt.tickRate === 0) {
    uBeltTick += 1;
    if (beltTick > UndergroundBelt.maxTick) { uBeltTick = 0; }
  }

  if (tick % MiningDrill.tickRate === 0) {
    drillTick = drillTick + drillBitDir;
    if (drillBitTick > 7 && drillBitTick < 0) {
      drillBitDir = drillBitDir * -1;
    }
    
    drillAnimTick += 1;
    if (drillAnimTick > 2) {
      drillAnimTick = 0;
    }
  }

  if (tick % StoneFurnace.animTickRate === 0) {
    furnaceAnimTick += 1;
    for (let y = 0; y < 3; y++) {
      // set_sprite_pixel(490, 0, y, floor(math.random(2, 4)))
      // set_sprite_pixel(490, 1, y, floor(math.random(2, 4)))
    }
    
    if (furnaceAnimTick > StoneFurnace.animMaxTick) {
      furnaceAnimTick = 0;
    }
  }

  if (tick % AssemblyMachine.animTickRate === 0) {
    crafterAnimTick = crafterAnimTick + crafterAnimDir;
    
    if (crafterAnimTick > 5) {
      crafterAnimDir = -1;
    }
    else if (crafterAnimTick < 1) {
      crafterAnimDir = 1;
    }
  }

  // updateEnts();
  // drawEnts();
  chestMap.forEach((chest) => {
    chest.draw(zoomScale);
  });
  player.draw(zoomScale);

  debugChest.globalPos = screenToWorld(cursor.x, cursor.y, true);
  debugChest.draw(zoomScale);

  render.drawText(
    `chest quant: ${chestMap.size}`, 50, 50, 30, "white", "top", "left"
  );
}


function BOOT(): void {
  TIC(1);
}
function TIC(currentTime: number) {
  delta = (currentTime - lastTime) / 100;
  lastTime = currentTime;

  render.drawBg("black");
  cursor.update();

  switch (state) {
    case "start": {
      startMenuLoop();
      break;
    }
    case "help": {
      helpMenuLoop();
      break;
    }
    case "game": {
      gameLoop();
      break;
    }
  }

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();