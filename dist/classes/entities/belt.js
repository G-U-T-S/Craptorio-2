import BaseEntity from "./base_entity.js";
export default class Belt extends BaseEntity {
    static tickRate;
    static maxTick;
    constructor(globalPos) {
        super({ ...globalPos });
    }
}
