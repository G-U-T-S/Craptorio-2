import BaseEntity from "./base_entity.js";


export default class WoodChest extends BaseEntity {
  private slots: Map<number, { itemName: string, quant: number }>;

  constructor(globalPos: { x: number, y: number }) {
    super("wood_chest", { ...globalPos });
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
}