import cursor from "./classes/cursor.js";
import Belt from "./classes/entities/belt.js";
import Crafter from "./classes/entities/crafter.js";
import Drill from "./classes/entities/drill.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import keyboard from "./classes/keyboard.js";
import player from "./classes/player.js";
import render from "./classes/render.js";
import ui from "./classes/ui.js";


window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});


const currentRecipe = {x: 0, y: 0, id: 0}; 

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


// function dispatchInput(delta: number): void {}


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

  // get_visible_ents();
  // draw_terrain();

  player.update(delta, tick, {w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d}, cursor.prog);
  // dispatchInput(delta);

  if (tick % Belt.tickRate === 0) {
    beltTick += 1;
    if (beltTick > Belt.maxTick) { beltTick = 0; }
  }

  if (tick % UndergroundBelt.tickRate === 0) {
    uBeltTick += 1;
    if (beltTick > UndergroundBelt.maxTick) { uBeltTick = 0; }
  }

  if (tick % Drill.tickRate === 0) {
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

  if (tick % Crafter.animTickRate === 0) {
    crafterAnimTick = crafterAnimTick + crafterAnimDir;
    
    if (crafterAnimTick > 5) {
      crafterAnimDir = -1;
    }
    else if (crafterAnimTick < 1) {
      crafterAnimDir = 1;
    }
  }

  // update_ents();
  // draw_ents();
  // if not show_mini_map then
  //   local st_time = time()
  //   TileMan:draw_clutter(player, 32, 21)
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
  //   TileMan:draw_worldmap(player, 0, 0, 192, 109, true)
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
  // if show_help then ui:draw_help_screen() end
  

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();