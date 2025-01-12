import RENDER from "./render.js";
import StoneFurnace from "./entities/stone_furnace.js";
import { WoodChest } from "./entities/wood_chest.js";
class EntityManager {
    ents;
    constructor() {
        this.ents = {
            stone_furnace: new Map(),
            conveyor_belt: new Map(),
            wood_chest: new Map()
        };
    }
    updateAndDraw() {
        this.ents.stone_furnace.forEach((ent) => {
            if (ent instanceof StoneFurnace) {
                ent.update();
                if (RENDER.isInsideCamera(ent.globalPos.x, ent.globalPos.y)) {
                    ent.draw();
                }
            }
        });
        this.ents.wood_chest.forEach((ent) => {
            if (ent instanceof WoodChest) {
                if (RENDER.isInsideCamera(ent.globalPos.x, ent.globalPos.y)) {
                    ent.draw();
                }
            }
        });
        RENDER.drawRect(0, 0, 250, 35, "black", "black");
        RENDER.drawText(`Total chests: ${this.ents.wood_chest.size}`, 0, 0, 30, "white", "top", "left");
    }
    addEnt(type, globalX, globalY) {
        switch (type) {
            case "stone_furnace": {
                this.ents.stone_furnace.set(`${globalX}_${globalY}`, new StoneFurnace({ x: globalX, y: globalY }));
                break;
            }
            case "wood_chest": {
                this.ents.wood_chest.set(`${globalX}_${globalY}`, new WoodChest({ x: globalX, y: globalY }));
                break;
            }
        }
    }
}
const entityManager = new EntityManager();
export default entityManager;
