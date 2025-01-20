import RENDER from "../render.js";
export default class WoodChest {
    type = "assembly_machine";
    globalPos;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    draw() {
        RENDER.drawSprite("staticSprite", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y, 48, 88, 8, 8);
    }
}
