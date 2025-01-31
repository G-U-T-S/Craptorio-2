import render from "./engine/render.js";
import ui from "./scripts/ui.js";
import playerInv from "./scripts/playerInv.js";
import craftMenu from "./scripts/craftMenu.js";
// import keyboard from "./classes/keyboard.js";
import cursor from "./engine/cursor.js";
import StoneFurnace from "./scripts/entities/stone_furnace.js";
import UndergroundBelt from "./scripts/entities/undergroundBelt.js";
import MiningDrill from "./scripts/entities/mining_drill.js";
// import TransportBelt from "./classes/entities/transport_belt.js";
import AssemblyMachine from "./scripts/entities/assembly_machine.js";
import WoodChest from "./scripts/entities/wood_chest.js";
// import { items } from "./classes/definitions.js";


//! coisas na tela nao alteram de posiçao se
//! se a tela muda de tamanho apos o primeiro load


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


let tileSize = 8 * 4;
const ents = {
  assembly_machine: new Map<string, AssemblyMachine>(),
  stone_furnace: new Map<string, StoneFurnace>(),
  wood_chest: new Map<string, WoodChest>(),
};
//! key == a posição, value == [entType, entKey];
//! TODO o problema é que esse map fica gigantesco muito rápido
//* rework
const gridData = new Map<string, Array<string>>();


const tickRate = 1000 / 60// ~ 16.65ms
let tick: number = 0;
let acumulator: number = 0;

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

let delta: number = 0;
let lastTime: number = 0;

type stateType = "start" | "game" | "help" | "firstLaunch";
let state: stateType = "game";
let secodWindowMode: "craft" | "ent" = "craft";
// let showTech: boolean = false;
// let showHelp: boolean = false;
// let showMiniMap: boolean = false;
// let showTileWidget: boolean = false;
// let altMode: boolean = false;

window.addEventListener("mousedown", () => {
  // const globalPos = screenToWorld(cursor.x, cursor.y, true);

  // if (cursor.l) {
  //   debugInv.depositStack("copper_plate", 30, 5, true);
  // }
  // else {
  //   debugInv.removeStack(0, "full");
  // }

  if (playerInv.visible) {
    if (playerInv.isHovered(cursor.x, cursor.y)) {
      playerInv.handleClick(cursor.x, cursor.y);
      return;
    }
    else if (craftMenu.isHovered(cursor.x, cursor.y)) {
      craftMenu.handleClick(cursor.x, cursor.y);
      return;
    }
  }

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
    playerInv.visible = !playerInv.visible;
  }
});


function screenToWorld(x: number, y: number, snapToGrid: boolean): { x: number, y: number } {
  const worldPos = { x: x + render.topLeft.x, y: y + render.topLeft.y };

  if (snapToGrid) {
    return {
      x: Math.floor(worldPos.x / tileSize) * tileSize,
      y: Math.floor(worldPos.y / tileSize) * tileSize
    };
  }

  return { ...worldPos };
}
function placeEnt(type: "assembly_machine" | "wood_chest", globalPos: { x: number, y: number }): boolean {
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
function removeEnt(globalPos: { x: number, y: number }): boolean {
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
function getEntData(globalPos: { x: number, y: number }): undefined | { entKey: string, entName: string } {
  const mouseKey = `${globalPos.x}-${globalPos.y}`;
  const mouseTile = gridData.get(mouseKey)

  return mouseTile !== undefined ? { entName: mouseTile[0], entKey: mouseTile[1] } : undefined;
}
function updateEnts(): void {
  Object.entries(ents).forEach((value) => {
    value[1].forEach((ent) => {
      if (ent instanceof WoodChest) {
        return;
      }

      ent.update();
    });
  });
}
function drawEnts(): void {
  //TODO check inside screen

  Object.entries(ents).forEach((value) => {
    value[1].forEach((ent) => {
      ent.draw();
    });
  });

  // ents.wood_chest.forEach((chest) => {
  //   chest.draw();
  // });
  // ents.assembly_machine.forEach((machine) => {
  //   machine.draw();
  // });
}

function startMenuLoop(): void {
  state = ui.drawStartMenu() as stateType;
}
function helpMenuLoop(): void {
  state = ui.drawHelpMenu() as stateType;
}
function gameLoop(): void {
  const now = performance.now();
  delta = now - lastTime;
  lastTime = now;
  acumulator += delta;

  render.drawText(
    `delta: ${Number(delta).toFixed(2)}`, 5, 5, 30, "white", "top", "left"
  );

  while (acumulator >= tickRate) {
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

    tick += 1;
    acumulator -= tickRate;
  }

  drawEnts();

  if (playerInv.visible) {
    playerInv.draw();

    if (secodWindowMode === "craft") {
      craftMenu.draw();
    }
    else if (secodWindowMode === "ent") {
      return;
    }
  }

  if (cursor.type === "item") {
    render.drawItemStack(
      cursor.itemStack.name, 3, cursor.x, cursor.y, cursor.itemStack.quant, false
    );
  }
}


function BOOT(): void {
  TIC();
}
function TIC() {
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

  tick += 1;
  requestAnimationFrame(TIC);
}


BOOT();