import RENDER from "../../engine/render.js";
import { entities } from "../definitions.js";


export default class StoneFurnace {
  static readonly tickRate = 5;
  static readonly animTickRate = 9;
  static readonly animMaxTick = 2;
  public type = "stone_furnace";
  public globalPos: { x: number, y: number };
  public atlasCoord = entities[this.type].atlasCoord;
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;

  constructor(globalPos: { x: number, y: number }) {
    this.globalPos = { ...globalPos };
  }

  public update(): void { }

  public draw(): void {
    RENDER.drawSprite(
      "sprite", 4, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      this.atlasCoord.x, this.atlasCoord.y, 16, 16
    );
  }
}