export default class MiningDrill {
    static tickRate = 8;
    type = "mining_drill";
    globalPos;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
}
