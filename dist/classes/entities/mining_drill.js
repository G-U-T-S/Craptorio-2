import BaseEntity from "./base_entity.js";
export default class Drill extends BaseEntity {
    static tickRate = 8;
    constructor(globalPos) {
        super({ ...globalPos });
    }
}
