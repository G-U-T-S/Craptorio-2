import render from "../../engine/render.js";
import cursor from "../../engine/cursor.js";
import { entities } from "../definitions.js";


export default class BaseEntity {
  public type: string;
  public globalPos: { x: number, y: number };
  public size: { w: number, h: number };
  public atlasCoord: { x: number, y: number };
  public updated = false;
  public drawn = false;

  constructor(type: string, globalPos: { x: number, y: number }) {
    this.globalPos = globalPos;
    this.type = type;
    this.size = entities[type].sizeInPixels;
    this.atlasCoord = entities[type].atlasCoord;
  }

  public update(): void {
    this.updated = true;
  }

  public draw(): void {
    render.drawSprite(
      "sprite", 4, this.globalPos.x - render.topLeft.x, this.globalPos.y - render.topLeft.y,
      this.atlasCoord.x, this.atlasCoord.y, this.size.w, this.size.h
    );

    this.drawn = true;
  }

  public isHovered(x: number, y: number): boolean {
    if (x >= this.globalPos.x && x <= this.globalPos.x + (this.size.w * 4) && y >= this.globalPos.y && y <= this.globalPos.y + (this.size.h * 4)) {
      return true;
    }

    return false;
  }

  public drawHoverWidget(): void {
    render.drawRect(cursor.x, cursor.y, 50, 50, "blue", "blue");
  }

  public drawEntWindow(): void { }
}