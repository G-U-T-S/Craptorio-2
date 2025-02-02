import render from "../../engine/render.js";
import { entities } from "../definitions.js";
export default class ResearchLab {
    static tickRate = 8;
    static animTickRate = 0;
    type = "research_lab";
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
        render.drawSprite("sprite", 4, (this.globalPos.x - render.topLeft.x), (this.globalPos.y - render.topLeft.y), this.atlasCoord.x, this.atlasCoord.y, 24, 24);
    }
}
