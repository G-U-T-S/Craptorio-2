export default class AssemblyMachine {
  static readonly tickRate = 8;
  static readonly animTickRate = 0;
  public type = "assembly_machine";
  public globalPos: {x: number, y: number};

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }

  update(): void {}
  draw(): void {}
}