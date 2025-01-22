import RENDER from "../render.js";
export default class WoodChest {
    type = "assembly_machine";
    globalPos;
    atlasCoords = {
        fullSize: { x: 64, y: 16 },
        small: { x: 64, y: 24 }
    };
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    draw() {
        RENDER.drawSprite("staticSprite", 4, (this.globalPos.x - RENDER.topLeft.x), (this.globalPos.y - RENDER.topLeft.y), this.atlasCoords.fullSize.x, this.atlasCoords.fullSize.y, 8, 8);
    }
}
