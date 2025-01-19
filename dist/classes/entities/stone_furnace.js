import RENDER from "../render.js";
export default class StoneFurnace {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    type = "stone_furnace";
    globalPos;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() {
        RENDER.drawSprite("staticSprite", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y, 64, 64, 16, 16);
    }
}
