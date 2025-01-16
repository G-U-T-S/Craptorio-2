import RENDER from "../render.js";
import BaseEntity from "./base_entity.js";


export default class StoneFurnace extends BaseEntity {
  public update(): void {}

  public draw(): void {
    RENDER.drawSprite(
      "sprites", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      64, 64, 16, 16
    );
  }
}