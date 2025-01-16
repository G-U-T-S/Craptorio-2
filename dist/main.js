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
const currentRecipe = { x: 0, y: 0, id: 0 };
let tick = 0;
let beltTick = 0;
let uBeltTick = 0;
let drillTick = 0;
let furnaceTick = 0;
let crafterTick = 0;
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
    if (state === 'first_launch') {
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
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
