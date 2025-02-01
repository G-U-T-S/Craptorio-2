import { entities } from "../definitions.js";
export default class MiningDrill {
    static tickRate = 8;
    type = "mining_drill";
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
}
