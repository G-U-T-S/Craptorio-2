import cursor from "./cursor.js";
import render from "./render.js";



class ItemButton {
  public x: number; public y: number;
  public w: number; public h: number;
  public name: string

  constructor(name: string, x: number, y: number, w: number, h: number) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.name = name
  }

  isHovered(x: number, y: number): boolean {
    if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
      return true;
    }
    
    return false;
  }

  draw(): void {
    //TODO
  }
}



class CraftMenu {
  public cols = 7; public rows = 5;
  public btnSize = 8 * 6;
  public w = this.btnSize * this.cols; public h = this.btnSize * this.rows;
  public x = (render.size.w / 2) + 5;
  public y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
  public buttons: Array<ItemButton> = [];
  public page = 0;

  constructor() {
    render.addResizeListener(() => {
      this.x = (render.size.w / 2) + 5;
      this.y = (render.size.h / 2) - ((this.btnSize * 3) / 2);
    });
  }

  draw (): void {
    render.drawSprite(
      "staticSprite", 7, this.x + ((8 * 5) / 2), (this.y - 24 * 4) + ((8 * 5) / 2), 
      48, 40, 8, 8
    );

    render.drawRect(
      this.x, this.y - 24 * 4, this.w, this.h, "blue", "blue"
    );
    render.drawGrid(
      this.x, this.y - 24 * 4, 1, 3, "white", "white", 
      112, 96
    );
    this.buttons.forEach((btn) => {
      btn.draw();
    });
  }

  isHovered(x: number, y: number): boolean {
    if (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) {
      return true;
    }
    
    return false;
  }

  handleClick(x: number, y: number): void {
    this.buttons.forEach((btn) => {
      if (btn.isHovered(cursor.x, cursor.y)) {
        this.craft(btn.name);
        return;
      }
    });
  }

  craft(itemName: string): void {}
}


const craftMenu = new CraftMenu();
export default craftMenu;