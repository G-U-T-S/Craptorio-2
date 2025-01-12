export default class BaseEntity {
    globalPos;
    coord;
    constructor(globalPos) {
        this.globalPos = { ...globalPos };
        this.coord = `${globalPos.x}_${globalPos.y}`;
    }
}
