import BaseEntity from "./base_entity.js";
export default class BurnerMiningDrill extends BaseEntity {
    static tickRate = 8;
    constructor(globalPos) {
        super("burner_mining_drill", { ...globalPos });
    }
}
