import render from "../engine/render.js";
import cursor from "../engine/cursor.js";
import Inventory from "./inventory.js";
import { items } from "./definitions.js";
const cols = 7;
const rows = 7;
const slotSize = 8 * 6;
const w = slotSize * cols;
const h = slotSize * rows;
const x = (render.size.w / 2) - w - 15;
const y = (render.size.h / 2) - (h / 2);
class PlayerInv extends Inventory {
    constructor() {
        super("Inventory", x, y, rows, cols, slotSize, w, h);
        this.depositStack(0, "copper_plate", 200, true);
        this.depositStack(0, "iron_plate", 200, true);
        this.depositStack(0, "steel", 100, true);
        this.depositStack(0, "stone_brick", 100, true);
        this.depositStack(0, "stone_ore", 50, true);
        this.depositStack(0, "wood", 50, true);
        this.depositStack(0, "stone_furnace", 5, true);
        this.depositStack(0, "coal_ore", 50, true);
    }
    handleClick(x, y) {
        const slot = this.getHoveredSlot(x, y);
        if (slot !== undefined) {
            if (cursor.type === 'item') {
                if (slot.itemName === "") {
                    slot.itemName = cursor.itemStack.name;
                    if (cursor.r) {
                        slot.quant += 1;
                        cursor.itemStack.quant = cursor.itemStack.quant - 1;
                        if (cursor.itemStack.quant < 1) {
                            cursor.checkStack();
                        }
                    }
                    else if (cursor.l) {
                        slot.quant = cursor.itemStack.quant;
                        cursor.setStack();
                    }
                }
                else if (slot.itemName == cursor.itemStack.name) {
                    if (cursor.r) {
                        if (slot.quant < items[slot.itemName].stackSize) {
                            slot.quant += 1;
                            cursor.itemStack.quant = cursor.itemStack.quant - 1;
                            if (cursor.itemStack.quant < 1) {
                                cursor.checkStack();
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
                            cursor.checkStack();
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
                        cursor.setStack({ name: slot.itemName, quant: remainder });
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
}
const playerInv = new PlayerInv();
export default playerInv;
