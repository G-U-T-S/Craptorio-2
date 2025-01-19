export default class TransportBelt {
  static readonly tickRate = 5;
  static readonly maxTick = 3;
  public type = "transport_belt";
  public globalPos: {x: number, y: number};

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }

  update(): void {}
  draw(): void {}
  drawItems(): void {}
}