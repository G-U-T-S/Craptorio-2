export default class UndergroundBelt {
  static readonly tickRate = 5;
  static readonly maxTick = 3;
  public type = "underground_belt";
  public globalPos: {x: number, y: number};

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }

  update(): void {}
  draw(): void {}
}