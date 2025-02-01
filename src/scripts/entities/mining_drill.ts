import { entities } from "../definitions.js";


export default class MiningDrill {
  static readonly tickRate = 8;
  public type = "mining_drill";
  public globalPos: { x: number, y: number };
  public atlasCoord = entities[this.type].atlasCoord;
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;

  constructor(globalPos: { x: number, y: number }) {
    this.globalPos = { ...globalPos };
  }

  update(): void { }
  draw(): void { }
}