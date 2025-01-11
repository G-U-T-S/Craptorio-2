export default class BaseEntity {
  public globalPos: {x: number, y: number};
  public coord: string;

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
    this.coord = `${globalPos.x}_${globalPos.y}`;
  }
}