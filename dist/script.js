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
class Player {
    x;
    y;
    lx;
    ly;
    anim_frame;
    anim_speed;
    anim_dir;
    anim_max;
    last_dir;
    move_speed;
    directions;
    constructor() {
        this.x = 0, this.y = 0;
        this.lx = 0, this.ly = 0;
        this.anim_frame = 0;
        this.anim_speed = 8;
        this.anim_dir = 0;
        this.anim_max = 4;
        this.last_dir = "0,0";
        this.move_speed = 1.9;
        this.directions = {
            '0,0': { id: 362, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
            '0,-1': { id: 365, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
            '0,1': { id: 365, flip: 2, rot: 0, dust: { x: 4, y: -2 } },
            '-1,0': { id: 363, flip: 1, rot: 0, dust: { x: 11, y: 5 } },
            '1,0': { id: 363, flip: 0, rot: 0, dust: { x: -2, y: 5 } },
            '1,-1': { id: 364, flip: 0, rot: 0, dust: { x: -2, y: 10 } },
            '-1,-1': { id: 364, flip: 1, rot: 0, dust: { x: 10, y: 10 } },
            '-1,1': { id: 364, flip: 3, rot: 0, dust: { x: 10, y: -2 } },
            '1,1': { id: 364, flip: 2, rot: 0, dust: { x: -2, y: -2 } }
        };
    }
    update() {
        if (tick % PLAYER.anim_speed === 0) {
            if (PLAYER.anim_dir === 0) {
                PLAYER.anim_frame = PLAYER.anim_frame + 1;
                if (PLAYER.anim_frame > PLAYER.anim_max) {
                    PLAYER.anim_dir = 1;
                    PLAYER.anim_frame = PLAYER.anim_max;
                }
            }
            else {
                PLAYER.anim_frame = PLAYER.anim_frame - 1;
                if (PLAYER.anim_frame < 0) {
                    PLAYER.anim_dir = 0;
                    PLAYER.anim_frame = 0;
                }
            }
        }
        PLAYER.lx = PLAYER.x;
        PLAYER.ly = PLAYER.y;
        let x_dir = 0;
        let y_dir = 0;
        if (KEYBOARD["w"]) {
            y_dir = -1;
        }
        if (KEYBOARD["s"]) {
            y_dir = 1;
        }
        if (KEYBOARD["a"]) {
            x_dir = -1;
        }
        if (KEYBOARD["d"]) {
            x_dir = 1;
        }
        if (!CURSOR.prog) {
            if (x_dir !== 0 || y_dir !== 0) {
                this.move(x_dir * PLAYER.move_speed, y_dir * PLAYER.move_speed);
            }
        }
        PLAYER.last_dir = `${x_dir},${y_dir}`;
    }
    move(x, y) {
        PLAYER.x = PLAYER.x + x;
        PLAYER.y = PLAYER.y + y;
    }
    draw() {
        switch (this.last_dir) {
            case "-1,0": {
                break;
            }
            case "-1,1": {
                break;
            }
            case "-1,-1": {
                break;
            }
            case "0,0": {
                drawSprite("sprites", this.x, this.y, 0, 32);
                break;
            }
            case "0,1": {
                break;
            }
            case "0,-1": {
                break;
            }
            case "1,0": {
                drawSprite("sprites", this.x, this.y, 8, 32);
                break;
            }
            case "1,1": {
                break;
            }
            case "1,-1": {
                break;
            }
        }
    }
}
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
const PLAYER = new Player();
const spriteAtlas = new Image();
spriteAtlas.src = "./assets/sprites.png";
const tilesAtlas = new Image();
tilesAtlas.src = "./assets/tiles.png";
let tick = 0;
let state = "start";
let integerScale = true;
function isHovered(mouse, box) {
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
    if (integerScale) {
        CVS.width = Math.floor(CVS.width);
        CVS.height = Math.floor(CVS.height);
    }
    CTX.imageSmoothingEnabled = false;
    drawBg("black");
}
function drawSprite(src, x, y, coordX, coordY, sizeX = 8, sizeY = 8) {
    const scale = 5;
    if (src === "sprites") {
        CTX.drawImage(spriteAtlas, coordX, coordY, sizeX, sizeY, x, y, sizeX * scale, sizeY * scale);
    }
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
        isHovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height }));
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
function world_to_screen(worldX, worldY) {
    const screen_x = (worldX * 8) - (PLAYER.x - 116);
    const screen_y = (worldY * 8) - (PLAYER.y - 64);
    return { tx: screen_x - 8, ty: screen_y - 8 };
}
function get_world_cell(mouseX, mouseY) {
    const cam_x = PLAYER.x - 116 + 1;
    const cam_y = PLAYER.y - 64 + 1;
    const sub_tile_x = cam_x % 8;
    const sub_tile_y = cam_y % 8;
    const sx = Math.floor((mouseX + sub_tile_x) / 8);
    const sy = Math.floor((mouseY + sub_tile_y) / 8);
    const wx = Math.floor(cam_x / 8) + sx + 1;
    const wy = Math.floor(cam_y / 8) + sy + 1;
    return { wx: wx, wy: wy };
}
function get_screen_cell(mouseX, mouseY) {
    const cam_x = 116 - PLAYER.x;
    const cam_y = 64 - PLAYER.y;
    const mx = Math.floor(cam_x) % 8;
    const my = Math.floor(cam_y) % 8;
    return { sx: mouseX - ((mouseX - mx) % 8), sy: mouseY - ((mouseY - my) % 8) };
}
function updateCursorState() {
    const l = CURSOR.l;
    const r = CURSOR.r;
    const sx = CURSOR.sx;
    const sy = CURSOR.sy;
    const { wx, wy } = get_world_cell(CURSOR.x, CURSOR.y);
    const { tx, ty } = world_to_screen(wx, wy);
    if (l && CURSOR.l && !CURSOR.held_left && !CURSOR.r) {
        CURSOR.held_left = true;
    }
    if (r && CURSOR.r && !CURSOR.held_right && !CURSOR.l) {
        CURSOR.held_right = true;
    }
    if (CURSOR.held_left || CURSOR.held_right) {
        CURSOR.hold_time = CURSOR.hold_time + 1;
    }
    if (!l && CURSOR.held_left) {
        CURSOR.held_left = false;
        CURSOR.hold_time = 0;
    }
    if (!r && CURSOR.held_right) {
        CURSOR.held_right = false;
        CURSOR.hold_time = 0;
    }
    CURSOR.ltx = CURSOR.tx;
    CURSOR.lty = CURSOR.ty;
    CURSOR.wx = wx;
    CURSOR.wy = wy;
    CURSOR.tx = tx;
    CURSOR.ty = ty;
    CURSOR.sx = sx;
    CURSOR.sy = sy;
    CURSOR.lx = CURSOR.x;
    CURSOR.ly = CURSOR.y;
    CURSOR.ll = CURSOR.l;
    CURSOR.lm = CURSOR.m;
    CURSOR.lr = CURSOR.r;
    CURSOR.lsx = CURSOR.sx;
    CURSOR.lsy = CURSOR.sy;
    CURSOR.sx = sx;
    CURSOR.sy = sy;
    if (CURSOR.tx !== CURSOR.ltx || CURSOR.ty !== CURSOR.lty) {
        CURSOR.hold_time = 0;
    }
}
function gameLoop() {
    drawBg("black");
    PLAYER.update();
    PLAYER.draw();
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
        drawText(info[i][0], panelCoords.x + panelCoords.w, panelCoords.y + (i * 20), 20, "black", "top", "right");
    }
    if (drawTextButton(middleScreen.x - (150 / 2), panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", new Label("Back", "black", "white", { x: 0, y: 2 }), false)) {
        state = 'start';
    }
}
function BOOT() {
    resizeCanvas();
    TIC();
}
function TIC() {
    updateCursorState();
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
