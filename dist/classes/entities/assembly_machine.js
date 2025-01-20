import render from "../render.js";
export default class AssemblyMachine {
    static tickRate = 8;
    static animTickRate = 0;
    type = "assembly_machine";
    globalPos;
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() {
        render.drawSprite("staticSprite", 4, (this.globalPos.x - render.topLeft.x), (this.globalPos.y - render.topLeft.y), 48, 64, 24, 24);
    }
}
