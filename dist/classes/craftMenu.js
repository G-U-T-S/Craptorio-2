import cursor from "./cursor.js";
import render from "./render.js";
import playerInv from "./playerInv.js";
import { items, recipes } from "./definitions.js";
class ItemButton {
    x;
    y;
    w;
    h;
    name;
    constructor(name, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.name = name;
    }
    isHovered(x, y) {
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        return false;
    }
    draw(spriteScale, border) {
        render.drawRect(this.x, this.y, this.w, this.h, "blue", "darkBlue");
        if (border) {
            render.drawEmptyRect(this.x, this.y, this.w, this.h, "white");
        }
        const x = this.x + (this.w / 2) - ((8 * spriteScale) / 2);
        const y = this.y + (this.h / 2) - ((8 * spriteScale) / 2) + 1;
        render.drawSprite("staticSprite", spriteScale, x, y, items[this.name].atlasCoord.normal.x, items[this.name].atlasCoord.normal.y);
    }
}
class CraftMenu {
    cols = 5;
    rows = 7;
    btnSize = 8 * 6;
    w = this.btnSize * 7;
    h = this.btnSize * 7;
    x = (render.size.w / 2) + 5;
    y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
    craftButtons = [[], [], []];
    tabButtons = [];
    actualTab = 0;
    constructor() {
        render.addResizeListener(() => {
            this.x = (render.size.w / 2) + 5;
            this.y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
            let index = 0;
            for (let y = 0; y < this.cols; y++) {
                for (let x = 0; x < this.rows; x++) {
                    const btn = this.craftButtons[0][index];
                    if (btn !== undefined) {
                        btn.x = this.x + (x * this.btnSize);
                        btn.y = this.y + (y * this.btnSize);
                    }
                }
                index++;
            }
            index = 0;
            for (let y = 0; y < this.cols; y++) {
                for (let x = 0; x < this.rows; x++) {
                    const btn = this.craftButtons[1][index];
                    if (btn !== undefined) {
                        btn.x = this.x + (x * this.btnSize);
                        btn.y = this.y + (y * this.btnSize);
                    }
                }
                index++;
            }
            index = 0;
            for (let y = 0; y < this.cols; y++) {
                for (let x = 0; x < this.rows; x++) {
                    const btn = this.craftButtons[2][index];
                    if (btn !== undefined) {
                        btn.x = this.x + (x * this.btnSize);
                        btn.y = this.y + (y * this.btnSize);
                    }
                }
                index++;
            }
        });
        const namesArrayZero = [
            "wood_chest", "", "", "", "", "", "",
            "transport_belt", "underground_belt", "splitter", "", "", "", "",
            "inserter", "", "", "", "", "", "",
            "stone_furnace", "mining_drill", "", "", "", "", "",
            "assembly_machine", "", "", "", "", "", "",
        ];
        let index = 0;
        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {
                if (namesArrayZero[index] !== "" && items[namesArrayZero[index]] !== undefined) {
                    this.craftButtons[0].push(new ItemButton(namesArrayZero[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize));
                }
                index++;
            }
        }
        const namesArrayOne = [
            "green_circuit", "red_circuit", "blue_circuit", "", "", "", "",
            "copper_plate", "iron_plate", "stone_brick", "steel", "plastic_bar", "sulfur", "",
            "gear", "copper_wire", "", "", "", "", "",
            "", "", "", "", "", "", "",
            "", "", "", "", "", "", "",
        ];
        index = 0;
        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {
                if (namesArrayOne[index] !== "" && items[namesArrayOne[index]] !== undefined) {
                    this.craftButtons[1].push(new ItemButton(namesArrayOne[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize));
                }
                index++;
            }
        }
        const namesArrayTwo = [
            "wood", "copper_ore", "iron_ore", "stone_ore", "coal_ore", "uranium_ore", "",
            "research_lab", "", "", "", "", "", "",
            "", "", "", "", "", "", "",
            "", "", "", "", "", "", "",
            "red_cience", "green_cience", "blue_cience", "black_cience", "white_cience", "", "",
        ];
        index = 0;
        for (let y = 0; y < this.cols; y++) {
            for (let x = 0; x < this.rows; x++) {
                if (namesArrayTwo[index] !== "" && items[namesArrayTwo[index]] !== undefined) {
                    this.craftButtons[2].push(new ItemButton(namesArrayTwo[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize));
                }
                index++;
            }
        }
        const tabsArray = ["inserter", "green_circuit", "red_cience"];
        index = 0;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 1; y++) {
                this.tabButtons.push(new ItemButton(tabsArray[index], this.x + (x * 112), this.y - 96, 112, 96));
                index++;
            }
        }
    }
    draw() {
        render.drawRect(this.x, this.y - 24 * 4, this.w, this.h, "blue", "blue");
        this.tabButtons.forEach((tab) => {
            tab.draw(7, true);
        });
        this.craftButtons[this.actualTab].forEach((btn) => {
            btn.draw(5, false);
        });
        render.drawGrid(this.x, this.y, this.cols, this.rows, "white", "white", this.btnSize, this.btnSize);
    }
    isHovered(x, y) {
        if (x >= this.x && x <= this.x + this.w && y >= this.y - (24 * 4) && y <= (this.y - (24 * 4)) + this.h) {
            return true;
        }
        return false;
    }
    handleClick(x, y) {
        let consumed = false;
        this.tabButtons.forEach((tab) => {
            if (tab.isHovered(x, y)) {
                switch (tab.name) {
                    case "inserter": {
                        this.actualTab = 0;
                        break;
                    }
                    case "green_circuit": {
                        this.actualTab = 1;
                        break;
                    }
                    case "red_cience": {
                        this.actualTab = 2;
                        break;
                    }
                }
                consumed = true;
                return;
            }
        });
        if (!consumed) {
            this.craftButtons[this.actualTab].forEach((btn) => {
                if (btn.isHovered(cursor.x, cursor.y)) {
                    this.craft(btn.name, 1);
                    return;
                }
            });
        }
    }
    craft(itemName, quant) {
        if (recipes[itemName] !== undefined) {
            const toBeRemoved = {};
            const stack = [];
            let iterations = 0;
            recipes[itemName].ingredients.forEach((ing) => {
                stack.push({ name: ing.name, quant: ing.quant * quant });
            });
            while (stack.length > 0 && iterations <= 50) {
                const topItem = stack[stack.length - 1];
                const recipe = recipes[topItem.name];
                if (recipe === undefined) {
                    if (toBeRemoved[topItem.name] === undefined) {
                        toBeRemoved[topItem.name] = topItem.quant;
                    }
                    else {
                        toBeRemoved[topItem.name] += topItem.quant;
                    }
                    stack.pop();
                }
                else {
                    stack.pop();
                    if (playerInv.hasStack(topItem.name, topItem.quant)) {
                        if (toBeRemoved[topItem.name] === undefined) {
                            toBeRemoved[topItem.name] = topItem.quant;
                        }
                        else {
                            toBeRemoved[topItem.name] += topItem.quant;
                        }
                    }
                    else {
                        recipes[topItem.name].ingredients.forEach((ing) => {
                            stack.push({ name: ing.name, quant: ing.quant * quant });
                        });
                    }
                }
                iterations++;
            }
            for (let item in toBeRemoved) {
                if (!playerInv.hasStack(item, toBeRemoved[item])) {
                    return;
                }
            }
            for (let name in toBeRemoved) {
                playerInv.removeStack(0, name, toBeRemoved[name], true);
            }
            playerInv.depositStack(0, itemName, recipes[itemName].outputQuant * quant, true);
        }
    }
}
const craftMenu = new CraftMenu();
export default craftMenu;
