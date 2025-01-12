import RENDER from "./render.js";
class Player {
    lx;
    ly;
    animFrame;
    animSpeed;
    animDir;
    animMax;
    lastDir;
    moveSpeed;
    directions;
    atlasCoord;
    constructor() {
        this.lx = 0, this.ly = 0;
        this.animFrame = 0;
        this.animSpeed = 8;
        this.animDir = 0;
        this.animMax = 4;
        this.lastDir = "0,0";
        this.moveSpeed = 50.0;
        this.directions = {
            '0,0': { id: 362, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
            '0,-1': { id: 365, flip: 0, rot: 0, dust: { x: 4, y: 11 } },
            '0,1': { id: 365, flip: 2, rot: 0, dust: { x: 4, y: -2 } },
            '-1,0': { id: 363, flip: 1, rot: 0, dust: { x: 11, y: 5 } },
            '1,0': { id: 363, flip: 0, rot: 0, dust: { x: -2, y: 5 } },
            '1,-1': { id: 364, flip: 0, rot: 0, dust: { x: -2, y: 10 } },
            '-1,-1': { id: 364, flip: 1, rot: 0, dust: { x: 10, y: 10 } },
            '-1,1': { id: 364, flip: 3, rot: 0, dust: { x: 10, y: -2 } },
            '1,1': { id: 364, flip: 2, rot: 0, dust: { x: -2, y: -2 } }
        };
        this.atlasCoord = { x: 0, y: 32 };
    }
    update(delta, tick, keys, cursorProg) {
        if (tick % this.animSpeed === 0) {
            if (this.animDir === 0) {
                this.animFrame = this.animFrame + 1;
                if (this.animFrame > this.animMax) {
                    this.animDir = 1;
                    this.animFrame = this.animMax;
                }
            }
            else {
                this.animFrame = this.animFrame - 1;
                if (this.animFrame < 0) {
                    this.animDir = 0;
                    this.animFrame = 0;
                }
            }
        }
        let xDir = 0;
        let yDir = 0;
        if (keys.w) {
            yDir = -1;
        }
        if (keys.s) {
            yDir = 1;
        }
        if (keys.a) {
            xDir = -1;
        }
        if (keys.d) {
            xDir = 1;
        }
        if (!cursorProg) {
            if (xDir !== 0 || yDir !== 0) {
                RENDER.topLeft.x += (xDir * this.moveSpeed) * delta;
                RENDER.topLeft.y += (yDir * this.moveSpeed) * delta;
            }
        }
        this.lastDir = `${xDir},${yDir}`;
        switch (this.lastDir) {
            case "-1,0": {
                this.atlasCoord.x = 16;
                break;
            }
            case "-1,1": {
                this.atlasCoord.x = 48;
                break;
            }
            case "-1,-1": {
                this.atlasCoord.x = 32;
                break;
            }
            case "0,1": {
                this.atlasCoord.x = 64;
                break;
            }
            case "0,-1": {
                this.atlasCoord.x = 56;
                break;
            }
            case "1,0": {
                this.atlasCoord.x = 8;
                break;
            }
            case "1,1": {
                this.atlasCoord.x = 40;
                break;
            }
            case "1,-1": {
                this.atlasCoord.x = 24;
                break;
            }
            default: {
                this.atlasCoord.x = 0;
                this.atlasCoord.y = 32;
                break;
            }
        }
    }
    draw() {
        RENDER.drawSprite("sprites", RENDER.centerCanvas.x - 16, RENDER.centerCanvas.y + this.animFrame, this.atlasCoord.x, this.atlasCoord.y);
    }
}
const player = new Player();
export default player;
