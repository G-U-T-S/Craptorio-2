import BaseEntity from "./base_entity.js";


export default class MiningDrill extends BaseEntity {
  static readonly tickRate = 8;

  constructor(globalPos: {x: number, y: number}) {
    super({ ...globalPos }, "mining_drill");
  }

  update(): void {}
  draw(): void {}
}