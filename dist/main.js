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
const currentRecipe = { x: 0, y: 0, id: 0 };
let tick = 0;
let beltTick = 0;
let uBeltTick = 0;
let drillTick = 0;
let drillBitTick = 0;
let drillBitDir = 1;
let drillAnimTick = 0;
let furnaceTick = 0;
let furnaceAnimTick = 0;
let crafterTick = 0;
let crafterAnimTick = 0;
let crafterAnimDir = 1;
let delta = 0;
let lastTime = 0;
let state = "start";
function BOOT() {
    TIC(1);
}
function TIC(currentTime) {
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
    if (state === 'firstLaunch') {
        cursor.update();
        state = ui.drawEndgameWindow(tick);
        tick += 1;
        requestAnimationFrame(TIC);
        return;
    }
    render.drawBg("black");
    player.update(delta, tick, { w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d }, cursor.prog);
    if (tick % Belt.tickRate === 0) {
        beltTick += 1;
        if (beltTick > Belt.maxTick) {
            beltTick = 0;
        }
    }
    if (tick % UndergroundBelt.tickRate === 0) {
        uBeltTick += 1;
        if (beltTick > UndergroundBelt.maxTick) {
            uBeltTick = 0;
        }
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
    player.draw();
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
