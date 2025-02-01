import RENDER from "../../engine/render.js";
import { entities } from "../definitions.js";
export default class WoodChest {
    type = "assembly_machine";
    globalPos;
    atlasCoord = entities[this.type].atlasCoord;
    drawn = false;
    isHovered = false;
    slots;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
        this.slots = new Map();
        let index = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 2; y++) {
                this.slots.set(index, { itemName: "", quant: 0 });
                index++;
            }
        }
    }
    draw() {
        RENDER.drawSprite("staticSprite", 4, (this.globalPos.x - RENDER.topLeft.x), (this.globalPos.y - RENDER.topLeft.y), this.atlasCoord.x, this.atlasCoord.y, 8, 8);
    }
}
