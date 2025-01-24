import render from "./classes/render.js";
import ui from "./classes/ui.js";
import keyboard from "./classes/keyboard.js";
import cursor from "./classes/cursor.js";
import player from "./classes/player.js";
import inv from "./classes/inventory.js";
import StoneFurnace from "./classes/entities/stone_furnace.js";
import UndergroundBelt from "./classes/entities/undergroundBelt.js";
import MiningDrill from "./classes/entities/mining_drill.js";
import AssemblyMachine from "./classes/entities/assembly_machine.js";
import WoodChest from "./classes/entities/wood_chest.js";
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
let tileSize = 8 * 4;
const ents = {
    assembly_machine: new Map(),
    wood_chest: new Map(),
};
const gridData = new Map();
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
window.addEventListener("mousedown", () => {
    const globalPos = screenToWorld(cursor.x, cursor.y, true);
    if (inv.isHovered(cursor.x, cursor.y)) {
        if (cursor.l || cursor.r) {
            inv.click(cursor.x, cursor.y);
        }
        return;
    }
});
window.addEventListener("keydown", (ev) => {
    if (ev.key === "i" || ev.key === "Tab") {
        inv.visible = !inv.visible;
    }
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
function placeEnt(type, globalPos) {
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
            break;
        }
    }
    return false;
}
function removeEnt(globalPos) {
    const mouseKey = `${globalPos.x}-${globalPos.y}`;
    if (gridData.has(mouseKey)) {
        const mouseTile = gridData.get(mouseKey);
        switch (mouseTile[0]) {
            case "wood_chest": {
                ents.wood_chest.delete(mouseKey);
                gridData.delete(mouseKey);
                break;
            }
            case "assembly_machine": {
                const machine = ents.assembly_machine.get(mouseTile[1]);
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
function updateEnts() {
    ents.assembly_machine.forEach((machine) => {
        machine.update();
    });
}
function drawEnts() {
    ents.wood_chest.forEach((chest) => {
        chest.draw();
    });
    ents.assembly_machine.forEach((machine) => {
        machine.draw();
    });
}
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
    updateEnts();
    drawEnts();
    player.draw();
    inv.draw();
    if (cursor.type === "item") {
        render.drawItemStack(cursor.itemStack.name, 3, cursor.x, cursor.y, cursor.itemStack.quant, false);
    }
    render.drawText(`total ents: ${ents.assembly_machine.size + ents.wood_chest.size}`, 50, 50, 30, "white", "top", "left");
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
