import render from "../../engine/render.js";
import { entities } from "../definitions.js";


export default class AssemblyMachine {
  static readonly tickRate = 8;
  static readonly animTickRate = 0;
  public type = "assembly_machine";
  public globalPos: { x: number, y: number };
  public atlasCoord = entities[this.type].atlasCoord;
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;

  constructor(globalPos: { x: number, y: number }) {
    this.globalPos = { ...globalPos };
  }

  update(): void { }
  draw(): void {
    render.drawSprite(
      "staticSprite", 4,
      (this.globalPos.x - render.topLeft.x),
      (this.globalPos.y - render.topLeft.y),
      this.atlasCoord.x, this.atlasCoord.y, 24, 24
    );
  }
}