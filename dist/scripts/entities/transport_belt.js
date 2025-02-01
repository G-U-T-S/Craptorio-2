import { entities } from "../definitions.js";
export default class TransportBelt {
    static tickRate = 5;
    static maxTick = 3;
    type = "transport_belt";
    globalPos;
    atlasCoord = entities[this.type].atlasCoord;
    updated = false;
    drawn = false;
    isHovered = false;
    beltDrawn = false;
    curveChecked = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
    drawItems() { }
}
