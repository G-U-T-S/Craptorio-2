/*
aqui eu fui pra uma aproach mais centralizada
onde todas as funções de desenho e update estão em um so lugar
apenas objetos pequenos são criados e destruidos
*/

import RENDER from "./render.js";
import BaseEntity from "./entities/base_entity.js";
import StoneFurnace from "./entities/stone_furnace.js";


type allTypeNames = "stone_furnace" | "conveyor_belt";


class EntityManager {
  private ents: {[index in allTypeNames]: Map<string, BaseEntity>};
  private entsToBeDraw: {[index in allTypeNames]: Array<string>};

  constructor() {
    this.ents = {
      stone_furnace: new Map<string, StoneFurnace>(),
      conveyor_belt: new Map<string, BaseEntity>()
    };
    this.entsToBeDraw = {
      stone_furnace: [],
      conveyor_belt: []
    };
  }

  public update(): void {
    this.ents.stone_furnace.forEach((ent) => {
      if (ent instanceof StoneFurnace) {
        ent.update();

        if (RENDER.isEntInside(ent.globalPos.x, ent.globalPos.y)) {
          this.entsToBeDraw.stone_furnace.push(ent.coord);
        }
      }
    });
  }

  public draw(): void {
    this.entsToBeDraw.stone_furnace.forEach((value) => {
      const stoFurn = this.ents.stone_furnace.get(value);
      if (stoFurn instanceof StoneFurnace) {
        stoFurn.draw();
      }
    });
    this.entsToBeDraw.stone_furnace = [];
  }

  public addEnt(type: "stone_furnace", globalPos: {x: number, y: number}): void {
    switch (type) {
      case "stone_furnace": {
        this.ents.stone_furnace.set(
          `${globalPos.x}_${globalPos.y}`, new StoneFurnace({ ...globalPos })
        );
        break;
      }
    }
  }
}

const entityManager = new EntityManager();
export default entityManager;