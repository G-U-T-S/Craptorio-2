import render from "../engine/render.js";
import Label from "./label.js";
import { items } from "./definitions.js";


interface Islot {
  x: number, y: number,
  itemName: string, quant: number
}
export default class Inventory {
  private slots = new Map<number, Islot>();
  public slotSize: number;
  public pos: { x: number, y: number };
  public size: { w: number, h: number };
  public rows: number; public cols: number;
  public panelText: string;
  public visible = false;

  constructor(panelText: string, x: number, y: number, rows: number, cols: number, slotSize: number, width: number, height: number) {
    this.panelText = panelText;
    this.pos = { x: x, y: y };
    this.size = { w: width, h: height };
    this.rows = rows; this.cols = cols;
    this.slotSize = slotSize;

    let index = 0;
    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < rows; x++) {
        this.slots.set(
          index, { x: this.pos.x + (x * this.slotSize), y: this.pos.y + (y * this.slotSize), itemName: "", quant: 0 }
        );

        index++;
      }
    }
  }

  draw(): void {
    render.drawPanel(this.pos.x, this.pos.y, this.size.w, this.size.h, "blue", "darkBlue", new Label(this.panelText, "white", "white", { x: 1, y: 1 }));

    if (this.rows + this.cols > 2) {
      render.drawGrid(this.pos.x, this.pos.y, this.rows, this.cols, "white", "white", this.slotSize, this.slotSize, false, false);
    }
    else {
      render.drawRect(this.pos.x, this.pos.y, this.slotSize, this.slotSize, "white", "white");
    }

    this.slots.forEach((slot) => {
      if (slot.itemName !== "" && slot.quant <= 0) {
        slot.itemName = "";
      }

      if (slot.itemName !== "") {
        render.drawItemStack(
          slot.itemName, 4,
          slot.x + (this.slotSize / 5), slot.y + (this.slotSize / 5),
          slot.quant, true
        );
      }
    });
  }

  getSlot(index: number): Islot | undefined {
    return this.slots.get(index);
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

  depositStack(slotIndex: number, itemName: string, quant: number, force: boolean): { itemName: string, quant: number } {
    const slot = this.slots.get(slotIndex);
    let returnData = { itemName: itemName, quant: quant };

    if (slot !== undefined) {
      if (slot.itemName === "" || slot.itemName === itemName) {
        slot.itemName = itemName;

        //! o slot.quant nunca pode ser maior que a stack_size;
        const availableSpace = items[itemName].stackSize - slot.quant;
        const toAdd = Math.min(returnData.quant, availableSpace);

        slot.quant += toAdd;
        returnData.quant -= toAdd;
      }
    }

    if (force && returnData.quant > 0) {
      this.slots.forEach((slot) => {
        if ((slot.itemName === "" || slot.itemName === itemName) && returnData.quant > 0) {
          slot.itemName = itemName;

          //! o slot.quant nunca pode ser maior que a stack_size;
          const availableSpace = items[itemName].stackSize - slot.quant;
          const toAdd = Math.min(returnData.quant, availableSpace);

          slot.quant += toAdd;
          returnData.quant -= toAdd;
        }
        else {
          return;
        }
      });
    }

    if (returnData.quant <= 0) {
      returnData.itemName = "";
    }

    return returnData;
  }

  removeStack(index: number, itemName: string, quant: number, force: boolean): undefined | { itemName: string, quant: number } {
    const returnData = { itemName: itemName, quant: quant };
    const slot = this.slots.get(index);
    let remaining = quant;

    if (slot !== undefined && slot.itemName === itemName) {
      if (slot.quant - remaining >= 0) {
        slot.quant -= remaining;
        remaining = 0;
      }
      else {
        remaining -= slot.quant;
        slot.quant = 0;
      }
    }

    if (force && remaining > 0) {
      this.slots.forEach((slot) => {
        if (slot.itemName === itemName && remaining > 0) {
          if (slot.quant - remaining >= 0) {
            slot.quant -= remaining;
            remaining = 0;
          }
          else {
            remaining -= slot.quant;
            slot.quant = 0;
          }
        }
      });
    }

    returnData.quant -= remaining

    if (returnData.quant <= 0) {
      return undefined;
    }

    return returnData;
  }

  hasStack(itemName: string, quant: number): boolean {
    let sum = 0;

    this.slots.forEach((slot) => {
      if (slot.itemName === itemName) {
        sum += slot.quant;
      }
    });

    if (sum >= quant) {
      return true;
    }

    return false;
  }

  swapStacks(index: number, itemName: string, quant: number): { itemName: string, quant: number } {
    const returnData = { itemName: itemName, quant: quant };
    const slot = this.getSlot(index);

    if (slot !== undefined) {
      returnData.itemName = slot.itemName;
      returnData.quant = slot.quant;

      slot.itemName = itemName;
      slot.quant = quant;
    }

    return returnData;
  }

  moveTo(x: number, y: number): void {
    this.pos.x = x; this.pos.y = y;

    let index = 0;
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        const slot = this.getSlot(index);

        if (slot !== undefined) {
          slot.x = this.pos.x + (x * this.slotSize);
          slot.y = this.pos.y + (y * this.slotSize);
        }

        index++;
      }
    }
  }
}