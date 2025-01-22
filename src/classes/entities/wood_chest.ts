import RENDER from "../render.js";


export default class WoodChest {
  public type = "assembly_machine";
  public globalPos: {x: number, y: number};
  public atlasCoords = {
    fullSize: {x: 64, y: 16},
    small: {x: 64,y: 24}
  };
  public drawn: boolean = false;
  public isHovered: boolean = false;
  
  constructor(globalPos: {x: number, y: number}) {
    this.globalPos = { ...globalPos };
  }
  
  draw(): void {
    RENDER.drawSprite(
      "staticSprite", 4,
      (this.globalPos.x - RENDER.topLeft.x),
      (this.globalPos.y - RENDER.topLeft.y),
      this.atlasCoords.fullSize.x, this.atlasCoords.fullSize.y, 8, 8
    );
  }
}