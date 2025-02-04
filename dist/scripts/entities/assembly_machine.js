import BaseEntity from "./base_entity.js";
export default class AssemblyMachine extends BaseEntity {
    static tickRate = 8;
    static animTickRate = 0;
    constructor(globalPos) {
        super("assembly_machine", { ...globalPos });
    }
}
