"use strict";
const CVS = document.getElementById("mainCanvas");
const CTX = CVS.getContext("2d");
window.addEventListener("resize", resizeCanvas);
window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
});
window.addEventListener("mousemove", (ev) => {
    CURSOR.x = ev.pageX;
    CURSOR.y = ev.pageY;
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
class Ui {
    draw_logo() {
        drawBg("gray");
    }
    draw_menu() {
        drawBg("gray");
        const middleScreen = {
            x: CVS.width / 2, y: CVS.height / 2
        };
        if (state === 'start') {
            this.draw_logo();
            if (this.draw_text_button(middleScreen.x - 50, middleScreen.y - 25, 100, 50, "blue", "black", "darkBlue", { text: 'Start', bg: "black", fg: "white", shadow: { x: 0, y: 2 } }, false)) {
                state = "game";
                drawBg("black");
            }
            if (this.draw_text_button(middleScreen.x - 50, (middleScreen.y - 25) + 65, 100, 50, "blue", "black", "darkBlue", { text: '  Controls  ', bg: "black", fg: "white", shadow: { x: 0, y: 2 } }, false)) {
                state = 'help';
            }
        }
        else if (state === 'help') {
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
            this.draw_panel(panelCoords.x, panelCoords.y, panelCoords.w, panelCoords.h, "white", "blue", { text: 'Controls', bg: "black", fg: "black" }, "black");
            for (let i = 0; i < info.length; i++) {
                drawText(info[i][1], panelCoords.x, panelCoords.y + (i * 20), 20, "black", "top", "left");
                drawText(info[i][0], panelCoords.x + panelCoords.w + 5, panelCoords.y + (i * 20) - 5, 20, "black", "top", "right");
            }
            if (this.draw_button(240 - 12, 150, 50, 50, "blue", "blue", "blue")) {
                drawBg("black");
                state = 'start';
                return;
            }
        }
    }
    draw_endgame_window() {
        drawBg("black");
        if (tick % 60 > 30) {
        }
        if (this.draw_text_button(120 - ((' Continue '.length / 2) - 2), 84, 113, 8, "blue", "black", "darkBlue", { text: ' Continue ', bg: "white", fg: "green", shadow: { x: 1, y: 0 } }, false)) {
            state = 'game';
        }
    }
    draw_button(x, y, w, h, color, shadow_color, hover_color) {
        const _mouse = { x: CURSOR.x, y: CURSOR.y };
        const _box = { x: x, y: y, w: w, h: h };
        const hov = hovered(_mouse, _box);
        if (hov && !CURSOR.l) {
            drawRect(x + 4, y, w - 8, h - 1, hover_color);
            drawLine(x + 4, y + h - 1, x + w - 4, y + h - 1, shadow_color);
        }
        else if (hov && CURSOR.l) {
            drawRect(x + 4, y + 1, w - 8, h - 1, hover_color);
        }
        else {
            drawRect(x + 4, y, w - 8, h - 1, color);
            drawLine(x + 4, y + h - 1, x + w - 4, y + h - 1, shadow_color);
        }
        if (hov && CURSOR.l && !CURSOR.ll) {
            return true;
        }
        return false;
    }
    draw_text_button(x, y, width, height, main_color, shadow_color, hover_color, label, locked) {
        const _mouse = { x: CURSOR.x, y: CURSOR.y };
        const _box = { x: x, y: y, w: width, h: height };
        const middle = {
            x: x + (width / 2), y: y + (height / 2)
        };
        const hov = (!locked && hovered({ ..._mouse }, { ..._box }));
        if (!locked && hov && !CURSOR.l) {
            drawRect(x + 4, y, width - 8, height - 1, hover_color);
            drawLine(x + 4, y + height - 1, x + width - 4, y + height - 1, shadow_color);
        }
        else if (!locked && hov && CURSOR.l) {
            drawRect(x + 4, y + 1, width - 8, height - 1, hover_color);
        }
        else {
            drawRect(x + 4, y, width - 8, height - 1, main_color);
            drawLine(x + 4, y + height - 1, x + width - 4, y + height - 1, shadow_color);
        }
        drawText(label.text, middle.x + label.shadow.x, middle.y + label.shadow.y, 25, label.bg, "middle", "center");
        drawText(label.text, middle.x, middle.y, 25, label.fg, "middle", "center");
        if (hov && CURSOR.l) {
            return true;
        }
        return false;
    }
    draw_panel(x, y, w, h, bg, fg, label, shadow_color) {
        drawRect(x, y, w, h, bg);
        drawText(label.text, x + (w / 2), y - 15, 20, label.fg, "middle", "center");
    }
}
;
class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    mult(other) {
        return new Vec2(this.x * other.x, this.y * other.y);
    }
    div(other) {
        return new Vec2(this.x / other.x, this.y / other.y);
    }
    unm() {
        return new Vec2(-this.x, -this.y);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distance(other) {
        return ((this.x - other.x) ^ 2 + (this.y - other.y) ^ 2) ^ 0.5;
    }
    normalize() {
        const lenght = this.length();
        if (lenght === 0) {
            return new Vec2(0, 0);
        }
        return new Vec2(this.x / length, this.y / length);
    }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sen = Math.sin(angle);
        return new Vec2(this.x * cos - this.y * sen, this.x * sen + this.y * cos);
    }
    _div() {
        return this.x / this.y;
    }
    min(other) {
        return new Vec2(Math.min(this.x, other.x), Math.min(this.y, other.y));
    }
    max(other) {
        return new Vec2(Math.max(this.x, other.x), Math.max(this.y, other.y));
    }
    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }
    toString() {
        return `${this.x}_#{this.y}`;
    }
}
class BaseEntity {
    type;
    otherKey;
    updated;
    drawn;
    isHovered;
    beltDrawn;
    curveChecked;
    constructor(type, otherKey) {
        this.type = type;
        this.otherKey = otherKey;
        this.updated = false;
        this.drawn = false;
        this.isHovered = false;
        this.beltDrawn = false;
        this.curveChecked = false;
    }
}
const BELT_TICKRATE = 5;
const BELT_MAXTICK = 3;
const UBELT_TICKRATE = 5;
const UBELT_MAXTICK = 3;
const DRILL_TICK_RATE = 8;
const DRILL_BIT_DIR = 1;
const FURNACE_ANIM_TICKRATE = 9;
const FURNACE_ANIM_TICKS = 2;
const FURNACE_TICKRATE = 5;
const CRAFTER_TICKRATE = 5;
const CRAFTER_ANIM_RATE = 5;
const ENTS = {};
const CURRENT_RECIPE = { x: 0, y: 0, id: 0 };
const RESOURCES = {
    '2': { name: 'Petrified Fossil', id: 5, min: 5, max: 20 },
    '7': { name: 'Medium Rock', id: 5, min: 5, max: 10 },
    '8': { name: 'Pebble', id: 5, min: 1, max: 3 },
    '9': { name: 'Bone', id: 5, min: 1, max: 3 },
    '10': { name: 'Skull', id: 5, min: 5, max: 10 },
    '24': { name: 'Small Rock', id: 5, min: 1, max: 3 },
    '26': { name: 'Medium Rock', id: 5, min: 4, max: 15 },
    '40': { name: 'Medium Rock', id: 5, min: 4, max: 15 },
    '42': { name: 'Large Rock', id: 5, min: 4, max: 15 },
    '3': { name: 'Cactus Sprouts', id: 32, min: 5, max: 12 },
    '4': { name: 'Wildflower Patch', id: 32, min: 10, max: 20 },
    '5': { name: 'Flowering Cactus', id: 32, min: 19, max: 45 },
    '6': { name: 'Large Wildflower', id: 32, min: 5, max: 17 },
    '1': { name: 'Palm Sprout', id: 32, min: 5, max: 12 },
    '17': { name: 'Grass', id: 32, min: 5, max: 12 },
    '18': { name: 'Small Wildflowers', id: 32, min: 5, max: 12 },
    '19': { name: 'Grass', id: 32, min: 5, max: 12 },
    '20': { name: 'Bean Sprouts', id: 32, min: 5, max: 12 },
    '21': { name: 'Wildflower', id: 32, min: 5, max: 12 },
    '22': { name: 'Wildflower', id: 32, min: 5, max: 12 },
    '23': { name: 'Fungal Sprout', id: 32, min: 5, max: 15 },
    '33': { name: 'Grass', id: 32, min: 5, max: 12 },
    '34': { name: 'Grass', id: 32, min: 5, max: 12 },
    '35': { name: 'Large Grass Patch', id: 32, min: 5, max: 12 },
    '36': { name: 'Wildflower Stem', id: 32, min: 5, max: 12 },
    '37': { name: 'Small Wildflowers', id: 32, min: 5, max: 12 },
    '39': { name: 'Grass', id: 32, min: 5, max: 12 }
};
const DUMMIES = {
    'dummy_furnace': true,
    'dummy_assembler': true,
    'dummy_drill': true,
    'dummy_lab': true,
    'dummy_splitter': true,
    'dummy_refinery': true,
    'dummy_silo': true
};
const OPENSiES = {
    'stone_furnace': true,
    'assembly_machine': true,
    'research_lab': true,
    'chest': true,
    'mining_drill': true,
    'bio_refinery': true,
    'rocket_silo': true
};
const PLAYER = {
    x: 100 * 8, y: 50 * 8, spr: 362,
    lx: 0, ly: 0, shadow: 382,
    anim_frame: 0, anim_speed: 8, anim_dir: 0,
    anim_max: 4, last_dir: '0,0', move_speed: 0.15,
    directions: {
        '0,0': { id: 362, flip: 0, rot: 0, dust: new Vec2(4, 11) },
        '0,-1': { id: 365, flip: 0, rot: 0, dust: new Vec2(4, 11) },
        '0,1': { id: 365, flip: 2, rot: 0, dust: new Vec2(4, -2) },
        '-1,0': { id: 363, flip: 1, rot: 0, dust: new Vec2(11, 5) },
        '1,0': { id: 363, flip: 0, rot: 0, dust: new Vec2(-2, 5) },
        '1,-1': { id: 364, flip: 0, rot: 0, dust: new Vec2(-2, 10) },
        '-1,-1': { id: 364, flip: 1, rot: 0, dust: new Vec2(10, 10) },
        '-1,1': { id: 364, flip: 3, rot: 0, dust: new Vec2(10, -2) },
        '1,1': { id: 364, flip: 2, rot: 0, dust: new Vec2(-2, -2) }
    },
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
    hand_item: { id: 0, count: 0, drag_offset: { x: 0, y: 0 }, item_stack: { id: 9, count: 100 } }
};
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
const UI = new Ui();
let db_time = 0.0;
let launched = false;
let show_tile_widget = false;
let ticks_elapsed = 0;
let last_frame_time = ticks_elapsed;
let show_mini_map = false;
let show_tech = false;
let vis_ents = {};
let tick = 0;
let belt_tick = 0;
let ubelt_tick = 0;
let drill_bit_tick = 0;
let drill_anim_tick = 0;
let furnace_anim_tick = 0;
let crafter_anim_frame = 0;
let crafter_anim_dir = 1;
let state = "help";
let _t = 0;
function time() {
    return ticks_elapsed;
}
function lapse(fn) {
    const t = time();
    fn();
    return Math.floor((time() - t));
}
function get_visible_ents() {
    vis_ents = {
        'transport_belt': [],
        'inserter': [],
        'power_pole': [],
        'splitter': [],
        'mining_drill': [],
        'stone_furnace': [],
        'underground_belt': [],
        'assembly_machine': [],
        'research_lab': [],
        'chest': [],
        'bio_refinery': [],
        'rocket_silo': []
    };
    for (let x = 1; x <= 31; x++) {
        for (let y = 1; y <= 18; y++) {
            const worldX = (x * 8) + (PLAYER.x - 116);
            const worldY = (y * 8) + (PLAYER.y - 64);
            const cellX = Math.floor(worldX / 8);
            const cellY = Math.floor(worldY / 8);
            const k = `${cellX}'-'${cellY}`;
            if (ENTS[k] && vis_ents[ENTS[k].type]) {
                const type = ENTS[k].type;
                const index = vis_ents[type].length;
                vis_ents[type][index] = k;
            }
        }
    }
}
function get_cell(x, y) {
    return { x: x - (x % 8), y: y - (y % 8) };
}
function get_screen_cell(mouseX, mouseY) {
    const cam_x = 116 - PLAYER.x;
    const cam_y = 64 - PLAYER.y;
    const mx = Math.floor(cam_x) % 8;
    const my = Math.floor(cam_y) % 8;
    return { sx: mouseX - ((mouseX - mx) % 8), sy: mouseY - ((mouseY - my) % 8) };
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
function get_key(x, y) {
    const { wx, wy } = get_world_cell(x, y);
    return `${wx}-${wy}`;
}
function get_ent(x, y) {
    const k = get_key(x, y);
    if (!ENTS[k]) {
        return "";
    }
    if (ENTS[k].type === 'splitter') {
        return k;
    }
    if (ENTS[k].type === 'underground_belt_exit') {
        return ENTS[k].otherKey;
    }
    if (ENTS[k].type === 'underground_belt') {
        return k;
    }
    if (ENTS[k].otherKey) {
        return ENTS[k].otherKey;
    }
    else {
        return k;
    }
}
function move_player(x, y) {
    PLAYER.x, PLAYER.y = PLAYER.x + x, PLAYER.y + y;
}
function update_player() {
    const dt = time() - last_frame_time;
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
        const dust_dir = PLAYER.directions[`${x_dir},${y_dir}`].dust;
        const dx = 240 / 2 - 4 + dust_dir.x;
        const dy = 136 / 2 - 4 + PLAYER.anim_frame + dust_dir.y;
        if (x_dir !== 0 || y_dir !== 0) {
            move_player(x_dir * PLAYER.move_speed * dt, y_dir * PLAYER.move_speed * dt);
        }
    }
    PLAYER.last_dir = `${x_dir},${y_dir}`;
}
function update_cursor_state() {
    const x = CURSOR.x;
    const y = CURSOR.y;
    const l = CURSOR.l;
    const m = CURSOR.m;
    const r = CURSOR.r;
    const sx = CURSOR.sx;
    const sy = CURSOR.sy;
    const { wx, wy } = get_world_cell(x, y);
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
    CURSOR.x = x;
    CURSOR.y = y;
    CURSOR.l = l;
    CURSOR.m = m;
    CURSOR.sx = sx;
    CURSOR.sy = sy;
    if (CURSOR.tx !== CURSOR.ltx || CURSOR.ty !== CURSOR.lty) {
        CURSOR.hold_time = 0;
    }
}
function dispatch_keypress() {
    if (KEYBOARD["f"]) { }
    if (KEYBOARD["g"]) { }
    if (KEYBOARD["m"]) {
        show_mini_map = !show_mini_map;
    }
    if (KEYBOARD["r"]) { }
    if (KEYBOARD["l"]) { }
    if (KEYBOARD["q"]) { }
    if (KEYBOARD["i"] || KEYBOARD["tab"]) { }
    if (KEYBOARD["h"]) { }
    if (KEYBOARD["c"]) { }
    if (KEYBOARD["y"]) { }
    if (KEYBOARD["shift"]) { }
    if (KEYBOARD["alt"]) { }
    if (KEYBOARD["ctrl"]) { }
    if (KEYBOARD["e"]) { }
    if (KEYBOARD["t"]) {
    }
}
function dispatch_input() {
    update_cursor_state();
    dispatch_keypress();
    if (show_tech) {
        return;
    }
    const { wx, wy } = get_world_cell(CURSOR.x, CURSOR.y);
    const k = get_ent(CURSOR.x, CURSOR.y);
    if (ENTS[k] !== undefined) {
        ENTS[k].isHovered = true;
    }
    if (!CURSOR.l) {
        CURSOR.panel_drag = false;
        CURSOR.drag = false;
    }
}
function resizeCanvas() {
    CVS.width = window.innerWidth;
    CVS.height = window.innerHeight;
    drawBg("black");
}
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function hovered(mouse, box) {
    return (mouse.x >= box.x &&
        mouse.x <= box.x + box.w &&
        mouse.y >= box.y &&
        mouse.y <= box.y + box.h);
}
function drawRect(x, y, w, h, color) {
    CTX.strokeStyle = color;
    CTX.fillStyle = color;
    CTX.fillRect(x, y, w, h);
}
function drawLine(x1, y1, x2, y2, color) {
    CTX.strokeStyle = color;
    CTX.moveTo(x1, y1);
    CTX.lineTo(x2, y2);
}
function drawText(text, x, y, size, color, baseLine, textAling) {
    CTX.textBaseline = baseLine;
    CTX.textAlign = textAling;
    CTX.font = `${size}px Arial`;
    CTX.strokeStyle = color;
    CTX.fillStyle = color;
    CTX.fillText(text, x, y);
}
function clearScreen() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
}
function drawBg(color) {
    CTX.fillStyle = color;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
}
function prints(text, x, y, fontSize, bg, fg, shadow_offset) {
    drawText(text, x + shadow_offset.x, y + shadow_offset.y, fontSize, bg, "middle", "left");
    drawText(text, x, y, fontSize, fg, "middle", "left");
}
function screen_to_world(screenX, screenY, playerX, playerY) {
    const cam_x = playerX - 116;
    const cam_y = playerY - 64;
    const sub_tile_x = cam_x % 8;
    const sub_tile_y = cam_y % 8;
    const sx = Math.floor((screenX + sub_tile_x) / 8);
    const sy = Math.floor((screenY + sub_tile_y) / 8);
    const wx = Math.floor(cam_x / 8) + sx + 1;
    const wy = Math.floor(cam_y / 8) + sy + 1;
    return { wordX: wx, wordY: wy };
}
function world_to_screen(worldX, worldY) {
    const screen_x = (worldX * 8) - (PLAYER.x - 116);
    const screen_y = (worldY * 8) - (PLAYER.y - 64);
    return { tx: screen_x - 8, ty: screen_y - 8 };
}
function BOOT() {
    resizeCanvas();
    TIC();
}
function TIC() {
    drawBg("black");
    CURRENT_RECIPE.x = 0;
    CURRENT_RECIPE.y = 0;
    CURRENT_RECIPE.id = 0;
    update_cursor_state();
    if (state === "start" || state === 'help') {
        UI.draw_menu();
        drawText(`x: ${CURSOR.x}\ny: ${CURSOR.y}\nL: ${CURSOR.l}\nR: ${CURSOR.r}`, 0, 0, 25, "white", "top", "left");
        tick = tick + 1;
        requestAnimationFrame(TIC);
        return;
    }
    if (state === "first_launch") {
        UI.draw_endgame_window();
        tick = tick + 1;
        requestAnimationFrame(TIC);
        return;
    }
    const start = time();
    let m_time = 0;
    const gv_time = lapse(get_visible_ents);
    const up_time = lapse(update_player);
    if (tick % BELT_TICKRATE === 0) {
        belt_tick = belt_tick + 1;
        if (belt_tick > BELT_MAXTICK) {
            belt_tick = 0;
        }
    }
    if (tick % UBELT_TICKRATE === 0) {
        ubelt_tick = ubelt_tick + 1;
        if (ubelt_tick > UBELT_MAXTICK) {
            ubelt_tick = 0;
        }
    }
    if (tick % DRILL_TICK_RATE === 0) {
        drill_bit_tick = drill_bit_tick + DRILL_BIT_DIR;
        if (drill_bit_tick > 7 || drill_bit_tick < 0) {
            drill_anim_tick = drill_anim_tick + 1;
        }
        if (drill_anim_tick > 2) {
            drill_anim_tick = 0;
        }
    }
    if (tick % FURNACE_ANIM_TICKRATE === 0) {
        furnace_anim_tick = furnace_anim_tick + 1;
        if (furnace_anim_tick > FURNACE_ANIM_TICKS) {
            furnace_anim_tick = 0;
        }
    }
    if (tick % CRAFTER_ANIM_RATE === 0) {
        crafter_anim_frame = crafter_anim_frame + crafter_anim_dir;
        if (crafter_anim_frame > 5) {
            crafter_anim_dir = -1;
        }
        else if (crafter_anim_frame < 1) {
            crafter_anim_dir = 1;
        }
    }
    let dcl_time = 0;
    if (!show_mini_map) {
        const st_time = time();
        dcl_time = Math.floor(time() - st_time);
    }
    const x = CURSOR.x;
    const y = CURSOR.y;
    const l = CURSOR.l;
    const m = CURSOR.m;
    const r = CURSOR.r;
    let col = 5;
    if (r) {
        col = 2;
    }
    if (!show_mini_map) {
    }
    let ents = 0;
    Object.entries(vis_ents).forEach((v) => {
        Object.entries(v[1]).forEach(() => {
            ents += 1;
        });
    });
    if (show_mini_map) {
        const st_time = time();
    }
    const { wx, wy } = get_world_cell(CURSOR.tx, CURSOR.ty);
    let k = `${wx}-${wy}`;
    if (KEYBOARD["shift"] && ENTS[k] !== undefined) {
        if (ENTS[k].type === 'underground_belt_exit') {
        }
        else {
            k = get_ent(CURSOR.x, CURSOR.y);
            if (ENTS[k] !== undefined) {
            }
        }
    }
    Object.entries(ENTS).forEach((k) => {
        const v = k[1];
        v.updated = false;
        v.drawn = false;
        v.isHovered = false;
        if (v.type === 'transport_belt') {
            v.beltDrawn = false;
            v.curveChecked = false;
        }
    });
    last_frame_time = time();
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
