import render from "./render.js";
import { items } from "./definitions.js";


interface Islot {
  x: number, y: number,
  itemName: string, quant: number
}
export default class BaseInventory {
  private slots = new  Map<number, Islot>();
  public slotSize: number;
  public pos: {x: number, y: number};
  public size: {w: number, h: number};
  public rows; public cols;
  public visible = false;

  constructor(x: number, y: number, rows: number, cols: number, slotSize: number, width: number, height: number) {
    this.pos = {x: x, y: y};
    this.size = {w: width, h: height};
    this.rows = rows; this.cols = cols;
    this.slotSize = slotSize;
    
    let index = 0;
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        this.slots.set(
          index, {x: this.pos.x + (x * this.slotSize),y: this.pos.y + (y * this.slotSize), itemName: "", quant: 0}
        );
        
        index++;
      } 
    }
  }

  draw(): void {
    render.drawPanel(this.pos.x, this.pos.y, this.size.w, this.size.h, "blue", "blue", "drakBlue");
    render.drawGrid(this.pos.x, this.pos.y, this.rows, this.cols, "white", "white", this.slotSize, false, false);
  
    this.slots.forEach((slot) => {
      if (slot.itemName !== "") {
        render.drawItemStack(slot.itemName, 4, slot.x, slot.y, slot.quant, true);
      }
    });
  }

  getHoveredSlot(x: number, y: number): Islot | undefined {
    let result: Islot | undefined;
    
    this.slots.forEach((slot) => {
      if (x >= slot.x && x <= (slot.x + this.slotSize) && y >= slot.y && y <= (slot.y + this.slotSize)) {
        result = slot;
      }
    });

    return result;
  }

  isHovered(x: number, y: number): boolean {
    if (this.visible && x >= this.pos.x && x <= this.pos.x + this.size.w && y >= this.pos.y && y <= this.pos.y + this.size.h) {
      return true;
    }

    const hx = render.center.x - (this.size.w / 2);
    const hy = render.size.h - (this.slotSize + 4);
    if (x >= hx && x <= hx + this.size.w && y >= hy && y <= hy + this.slotSize + 4) {
      return true;
    }
    
    return false;
  }

  depositStack(itemName: string, quant: number, slotIndex: number, force: boolean): void {
    const slot = this.slots.get(slotIndex);

    if (slot !== undefined) {
      if ((slot.itemName === "" || slot.itemName === itemName) && slot.quant + quant <= items[itemName].stackSize) {
        slot.itemName = itemName;
        slot.quant += quant;

        return;
      }
    }

    // if (force) {
    //   let remaining = quant;
    //   this.slots.forEach((slot) => {
    //     if ((slot.itemName === "" || slot.itemName === itemName) && slot.quant + remaining <= items[itemName].stackSize) {
    //       slot.itemName = itemName;
    //       slot.quant += remaining;

    //       cursor.itemStack.quant -= remaining
    //     }

    //     if (remaining <= 0) {
    //       cursor.itemStack.name = "";
    //       cursor.itemStack.quant = 0;
    //       return;
    //     }
    //   });
    // }
  }
}