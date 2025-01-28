import cursor from "./cursor.js";
import render from "./render.js";
import { items } from "./definitions.js";
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
    draw() {
        render.drawRect(this.x, this.y, this.w, this.h, "blue", "darkBlues");
        const x = this.x + (this.w / 2) - ((8 * 5) / 2);
        const y = this.y + (this.h / 2) - ((8 * 5) / 2);
        ;
        render.drawSprite("staticSprite", 5, x, y, items[this.name].atlasCoord.normal.x, items[this.name].atlasCoord.normal.y);
    }
}
class CraftMenu {
    cols = 1;
    rows = 1;
    btnSize = 8 * 6;
    w = this.btnSize * this.cols;
    h = this.btnSize * this.rows;
    x = (render.size.w / 2) + 5;
    y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
    buttons = [];
    page = 0;
    constructor() {
        render.addResizeListener(() => {
            this.x = (render.size.w / 2) + 5;
            this.y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
            let index = 0;
            for (let x = 0; x < this.rows; x++) {
                for (let y = 0; y < this.cols; y++) {
                    const btn = this.buttons[index];
                    btn.x = this.x + (x * this.btnSize);
                    btn.y = this.y + (y * this.btnSize);
                }
                index++;
            }
        });
        const namesArray = [
            "green_circuit",
        ];
        let index = 0;
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                this.buttons.push(new ItemButton(namesArray[index], this.x + (x * this.btnSize), this.y + (y * this.btnSize), this.btnSize, this.btnSize));
            }
            index++;
        }
    }
    draw() {
        render.drawSprite("staticSprite", 7, this.x + ((8 * 5) / 2), (this.y - 24 * 4) + ((8 * 5) / 2), 48, 40, 8, 8);
        render.drawRect(this.x, this.y - 24 * 4, this.w, this.h, "blue", "blue");
        render.drawGrid(this.x, this.y - 24 * 4, 1, 3, "white", "white", 112, 96);
        this.buttons.forEach((btn) => {
            btn.draw();
        });
    }
    isHovered(x, y) {
        if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        return false;
    }
    handleClick(x, y) {
        this.buttons.forEach((btn) => {
            if (btn.isHovered(cursor.x, cursor.y)) {
                this.craft(btn.name);
                return;
            }
        });
    }
    craft(itemName) {
        console.log(itemName);
    }
}
const craftMenu = new CraftMenu();
export default craftMenu;
