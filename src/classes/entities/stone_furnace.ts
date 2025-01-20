import RENDER from "../render.js";


export default class StoneFurnace {
  static readonly tickRate = 5;
  static readonly animTickRate = 9;
  static readonly animMaxTick = 2;
  public type = "stone_furnace";
  public globalPos: {x: number, y: number};
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;

  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }
  
  public update(): void {}

  public draw(): void {
    RENDER.drawSprite(
      "staticSprite", 4, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      64, 64, 16, 16
    );
  }
}