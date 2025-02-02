import render from "../../engine/render.js";
import { entities } from "../definitions.js";
export default class BurnerMiningDrill {
    static tickRate = 8;
    type = "burner_mining_drill";
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
        render.drawSprite("sprite", 4, this.globalPos.x - render.topLeft.x, this.globalPos.y - render.topLeft.y, this.atlasCoord.x, this.atlasCoord.y, 16, 16);
    }
}
