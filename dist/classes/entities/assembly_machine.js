export default class AssemblyMachine {
    static tickRate = 8;
    static animTickRate = 0;
    type = "assembly_machine";
    globalPos;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
    }
    update() { }
    draw() { }
}
