import render from "../../engine/render.js";
import { entities } from "../definitions.js";


export default class BurnerMiningDrill {
  static readonly tickRate = 8;
  public type = "burner_mining_drill";
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
    render.drawSprite(
      "sprite", 4, this.globalPos.x - render.topLeft.x, this.globalPos.y - render.topLeft.y,
      this.atlasCoord.x, this.atlasCoord.y, 16, 16
    );
  }
}