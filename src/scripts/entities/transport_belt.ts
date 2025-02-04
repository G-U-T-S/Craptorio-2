// todo create rotatable entity
import { entities } from "../definitions.js";


export default class TransportBelt {
  static readonly tickRate = 5;
  static readonly maxTick = 3;
  public type = "transport_belt";
  public globalPos: { x: number, y: number };
  public atlasCoord = entities[this.type].atlasCoord;
  public updated: boolean = false;
  public drawn: boolean = false;
  public isHovered: boolean = false;
  public beltDrawn: boolean = false;
  public curveChecked: boolean = false;

  constructor(globalPos: { x: number, y: number }) {
    this.globalPos = { ...globalPos };
  }

  update(): void { }
  draw(): void { }
  drawItems(): void { }
}