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
const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
const tmp = new Uint8Array(256);
class Player {
    x;
    y;
    lx;
    ly;
    animFrame;
    animSpeed;
    animDir;
    animMax;
    lastDir;
    moveSpeed;
    directions;
    constructor() {
        this.x = 0, this.y = 0;
        this.lx = 0, this.ly = 0;
        this.animFrame = 0;
        this.animSpeed = 8;
        this.animDir = 0;
        this.animMax = 4;
        this.lastDir = "0,0";
        this.moveSpeed = 1.9;
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
        if (tick % this.animSpeed === 0) {
            if (this.animDir === 0) {
                this.animFrame = this.animFrame + 1;
                if (this.animFrame > this.animMax) {
                    this.animDir = 1;
                    this.animFrame = this.animMax;
                }
            }
            else {
                this.animFrame = this.animFrame - 1;
                if (this.animFrame < 0) {
                    this.animDir = 0;
                    this.animFrame = 0;
                }
            }
        }
        this.lx = this.x;
        this.ly = this.y;
        let xDir = 0;
        let yDir = 0;
        if (KEYBOARD["w"]) {
            yDir = -1;
        }
        if (KEYBOARD["s"]) {
            yDir = 1;
        }
        if (KEYBOARD["a"]) {
            xDir = -1;
        }
        if (KEYBOARD["d"]) {
            xDir = 1;
        }
        if (!CURSOR.prog) {
            if (xDir !== 0 || yDir !== 0) {
                this.move(xDir * this.moveSpeed, yDir * this.moveSpeed);
            }
        }
        this.lastDir = `${xDir},${yDir}`;
    }
    move(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
    }
    draw() {
        const center = {
            x: Math.round(CVS.width / 2),
            y: Math.round(CVS.height / 2)
        };
        const atlasCoord = {
            x: 0, y: 32
        };
        switch (this.lastDir) {
            case "-1,0": {
                atlasCoord.x = 16;
                break;
            }
            case "-1,1": {
                atlasCoord.x = 48;
                break;
            }
            case "-1,-1": {
                atlasCoord.x = 32;
                break;
            }
            case "0,1": {
                atlasCoord.x = 64;
                break;
            }
            case "0,-1": {
                atlasCoord.x = 56;
                break;
            }
            case "1,0": {
                atlasCoord.x = 8;
                break;
            }
            case "1,1": {
                atlasCoord.x = 40;
                break;
            }
            case "1,-1": {
                atlasCoord.x = 24;
                break;
            }
        }
        drawSprite("sprites", center.x, center.y + this.animFrame, atlasCoord.x, atlasCoord.y);
    }
}
class Tilemanager {
    tiles;
    constructor() {
        this.tiles = {};
    }
    createTile(x, y) {
        const scale = 0.0005;
        const scale2 = 0.025;
    }
    drawTerrain() {
        const cameraTopLeftX = PLAYER.x - CVS.width / 2;
        const cameraTopLeftY = PLAYER.y - CVS.height / 2;
        const subTileX = cameraTopLeftX % 8;
        const subTileY = cameraTopLeftY % 8;
        const startX = Math.floor(cameraTopLeftX / 8);
        const startY = Math.floor(cameraTopLeftY / 8);
        for (let screenY = 0; screenY < CVS.height; screenY++) {
            for (let screenX = 0; screenX < CVS.width; screenX++) {
                const worldX = startX + screenX;
                const worldY = startY + screenY;
                if (this.tiles[worldX][worldY] === undefined) {
                    this.createTile(worldX, worldY);
                }
                const tile = this.tiles[worldX][worldY];
                if (!showMiniMap) {
                    const sx = (screenX - 1) * 8 - subTileX;
                    const sy = (screenY - 1) * 8 - subTileY;
                    if (tile.ore) {
                    }
                    else if (!tile.isBorder) {
                        const rot = tile.rot;
                        let flip = tile.flip;
                        if (!tile.isLand) {
                            if (worldX % 2 == 1 && worldY % 2 == 1) {
                                flip = 3;
                            }
                            else if (worldX % 2 == 1) {
                                flip = 1;
                            }
                            else if (worldY % 2 == 1) {
                                flip = 2;
                            }
                        }
                        else {
                        }
                    }
                }
                else {
                    if (tile.biome === 1) {
                        let flip = 0;
                        if (worldX % 2 == 1 && worldY % 2 == 1) {
                            flip = 3;
                        }
                        else if (worldX % 2 == 1) {
                            flip = 1;
                        }
                        else if (worldY % 2 == 1) {
                            flip = 2;
                        }
                    }
                    else {
                    }
                }
            }
        }
    }
}
class Grad {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    dot2(x, y) {
        return this.x * x + this.y * y;
    }
}
class Perlin {
    gradP;
    grad3;
    p;
    constructor(seed) {
        this.gradP = new Array(512);
        this.grad3 = [
            new Grad(1, 1, 0),
            new Grad(-1, 1, 0),
            new Grad(1, -1, 0),
            new Grad(-1, -1, 0),
            new Grad(1, 0, 1),
            new Grad(-1, 0, 1),
            new Grad(1, 0, -1),
            new Grad(-1, 0, -1),
            new Grad(0, 1, 1),
            new Grad(0, -1, 1),
            new Grad(0, 1, -1),
            new Grad(0, -1, -1),
        ];
        this.p = [
            151,
            160,
            137,
            91,
            90,
            15,
            131,
            13,
            201,
            95,
            96,
            53,
            194,
            233,
            7,
            225,
            140,
            36,
            103,
            30,
            69,
            142,
            8,
            99,
            37,
            240,
            21,
            10,
            23,
            190,
            6,
            148,
            247,
            120,
            234,
            75,
            0,
            26,
            197,
            62,
            94,
            252,
            219,
            203,
            117,
            35,
            11,
            32,
            57,
            177,
            33,
            88,
            237,
            149,
            56,
            87,
            174,
            20,
            125,
            136,
            171,
            168,
            68,
            175,
            74,
            165,
            71,
            134,
            139,
            48,
            27,
            166,
            77,
            146,
            158,
            231,
            83,
            111,
            229,
            122,
            60,
            211,
            133,
            230,
            220,
            105,
            92,
            41,
            55,
            46,
            245,
            40,
            244,
            102,
            143,
            54,
            65,
            25,
            63,
            161,
            1,
            216,
            80,
            73,
            209,
            76,
            132,
            187,
            208,
            89,
            18,
            169,
            200,
            196,
            135,
            130,
            116,
            188,
            159,
            86,
            164,
            100,
            109,
            198,
            173,
            186,
            3,
            64,
            52,
            217,
            226,
            250,
            124,
            123,
            5,
            202,
            38,
            147,
            118,
            126,
            255,
            82,
            85,
            212,
            207,
            206,
            59,
            227,
            47,
            16,
            58,
            17,
            182,
            189,
            28,
            42,
            223,
            183,
            170,
            213,
            119,
            248,
            152,
            2,
            44,
            154,
            163,
            70,
            221,
            153,
            101,
            155,
            167,
            43,
            172,
            9,
            129,
            22,
            39,
            253,
            19,
            98,
            108,
            110,
            79,
            113,
            224,
            232,
            178,
            185,
            112,
            104,
            218,
            246,
            97,
            228,
            251,
            34,
            242,
            193,
            238,
            210,
            144,
            12,
            191,
            179,
            162,
            241,
            81,
            51,
            145,
            235,
            249,
            14,
            239,
            107,
            49,
            192,
            214,
            31,
            181,
            199,
            106,
            157,
            184,
            84,
            204,
            176,
            115,
            121,
            50,
            45,
            127,
            4,
            150,
            254,
            138,
            236,
            205,
            93,
            222,
            114,
            67,
            29,
            24,
            72,
            243,
            141,
            128,
            195,
            78,
            66,
            215,
            61,
            156,
            180,
        ];
        if (seed > 0 && seed < 1) {
            seed *= 65536;
        }
        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }
        for (let i = 0; i < 256; i++) {
            let v;
            if (i & 1) {
                v = this.p[i] ^ (seed & 255);
            }
            else {
                v = this.p[i] ^ ((seed >> 8) & 255);
            }
            perm[i] = perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
        }
    }
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    noise2D(x, y) {
        let X = Math.floor(x);
        let Y = Math.floor(y);
        x = x - X;
        y = y - Y;
        X = X & 255;
        Y = Y & 255;
        const n00 = this.gradP[X + perm[Y]].dot2(x, y);
        const n01 = this.gradP[X + perm[Y + 1]].dot2(x, y - 1);
        const n10 = this.gradP[X + 1 + perm[Y]].dot2(x - 1, y);
        const n11 = this.gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
        const u = this.fade(x);
        return lerp(lerp(n00, n10, u), lerp(n01, n11, u), this.fade(y));
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
    heldLeft: false, heldRight: false, ltx: 0, lty: 0,
    lastRotation: 0, holdTime: 0, type: 'pointer', item: 'transport_belt',
    drag: false, panelDrag: false, dragDir: 0, dragLoc: { x: 0, y: 0 },
    handItem: { id: 0, count: 0 }, dragOffset: { x: 0, y: 0 }, itemStack: { id: 9, count: 100 }
};
const PLAYER = new Player();
const TILEMAN = new Tilemanager();
const PERLIN = new Perlin(1);
const spriteAtlas = new Image();
spriteAtlas.src = "./assets/sprites.png";
const tilesAtlas = new Image();
tilesAtlas.src = "./assets/tiles.png";
let tick = 0;
let state = "start";
let showMiniMap = false;
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
function lerp(a, b, t) {
    return a + t * (b - a);
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
function drawPanel(x, y, w, h, bg, fg, shadowColor, label) {
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
function drawTextButton(x, y, width, height, mainColor, shadowColor, hoverColor, label, locked) {
    const middle = { x: x + (width / 2), y: y + (height / 2) };
    const hov = (!locked &&
        isHovered({ x: CURSOR.x, y: CURSOR.y }, { x: x, y: y, w: width, h: height }));
    if (!locked && hov && !CURSOR.l) {
        drawRect(x, y, width, height, hoverColor, hoverColor);
    }
    else if (!locked && hov && CURSOR.l) {
        drawRect(x, y, width, height, hoverColor, hoverColor);
    }
    else {
        drawRect(x, y, width, height, mainColor, mainColor);
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
function updateCursorState() {
    const l = CURSOR.l;
    const r = CURSOR.r;
    const sx = CURSOR.sx;
    const sy = CURSOR.sy;
    if (l && CURSOR.l && !CURSOR.heldLeft && !CURSOR.r) {
        CURSOR.heldLeft = true;
    }
    if (r && CURSOR.r && !CURSOR.heldRight && !CURSOR.l) {
        CURSOR.heldRight = true;
    }
    if (CURSOR.heldLeft || CURSOR.heldRight) {
        CURSOR.holdTime = CURSOR.holdTime + 1;
    }
    if (!l && CURSOR.heldLeft) {
        CURSOR.heldLeft = false;
        CURSOR.holdTime = 0;
    }
    if (!r && CURSOR.heldRight) {
        CURSOR.heldRight = false;
        CURSOR.holdTime = 0;
    }
    CURSOR.ltx = CURSOR.tx;
    CURSOR.lty = CURSOR.ty;
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
        CURSOR.holdTime = 0;
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
        clearScreen();
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                const noise = PERLIN.noise2D(x, y);
                console.log(noise);
                drawRect(x, y, 1, 1, `rgb(${255 * noise}, ${255 * noise}, ${255 * noise})`, `rgb(${255 * noise}, ${255 * noise}, ${255 * noise})`);
            }
        }
        return;
    }
    tick = tick + 1;
    requestAnimationFrame(TIC);
}
BOOT();
