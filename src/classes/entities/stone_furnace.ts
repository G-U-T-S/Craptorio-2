import RENDER from "../render.js";
import BaseEntity from "./base_entity.js";


export default class StoneFurnace extends BaseEntity {
  static readonly tickRate = 5;
  static readonly animTickRate = 9;
  static readonly animMaxTick = 2;

  constructor(globalPos: {x: number, y: number}) {
    super({ ...globalPos }, "stone_furnace");
  }
  
  public update(): void {}

  public draw(): void {
    RENDER.drawSprite(
      "staticSprite", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      64, 64, 16, 16
    );
  }
}