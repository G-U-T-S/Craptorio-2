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
const currentRecipe = { x: 0, y: 0, id: 0 };
const ents = {};
const visEnts = {
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
let showTech = false;
let showHelp = false;
let showMiniMap = false;
let showTileWidget = false;
let altMode = false;
function screenToWorld(x, y) {
    return { x: x + render.topLeft.x, y: y + render.topLeft.y };
}
function getVisibleEnts() {
    Object.entries(visEnts).forEach((value) => {
        const index = value[0];
        visEnts[index] = [];
    });
    for (let worldX = render.topLeft.x - tileSize; worldX < render.topLeft.x + render.canvas.width; worldX++) {
        if (worldX % tileSize !== 0) {
            continue;
        }
        for (let worldY = render.topLeft.y - tileSize; worldY < render.topLeft.y + render.canvas.height; worldY++) {
            if (worldY % tileSize !== 0) {
                continue;
            }
            const coord = worldX + '-' + worldY;
            if (ents[coord] !== undefined && visEnts[ents[coord].type] !== undefined) {
                const type = ents[coord].type;
                visEnts[type].push(coord);
            }
        }
    }
}
function updateEnts() {
    Object.entries(ents).forEach((value) => {
        const ent = value[1];
        if (ent !== undefined && !(ent instanceof WoodChest)) {
            ent.update();
        }
    });
}
function drawEnts() {
    if (showMiniMap || showHelp || state !== 'game') {
        return;
    }
    visEnts.transport_belt.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.transport_belt.forEach((coord) => {
        if (ents[coord] !== undefined) {
            const belt = ents[coord];
            belt.drawItems();
        }
    });
    visEnts.underground_belt.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.underground_belt.forEach((coord) => {
        if (ents[coord] !== undefined) {
            const uBelt = ents[coord];
            uBelt.drawItems();
        }
    });
    visEnts.stone_furnace.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.splitter.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.mining_drill.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.assembly_machine.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.research_lab.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.wood_chest.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.rocket_silo.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.bio_refinary.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
    visEnts.inserter.forEach((coord) => {
        if (ents[coord] !== undefined) {
            ents[coord].draw();
        }
    });
}
function dispatchKeypress() {
    if (keyboard.m) {
        showMiniMap = !showMiniMap;
    }
    if (keyboard.r) {
        if (keyboard.shift) {
            cursor.rotate('l');
        }
        else {
            cursor.rotate('r');
        }
    }
    showTileWidget = keyboard.shift;
    if (keyboard.alt) {
        altMode = !altMode;
    }
    if (keyboard.t) {
        showTech = !showTech;
    }
}
function dispatchInput() {
    cursor.update();
    dispatchKeypress();
    if (showTech) {
        return;
    }
    const coord = screenToWorld(cursor.x, cursor.y);
    const ent = ents[`${coord.x}-${coord.y}`];
    if (ent !== undefined) {
        ent.isHovered = true;
    }
    if (!cursor.l) {
        cursor.panelDrag = false;
        cursor.drag = false;
    }
    if (cursor.type === 'item' && cursor.itemStack.id !== 0) {
    }
}
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
    getVisibleEnts();
    player.update(delta, tick, { w: keyboard.w, a: keyboard.a, s: keyboard.s, d: keyboard.d }, cursor.prog);
    dispatchInput();
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
    if (!showMiniMap) {
    }
    player.draw();
    let col = 5;
    if (cursor.r) {
        col = 2;
    }
    if (!showMiniMap) {
    }
    let totalEnts = 0;
    Object.entries(visEnts).forEach((value) => {
        const arr = value[1];
        totalEnts += arr.length;
    });
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
            }
        }
    });
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
