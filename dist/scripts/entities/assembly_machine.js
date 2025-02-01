import render from "../../engine/render.js";
import { entities } from "../definitions.js";
export default class AssemblyMachine {
    static tickRate = 8;
    static animTickRate = 0;
    type = "assembly_machine";
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
        render.drawSprite("staticSprite", 4, (this.globalPos.x - render.topLeft.x), (this.globalPos.y - render.topLeft.y), this.atlasCoord.x, this.atlasCoord.y, 24, 24);
    }
}
