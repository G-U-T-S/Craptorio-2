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


const tileScale = 5;
const tileSize = 8 * tileScale;
const currentRecipe = {x: 0, y: 0, id: 0}; 
const ents: { [index: string]: AssemblyMachine | MiningDrill | StoneFurnace | TransportBelt | UndergroundBelt | WoodChest} = {};
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
let state: stateType = "start";
let showTech: boolean = false;
let showHelp: boolean = false;
let showMiniMap: boolean = false;


function getVisibleEnts(): void {
  Object.entries(visEnts).forEach((value) => {
    const index = value[0];
    visEnts[index] = [];
  });

  for (let worldX = render.topLeft.x - tileSize; worldX < render.topLeft.x + render.canvas.width; worldX++) {
    if (worldX % tileSize !== 0) { continue; }
    for (let worldY = render.topLeft.y - tileSize; worldY < render.topLeft.y + render.canvas.height; worldY++) {
      if (worldY % tileSize !== 0) { continue; }

      const coord = worldX + '-' + worldY;
      if (ents[coord] !== undefined && visEnts[ents[coord].type] !== undefined) {
        const type = ents[coord].type;
        visEnts[type].push(coord);
      }
    }
  }
}
function updateEnts(): void {
  Object.entries(ents).forEach((value) => {
    const ent = value[1];

    if (!(ent instanceof WoodChest)) {
      ent.update();
    }
  });
}
function drawEnts(): void {
  if (showMiniMap || showHelp || state !== 'game') { return; }
  
  visEnts.transport_belt.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.transport_belt.forEach((coord) => {
    if (ents[coord] !== undefined) {
      const belt = ents[coord] as TransportBelt;
      belt.drawItems();
    }
  });
  visEnts.underground_belt.forEach((coord) => {
    if (ents[coord] !== undefined) {ents[coord].draw()}
  });
  visEnts.underground_belt.forEach((coord) => {
    if (ents[coord] !== undefined) {
      const uBelt = ents[coord] as UndergroundBelt;
      uBelt.drawItems();
    }
  });
  visEnts.stone_furnace.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw();}
  });
  visEnts.splitter.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.mining_drill.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.assembly_machine.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.research_lab.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.wood_chest.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.rocket_silo.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.bio_refinary.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
  visEnts.inserter.forEach((coord) => {
    if (ents[coord] !== undefined) { ents[coord].draw(); }
  });
}


function BOOT(): void {
  TIC(1);
}
function TIC(currentTime: number) {
  delta = (currentTime - lastTime) / 100;
  lastTime = currentTime;

  currentRecipe.x = 0;
  currentRecipe.y = 0;
  currentRecipe.id = 0;

  if (state === "start") {
    cursor.update();
    state = ui.drawStartMenu() as stateType;
    tick += 1;
    requestAnimationFrame(TIC);
    return;
  }
  else if (state === "help") {
    cursor.update();
    state = ui.drawHelpMenu() as stateType;
    tick += 1;
    requestAnimationFrame(TIC);
    return;
  }

  if (state === 'firstLaunch') {
    cursor.update();
    state = ui.drawEndgameWindow(tick) as stateType;
    tick += 1;
    requestAnimationFrame(TIC);
    return;
  }
  
  // update_water_effect(time())
  render.drawBg("black");

  getVisibleEnts();
  // draw_terrain();

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

  updateEnts();
  drawEnts();
  if (!showMiniMap) {
    // TileMan.draw_clutter(player, 32, 21)
  }
  // particles()

  player.draw();

  let col = 5;
  if (cursor.r) { col = 2; }
  
  if (!showMiniMap) {
    // inv.draw();
    // craft_menu.draw();
    // if (ui.active_window) {
    //   if (ents[ui.active_window.entKey]) {
    //     ui.active_window.draw();
    //   }
    //   else {
    //     ui.active_window = null
    //   }
    // }
  }

  // draw_cursor();

  let totalEnts = 0;
  Object.entries(visEnts).forEach((value) => {
    const arr = value[1];
    totalEnts += arr.length;
  });

  // if (showMiniMap) {
  //   TileMan.draw_worldmap(player, 0, 0, 192, 109, true)
  //   pix(121, 69, 2)
  // }

  // local tile, wx, wy = get_world_cell(cursor.x, cursor.y)
  // local sx, sy = get_screen_cell(cursor.x, cursor.y)
  // local k
  // local _, wx, wy  = get_world_cell(cursor.tx, cursor.ty)
  // local k = wx .. '-' .. wy
  // if key(64) and ENTS[k] and not inv:is_hovered(cursor.x, cursor.y) then
  //   if ENTS[k].type == 'underground_belt_exit' then
  //     ENTS[ENTS[k].other_key]:draw_hover_widget(k)
  //   else
  //     k = get_ent(cursor.x, cursor.y)
  //     if ENTS[k] then ENTS[k]:draw_hover_widget() end
  //   end
  // end

  Object.entries(ents).forEach((value) => {
    const ent = value[1];
    
    if (!(ent instanceof WoodChest)) {
      ent.updated = false;
    }
    ent.drawn = false;
    ent.isHovered = false;

    if (ent instanceof TransportBelt) {
      ent.beltDrawn = false;
      ent.curveChecked = false;
    }
  });

  // if (show_tech) { draw_research_screen(); }
  // if (showTileWidget && ents[k] === undefined) { drawTileWidget(); }
  // if (currentRecipe.id > 0) { show_recipe_widget(); }
  
  // renderCursorProgress();
  // ui.updateAlerts();
  
  // updateRockets();
  // if (showHelp) { ui.drawHelpScreen(); }  

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();