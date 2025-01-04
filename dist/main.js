import { Render } from "./classes/render.js";
import { Player } from "./classes/player.js";
import { Cursor } from "./classes/cursor.js";
import { Keyboard } from "./classes/keyboard.js";
import { Label } from "./classes/label.js";
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
const RENDER = new Render("mainCanvas");
const CURSOR = new Cursor("mainCanvas");
const KEYBOARD = new Keyboard();
const PLAYER = new Player(RENDER);
let tick = 0;
let state = "start";
function gameLoop() {
    RENDER.drawBg("black");
    PLAYER.update(tick, KEYBOARD, CURSOR);
    PLAYER.draw(RENDER.canvas.width / 2, RENDER.canvas.height / 2);
}
function mainMenuLoop() {
    RENDER.drawBg("gray");
    const middleScreen = {
        x: RENDER.canvas.width / 2, y: RENDER.canvas.height / 2
    };
    if (RENDER.drawTextButton(CURSOR, middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", { x: 0, y: 2 }), false)) {
        state = "game";
    }
    if (RENDER.drawTextButton(CURSOR, middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", { x: 0, y: 2 }), false)) {
        state = 'help';
    }
}
function helpMenuLoop() {
    RENDER.drawBg("gray");
    const middleScreen = {
        x: RENDER.canvas.width / 2, y: RENDER.canvas.height / 2
    };
    const info = [
        ['W A S D', 'Move PLAYER'],
        ['ESC', 'Exit game'],
        ['CTRL + R', 'Reload game'],
        ['I or TAB', 'Toggle inventory window'],
        ['C', 'Toggle crafting window'],
        ['T', 'Toggle research window'],
        ['R', 'Rotate held item or hovered object'],
        ['Q', 'Pipette tool - copy/swap objects'],
        ['Left-click', 'Place/deposit item/open machine'],
        ['Right-click hold', 'Mine resource or destroy object'],
        ['Scroll +/-', 'Scroll active hotbar slot']
    ];
    const panelCoords = {
        x: middleScreen.x - 250,
        y: middleScreen.y - 150,
        w: 500, h: 300
    };
    RENDER.drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", { x: 0, y: 0 }));
    for (let i = 0; i < info.length; i++) {
        RENDER.drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
        RENDER.drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
    }
    if (RENDER.drawTextButton(CURSOR, middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", { x: 0, y: 2 }), false)) {
        state = 'start';
    }
}
function BOOT() {
    RENDER.resizeCanvas();
    TIC();
}
function TIC() {
    CURSOR.update();
    if (state === "start") {
        mainMenuLoop();
    }
    else if (state === "help") {
        helpMenuLoop();
    }
    else if (state === "game") {
        gameLoop();
    }
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
