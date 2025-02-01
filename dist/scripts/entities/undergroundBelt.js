import { entities } from "../definitions.js";
export default class UndergroundBelt {
    static tickRate = 5;
    static maxTick = 3;
    type = "underground_belt";
    globalPos;
    atlasCoord = entities[this.type].atlasCoord;
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
    drawItems() { }
}
