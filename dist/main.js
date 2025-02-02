import render from "./engine/render.js";
import ui from "./scripts/ui.js";
import playerInv from "./scripts/playerInv.js";
import craftMenu from "./scripts/craftMenu.js";
import cursor from "./engine/cursor.js";
import StoneFurnace from "./scripts/entities/stone_furnace.js";
import UndergroundBelt from "./scripts/entities/undergroundBelt.js";
import MiningDrill from "./scripts/entities/mining_drill.js";
import TransportBelt from "./scripts/entities/transport_belt.js";
import AssemblyMachine from "./scripts/entities/assembly_machine.js";
import WoodChest from "./scripts/entities/wood_chest.js";
import { entities, items } from "./scripts/definitions.js";
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
let tileSize = 8 * 4;
const ents = {
    "wood_chest": new Map(),
    "stone_furnace": new Map(),
    "assembly_machine": new Map(),
};
const gridData = new Map();
const tickRate = 1000 / 60;
let tick = 0;
let acumulator = 0;
let beltTick = 0;
let uBeltTick = 0;
let drillTick = 0;
let drillBitTick = 0;
let drillBitDir = 1;
let drillAnimTick = 0;
let furnaceAnimTick = 0;
let crafterAnimTick = 0;
let crafterAnimDir = 1;
let delta = 0;
let lastTime = 0;
let state = "game";
let secodWindowMode = "craft";
window.addEventListener("mousedown", (ev) => {
    const cursorGlobalPos = screenToWorld(cursor.x, cursor.y, true);
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
    if (ev.button === 0 && placeEnt(cursor.itemStack.name, { x: cursorGlobalPos.x, y: cursorGlobalPos.y })) {
        cursor.itemStack.quant -= 1;
        cursor.checkStack();
    }
    else if (ev.button === 2) {
        const name = removeEnt({ ...screenToWorld(cursor.x, cursor.y, true) });
        if (name !== undefined) {
            playerInv.depositStack(0, name, 1, true);
        }
    }
});
window.addEventListener("keydown", (ev) => {
    if (ev.key === "i" || ev.key === "Tab") {
        playerInv.visible = !playerInv.visible;
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
function placeEnt(name, globalPos) {
    const ent = entities[name];
    if (ent === undefined) {
        return false;
    }
    for (let x = 0; x < ent.sizeInTiles.w; x++) {
        for (let y = 0; y < ent.sizeInTiles.h; y++) {
            const key = `${globalPos.x + (x * tileSize)}-${globalPos.y + (y * tileSize)}`;
            if (gridData.has(key)) {
                return false;
            }
        }
    }
    for (let x = 0; x < ent.sizeInTiles.w; x++) {
        for (let y = 0; y < ent.sizeInTiles.h; y++) {
            const key = `${globalPos.x + (x * tileSize)}-${globalPos.y + (y * tileSize)}`;
            gridData.set(key, [name, `${globalPos.x}-${globalPos.y}`]);
        }
    }
    const key = `${globalPos.x}-${globalPos.y}`;
    switch (name) {
        case "wood_chest": {
            ents.wood_chest.set(key, new WoodChest({ ...globalPos }));
            return true;
        }
        case "assembly_machine": {
            ents.assembly_machine.set(key, new AssemblyMachine({ ...globalPos }));
            return true;
        }
        case "stone_furnace": {
            ents.stone_furnace.set(key, new StoneFurnace({ ...globalPos }));
            return true;
        }
    }
    return false;
}
function removeEnt(globalPos) {
    const posKey = `${globalPos.x}-${globalPos.y}`;
    if (gridData.has(posKey)) {
        const mouseTile = gridData.get(posKey);
        const entData = entities[mouseTile[0]];
        const ent = ents[mouseTile[0]].get(mouseTile[1]);
        if (ent !== undefined && entData !== undefined) {
            for (let x = 0; x < entData.sizeInTiles.w; x++) {
                for (let y = 0; y < entData.sizeInTiles.h; y++) {
                    const key = `${ent.globalPos.x + (x * tileSize)}-${ent.globalPos.y + (y * tileSize)}`;
                    gridData.delete(key);
                }
            }
            ents[mouseTile[0]].delete(mouseTile[1]);
            return mouseTile[0];
        }
    }
    return undefined;
}
function updateEnts() {
    Object.entries(ents).forEach((value) => {
        value[1].forEach((ent) => {
            if (ent instanceof WoodChest) {
                return;
            }
            ent.update();
        });
    });
}
function drawEnts() {
    Object.entries(ents).forEach((value) => {
        value[1].forEach((ent) => {
            ent.draw();
        });
    });
}
function startMenuLoop() {
    state = ui.drawStartMenu();
}
function helpMenuLoop() {
    state = ui.drawHelpMenu();
}
function gameLoop() {
    const now = performance.now();
    delta = now - lastTime;
    lastTime = now;
    acumulator += delta;
    render.drawText(`FPS: ${Number(1 / (delta / 1000)).toFixed(2)}`, 5, 5, 30, "white", "top", "left");
    render.drawText(`Cursor.Item: ${cursor.itemStack.name || "null"}, quant: ${cursor.itemStack.quant}`, 5, 35, 30, "white", "top", "left");
    let totalEnts = 0;
    Object.entries(ents).forEach((value) => {
        const map = value[1];
        totalEnts += map.size;
    });
    render.drawText(`Total Ents: ${totalEnts}`, 5, 65, 30, "white", "top", "left");
    const totalGridData = gridData.size;
    render.drawText(`Total Grid Data: ${totalGridData}`, 5, 95, 30, "white", "top", "left");
    while (acumulator >= tickRate) {
        if (tick % TransportBelt.tickRate === 0) {
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
        if (entities[cursor.itemStack.name] !== undefined && !playerInv.visible) {
            const ent = entities[cursor.itemStack.name];
            const pos = screenToWorld(cursor.x, cursor.y, true);
            render.drawSprite("staticSprite", 4, pos.x, pos.y, ent.atlasCoord.x, ent.atlasCoord.y, ent.sizeInPixels.w, ent.sizeInPixels.h);
        }
        else if (items[cursor.itemStack.name] !== undefined) {
            render.drawItemStack(cursor.itemStack.name, 3, cursor.x, cursor.y, cursor.itemStack.quant, false);
        }
    }
}
function BOOT() {
    TIC();
}
function TIC() {
    render.drawBg("black");
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
