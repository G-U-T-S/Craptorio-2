/*
aqui eu fui pra uma aproach mais centralizada
onde todas as funções de desenho e update estão em um so lugar
apenas objetos pequenos são criados e destruidos
*/

import RENDER from "./render.js";
import BaseEntity from "./entities/base_entity.js";
import StoneFurnace from "./entities/stone_furnace.js";
import { WoodChest } from "./entities/wood_chest.js";


type allTypeNames = "stone_furnace" | "conveyor_belt" | "wood_chest";


class EntityManager {
  private ents: {[index in allTypeNames]: Map<string, BaseEntity>};
  // private entsToBeDraw: {[index in allTypeNames]: Array<string>};

  constructor() {
    this.ents = {
      stone_furnace: new Map<string, StoneFurnace>(),
      conveyor_belt: new Map<string, BaseEntity>(),
      wood_chest: new Map<string, WoodChest>()
    };
    // this.entsToBeDraw = {
    //   stone_furnace: [],
    //   conveyor_belt: []
    // };
  }

  public updateAndDraw(): void {
    this.ents.stone_furnace.forEach((ent) => {
      if (ent instanceof StoneFurnace) {
        ent.update();

        if (RENDER.isInsideCamera(ent.globalPos.x, ent.globalPos.y)) {
          ent.draw();
        }
      }
    });

    this.ents.wood_chest.forEach((ent) => {
      //TODO optimize!
      if (ent instanceof WoodChest) {
        if (RENDER.isInsideCamera(ent.globalPos.x, ent.globalPos.y)) {
          ent.draw();
        }
      }
    });

    RENDER.drawRect(0, 0, 250, 35, "black", "black");
    RENDER.drawText(
      `Total chests: ${this.ents.wood_chest.size}`, 0, 0, 30,
      "white", "top", "left"
    );
  }

  // public draw(): void {
  //   this.entsToBeDraw.stone_furnace.forEach((value) => {
  //     const stoFurn = this.ents.stone_furnace.get(value);
  //     if (stoFurn instanceof StoneFurnace) {
  //       stoFurn.draw();
  //     }
  //   });
  //   this.entsToBeDraw.stone_furnace = [];
  // }

  public addEnt(type: allTypeNames, globalX: number, globalY: number): void {
    switch (type) {
      case "stone_furnace": {
        this.ents.stone_furnace.set(
          `${globalX}_${globalY}`, new StoneFurnace({x: globalX, y: globalY })
        );
        break;
      }
      case "wood_chest": {
        this.ents.wood_chest.set(
          `${globalX}_${globalY}`, new WoodChest({x: globalX, y: globalY })
        );
        break;
      }
    }
  }
}

const entityManager = new EntityManager();
export default entityManager;