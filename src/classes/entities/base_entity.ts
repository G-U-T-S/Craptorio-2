export default class BaseEntity {
  public globalPos: {x: number, y: number};
  public coord: string;
  public type: string;

  constructor(globalPos: {x: number, y: number}, type: string) {
    this.globalPos = { ...globalPos };
    this.coord = `${globalPos.x}_${globalPos.y}`;
    this.type = type;
  }
}