import BaseEntity from "./base_entity.js";


export default class ResearchLab extends BaseEntity {
  static readonly tickRate = 8;
  static readonly animTickRate = 0;

  constructor(globalPos: { x: number, y: number }) {
    super("research_lab", { ...globalPos });
  }
}