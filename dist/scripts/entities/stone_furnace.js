import BaseEntity from "./base_entity.js";
export default class StoneFurnace extends BaseEntity {
    static tickRate = 5;
    static animTickRate = 9;
    static animMaxTick = 2;
    constructor(globalPos) {
        super("stone_furnace", { ...globalPos });
    }
}
