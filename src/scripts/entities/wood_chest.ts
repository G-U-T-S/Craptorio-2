import RENDER from "../../engine/render.js";
import { items } from "../definitions.js";


export default class WoodChest {
  public type = "assembly_machine";
  public globalPos: { x: number, y: number };
  public atlasCoords = {
    fullSize: { x: 64, y: 16 },
    small: { x: 64, y: 24 }
  };
  public drawn: boolean = false;
  public isHovered: boolean = false;
  private slots: Map<number, { itemName: string, quant: number }>;

  constructor(globalPos: { x: number, y: number }) {
    this.globalPos = { ...globalPos };
    this.slots = new Map();

    let index = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 2; y++) {
        this.slots.set(
          index, { itemName: "", quant: 0 }
        );

        index++;
      }
    }
  }

  draw(): void {
    RENDER.drawSprite(
      "staticSprite", 4,
      (this.globalPos.x - RENDER.topLeft.x),
      (this.globalPos.y - RENDER.topLeft.y),
      this.atlasCoords.fullSize.x, this.atlasCoords.fullSize.y, 8, 8
    );
  }

  depositStack(stack: { itemName: string, quant: number }): { success: boolean, itemName: string, quant: number } {
    const returnData = { success: false, itemName: stack.itemName, quant: stack.quant };

    this.slots.forEach((slot) => {
      const item = items[slot.itemName];

      if (slot.itemName === "") {
        slot.quant = stack.quant;
        slot.itemName = stack.itemName;

        returnData.success = true;
        returnData.itemName = "";
        returnData.quant = 0;
        return;
      }
      else if (slot.itemName === stack.itemName && slot.quant + stack.quant <= item.stackSize) {
        slot.quant = slot.quant + stack.quant;

        returnData.success = true;
        returnData.itemName = "";
        returnData.quant = 0;
        return;
      }
      else if (slot.itemName === stack.itemName && slot.quant < item.stackSize && slot.quant + stack.quant > item.stackSize) {
        const diff = item.stackSize - slot.quant;
        slot.quant = item.stackSize;
        stack.quant = stack.quant - diff;

        returnData.success = false;
        returnData.itemName = stack.itemName;
        returnData.quant = slot.quant;
      }
    });

    return returnData;
  }
}