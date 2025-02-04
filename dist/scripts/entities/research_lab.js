import BaseEntity from "./base_entity.js";
export default class ResearchLab extends BaseEntity {
    static tickRate = 8;
    static animTickRate = 0;
    constructor(globalPos) {
        super("research_lab", { ...globalPos });
    }
}
