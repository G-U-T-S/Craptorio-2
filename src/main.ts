import render from "./classes/render.js";
import ui from "./classes/ui.js";
// import keyboard from "./classes/keyboard.js";
import cursor from "./classes/cursor.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import MiningDrill from "./classes/entities/mining_drill.js";
// import TransportBelt from "./classes/entities/transport_belt.js";
import AssemblyMachine from "./classes/entities/assembly_machine.js";
import WoodChest from "./classes/entities/wood_chest.js";
import Inventory from "./classes/inventory.js";


//! coisas na tela nao alteram de posiçao se
//! se a tela muda de tamanho apos o primeiro load


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


let tileSize = 8 * 4;
const ents = {
  assembly_machine: new Map<string, AssemblyMachine>(),
  wood_chest: new Map<string, WoodChest>(),
};
//! key == a posição, value == [entType, entKey];
//! TODO o problema é que esse map fica gigantesco muito rápido
//* rework
const gridData = new Map<string, Array<string>>();


let tick: number = 0;

let beltTick: number = 0;

let uBeltTick: number = 0;

let drillTick: number = 0;
let drillBitTick: number = 0;
let drillBitDir: number = 1;
let drillAnimTick: number = 0;

// let furnaceTick: number = 0;
let furnaceAnimTick: number = 0;

// let crafterTick: number = 0;
let crafterAnimTick: number = 0;
let crafterAnimDir: number = 1;

// let delta: number = 0;
// let lastTime: number = 0;

type stateType = "start" | "game" | "help" | "firstLaunch";
let state: stateType = "game";
// let showTech: boolean = false;
// let showHelp: boolean = false;
// let showMiniMap: boolean = false;
// let showTileWidget: boolean = false;
// let altMode: boolean = false;

window.addEventListener("mousedown", () => {
  // const globalPos = screenToWorld(cursor.x, cursor.y, true);

  if (cursor.l)  debugInv.depositStack("copper_plate", 30, 5, true);
  else {
    debugInv.removeStack(0);
  }

  // if (inv.isHovered(cursor.x, cursor.y)) {
  //   if (cursor.l || cursor.r) {
  //     inv.click(cursor.x, cursor.y);
  //   }
  //   return;
  // }
  
  /*
  // const entData = getEntData({ ...screenToWorld(cursor.x, cursor.y, true) });
  // if (cursor.type === 'item' && cursor.itemStack.name !== "") {
  //   if (keyboard.ctrl && entData !== undefined) {
  //     let returnData = {success: false, itemName: "", quant: 0};

  //     if (cursor.r) {
  //       switch (entData.entName) {
  //         case "wood_chest": {
  //           const chest = ents.wood_chest.get(entData.entKey) as WoodChest;
  //           returnData = chest.depositStack({itemName: cursor.itemStack.name, quant: 1});
  //           break;
  //         }
  //       }

  //       if (returnData.success) {
  //         cursor.itemStack.quant = cursor.itemStack.quant - 1;
  //       }
  //     }
  //   }
  // }
  */

  
});

window.addEventListener("keydown", (ev) => {
  if (ev.key === "i" || ev.key === "Tab") {
    // inv.visible = !inv.visible;
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
function placeEnt(type: "assembly_machine" | "wood_chest", globalPos: {x: number, y: number}): boolean {
  switch (type) {
    case "wood_chest": {
      const key = `${globalPos.x}-${globalPos.y}`;
      if (!gridData.has(key)) {
        gridData.set(key, ["wood_chest", key]);
        ents.wood_chest.set(key, new WoodChest({ ...globalPos }));
        return true;
      }
      break;
    }

    case "assembly_machine": {
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const key = `${globalPos.x + (x * tileSize)}-${globalPos.y + (y * tileSize)}`;

          if (gridData.has(key)) {
            return false;
          }
        }
      }

      ents.assembly_machine.set(`${globalPos.x}-${globalPos.y}`, new AssemblyMachine({ ...globalPos }));
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          const key = `${globalPos.x + (x * tileSize)}-${globalPos.y + (y * tileSize)}`;
          gridData.set(key, ["assembly_machine", `${globalPos.x}-${globalPos.y}`]);
        }
      }
      return true;
    }
  }

  return false;
}
function removeEnt(globalPos: {x: number, y: number}): boolean {
  const mouseKey = `${globalPos.x}-${globalPos.y}`;

  if (gridData.has(mouseKey)) {
    const mouseTile = gridData.get(mouseKey) as string[];
    switch (mouseTile[0]) {
      case "wood_chest": {
        ents.wood_chest.delete(mouseKey);
        gridData.delete(mouseKey);
        break;
      }

      case "assembly_machine": {
        //TODO não foi feito da maneira ideal;
        const machine = ents.assembly_machine.get(mouseTile[1]) as AssemblyMachine;
        ents.assembly_machine.delete(mouseTile[1]);
        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 3; y++) {
            const key = `${machine.globalPos.x + (x * tileSize)}-${machine.globalPos.y + (y * tileSize)}`;
            gridData.delete(key);
          }
        }

        break;
      }
    }
    
    return true;
  }
  
  return false;
}
function getEntData(globalPos: {x: number, y: number}): undefined | {entKey: string, entName: string} {
  const mouseKey = `${globalPos.x}-${globalPos.y}`;
  const mouseTile = gridData.get(mouseKey)

  return mouseTile !== undefined ? {entName: mouseTile[0], entKey: mouseTile[1]} : undefined;
}
function updateEnts(): void {
  ents.assembly_machine.forEach((machine) => {
    machine.update();
  });
}
function drawEnts(): void {
  ents.wood_chest.forEach((chest) => {
    chest.draw();
  });
  ents.assembly_machine.forEach((machine) => {
    machine.draw();
  });
}

function startMenuLoop(): void {
  state = ui.drawStartMenu() as stateType;
}
function helpMenuLoop(): void {
  state = ui.drawHelpMenu() as stateType;
}
function gameLoop(): void {
  // getVisibleEnts();

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

  updateEnts();
  drawEnts();

  // inv.draw();
  const slot = cursor.inv.getSlot(0)
  if (cursor.type === "item" && slot !== undefined) {
    render.drawItemStack(
      slot.itemName, 3, cursor.x, cursor.y, slot.quant, false
    );
  }

  render.drawText(
    `total ents: ${ents.assembly_machine.size + ents.wood_chest.size}`, 50, 50, 30, "white", "top", "left"
  );
}


const cols = 5;
const rows = 5;
const slotSize = 8 * 6;
const w = slotSize * cols;
const h = slotSize * rows;
const x = (render.size.w / 2) - (w / 2);
const y = (render.size.h / 2) - (h / 2);
const debugInv = new Inventory(
  x, y, rows, cols, slotSize, w, h
)
render.addResizeListener(() => {
  debugInv.moveTo(
    (render.size.w / 2) - (w / 2),
    (render.size.h / 2) - (h / 2)
  );
});


function BOOT(): void {
  TIC(1);
}
function TIC(currentTime: number) {
  // delta = (currentTime - lastTime) / 100;
  // lastTime = currentTime;

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

  debugInv.draw();

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();