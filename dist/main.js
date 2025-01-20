import render from "./classes/render.js";
import ui from "./classes/ui.js";
import keyboard from "./classes/keyboard.js";
import cursor from "./classes/cursor.js";
import player from "./classes/player.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import MiningDrill from "./classes/entities/mining_drill.js";
import AssemblyMachine from "./classes/entities/assembly_machine.js";
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
let tileSize = 8 * 4;
const ents = {
    assembly_machine: new Map(),
    wood_chest: new Map(),
};
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
let state = "game";
let showTech = false;
let showHelp = false;
let showMiniMap = false;
let showTileWidget = false;
let altMode = false;
cursor.addMouseDownListener(() => {
    const pos = screenToWorld(cursor.x, cursor.y, true);
    placeEnt("assembly_machine", pos.x, pos.y);
});
function screenToWorld(x, y, snapToGrid) {
    const worldPos = { x: x + render.topLeft.x, y: y + render.topLeft.y };
    if (snapToGrid) {
        return {
            x: Math.floor(worldPos.x / tileSize) * tileSize,
            y: Math.floor(worldPos.y / tileSize) * tileSize
        };
    }
    return { ...worldPos };
}
function canPlace(type, posX, posY, sizeInTiles) {
    for (let x = 0; x < sizeInTiles.x; x++) {
        for (let y = 0; y < sizeInTiles.y; y++) {
            const key = `${posX + (x * tileSize)}-${posY + (y * tileSize)}`;
            switch (type) {
                case "wood_chest": {
                    if (ents.wood_chest.has(key)) {
                        return false;
                    }
                    break;
                }
                case "assembly_machine": {
                    if (ents.assembly_machine.has(key)) {
                        return false;
                    }
                    break;
                }
            }
        }
    }
    return true;
}
function placeEnt(type, globalX, globalY) {
    switch (type) {
        case "wood_chest": {
            break;
        }
        case "assembly_machine": {
            break;
        }
    }
    return false;
}
function removeEnt() { }
function startMenuLoop() {
    state = ui.drawStartMenu();
}
function helpMenuLoop() {
    state = ui.drawHelpMenu();
}
function gameLoop() {
    player.update(delta, tick, { w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d }, cursor.prog);
    if (tick % UndergroundBelt.tickRate === 0) {
        beltTick += 1;
        if (beltTick > UndergroundBelt.maxTick) {
            beltTick = 0;
        }
    }
    if (tick % UndergroundBelt.tickRate === 0) {
        uBeltTick += 1;
        if (beltTick > UndergroundBelt.maxTick) {
            uBeltTick = 0;
        }
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
    ents.assembly_machine.forEach((machine) => {
        machine.draw();
    });
    player.draw();
    render.drawText(`machine quant: ${ents.assembly_machine.size}`, 50, 50, 30, "white", "top", "left");
}
function BOOT() {
    TIC(1);
}
function TIC(currentTime) {
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
