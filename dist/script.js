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
class windo {
    is_hovered(x, y) {
        return false;
    }
    click(x, y) {
        return false;
    }
}
class Ui {
    active_window;
    constructor() {
        this.active_window = undefined;
    }
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
            if (this.draw_text_button(panelCoords.x, panelCoords.y + panelCoords.h, 150, 50, "red", "black", "darkRed", { text: "Back", bg: "black", fg: "white", shadow: { x: 0, y: 2 } }, false)) {
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
        const middle = { x: x + (width / 2), y: y + (height / 2) };
        const hov = (!locked && hovered({ ..._mouse }, { ..._box }));
        if (!locked && hov && !CURSOR.l) {
            drawRect(x, y, width, height, hover_color);
            drawLine(x, y + height, x + width, y + height, shadow_color);
        }
        else if (!locked && hov && CURSOR.l) {
            drawRect(x, y, width, height, hover_color);
        }
        else {
            drawRect(x, y, width, height, main_color);
            drawLine(x, y + height, x + width, y + height, shadow_color);
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
class CraftMenu {
    x;
    y;
    w;
    h;
    grid_x;
    grid_y;
    vis;
    docked;
    current_output;
    active_tab;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 100;
        this.grid_x = 1;
        this.grid_y = 34;
        this.vis = false;
        this.docked = false;
        this.current_output = "";
        this.active_tab = 1;
    }
    is_hovered(x, y) {
        if (this.vis) {
            return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
        }
        return false;
    }
    get_hovered_slot(x, y) {
        const grid_x = this.x + this.grid_x;
        const grid_y = this.y + this.grid_y;
        const start_x = grid_x + 1;
        const start_y = grid_y + 1;
        const rel_x = x - start_x + 1;
        const rel_y = y - start_y + 1;
        const slot_x = Math.floor(rel_x / 9);
        const slot_y = Math.floor(rel_y / 9);
        const slot_pos_x = start_x + slot_x * 9;
        const slot_pos_y = start_y + slot_y * 9;
        const slot_index = slot_y * 10 + slot_x + 1;
        if (slot_x >= 0 && slot_x <= CRAFT_COLS - 1 && slot_y >= 0 && slot_y <= CRAFT_ROWS - 1) {
            return { result: true, sx: slot_pos_x, sy: slot_pos_y, index: slot_index };
        }
        return undefined;
    }
    click(x, y, side) {
        if (side === "left" && !CURSOR.ll) {
            const { result, sx, sy, index } = { ...this.get_hovered_slot(x, y) };
            if (result !== undefined && sx !== undefined && sy !== undefined && index !== undefined && this.current_output !== "PLAYER") {
                const row = Math.ceil(index / 10);
                const col = ((index - 1) % 10) + 1;
                if (row <= RECIPES[this.active_tab].length && col <= RECIPES[this.active_tab][row].length) {
                    if (ENTS[this.current_output] !== undefined) {
                        const item = ITEMS[RECIPES[this.active_tab][row][col]];
                        const cur_output = ENTS[this.current_output];
                        if (item.type === 'oil' && cur_output instanceof CrafterEntity && cur_output.type === 'bio_refinery' && UNLOCKED_ITEMS[item.id]) {
                            cur_output.set_recipe({ ...ITEMS[RECIPES[this.active_tab][row][col]].recipe });
                            toggle_crafting(false);
                            this.current_output = 'PLAYER';
                            return true;
                        }
                        return false;
                    }
                }
            }
            else if (result !== undefined && sx !== undefined && sy !== undefined && index !== undefined && this.current_output === 'PLAYER') {
                const row = Math.ceil(index / 10);
                const col = ((index - 1) % 10) + 1;
                if (row <= RECIPES[this.active_tab].length && col <= RECIPES[this.active_tab][row].length) {
                    const item = ITEMS[RECIPES[this.active_tab][row][col]];
                    if (item && item.craftable && item.recipe !== undefined && UNLOCKED_ITEMS[item.id]) {
                        let can_craft = true;
                        if (can_craft) {
                        }
                    }
                }
            }
        }
        return false;
    }
}
class Tilemanager {
    tiles;
    biomes;
    auto_map;
    constructor() {
        this.tiles = {};
        this.auto_map = {
            '1000': { sprite_id: 1, rot: 0 },
            '0100': { sprite_id: 1, rot: 1 },
            '0010': { sprite_id: 1, rot: 2 },
            '0001': { sprite_id: 1, rot: 3 },
            '1100': { sprite_id: 2, rot: 1 },
            '0110': { sprite_id: 2, rot: 2 },
            '0011': { sprite_id: 2, rot: 3 },
            '1001': { sprite_id: 2, rot: 0 },
            '1101': { sprite_id: 3, rot: 0 },
            '1110': { sprite_id: 3, rot: 1 },
            '0111': { sprite_id: 3, rot: 2 },
            '1011': { sprite_id: 3, rot: 3 },
            '0101': { sprite_id: 4, rot: 0 },
            '1010': { sprite_id: 4, rot: 1 },
            '1111': { sprite_id: 0, rot: 0 },
        };
        this.biomes = {
            1: {
                name: 'Desert',
                tile_id_offset: 0,
                min: 20,
                max: 30,
                t_min: 20.5,
                t_max: 21.5,
                tree_id: 194,
                tree_density: 0.05,
                color_key: 0,
                map_col: "blue",
                clutter: 0.01
            },
            2: {
                name: 'Prarie',
                tile_id_offset: 16,
                min: 30,
                max: 45,
                t_min: 33,
                t_max: 40,
                tree_id: 200,
                tree_density: 0.075,
                color_key: 1,
                map_col: "green",
                clutter: 0.09
            },
            3: {
                name: 'Forest',
                tile_id_offset: 32,
                min: 45,
                max: 101,
                t_min: 65,
                t_max: 85,
                tree_id: 197,
                tree_density: 0.15,
                color_key: 1,
                map_col: "white",
                clutter: 0.05
            },
        };
    }
    draw_terrain(screenWidth, screenHeight) {
        const cameraTopLeftX = PLAYER.x - 116;
        const cameraTopLeftY = PLAYER.y - 64;
        const subTileX = cameraTopLeftX % 8;
        const subTileY = cameraTopLeftY % 8;
        const startX = Math.floor(cameraTopLeftX / 8);
        const startY = Math.floor(cameraTopLeftY / 8);
        for (let screenY = 1; screenY < screenHeight; screenY++) {
            for (let screenX = 1; screenX < screenWidth; screenX++) {
                const worldX = startX + screenX;
                const worldY = startY + screenY;
                const tile = this.tiles[worldX][worldY];
                if (!show_mini_map) {
                    const sx = (screenX - 1) * 8 - subTileX;
                    const sy = (screenY - 1) * 8 - subTileY;
                    if (!tile.visited) {
                        this.autoMap(worldX, worldY);
                    }
                    if (tile.ore) {
                        drawRect(sx, sy, 8, 8, this.biomes[tile.biome].map_col);
                    }
                    else if (!tile.is_border) {
                        const id = tile.sprite_id;
                        const rot = tile.rot;
                        let flip = tile.flip;
                        if (!tile.is_land) {
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
                            drawRect(sx, sy, 8, 8, this.biomes[tile.biome].map_col);
                            if (id !== this.biomes[tile.biome].tile_id_offset) {
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
    autoMap(x, y) {
        const tile = this.tiles[y][x];
        this.tiles[y][x].visited = true;
        const adj = {
            0: { x: 0, y: -1 },
            1: { x: 1, y: 0 },
            2: { x: 0, y: 1 },
            3: { x: -1, y: 0 }
        };
        let key = '';
        for (let i = 0; i < 4; i++) {
            const near = this.tiles[y + adj[i].y][x + adj[i].x];
            if (!near.is_land || near.biome < tile.biome) {
                key = key + '1';
                this.tiles[y][x].border_col = this.biomes[near.biome].map_col;
            }
            else {
                key = key + '0';
            }
        }
        const new_tile = this.auto_map[key];
        if (new_tile === undefined) {
            return;
        }
        this.tiles[y][x].sprite_id = new_tile.sprite_id + 11 + this.biomes[tile.biome].tile_id_offset;
        this.tiles[y][x].is_border = true;
        this.tiles[y][x].ore = false;
        this.tiles[y][x].flip = 0;
        this.tiles[y][x].rot = new_tile.rot;
    }
}
class BaseEntity {
    type;
    updated;
    drawn;
    isHovered;
    constructor(type) {
        this.type = type;
        this.updated = false;
        this.drawn = false;
        this.isHovered = false;
    }
}
class CrafterEntity extends BaseEntity {
    recipe;
    input;
    output;
    requests;
    constructor() {
        super("assembly_machine");
        this.recipe = {
            id: -1, crafting_time: -1, quant: -1,
            ingredients: []
        };
        this.input = [];
        this.output = { id: -1, count: -1 };
        this.requests = [];
    }
    set_recipe(newRecipe) {
        this.recipe = { ...newRecipe };
        for (let i = 0; this.recipe.ingredients.length; i++) {
            this.input[i].name = this.recipe.ingredients[i].name;
        }
        this.output.id = this.recipe.id;
        this.output.count = 0;
        this.requests = [];
        for (let i = 1; this.recipe.ingredients.length; i++) {
            this.requests[i] = [true, false];
        }
    }
}
class BeltEntity extends BaseEntity {
    beltDrawn;
    curveChecked;
    constructor() {
        super("transport_belt");
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
const CRAFT_ROWS = 6;
const CRAFT_COLS = 8;
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
const RECIPES = [
    [
        ["chest"],
        ["transport_belt", "underground_belt", "splitter", "inserter"],
        [],
        [],
        [],
        []
    ],
    [
        ["electronic_circuit", "advanced_circuit", "processing_unit"],
        ['iron_plate', 'copper_plate', 'stone_brick', 'steel_plate', 'solar_panel', 'wood'],
        ['gear', 'copper_cable', 'plastic_bar'],
        ['mining_drill', 'stone_furnace', 'assembly_machine', 'engine_unit', 'fiber'],
        ['research_lab', 'bio_refinery'],
        ['rocket_silo']
    ],
    [
        ['iron_ore', 'copper_ore', 'stone', 'coal', 'uranium', 'oil_shale'],
        ['fiber', 'biofuel'],
        [],
        [],
        ['automation_pack', 'logistics_pack', 'biology_pack', 'production_pack'],
        [],
    ]
];
const PLAYER = {
    x: 100 * 8, y: 50 * 8, spr: 362,
    lx: 0, ly: 0, shadow: 382,
    anim_frame: 0, anim_speed: 8, anim_dir: 0,
    anim_max: 4, last_dir: '0,0', move_speed: 0.15,
    directions: {
        '0,0': { id: 362, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
        '0,-1': { id: 365, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
        '0,1': { id: 365, flip: 2, rot: 0, dust: { x: 4, y: -2 } },
        '-1,0': { id: 363, flip: 1, rot: 0, dust: { x: 11, y: 5 } },
        '1,0': { id: 363, flip: 0, rot: 0, dust: { x: -2, y: 5 } },
        '1,-1': { id: 364, flip: 0, rot: 0, dust: { x: -2, y: 10 } },
        '-1,-1': { id: 364, flip: 1, rot: 0, dust: { x: 10, y: 10 } },
        '-1,1': { id: 364, flip: 3, rot: 0, dust: { x: 10, y: -2 } },
        '1,1': { id: 364, flip: 2, rot: 0, dust: { x: -2, y: -2 } }
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
    hand_item: { id: 0, count: 0 }, drag_offset: { x: 0, y: 0 }, item_stack: { id: 9, count: 100 }
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
const ITEMS = {
    "advanced_circuit": {
        name: "advanced_circuit", fancy_name: "advanced_circuit",
        id: 1, type: 'consumable', craftable: "BOTH", mining_time: undefined,
        sub_type: 'icon_only', stack_size: 100, info: "", smelting_time: undefined,
        fuel_time: undefined, recipe: {
            id: 1, crafting_time: 60 * 6, quant: 1,
            ingredients: [
                { name: "copper_cable", quant: 4 },
                { name: "green_circuit", quant: 2 },
                { name: "plastic_bar", quant: 2 },
            ],
        }
    },
    "electronic_circuit": {
        name: 'electronic_circuit', fancy_name: 'Electronic Circuit',
        id: 2, type: 'consumable', craftable: "BOTH", mining_time: undefined,
        sub_type: 'icon_only', stack_size: 100, info: "", smelting_time: undefined,
        fuel_time: undefined, recipe: {
            id: 2, crafting_time: 60 * 0.5, quant: 1,
            ingredients: [
                { name: "copper_cable", quant: 3 },
                { name: "iron_plate", quant: 1 }
            ],
        }
    },
    "iron_ore": {
        name: 'iron_ore', fancy_name: 'Iron Ore', smelting_time: 4 * 60,
        fuel_time: undefined, id: 3, type: 'ore', craftable: "NULL",
        mining_time: 4 * 60, sub_type: "null", stack_size: 100,
        info: 'Collected by laser, or mining drill. Found at iron ore deposits in the wild',
        recipe: undefined
    },
    "copper_ore": {
        name: 'copper_ore', fancy_name: 'Copper Ore',
        id: 4, type: 'ore', craftable: "NULL", smelting_time: 5 * 60,
        sub_type: "null", stack_size: 100, mining_time: 4 * 60,
        info: 'Collected by laser, or mining drill. Found at copper ore deposits in the wild',
        fuel_time: undefined, recipe: undefined
    },
    "stone": {
        name: 'stone', fancy_name: 'Stone Ore',
        id: 5, type: 'ore', craftable: "NULL", smelting_time: 2 * 60,
        sub_type: "null", stack_size: 100, mining_time: 2 * 60,
        info: 'Collected by laser, or mining drill. Found at stone ore deposits, and loose stones in the wild',
        fuel_time: undefined, recipe: undefined
    },
    "coal": {
        name: 'coal', fancy_name: 'Coal',
        id: 6, type: 'fuel', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: 3 * 60,
        info: 'Collected by laser, or mining drill. Found at coal ore deposits in the wild',
        fuel_time: 60 * 15, recipe: undefined
    },
    "uranium": {
        name: 'uranium', fancy_name: 'Uranium Ore',
        id: 7, type: 'liquid', craftable: "NULL", smelting_time: 5 * 60,
        sub_type: "null", stack_size: 100, mining_time: 4 * 60,
        info: 'Collected by mining drill only. Found at uranium ore deposits in the wild',
        fuel_time: undefined, recipe: undefined
    },
    "oil_shale": {
        name: 'oil_shale', fancy_name: 'Oil Shale',
        id: 8, type: 'liquid', craftable: "NULL", smelting_time: 5 * 60,
        sub_type: "null", stack_size: 100, mining_time: 4 * 60,
        info: 'Collected by laser, or mining drill. Found at oil-shale deposits in the wild',
        fuel_time: undefined, recipe: undefined
    },
    "transport_belt": {
        name: 'transport_belt', fancy_name: 'Transport Belt',
        id: 9, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 9, crafting_time: 60 * 0.5,
            quant: 2, ingredients: [
                { name: 'gear', quant: 1 },
                { name: 'iron_plate', quant: 1 }
            ]
        }
    },
    "splitter": {
        name: 'splitter', fancy_name: 'Splitter',
        id: 10, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 10, crafting_time: 60 * 1, quant: 2,
            ingredients: [
                { name: "electronic_circuit", quant: 5 },
                { name: "iron_plate", quant: 5 },
                { name: "transport_belt", quant: 4 }
            ]
        }
    },
    "inserter": {
        name: 'inserter', fancy_name: 'Inserter',
        id: 11, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 11, crafting_time: 60 * 0.5, quant: 1,
            ingredients: [
                { name: "electronic_circuit", quant: 1 },
                { name: "gear", quant: 1 },
                { name: "iron_plate", quant: 1 }
            ]
        }
    },
    "power_pole": {
        name: 'power_pole', fancy_name: 'Power Pole',
        id: 12, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: undefined
    },
    "mining_drill": {
        name: 'mining_drill', fancy_name: 'Mining Drill',
        id: 13, type: "placeable", craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 13, crafting_time: 60 * 2, quant: 2,
            ingredients: [
                { name: "electronic_circuit", quant: 3 },
                { name: "iron_plate", quant: 10 },
                { name: "gear", quant: 5 }
            ]
        }
    },
    "stone_furnace": {
        name: 'stone_furnace', fancy_name: 'Stone Furnace',
        id: 14, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 14, crafting_time: 60 * 0.5, quant: 1,
            ingredients: [
                { name: "stone", quant: 5 }
            ]
        }
    },
    "iron_plate": {
        name: 'iron_plate', fancy_name: 'Iron Plate',
        id: 15, type: 'ore', craftable: "NULL", smelting_time: 5 * 60,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        info: 'Obtained via smelting iron ore in a furnace',
        fuel_time: undefined, recipe: undefined
    },
    "copper_plate": {
        name: 'copper_plate', fancy_name: 'Copper Plate',
        id: 16, type: "intermediate", craftable: "NULL", smelting_time: 5 * 60,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        info: 'Obtained via smelting copper ore in a furnace',
        fuel_time: undefined, recipe: undefined
    },
    "stone_brick": {
        name: 'stone_brick', fancy_name: 'Stone Brick',
        id: 17, type: 'intermediate', craftable: "NULL", smelting_time: 10,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        info: 'Obtained via smelting stone ore in a furnace',
        fuel_time: undefined, recipe: undefined
    },
    "underground_belt": {
        name: 'underground_belt', fancy_name: 'Underground Belt',
        id: 18, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 18, crafting_time: 60 * 1, quant: 2,
            ingredients: [
                { name: "iron_plate", quant: 10 },
                { name: "transport_belt", quant: 5 }
            ]
        }
    },
    "assembly_machine": {
        name: 'assembly_machine', fancy_name: 'Assembly Machine',
        id: 19, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 21, crafting_time: 60 * 0.5, quant: 2,
            ingredients: [
                { name: "electronic_circuit", quant: 3 },
                { name: "gear", quant: 5 },
                { name: "iron_plate", quant: 9 }
            ]
        }
    },
    "gear": {
        name: 'gear', fancy_name: 'Gear',
        id: 20, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 20, crafting_time: 60 * 0.5, quant: 1,
            ingredients: [
                { name: "iron_plate", quant: 2 }
            ]
        }
    },
    "copper_cable": {
        name: 'copper_cable', fancy_name: 'Copper Cable',
        id: 21, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 21, crafting_time: 60 * 0.5, quant: 2,
            ingredients: [
                { name: "copper_plate", quant: 1 }
            ]
        }
    },
    "research_lab": {
        name: 'research_lab', fancy_name: 'Research Lab',
        id: 22, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 22, crafting_time: 60 * 2, quant: 1,
            ingredients: [
                { name: "electronic_circuit", quant: 10 },
                { name: "gear", quant: 10 },
                { name: "transport_belt", quant: 4 }
            ]
        }
    },
    "automation_pack": {
        name: 'automation_pack', fancy_name: 'Automation Pack',
        id: 23, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 23, crafting_time: 60 * 5, quant: 1,
            ingredients: [
                { name: "copper_plate", quant: 1 },
                { name: "gear", quant: 1 }
            ]
        }
    },
    "logistics_pack": {
        name: 'logistics_pack', fancy_name: 'Logistics Pack',
        id: 24, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 24, crafting_time: 60 * 6, quant: 1,
            ingredients: [
                { name: "inserter", quant: 1 },
                { name: "transport_belt", quant: 1 }
            ]
        }
    },
    "biology_pack": {
        name: 'biology_pack', fancy_name: 'Biology Pack',
        id: 25, type: 'oil', craftable: "BIO_REFINERY", smelting_time: undefined,
        sub_type: 'craftable', stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "Crafed in a Bio Refinery",
        recipe: {
            id: 25, crafting_time: 60 * 10, quant: 1,
            ingredients: [
                { name: "fiber", quant: 25 },
                { name: "coal", quant: 5 },
                { name: "oil_shale", quant: 10 }
            ]
        }
    },
    "production_pack": {
        name: 'production_pack', fancy_name: 'Production Pack',
        id: 26, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: 'craftable', stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 26, crafting_time: 60 * 20, quant: 1,
            ingredients: [
                { name: "bio_refinery", quant: 1 },
                { name: "steel_plate", quant: 5 },
                { name: "processing_unit", quant: 1 }
            ]
        }
    },
    "steel_plate": {
        name: 'steel_plate', fancy_name: 'Steel Plate',
        id: 27, type: 'intermediate', craftable: "BOTH", smelting_time: 180,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        info: 'Obtained via smelting 2x iron plates in a furnace',
        fuel_time: undefined, recipe: undefined
    },
    "wood": {
        name: 'wood', fancy_name: 'Wood Planks',
        id: 28, type: 'fuel', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: 1 * 2 * 60, info: 'Obtained via chopping trees in the wild',
        recipe: undefined
    },
    "solar_panel": {
        name: 'solar_panel', fancy_name: 'Solar Panel',
        id: 29, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 29, crafting_time: 4.5 * 60, quant: 1,
            ingredients: [
                { name: "copper_plate", quant: 5 },
                { name: "electronic_circuit", quant: 15 },
                { name: "steel_plate", quant: 5 }
            ]
        }
    },
    "bio_refinery": {
        name: 'bio_refinery', fancy_name: 'Bio-Refinery',
        id: 30, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 10, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 30, crafting_time: 10 * 60, quant: 1,
            ingredients: [
                { name: "copper_plate", quant: 5 },
                { name: "electronic_circuit", quant: 15 },
                { name: "steel_plate", quant: 5 }
            ]
        }
    },
    "engine_unit": {
        name: 'engine_unit', fancy_name: 'Biofuel Engine',
        id: 31, type: 'intermediate', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 5, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 31, crafting_time: 10 * 60, quant: 1,
            ingredients: [
                { name: "gear", quant: 3 },
                { name: "steel_plate", quant: 2 },
                { name: "electronic_circuit", quant: 1 }
            ]
        }
    },
    "fiber": {
        name: 'fiber', fancy_name: 'Organic Fibers',
        id: 32, type: "oil", craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 200, mining_time: undefined,
        fuel_time: undefined, info: 'Acquired via laser mining or made in Bio Refinery',
        recipe: {
            id: 32, crafting_time: 3 * 60, quant: 50,
            ingredients: [
                { name: "wood", quant: 10 }
            ]
        }
    },
    "chest": {
        name: 'chest', fancy_name: 'Storage Chest',
        id: 33, type: 'placeable', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: "",
        recipe: {
            id: 33, crafting_time: 60 * 3, quant: 1,
            ingredients: [
                { name: "wood", quant: 10 }
            ]
        }
    },
    "laser_mining_speed": {
        name: 'laser_mining_speed', fancy_name: 'Laser Mining 1 Upgrade',
        id: 34, type: 'upgrade', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: undefined, mining_time: undefined,
        fuel_time: undefined, info: 'Increases mining speed by 150%',
        recipe: undefined
    },
    "biofuel": {
        name: 'biofuel', fancy_name: 'Solid Biofuel',
        id: 35, type: 'oil', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 20, mining_time: undefined,
        fuel_time: undefined, info: 'Crafed in a Bio Refinery',
        recipe: {
            id: 32, crafting_time: 60 * 3, quant: 5,
            ingredients: [
                { name: "coal", quant: 1 },
                { name: "oil_shale", quant: 5 },
                { name: "fiber", quant: 10 }
            ]
        }
    },
    "plastic_bar": {
        name: 'plastic_bar', fancy_name: 'Plastic Bar',
        id: 36, type: 'oil', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'Crafed in a Bio Refinery',
        recipe: {
            id: 36, crafting_time: 15, quant: 2,
            ingredients: [
                { name: "coal", quant: 1 },
                { name: "oil_shale", quant: 5 },
                { name: "fiber", quant: 10 }
            ]
        }
    },
    "processing_unit": {
        name: 'processing_unit', fancy_name: 'Processing Unit',
        id: 36, type: 'oil', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'Crafed in a Bio Refinery',
        recipe: {
            id: 37, crafting_time: 10, quant: 2,
            ingredients: [
                { name: "electronic_circuit", quant: 10 },
                { name: "advanced_circuit", quant: 10 },
                { name: "biofuel", quant: 10 }
            ]
        }
    },
    "laser_mining_speed2": {
        name: 'laser_mining_speed2', fancy_name: 'Laser Mining 2 Upgrade',
        id: 38, type: "upgrade", craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: undefined, mining_time: undefined,
        fuel_time: undefined, info: 'Increases mining speed by +150%',
        recipe: undefined
    },
    "laser_mining_speed3": {
        name: 'laser_mining_speed3', fancy_name: 'Laser Mining 3 Upgrade',
        id: 39, type: "upgrade", craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: undefined, mining_time: undefined,
        fuel_time: undefined, info: 'Increases mining speed by +150%',
        recipe: undefined
    },
    "rocket_silo": {
        name: 'rocket_silo', fancy_name: 'Rocket Silo',
        id: 40, type: 'placeable', craftable: "MACHINE", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'placeholder rocket text',
        recipe: {
            id: 40, crafting_time: 60 * 10, quant: 1,
            ingredients: [
                { name: "stone_brick", quant: 250 },
                { name: "iron_plate", quant: 100 },
                { name: "copper_plate", quant: 100 },
                { name: "refined_oil_chunk", quant: 100 }
            ]
        }
    },
    "rocket_part": {
        name: 'rocket_part', fancy_name: 'Rocket Part',
        id: 41, type: 'intermediate', craftable: "BOTH", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'An intermediate product used in repairing rockets',
        recipe: {
            id: 41, crafting_time: 60 * 5, quant: 2,
            ingredients: [
                { name: "electronic_circuit", quant: 10 },
                { name: "advanced_circuit", quant: 10 },
                { name: "iron_plate", quant: 25 },
                { name: "stone_brick", quant: 25 },
            ]
        }
    },
    "rocket_fuel": {
        name: 'rocket_fuel', fancy_name: 'Rocket Fuel',
        id: 42, type: 'oil', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'Like my grandpa\'s whiskey',
        recipe: {
            id: 42, crafting_time: 60 * 5, quant: 5,
            ingredients: [
                { name: "iron_plate", quant: 5 },
                { name: "copper_plate", quant: 5 },
                { name: "refined_oil_chunk", quant: 10 },
                { name: "biofuel", quant: 10 },
            ]
        }
    },
    "rocket_control_unit": {
        name: 'rocket_control_unit', fancy_name: 'Rocket Control Unit',
        id: 43, type: 'intermediate', craftable: "MACHINE", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: 'High-tech electronics used to re-build rockets',
        recipe: {
            id: 43, crafting_time: 60 * 5, quant: 1,
            ingredients: [
                { name: "plastic_bar", quant: 5 },
                { name: "advanced_circuit", quant: 10 },
                { name: "electronic_circuit", quant: 10 },
                { name: "iron_plate", quant: 5 },
            ]
        }
    },
    "rocket_science_pack": {
        name: 'rocket_science_pack', fancy_name: 'Rocket Science Pack',
        id: 44, type: 'intermediate', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 100, mining_time: undefined,
        fuel_time: undefined, info: '1k Obtained from a Rocket Silo after launching a rocket into space',
        recipe: undefined
    },
    "refined_oil_chunk": {
        name: 'refined_oil_chunk', fancy_name: 'Refined Oil Chunk',
        id: 45, type: 'oil', craftable: "NULL", smelting_time: undefined,
        sub_type: "null", stack_size: 50, mining_time: undefined,
        fuel_time: undefined, info: 'Condensed heavy oil, used in high-grade fuels',
        recipe: {
            id: 45, crafting_time: 60 * 1.5, quant: 2,
            ingredients: [
                { name: "oil_shale", quant: 10 }
            ]
        }
    },
};
const UNLOCKED_ITEMS = {
    "advanced_circuit": false,
    "electronic_circuit": true,
    "iron_ore": true,
    "copper_ore": true,
    "stone": true,
    "coal": true,
    "uranium": true,
    "oil_shale": true,
    "transport_belt": true,
    "splitter": false,
    "inserter": false,
    "power_pole": false,
    "mining_drill": false,
    "stone_furnace": true,
    "iron_plate": true,
    "copper_plate": true,
    "stone_brick": true,
    "underground_belt": false,
    "assembly_machine": false,
    "gear": true,
    "copper_cable": true,
    "research_lab": true,
    "automation_pack": true,
    "logistics_pack": false,
    "biology_pack": false,
    "production_pack": false,
    "steel_plate": false,
    "wood": true,
    "solar_panel": false,
    "bio_refinery": false,
    "engine_unit": false,
    "fiber": true,
    "chest": true,
    "laser_mining_speed": false,
    "biofuel": false,
    "plastic_bar": false,
    "processing_unit": false,
    "laser_mining_speed2": false,
    "laser_mining_speed3": false,
    "rocket_silo": false,
    "rocket_part": false,
    "rocket_fuel": false,
    "rocket_control_unit": false,
    "rocket_science_pack": false,
    "refined_oil_chunk": false
};
const UI = new Ui();
const TILEMAN = new Tilemanager();
const CRAFT_MENU = new CraftMenu();
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
let state = "start";
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
    if (ENTS[k].type === 'underground_belt') {
        return k;
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
    if (UI.active_window !== undefined && UI.active_window.is_hovered(CURSOR.x, CURSOR.y)) {
        if ((CURSOR.l && !CURSOR.ll) || (CURSOR.r && !CURSOR.lr)) {
            if (UI.active_window.click(CURSOR.x, CURSOR.y)) {
            }
        }
        return;
    }
    if (CRAFT_MENU.vis && CRAFT_MENU.is_hovered(CURSOR.x, CURSOR.y)) {
        if (CURSOR.l && !CURSOR.ll) {
            if (CRAFT_MENU.click(CURSOR.x, CURSOR.y, 'left')) {
                return;
            }
        }
        else if (CURSOR.r && CURSOR.lr) {
            if (CRAFT_MENU.click(CURSOR.x, CURSOR.y, 'right')) {
                return;
            }
        }
        if (CRAFT_MENU.vis && CURSOR.panel_drag) {
            CRAFT_MENU.x = Math.max(1, Math.min(CURSOR.x + CURSOR.drag_offset.x, 239 - CRAFT_MENU.w));
            CRAFT_MENU.y = Math.max(1, Math.min(CURSOR.y + CURSOR.drag_offset.y, 135 - CRAFT_MENU.h));
            return;
        }
        if (CRAFT_MENU.vis && !CURSOR.panel_drag && CURSOR.l && !CURSOR.ll && CRAFT_MENU.is_hovered(CURSOR.x, CURSOR.y)) {
            if (CRAFT_MENU.click(CURSOR.x, CURSOR.y, undefined)) {
                return;
            }
            else if (!CRAFT_MENU.docked) {
                CURSOR.panel_drag = true;
                CURSOR.drag_offset.x = CRAFT_MENU.x - CURSOR.x;
                CURSOR.drag_offset.y = CRAFT_MENU.y - CURSOR.y;
                return;
            }
        }
        return;
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
function draw_terrain() {
    TILEMAN.draw_terrain(31, 18);
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
function toggle_crafting(force) {
    if (force) {
        CRAFT_MENU.vis = true;
    }
    else {
        CRAFT_MENU.vis = !CRAFT_MENU.vis;
    }
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
    const gv_time = lapse(get_visible_ents);
    const m_time = lapse(draw_terrain);
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
        if (v.type === 'transport_belt' && v instanceof BeltEntity) {
            v.beltDrawn = false;
            v.curveChecked = false;
        }
    });
    last_frame_time = time();
    tick = tick + 1;
    drawText(`x: ${CURSOR.x}\ny: ${CURSOR.y}\nL: ${CURSOR.l}\nR: ${CURSOR.r}`, 0, 0, 25, "white", "top", "left");
    requestAnimationFrame(TIC);
}
BOOT();
