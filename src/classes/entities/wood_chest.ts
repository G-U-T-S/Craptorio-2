import RENDER from "../render.js";
import BaseEntity from "./base_entity.js";


export class WoodChest extends BaseEntity {
  draw(): void {
    RENDER.drawSprite(
      "sprites", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      48, 88, 8, 8
    );
  }
}