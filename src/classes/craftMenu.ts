import render from "./render.js";

const cols = 7;
const rows = 5;
const slotSize = 8 * 6;
const w = slotSize * cols;
const h = slotSize * rows;
let x = (render.size.w / 2) + 5;
let y = (render.size.h / 2) - ((slotSize * 3) / 2);
class CraftMenu {
  public page = 0;

  constructor() {
    render.addResizeListener(() => {
      x = (render.size.w / 2) + 5;
      y = (render.size.h / 2) - ((slotSize * 3) / 2);
    });
  }

  draw (): void {
    render.drawRect(
      x, y - 24 * 4, w, h, "blue", "blue"
    );
    render.drawGrid(
      x, y - 24 * 4, 1, 3, "white", "white", 
      112, 96
    );

    render.drawSprite(
      "staticSprite", 7, x + ((8 * 5) / 2), (y - 24 * 4) + ((8 * 5) / 2), 
      48, 40, 8, 8
    );
  }
}


const craftMenu = new CraftMenu();
export default craftMenu;