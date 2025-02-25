import render from "../engine/render.js";


export default class itemSlot {
  public name = "";
  public quant = 0;
  public size = { w: 0, h: 0 };
  public pos = { x: 0, y: 0 };

  constructor(posX: number, posY: number, sizeW: number, sizeH: number, name = "", quant = 0) {
    this.pos.x = posX; this.pos.y = posY;
    this.size.w = sizeW; this.size.h = sizeH;
    this.name = name; this.quant = quant;
  }

  public draw(): void {
    render.drawEmptyRect(
      this.pos.x - 1, this.pos.y - 1, this.size.w + 2, this.size.h + 2, "white"
    );
    render.drawRect(this.pos.x, this.pos.y, this.size.w, this.size.h, "black");

    if (this.quant > 0) {
      render.drawItemStack(
        this.name, 5,
        this.pos.x + (this.size.w / 10), this.pos.y + (this.size.h / 10),
        this.quant, true
      );
    }
  }
}