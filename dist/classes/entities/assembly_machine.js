import render from "../render.js";
export default class AssemblyMachine {
    static tickRate = 8;
    static animTickRate = 0;
    type = "assembly_machine";
    globalPos;
    atlasCoords = {
        fullSize: { x: 48, y: 64 },
        mediun: { x: 96, y: 16 },
        small: { x: 96, y: 24 }
    };
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() {
        render.drawSprite("staticSprite", 4, (this.globalPos.x - render.topLeft.x), (this.globalPos.y - render.topLeft.y), this.atlasCoords.fullSize.x, this.atlasCoords.fullSize.y, 24, 24);
    }
}
