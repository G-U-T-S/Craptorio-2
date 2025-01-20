export default class MiningDrill {
    static tickRate = 8;
    type = "mining_drill";
    globalPos;
    updated = false;
    drawn = false;
    isHovered = false;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
}
