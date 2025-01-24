import render from "./render.js";
import cursor from "./cursor.js";
import Label from "./label.js";
import { items } from "./definitions.js";
class Inventory {
    offSet = 8;
    slotSize = (8 * 6) + this.offSet;
    rows = 8;
    colomns = 8;
    w = this.slotSize * this.colomns;
    h = this.slotSize * this.rows;
    x = (render.size.w / 2) - (this.w / 2);
    y = (render.size.h / 2) - (this.h / 2);
    slots = new Map();
    hotbarSlots = new Map();
    visible = false;
    hotbarVisible = true;
    constructor() {
        let index = 0;
        for (let x = 0; x < this.colomns; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.slots.set(index, { x: this.x + (x * this.slotSize), y: this.y + (y * this.slotSize), itemName: "", quant: 0 });
                index++;
            }
        }
        index = 0;
        const hx = render.center.x - (this.w / 2);
        const hy = render.size.h - (this.slotSize + 4);
        for (let x = 0; x < this.colomns; x++) {
            this.hotbarSlots.set(index, { x: hx + (x * this.slotSize), y: hy, itemName: "", quant: 0 });
            index++;
        }
    }
    draw() {
        const slot = this.getHoveredSlot(cursor.x, cursor.y);
        if (this.visible) {
            render.drawPanel(this.x, this.y, this.w, this.h, "blue", "blue", "drakBlue", new Label("Inventory", "black", "white", { x: 1, y: 1 }));
            render.drawGrid(this.x, this.y, this.rows, this.colomns, "white", "white", this.slotSize, false, false);
            this.slots.forEach((slot) => {
                if (slot.itemName !== "") {
                    render.drawItemStack(slot.itemName, 5, slot.x + this.offSet + 2, slot.y + this.offSet + 2, slot.quant, true);
                }
            });
        }
        if (this.hotbarVisible) {
            const hx = render.center.x - (this.w / 2);
            const hy = render.size.h - (this.slotSize + 4);
            render.drawPanel(hx, hy, this.w, this.slotSize + 4, "blue", "blue", "darkBlue");
            render.drawGrid(hx, hy, 1, this.colomns, "white", "white", this.slotSize);
            this.hotbarSlots.forEach((slot) => {
                if (slot.itemName !== "") {
                    render.drawItemStack(slot.itemName, 5, slot.x + this.offSet + 2, slot.y + this.offSet + 2, slot.quant, true);
                }
            });
        }
    }
    getHoveredSlot(x, y) {
        let result = undefined;
        this.slots.forEach((slot, index) => {
            if (cursor.x >= slot.x && cursor.x <= (slot.x + this.slotSize) && cursor.y >= slot.y && cursor.y <= (slot.y + this.slotSize)) {
                result = { target: "inventory", index: index };
            }
        });
        this.hotbarSlots.forEach((slot, index) => {
            if (cursor.x >= slot.x && cursor.x <= (slot.x + this.slotSize) && cursor.y >= slot.y && cursor.y <= (slot.y + this.slotSize)) {
                result = { target: "hotbar", index: index };
            }
        });
        return result;
    }
    isHovered(x, y) {
        if (this.visible && x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
            return true;
        }
        const hx = render.center.x - (this.w / 2);
        const hy = render.size.h - (this.slotSize + 4);
        if (x >= hx && x <= hx + this.w && y >= hy && y <= hy + this.slotSize + 4) {
            return true;
        }
        return false;
    }
    click(x, y) {
        const slot = this.getHoveredSlot(x, y);
        if (slot !== undefined) {
            this.slotClick(slot.index, slot.target);
            return true;
        }
        return false;
    }
    slotClick(index, target) {
        let slot;
        if (target === "inventory") {
            slot = this.slots.get(index);
        }
        else if (target === "hotbar") {
            slot = this.hotbarSlots.get(index);
        }
        if (cursor.type === 'item') {
            if (slot?.itemName === "") {
                slot.itemName = cursor.itemStack.name;
                if (cursor.r) {
                    slot.quant += 1;
                    cursor.itemStack.quant = cursor.itemStack.quant - 1;
                    if (cursor.itemStack.quant < 1) {
                        cursor.setItem();
                    }
                }
                else if (cursor.l) {
                    slot.quant = cursor.itemStack.quant;
                    cursor.setItem();
                }
            }
            else if (slot?.itemName == cursor.itemStack.name) {
                if (cursor.r) {
                    if (slot.quant < items[slot.itemName].stackSize) {
                        slot.quant += 1;
                        cursor.itemStack.quant = cursor.itemStack.quant - 1;
                        if (cursor.itemStack.quant < 1) {
                            cursor.setItem();
                        }
                        return;
                    }
                }
                else if (cursor.l) {
                    if (slot.quant == items[slot.itemName].stackSize) {
                        const stack = { name: slot.itemName, quant: slot.quant };
                        slot.quant = cursor.itemStack.quant;
                        cursor.itemStack.name = stack.name;
                        cursor.itemStack.quant = stack.quant;
                    }
                    else if (slot.quant + cursor.itemStack.quant <= items[slot.itemName].stackSize) {
                        slot.quant += cursor.itemStack.quant;
                        cursor.itemStack.quant = 0;
                    }
                    else if (slot.quant < items[slot.itemName].stackSize) {
                        const diff = items[slot.itemName].stackSize - slot.quant;
                        cursor.itemStack.quant = cursor.itemStack.quant - diff;
                        slot.quant = items[slot.itemName].stackSize;
                    }
                    if (cursor.itemStack.quant < 1) {
                        cursor.setItem();
                    }
                    return;
                }
            }
            else if (slot !== undefined) {
                const invStack = { itemName: slot.itemName, quant: slot.quant };
                slot.itemName = cursor.itemStack.name;
                slot.quant = cursor.itemStack.quant;
                cursor.itemStack.name = invStack.itemName;
                cursor.itemStack.quant = invStack.quant;
                cursor.type = 'item';
            }
        }
        else if (cursor.type === 'pointer') {
            if (slot !== undefined && slot.itemName !== "") {
                if (cursor.r && slot.quant > 1) {
                    const half = Math.floor(slot.quant / 2);
                    const remainder = slot.quant - half;
                    cursor.setItem({ name: slot.itemName, quant: remainder });
                    slot.quant = half;
                    return;
                }
                cursor.itemStack.name = slot.itemName;
                cursor.itemStack.quant = slot.quant;
                cursor.type = 'item';
                slot.itemName = "";
                slot.quant = 0;
            }
        }
    }
}
const inv = new Inventory();
export default inv;
