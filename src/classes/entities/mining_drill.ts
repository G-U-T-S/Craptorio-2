export default class MiningDrill {
  static readonly tickRate = 8;
  public type = "mining_drill";
  public globalPos: {x: number, y: number};

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }

  update(): void {}
  draw(): void {}
}