import RENDER from "../render.js";


export default class WoodChest {
  public type = "assembly_machine";
  public globalPos: {x: number, y: number};
  public drawn: boolean = false;
  public isHovered: boolean = false;
  
  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }
  
  draw(): void {
    RENDER.drawSprite(
      "staticSprite", 5, this.globalPos.x - RENDER.topLeft.x, this.globalPos.y - RENDER.topLeft.y,
      48, 88, 8, 8
    );
  }
}