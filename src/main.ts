import cursor from "./classes/cursor.js";
import Belt from "./classes/entities/belt.js";
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
let furnaceTick: number = 0;
let crafterTick: number = 0;

let delta: number = 0;
let lastTime: number = 0;
let state: string = "start";


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
    state = ui.drawStartMenu();
    tick += 1;
    requestAnimationFrame(TIC);
    return;
  }
  else if (state === "help") {
    cursor.update();
    state = ui.drawHelpMenu();
    tick += 1;
    requestAnimationFrame(TIC);
    return;
  }

  if (state === 'first_launch') {
    cursor.update();
    state = ui.drawEndgameWindow(tick);
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

  // if tick % DRILL_TICK_RATE == 0 then
  //   DRILL_BIT_TICK = DRILL_BIT_TICK + DRILL_BIT_DIR
  //   if DRILL_BIT_TICK > 7 or DRILL_BIT_TICK < 0 then DRILL_BIT_DIR = DRILL_BIT_DIR * -1 end
  //   DRILL_ANIM_TICK = DRILL_ANIM_TICK + 1
  //   if DRILL_ANIM_TICK > 2 then DRILL_ANIM_TICK = 0 end
  // end

  // if tick % FURNACE_ANIM_TICKRATE == 0 then
  //   FURNACE_ANIM_TICK = FURNACE_ANIM_TICK + 1
  //   for y = 0, 3 do
  //     set_sprite_pixel(490, 0, y, floor(math.random(2, 4)))
  //     set_sprite_pixel(490, 1, y, floor(math.random(2, 4)))
  //   end
  //   if FURNACE_ANIM_TICK > FURNACE_ANIM_TICKS then
  //     FURNACE_ANIM_TICK = 0
  //   end
  // end

  // if tick % CRAFTER_ANIM_RATE == 0 then
  //   CRAFTER_ANIM_FRAME = CRAFTER_ANIM_FRAME + CRAFTER_ANIM_DIR
  //   if CRAFTER_ANIM_FRAME > 5 then
  //     CRAFTER_ANIM_DIR = -1
  //   elseif CRAFTER_ANIM_FRAME < 1 then
  //     CRAFTER_ANIM_DIR = 1
  //   end
  // end

  // local ue_time = lapse(update_ents)
  // local de_time = lapse(draw_ents)
  // local dcl_time = 0
  // if not show_mini_map then
  //   local st_time = time()
  //   TileMan:draw_clutter(player, 32, 21)
  //   dcl_time = floor(time() - st_time)
  // end
  // particles()

  // draw_player()

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
  // local dc_time = lapse(draw_cursor)
  // local info = {
  //   [1] = 'draw_clutter: ' .. dcl_time,
  //   [2] = 'draw_terrain: ' .. m_time,
  //   [3] = 'update_player: ' .. up_time,
  //   [4] = 'handle_input: ' .. hi_time,
  //   [5] = 'draw_ents: ' .. de_time,
  //   [6] = 'update_ents:' .. ue_time,
  //   [7] = 'draw_cursor: ' .. dc_time,    
  //   [8] = 'draw_belt_items: ' .. db_time,
  //   [9] = 'get_vis_ents: ' .. gv_time,
  // }
  // local ents = 0
  // for k, v in pairs(vis_ents) do
  //   for _, ent in ipairs(v) do
  //     ents = ents + 1
  //   end
  // end

  // info[9] = 0
  // if show_mini_map then
  //   local st_time = time()
  //   TileMan:draw_worldmap(player, 0, 0, 192, 109, true)
  //   pix(121, 69, 2)
  //   info[9] = 'draw_worldmap: ' .. floor(time() - st_time) .. 'ms'
  // end

  // local tile, wx, wy = get_world_cell(cursor.x, cursor.y)
  // local sx, sy = get_screen_cell(cursor.x, cursor.y)
  // local k
  // info[10] = 'Frame Time: ' .. floor(time() - start) .. 'ms'
  // info[11] = 'Seed: ' .. seed
  // info[12] = 'hold time: ' .. cursor.hold_time
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
  // if debug then ui.draw_text_window(info, 2, 2, 'Debug - Y to toggle', 0, 2, 0, 4) end
  // if show_tile_widget and not ENTS[k] then draw_tile_widget() end
  // if current_recipe.id > 0 then
  //   show_recipe_widget()
  // end
  // render_cursor_progress()
  // ui.update_alerts()
  
  // update_rockets()
  // if show_help then ui:draw_help_screen() end
  // tick = tick + 1
  

  tick = tick + 1;
  requestAnimationFrame(TIC);
}


BOOT();