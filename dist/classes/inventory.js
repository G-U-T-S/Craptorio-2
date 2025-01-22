import render from "./render.js";
import cursor from "./cursor.js";
import Label from "./label.js";
class Inventory {
    offSet = 5;
    slotSize = (8 * 4) + this.offSet;
    rows = 8;
    colomns = 8;
    w = this.slotSize * this.colomns;
    h = this.slotSize * this.rows;
    x = (render.size.w / 2) - (this.w / 2);
    y = (render.size.h / 2) - (this.h / 2);
    slots = new Map();
    visible = false;
    constructor() {
        let quant = 0;
        for (let x = 0; x < this.colomns; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.slots.set(quant, { x: this.x + (x * this.slotSize), y: this.y + (y * this.slotSize), itemName: ["copper_plate", "iron_plate", "stone_furnace", "", ""][Math.round(Math.random() * 4)], quant: -1 });
                quant++;
            }
        }
    }
    draw() {
        const slotIndex = this.getHoveredSlotIndex(cursor.x, cursor.y);
        if (this.visible) {
            render.drawPanel(this.x, this.y, this.w, this.h, "blue", "blue", "drakBlue", new Label("Inventory", "black", "white", { x: 1, y: 1 }));
            render.drawGrid(this.x, this.y, this.rows, this.colomns, "white", "white", this.slotSize, false, false);
            this.slots.forEach((slot) => {
                if (slot.itemName !== "") {
                    render.drawItemStack(slot.itemName, slot.x + this.offSet - 1, slot.y + this.offSet - 1, slot.quant, true);
                }
            });
        }
    }
    getHoveredSlotIndex(x, y) {
        return undefined;
    }
}
const inv = new Inventory();
export default inv;
