import BaseEntity from "./base_entity.js";


export default class UndergroundBelt extends BaseEntity {
  static readonly tickRate = 5;
  static readonly maxTick = 3;

  constructor(globalPos: {x: number, y: number}) {
    super({ ...globalPos });
  }
}