import render from "../engine/render.js";
export default class itemSlot {
    name = "";
    quant = 0;
    size = { w: 0, h: 0 };
    pos = { x: 0, y: 0 };
    constructor(posX, posY, sizeW, sizeH, name = "", quant = 0) {
        this.pos.x = posX;
        this.pos.y = posY;
        this.size.w = sizeW;
        this.size.h = sizeH;
        this.name = name;
        this.quant = quant;
    }
    draw() {
        render.drawEmptyRect(this.pos.x - 1, this.pos.y - 1, this.size.w + 2, this.size.h + 2, "white");
        render.drawRect(this.pos.x, this.pos.y, this.size.w, this.size.h, "black");
        if (this.quant > 0) {
            render.drawItemStack(this.name, 5, this.pos.x + (this.size.w / 10), this.pos.y + (this.size.h / 10), this.quant, true);
        }
    }
}
