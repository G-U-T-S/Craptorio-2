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


let tileSize = 8 * 4;
const ents = {
  assembly_machine: new Map<string, AssemblyMachine>(),
  wood_chest: new Map<String, WoodChest>(),
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

cursor.addMouseDownListener(() => {
  const pos = screenToWorld(cursor.x, cursor.y, true);
  const key = `${pos.x}-${pos.y}`;
  
  if(!ents.assembly_machine.has(key)) {
    ents.assembly_machine.set(key, new AssemblyMachine({ ...pos }));
  }
});


function screenToWorld(x: number, y: number, snapToGrid: boolean): {x: number, y: number} {
  const worldPos = {x: x + render.topLeft.x, y: y + render.topLeft.y};
  
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
  ents.assembly_machine.forEach((machine) => {
    machine.draw();
  });
  player.draw();

  render.drawText(
    `machine quant: ${ents.assembly_machine.size}`, 50, 50, 30, "white", "top", "left"
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