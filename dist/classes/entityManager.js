import RENDER from "./render.js";
import StoneFurnace from "./entities/stone_furnace.js";
class EntityManager {
    ents;
    entsToBeDraw;
    constructor() {
        this.ents = {
            stone_furnace: new Map(),
            conveyor_belt: new Map()
        };
        this.entsToBeDraw = {
            stone_furnace: [],
            conveyor_belt: []
        };
    }
    update() {
        this.ents.stone_furnace.forEach((ent) => {
            if (ent instanceof StoneFurnace) {
                ent.update();
                if (RENDER.isEntInside(ent.globalPos.x, ent.globalPos.y)) {
                    this.entsToBeDraw.stone_furnace.push(ent.coord);
                }
            }
        });
    }
    draw() {
        this.entsToBeDraw.stone_furnace.forEach((value) => {
            const stoFurn = this.ents.stone_furnace.get(value);
            if (stoFurn instanceof StoneFurnace) {
                stoFurn.draw();
            }
        });
        this.entsToBeDraw.stone_furnace = [];
    }
    addEnt(type, globalPos) {
        switch (type) {
            case "stone_furnace": {
                this.ents.stone_furnace.set(`${globalPos.x}_${globalPos.y}`, new StoneFurnace({ ...globalPos }));
                break;
            }
        }
    }
}
const entityManager = new EntityManager();
export default entityManager;
