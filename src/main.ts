import cursor from "./classes/cursor.js";
import BaseEntity from "./classes/entities/base_entity.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import keyboard from "./classes/keyboard.js";
import player from "./classes/player.js";
import render from "./classes/render.js";
import ui from "./classes/ui.js";
import MiningDrill from "./classes/entities/mining_drill.js";
import TransportBelt from "./classes/entities/transport_belt.js";
import AssemblyMachine from "./classes/entities/assembly_machine.js";


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


const tileScale = 5;
const tileSize = 8 * tileScale;
const currentRecipe = {x: 0, y: 0, id: 0}; 
const ents: { [index: string]: BaseEntity} = {};
const visEnts: { [index: string]: Array<string>} = {
  transport_belt: [],
  inserter: [],
  splitter: [],
  mining_drill: [],
  stone_furnace: [],
  underground_belt: [],
  assembly_machine: [],
  research_lab: [],
  chest: [],
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

type stateType = "start" | "help" | "firstLaunch";
let state: stateType = "start";
let showHelp: boolean = false;


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

    if (ent instanceof MiningDrill && tick % MiningDrill.tickRate === 0) {
      ent.update()
    }
    else if (ent instanceof StoneFurnace && tick % StoneFurnace.tickRate === 0) {
      ent.update();
    }
    else if (ent instanceof TransportBelt && tick % TransportBelt.tickRate === 0) {
      ent.update();
    }
    else if (ent instanceof UndergroundBelt && tick % UndergroundBelt.tickRate === 0) {
      ent.update();
    }
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
  // dispatchInput(delta);

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
  // draw_ents();
  // if not show_mini_map then
  //   local st_time = time()
  //   TileMan.draw_clutter(player, 32, 21)
  //   dcl_time = floor(time() - st_time)
  // end
  // particles()

  player.draw();

  // local x, y, l, m, r = mouse()
  // local col = 5
  // if r then col = 2 end
  // if not show_mini_map then
  //   inv:draw()
  //   craft_menu:draw()
  //   if ui.active_window then
  //     if ENTS[ui.active_window.ent_key] then
  //       ui.active_window:draw()
  //     else
  //       ui.active_window = nil
  //     end
  //   end
  // end

  // draw_cursor();

  // local ents = 0
  // for k, v in pairs(vis_ents) do
  //   for _, ent in ipairs(v) do
  //     ents = ents + 1
  //   end
  // end

  // if show_mini_map then
  //   TileMan.draw_worldmap(player, 0, 0, 192, 109, true)
  //   pix(121, 69, 2)
  // end

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
  // for k, v in pairs(ENTS) do
  //   v.updated = false
  //   v.drawn = false
  //   v.is_hovered = false
  //   if v.type == 'transport_belt' then v.belt_drawn = false; v.curve_checked = false; end
  // end
  // if show_tech then draw_research_screen() end
  // if show_tile_widget and not ENTS[k] then draw_tile_widget() end
  // if current_recipe.id > 0 then
  //   show_recipe_widget()
  // end
  // render_cursor_progress()
  // ui.update_alerts()
  
  // update_rockets()
  // if (showHelp) {ui.drawHelpScreen();}  

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();