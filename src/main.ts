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
let state: stateType = "start";
let showTech: boolean = false;
let showHelp: boolean = false;
let showMiniMap: boolean = false;
let showTileWidget: boolean = false;
let altMode: boolean = false;


function screenToWorld(x: number, y: number): {x: number, y: number} {
  return {x: x + render.topLeft.x, y: y + render.topLeft.y};
}
// function getEnt(coord: string): undefined | string {
//   if (ents[coord] === undefined) {
//     return undefined;
//   }

//   // if ENTS[k].type == 'splitter' then return k end
//   // if ENTS[k].type == 'underground_belt_exit' then return ENTS[k].other_key, true end
//   // if ENTS[k].type == 'underground_belt' then return k end
//   // if ENTS[k].other_key then return ENTS[k].other_key else return k end
//   // return false;
// }
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

    if (ent !== undefined && !(ent instanceof WoodChest)) {
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
function dispatchKeypress(): void {
  if (keyboard.m) { showMiniMap = !showMiniMap; }
  if (keyboard.r) {
    if (keyboard.shift) {
      cursor.rotate('l');
    }
    else {
      cursor.rotate('r');
    }
  }
  // if (keyboard.q) { pipette(); }
  // if (keyboard.i && keyboard.tab) { inv.vis = !inv.vis; }
  // if (keyboard.h) { toggleHotbar(); }
  // if (keyboard.c) { toggleCrafting(); }
  showTileWidget = keyboard.shift;
  if (keyboard.alt) { altMode = !altMode; }
  // if (keyboard.shift && keyboard.ctrl) { showCount = !showCount; }
  if (keyboard.t) { showTech = !showTech; }
  // --0-9
  // for i = 1, INVENTORY_COLS do
  //   local key_n = 27 + i
  //   if keyp(key_n) then set_active_slot(i) end
  // end
}
function dispatchInput(): void {
  cursor.update();
  dispatchKeypress();

  if (showTech) { return; }

  const coord = screenToWorld(cursor.x, cursor.y);
  const ent = ents[`${coord.x}-${coord.y}`];
  if (ent !== undefined) { ent.isHovered = true; }
//   if cursor.sy ~= 0 then cycle_hotbar(cursor.sy*-1) end
  if (!cursor.l) {
    cursor.panelDrag = false;
    cursor.drag = false;
  }
  
//   --begin mouse-over priority dispatch
//   if ui.active_window and ui.active_window:is_hovered(cursor.x, cursor.y) then
//     if (cursor.l and not cursor.ll) or (cursor.r and not cursor.lr) then
//       if ui.active_window:click(cursor.x, cursor.y) then
//         --trace('clicked active window')
//       end
//     end
//     return
//   end
  
//   if craft_menu.vis and craft_menu:is_hovered(cursor.x, cursor.y) then
//     if cursor.l and not cursor.ll then
//       if craft_menu:click(cursor.x, cursor.y, 'left') then return end
//     elseif cursor.r and cursor.lr then
//       if craft_menu:click(cursor.x, cursor.y, 'right') then return end
//     end
//     if craft_menu.vis and cursor.panel_drag then
//       craft_menu.x = math.max(1, math.min(cursor.x + cursor.drag_offset.x, 239 - craft_menu.w))
//       craft_menu.y = math.max(1, math.min(cursor.y + cursor.drag_offset.y, 135 - craft_menu.h))
//       return
//       --consumed = true
//     end
//     if craft_menu.vis and not cursor.panel_drag and cursor.l and not cursor.ll and craft_menu:is_hovered(cursor.x, cursor.y) then
//       if craft_menu:click(cursor.x, cursor.y) then
//         return
//       elseif not craft_menu.docked then
//         cursor.panel_drag = true
//         cursor.drag_offset.x = craft_menu.x - cursor.x
//         cursor.drag_offset.y = craft_menu.y - cursor.y
//         return
//       end
//     end
//     return
//   end
  
//   if inv:is_hovered(cursor.x, cursor.y) then
//     if (cursor.l and not cursor.ll) or (cursor.r and not cursor.lr) then
//       inv:clicked(cursor.x, cursor.y)
//     end
//     return
//   end

  if (cursor.type === 'item' && cursor.itemStack.id !== 0) {
//     --check other visible widgets
    // const item = items[cursor.itemStack.id];
//     local count = cursor.item_stack.count
//     --check for ents to deposit item stack
//     if key(63) and ENTS[k] and ENTS[k].deposit_stack then
//       if cursor.r and not cursor.lr then
//         local result, stack = ENTS[k]:deposit_stack({id = cursor.item_stack.id, count = 1})
//         if result then
//           cursor.item_stack.count = cursor.item_stack.count - 1
//           if cursor.item_stack.slot then
//             inv.slots[cursor.item_stack.slot].count = inv.slots[cursor.item_stack.slot].count - 1
//             if inv.slots[cursor.item_stack.slot].count < 1 then
//               inv.slots[cursor.item_stack.slot].count = 0
//               inv.slots[cursor.item_stack.slot].id = 0
//             end
//           end
//           ui.new_alert(cursor.x, cursor.y, '-1 ' .. ITEMS[cursor.item_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           if cursor.item_stack.count < 1 then
//             set_cursor_item()
//           end
//         end
//       elseif cursor.l and not cursor.ll then
//         local result, stack = ENTS[k]:deposit_stack(cursor.item_stack)
//         local old_stack = {id = cursor.item_stack.id, count = cursor.item_stack.count}
//         if stack.count == 0 then
//           if cursor.item_stack.slot then
//             inv.slots[cursor.item_stack.slot].count = 0
//             inv.slots[cursor.item_stack.slot].id = 0
//           end
//           ui.new_alert(cursor.x, cursor.y, -old_stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           set_cursor_item()
//         else
//           ui.new_alert(cursor.x, cursor.y, '- ' .. (old_stack.count - stack.count) .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 6)
//           sound('deposit')
//           cursor.item_stack.count = stack.count
//           if cursor.item_stack.slot then
//             inv.slots[cursor.item_stack.slot].count = stack.count
//           end
//         end
//       end
//       return
//       --if item is placeable, run callback for item type
//       --checking transport_belt's first (for drag-placement), then other items
//     else
//       if cursor.l and cursor.item == 'transport_belt' and (cursor.tx ~= cursor.ltx or cursor.ty ~= cursor.lty)  then
//         --trace('placing belt')
//         local slot = cursor.item_stack.slot
//         local item_consumed = callbacks[cursor.item].place_item(cursor.x, cursor.y)
//         if slot and item_consumed then
//           inv.slots[slot].count = inv.slots[slot].count - 1
//           cursor.item_stack.count = inv.slots[slot].count
//         elseif item_consumed ~= false then
//           cursor.item_stack.count = cursor.item_stack.count - 1
//           if cursor.item_stack.count < 1 then
//             set_cursor_item()
//           end
//         end
//         if slot and inv.slots[slot].count < 1 then
//           inv.slots[slot].id = 0
//           inv.slots[slot].count = 0
//           set_cursor_item()
//         end
//         return
//       elseif cursor.l and not cursor.ll and ITEMS[cursor.item_stack.id].type == 'placeable' then
//         if callbacks[cursor.item] then
//           local item_consumed = callbacks[cursor.item].place_item(cursor.x, cursor.y)
//           if item_consumed ~= false then
//             cursor.item_stack.count = cursor.item_stack.count - 1
//             if cursor.item_stack.count < 1 then
//               set_cursor_item()
//             end
//             if cursor.item_stack.slot then
//               inv.slots[cursor.item_stack.slot].count = inv.slots[cursor.item_stack.slot].count - 1
//               if inv.slots[cursor.item_stack.slot].count < 1 then
//                 inv.slots[cursor.item_stack.slot].id = 0
//                 inv.slots[cursor.item_stack.slot].count = 0
//                 set_cursor_item()
//               end
//             end
//           end
//         end
//         return
//       elseif cursor.r then
//         --remove_tile(cursor.x, cursor.y)
//         return
//       end
//     end
  }
//   elseif cursor.type == 'pointer' then
//     if cursor.l and not cursor.ll and key(63) and ENTS[k] and ENTS[k].return_all then
//       --try to take all items
//       ENTS[k]:return_all()
//       return
//     end
//   end

//   if cursor.held_right and cursor.type == 'pointer' then
//     local sx, sy = get_screen_cell(cursor.x, cursor.y)
//     local tile, wx, wy = get_world_cell(cursor.x, cursor.y)
//     local result = resources[tostring(tile.sprite_id)]
//     local k = get_ent(cursor.x, cursor.y)
//     if not result and not tile.is_tree and not ENTS[k] and not tile.ore then cursor.prog = false return end
//     if tick % 4 == 0 then
//       local px, py = sx + 4, sy + 4
//       line(120, 67 + player.anim_frame, px, py, floor(math.random(1, 3) + 0.5))
//       for i = 1, 3 do
//         local rr = 1 + floor((math.random() + 0.5) * 4)
//         local rc = 1 + floor((math.random(6) + 0.5))
//         circb(px, py, rr, rc)
//       end
//     end
//     if tile.is_tree then
//       local c1, c2 = 3, 4
//       if tile.biome < 2 then c1, c2 = 2, 3 end
//       ui.highlight(cursor.tx - 9 + tile.offset.x, cursor.ty - 27 + tile.offset.y, 24, 32, false, c1, c2)
//       ui.highlight(cursor.tx + tile.offset.x - 2, cursor.ty - 1 + tile.offset.y, 8, 8, false, c1, c2)
//     end
//     if result or tile.ore or ENTS[k] then
//       ui.highlight(sx - 1, sy - 1, 8, 8, false, 3, 4)
//     end
//     if (ENTS[k] or tile.is_tree or tile.ore or result) then
//       sound('laser')
//       cursor.prog = remap(clamp(cursor.hold_time, 0, CURSOR_MINING_SPEED), 0, CURSOR_MINING_SPEED, 0, 9)
//       if cursor.prog >= 9 then
//         remove_tile(cursor.x, cursor.y)
//         cursor.prog = false
//         cursor.held_right = false
//         cursor.hold_time = 0
//         return
//       end
//     end
//   else
//     cursor.prog = false
//   end

//     --check for held item placement/deposit to other ents
//   if cursor.l and not cursor.ll and not craft_menu:is_hovered(cursor.x, cursor.y) and inv:is_hovered(cursor.x, cursor.y) then
//     local slot = inv:get_hovered_slot(cursor.x, cursor.y)
//     if slot then
//       inv.slots[slot.index]:callback()
//       return
//     end
//   end

//   if cursor.l and not cursor.ll and ENTS[k] then

//     if dummies[ENTS[k].type] then
//       k = ENTS[k].other_key
//     end

//     if opensies[ENTS[k].type] then
//       if key(63) and cursor.type == 'pointer' then
        
//       end
//       if key(64) and cursor.type == 'item' and ENTS[k].deposit_stack then
//         local old_stack = cursor.item_stack
//         local result, stack = ENTS[k]:deposit_stack(cursor.item_stack)
//         if result then
//           if stack then
//             if stack.count > 0 then
//               cursor.item_stack.count = stack.count
//             else
//               cursor.item_stack = {id = 0, count = 0, slot = false}
//               cursor.type = 'pointer'
//             end
//             sound('deposit')
//             ui.new_alert(cursor.x, cursor.y, stack.count - old_stack.count .. ' ' .. ITEMS[old_stack.id].fancy_name, 1000, 0, 2)
//           end
//         end
//       else
//         ui.active_window = ENTS[k]:open()
//       end
//     end
//     return
//   end
// end
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
  
  // updateWaterEffect(time());
  render.drawBg("black");

  getVisibleEnts();
  // tileman.drawTerrain();

  player.update(delta, tick, {w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d}, cursor.prog);
  dispatchInput();

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
    // tileman.drawClutter(player, 32, 21);
  }
  // particles();

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
    //     ui.active_window = null;
    //   }
    // }
  }

  // drawCursor();

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
    if (ent !== undefined) {
    
      if (!(ent instanceof WoodChest)) {
        ent.updated = false;
      }
      ent.drawn = false;
      ent.isHovered = false;

      if (ent instanceof TransportBelt) {
        ent.beltDrawn = false;
        ent.curveChecked = false;
      }}
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