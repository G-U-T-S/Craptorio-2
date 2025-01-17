import BaseEntity from "./base_entity.js";


export default class Drill extends BaseEntity {
  static readonly tickRate = 8;

  constructor(globalPos: {x: number, y: number}) {
    super({ ...globalPos });
  }
}