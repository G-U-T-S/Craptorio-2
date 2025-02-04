import BaseEntity from "./base_entity.js";


export default class BurnerMiningDrill extends BaseEntity {
  static readonly tickRate = 8;

  constructor(globalPos: { x: number, y: number }) {
    super("burner_mining_drill", { ...globalPos });
  }
}