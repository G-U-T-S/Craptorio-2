import RENDER from "../render.js";
export default class StoneFurnace {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    type = "stone_furnace";
    globalPos;
    atlasCoords = {
        fullSize: { x: 72, y: 64 },
        mediun: { x: 80, y: 16 },
        small: { x: 80, y: 24 }
    };
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() {
        RENDER.drawSprite("staticSprite", 4, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y, this.atlasCoords.fullSize.x, this.atlasCoords.fullSize.y, 16, 16);
    }
}
