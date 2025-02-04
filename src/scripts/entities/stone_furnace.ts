import BaseEntity from "./base_entity.js";


export default class StoneFurnace extends BaseEntity {
  static readonly tickRate = 5;
  static readonly animTickRate = 9;
  static readonly animMaxTick = 2;

  constructor(globalPos: { x: number, y: number }) {
    super("stone_furnace", { ...globalPos });
  }
}