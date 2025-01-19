export default class UndergroundBelt {
    static tickRate = 5;
    static maxTick = 3;
    type = "underground_belt";
    globalPos;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
}
