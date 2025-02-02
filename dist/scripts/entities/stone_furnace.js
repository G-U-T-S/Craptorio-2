import RENDER from "../../engine/render.js";
import { entities } from "../definitions.js";
export default class StoneFurnace {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    type = "stone_furnace";
    globalPos;
    atlasCoord = entities[this.type].atlasCoord;
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() {
        RENDER.drawSprite("sprite", 4, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y, this.atlasCoord.x, this.atlasCoord.y, 16, 16);
    }
}
