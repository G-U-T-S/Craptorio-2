import render from "../render.js";


export default class AssemblyMachine {
  static readonly tickRate = 8;
  static readonly animTickRate = 0;
  public type = "assembly_machine";
  public globalPos: {x: number, y: number};
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }

  update(): void {}
  draw(): void {
    render.drawSprite(
      "staticSprite", 4,
      (this.globalPos.x - render.topLeft.x),
      (this.globalPos.y - render.topLeft.y),
      48, 64, 24, 24
    );
  }
}