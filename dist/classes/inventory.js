import render from "./render.js";
import { items } from "./definitions.js";
export default class Inventory {
    slots = new Map();
    slotSize;
    pos;
    size;
    rows;
    cols;
    visible = false;
    constructor(x, y, rows, cols, slotSize, width, height) {
        this.pos = { x: x, y: y };
        this.size = { w: width, h: height };
        this.rows = rows;
        this.cols = cols;
        this.slotSize = slotSize;
        let index = 0;
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                this.slots.set(index, { x: this.pos.x + (x * this.slotSize), y: this.pos.y + (y * this.slotSize), itemName: "", quant: 0 });
                index++;
            }
        }
    }
    draw() {
        render.drawPanel(this.pos.x, this.pos.y, this.size.w, this.size.h, "blue", "blue", "drakBlue");
        render.drawGrid(this.pos.x, this.pos.y, this.rows, this.cols, "white", "white", this.slotSize, false, false);
        this.slots.forEach((slot) => {
            if (slot.itemName !== "") {
                render.drawItemStack(slot.itemName, 4, slot.x + (this.slotSize / 5), slot.y + (this.slotSize / 5), slot.quant, true);
            }
        });
    }
    getSlot(index) {
        return this.slots.get(index);
    }
    getHoveredSlot(x, y) {
        let result;
        this.slots.forEach((slot) => {
            if (x >= slot.x && x <= (slot.x + this.slotSize) && y >= slot.y && y <= (slot.y + this.slotSize)) {
                result = slot;
            }
        });
        return result;
    }
    isHovered(x, y) {
        if (this.visible && x >= this.pos.x && x <= this.pos.x + this.size.w && y >= this.pos.y && y <= this.pos.y + this.size.h) {
            return true;
        }
        const hx = render.center.x - (this.size.w / 2);
        const hy = render.size.h - (this.slotSize + 4);
        if (x >= hx && x <= hx + this.size.w && y >= hy && y <= hy + this.slotSize + 4) {
            return true;
        }
        return false;
    }
    depositStack(itemName, quant, slotIndex, force) {
        const slot = this.slots.get(slotIndex);
        let returnData = { itemName: itemName, quant: quant };
        if (slot !== undefined) {
            if (slot.itemName === "" || slot.itemName === itemName) {
                slot.itemName = itemName;
                const availableSpace = items[itemName].stackSize - slot.quant;
                const toAdd = Math.min(returnData.quant, availableSpace);
                slot.quant += toAdd;
                returnData.quant -= toAdd;
            }
        }
        if (force && returnData.quant > 0) {
            this.slots.forEach((slot) => {
                if ((slot.itemName === "" || slot.itemName === itemName) && returnData.quant > 0) {
                    slot.itemName = itemName;
                    const availableSpace = items[itemName].stackSize - slot.quant;
                    const toAdd = Math.min(returnData.quant, availableSpace);
                    slot.quant += toAdd;
                    returnData.quant -= toAdd;
                }
                else {
                    return;
                }
            });
        }
        if (returnData.quant <= 0) {
            returnData.itemName = "";
        }
        return returnData;
    }
    removeStack(index) {
        const slot = this.getSlot(index);
        if (slot !== undefined) {
            const name = slot.itemName;
            slot.itemName = "";
            const quant = slot.quant;
            slot.quant = 0;
            return { itemName: name, quant: quant };
        }
        return undefined;
    }
    moveTo(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        let index = 0;
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const slot = this.getSlot(index);
                if (slot !== undefined) {
                    slot.x = this.pos.x + (x * this.slotSize);
                    slot.y = this.pos.y + (y * this.slotSize);
                }
                index++;
            }
        }
    }
}
