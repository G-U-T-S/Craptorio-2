import render from "../engine/render.js";
import Label from "./label.js";
import { items } from "./definitions.js";
export default class Inventory {
    slots = new Map();
    slotSize;
    pos;
    size;
    rows;
    cols;
    panelText;
    visible = false;
    constructor(panelText, x, y, rows, cols, slotSize, width, height) {
        this.panelText = panelText;
        this.pos = { x: x, y: y };
        this.size = { w: width, h: height };
        this.rows = rows;
        this.cols = cols;
        this.slotSize = slotSize;
        let index = 0;
        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {
                this.slots.set(index, { x: this.pos.x + (x * this.slotSize), y: this.pos.y + (y * this.slotSize), itemName: "", quant: 0 });
                index++;
            }
        }
    }
    draw() {
        render.drawPanel(this.pos.x, this.pos.y, this.size.w, this.size.h, "blue", "darkBlue", new Label(this.panelText, "white", "white", { x: 1, y: 1 }));
        if (this.rows + this.cols > 2) {
            render.drawGrid(this.pos.x, this.pos.y, this.rows, this.cols, "white", "white", this.slotSize, this.slotSize, false, false);
        }
        else {
            render.drawRect(this.pos.x, this.pos.y, this.slotSize, this.slotSize, "white", "white");
        }
        this.slots.forEach((slot) => {
            if (slot.itemName !== "" && slot.quant <= 0) {
                slot.itemName = "";
            }
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
    depositStack(slotIndex, itemName, quant, force) {
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
    removeStack(index, itemName, quant, force) {
        const returnData = { itemName: itemName, quant: quant };
        const slot = this.slots.get(index);
        let remaining = quant;
        if (slot !== undefined && slot.itemName === itemName) {
            if (slot.quant - remaining >= 0) {
                slot.quant -= remaining;
                remaining = 0;
            }
            else {
                remaining -= slot.quant;
                slot.quant = 0;
            }
        }
        if (force && remaining > 0) {
            this.slots.forEach((slot) => {
                if (slot.itemName === itemName && remaining > 0) {
                    if (slot.quant - remaining >= 0) {
                        slot.quant -= remaining;
                        remaining = 0;
                    }
                    else {
                        remaining -= slot.quant;
                        slot.quant = 0;
                    }
                }
            });
        }
        returnData.quant -= remaining;
        if (returnData.quant <= 0) {
            return undefined;
        }
        return returnData;
    }
    hasStack(itemName, quant) {
        let sum = 0;
        this.slots.forEach((slot) => {
            if (slot.itemName === itemName) {
                sum += slot.quant;
            }
        });
        if (sum >= quant) {
            return true;
        }
        return false;
    }
    swapStacks(index, itemName, quant) {
        const returnData = { itemName: itemName, quant: quant };
        const slot = this.getSlot(index);
        if (slot !== undefined) {
            returnData.itemName = slot.itemName;
            returnData.quant = slot.quant;
            slot.itemName = itemName;
            slot.quant = quant;
        }
        return returnData;
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
