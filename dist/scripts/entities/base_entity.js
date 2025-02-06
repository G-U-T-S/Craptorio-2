import render from "../../engine/render.js";
import cursor from "../../engine/cursor.js";
import { entities } from "../definitions.js";
export default class BaseEntity {
    type;
    globalPos;
    size;
    atlasCoord;
    updated = false;
    drawn = false;
    constructor(type, globalPos) {
        this.globalPos = globalPos;
        this.type = type;
        this.size = entities[type].sizeInPixels;
        this.atlasCoord = entities[type].atlasCoord;
    }
    update() {
        this.updated = true;
    }
    draw() {
        render.drawSprite("sprite", 4, this.globalPos.x - render.topLeft.x, this.globalPos.y - render.topLeft.y, this.atlasCoord.x, this.atlasCoord.y, this.size.w, this.size.h);
        this.drawn = true;
    }
    isHovered(x, y) {
        if (x >= this.globalPos.x && x <= this.globalPos.x + (this.size.w * 4) && y >= this.globalPos.y && y <= this.globalPos.y + (this.size.h * 4)) {
            return true;
        }
        return false;
    }
    drawHoverWidget() {
        render.drawRect(cursor.x, cursor.y, 50, 50, "blue", "blue");
    }
    drawEntWindow() { }
}
