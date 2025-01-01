"use strict";
const CVS = document.getElementById("mainCanvas");
const CTX = CVS.getContext("2d");
window.addEventListener("resize", resizeCanvas);
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
window.addEventListener("mousemove", (ev) => {
    const rect = CVS.getBoundingClientRect();
    CURSOR.x = ev.clientX - rect.left;
    CURSOR.y = ev.clientY - rect.top;
});
window.addEventListener("mousedown", (ev) => {
    if (ev.button === 0) {
        CURSOR.l = true;
    }
    if (ev.button === 1) {
        CURSOR.m = true;
    }
    if (ev.button === 2) {
        CURSOR.r = true;
    }
});
window.addEventListener("mouseup", (ev) => {
    if (ev.button === 0) {
        CURSOR.l = false;
    }
    if (ev.button === 1) {
        CURSOR.m = false;
    }
    if (ev.button === 2) {
        CURSOR.r = false;
    }
});
window.addEventListener("keydown", (ev) => {
    if (ev instanceof KeyboardEvent) {
        if (KEYBOARD[ev.key] !== undefined) {
            KEYBOARD[ev.key] = true;
        }
    }
});
window.addEventListener("keyup", (ev) => {
    if (ev instanceof KeyboardEvent) {
        if (KEYBOARD[ev.key] !== undefined) {
            KEYBOARD[ev.key] = false;
        }
    }
});
class Label {
    text;
    fg;
    bg;
    shadow;
    constructor(txt, bg, fg, shadow) {
        this.text = txt;
        this.fg = fg;
        this.bg = bg;
        this.shadow = { ...shadow };
    }
}
const KEYBOARD = {
    "shift": false,
    "alt": false,
    "ctrl": false,
    "tab": false,
    "w": false,
    "a": false,
    "s": false,
    "d": false,
    "f": false,
    "g": false,
    "m": false,
    "r": false,
    "q": false,
    "i": false,
    "h": false,
    "c": false,
    "y": false,
    "e": false,
    "t": false,
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "9": false,
};
const CURSOR = {
    x: 0, y: 0, lx: 8, ly: 8,
    tx: 8, ty: 8, wx: 0, wy: 0,
    sx: 0, sy: 0, lsx: 0, lsy: 0,
    l: false, ll: false, m: false, lm: false,
    r: false, lr: false, prog: false, rot: 0,
    held_left: false, held_right: false, ltx: 0, lty: 0,
    last_rotation: 0, hold_time: 0, type: 'pointer', item: 'transport_belt',
    drag: false, panel_drag: false, drag_dir: 0, drag_loc: { x: 0, y: 0 },
    hand_item: { id: 0, count: 0 }, drag_offset: { x: 0, y: 0 }, item_stack: { id: 9, count: 100 }
};
let tick = 0;
let state = "start";
function hovered(mouse, box) {
    return (mouse.x >= box.x &&
        mouse.x <= box.x + box.w &&
        mouse.y >= box.y &&
        mouse.y <= box.y + box.h);
}
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const width = windowWidth;
    const height = (windowWidth / 16) * 9;
    if (height > windowHeight) {
        CVS.height = windowHeight;
        CVS.width = (windowHeight / 9) * 16;
    }
    else {
        CVS.width = width;
        CVS.height = height;
    }
    drawBg("black");
}
function drawRect(x, y, w, h, fillColor, strokeColor) {
    CTX.strokeStyle = strokeColor;
    CTX.fillStyle = fillColor;
    CTX.fillRect(x, y, w, h);
}
function drawLine(x1, y1, x2, y2, strokeColor) {
    CTX.strokeStyle = strokeColor;
    CTX.moveTo(x1, y1);
    CTX.lineTo(x2, y2);
}
function drawPanel(x, y, w, h, bg, fg, shadow_color, label) {
    drawRect(x, y, w, h, bg, bg);
    drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center");
}
function drawText(text, x, y, fontSize, color, baseLine, textAling) {
    CTX.textBaseline = baseLine;
    CTX.textAlign = textAling;
    CTX.font = `${fontSize}px Arial`;
    CTX.strokeStyle = color;
    CTX.fillStyle = color;
    CTX.fillText(text, x, y);
}
function drawTextButton(x, y, width, height, main_color, shadow_color, hover_color, label, locked) {
    const middle = { x: x + (width / 2), y: y + (height / 2) };
    const hov = (!locked &&
        hovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height }));
    if (!locked && hov && !CURSOR.l) {
        drawRect(x, y, width, height, hover_color, hover_color);
    }
    else if (!locked && hov && CURSOR.l) {
        drawRect(x, y, width, height, hover_color, hover_color);
    }
    else {
        drawRect(x, y, width, height, main_color, main_color);
    }
    drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
    drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
    if (hov && CURSOR.l) {
        return true;
    }
    return false;
}
function drawBg(color) {
    CTX.fillStyle = color;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
}
function clearScreen() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
}
function mainMenuLoop() {
    drawBg("gray");
    const middleScreen = {
        x: CVS.width / 2, y: CVS.height / 2
    };
    if (drawTextButton(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", new Label("Start", "black", "white", { x: 0, y: 2 }), false)) {
        state = "game";
    }
    if (drawTextButton(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", new Label("Controls", "black", "white", { x: 0, y: 2 }), false)) {
        state = 'help';
    }
}
function helpMenuLoop() {
    drawBg("gray");
    const middleScreen = {
        x: CVS.width / 2, y: CVS.height / 2
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
    drawPanel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", "black", new Label("Controls", "black", "black", { x: 0, y: 0 }));
    for (let i = 0; i < info.length; i++) {
        drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
        drawText(info[i][0], panelCoords.x + panelCoords.w + 5, panelCoords.y + (i * 20) - 5, 20, "black", "top", "right");
    }
    if (drawTextButton(panelCoords.x, panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", { x: 0, y: 2 }), false)) {
        state = 'start';
    }
}
function BOOT() {
    resizeCanvas();
    TIC();
}
function TIC() {
    if (state === "start") {
        mainMenuLoop();
    }
    else if (state === "help") {
        helpMenuLoop();
    }
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
