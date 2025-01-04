export class Player {
    x;
    y;
    lx;
    ly;
    animFrame;
    animSpeed;
    animDir;
    animMax;
    lastDir;
    moveSpeed;
    directions;
    render;
    constructor(render) {
        this.x = 0, this.y = 0;
        this.lx = 0, this.ly = 0;
        this.animFrame = 0;
        this.animSpeed = 8;
        this.animDir = 0;
        this.animMax = 4;
        this.lastDir = "0,0";
        this.moveSpeed = 1.9;
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
        this.render = render;
    }
    update(tick, kboard, cursor) {
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
        this.lx = this.x;
        this.ly = this.y;
        let xDir = 0;
        let yDir = 0;
        if (kboard.w) {
            yDir = -1;
        }
        if (kboard.s) {
            yDir = 1;
        }
        if (kboard.a) {
            xDir = -1;
        }
        if (kboard.d) {
            xDir = 1;
        }
        if (!cursor.prog) {
            if (xDir !== 0 || yDir !== 0) {
                this.move(xDir * this.moveSpeed, yDir * this.moveSpeed);
            }
        }
        this.lastDir = `${xDir},${yDir}`;
    }
    move(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
    }
    draw(x, y) {
        const atlasCoord = {
            x: 0, y: 32
        };
        switch (this.lastDir) {
            case "-1,0": {
                atlasCoord.x = 16;
                break;
            }
            case "-1,1": {
                atlasCoord.x = 48;
                break;
            }
            case "-1,-1": {
                atlasCoord.x = 32;
                break;
            }
            case "0,1": {
                atlasCoord.x = 64;
                break;
            }
            case "0,-1": {
                atlasCoord.x = 56;
                break;
            }
            case "1,0": {
                atlasCoord.x = 8;
                break;
            }
            case "1,1": {
                atlasCoord.x = 40;
                break;
            }
            case "1,-1": {
                atlasCoord.x = 24;
                break;
            }
        }
        this.render.drawSprite("sprites", x, y + this.animFrame, atlasCoord.x, atlasCoord.y);
    }
}
